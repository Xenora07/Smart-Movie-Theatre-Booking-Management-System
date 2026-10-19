package com.cinema.booking.service;

import com.cinema.booking.dto.admin.*;
import com.cinema.booking.dto.booking.BookingResponseDTO;
import com.cinema.booking.dto.booking.PaymentDTO;
import com.cinema.booking.dto.catalogue.*;
import com.cinema.booking.entity.*;
import com.cinema.booking.exception.BadRequestException;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;
    private final CatalogueService catalogueService;

    public AdminService(MovieRepository movieRepository,
                        TheatreRepository theatreRepository,
                        ScreenRepository screenRepository,
                        SeatRepository seatRepository,
                        ShowRepository showRepository,
                        BookingRepository bookingRepository,
                        PaymentRepository paymentRepository,
                        BookingService bookingService,
                        CatalogueService catalogueService) {
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
        this.catalogueService = catalogueService;
    }

    // --- Movie CRUD ---
    public MovieDTO createMovie(MovieRequest request) {
        Movie movie = new Movie(
                request.getTitle().trim(),
                request.getGenre().trim(),
                request.getDurationMinutes(),
                request.getLanguage().trim(),
                request.getRating(),
                request.getDescription() != null ? request.getDescription().trim() : null,
                request.getPosterUrl() != null ? request.getPosterUrl().trim() : null
        );
        return catalogueService.mapMovieToDTO(movieRepository.save(movie));
    }

    public MovieDTO updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + id));

        movie.setTitle(request.getTitle().trim());
        movie.setGenre(request.getGenre().trim());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setLanguage(request.getLanguage().trim());
        movie.setRating(request.getRating());
        movie.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        movie.setPosterUrl(request.getPosterUrl() != null ? request.getPosterUrl().trim() : null);

        return catalogueService.mapMovieToDTO(movieRepository.save(movie));
    }

    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + id));

        List<Show> shows = showRepository.findByMovieMovieIdOrderByShowDateAscShowTimeAsc(id);
        if (!shows.isEmpty()) {
            throw new BadRequestException("Cannot delete movie referenced by existing shows. Please delete or reassign shows first.");
        }
        movieRepository.delete(movie);
    }

    // --- Theatre CRUD ---
    public TheatreDTO createTheatre(TheatreRequest request) {
        Theatre theatre = new Theatre(request.getTheatreName().trim(), request.getLocation().trim());
        Theatre saved = theatreRepository.save(theatre);
        return new TheatreDTO(saved.getTheatreId(), saved.getTheatreName(), saved.getLocation());
    }

    public TheatreDTO updateTheatre(Long id, TheatreRequest request) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with ID: " + id));
        theatre.setTheatreName(request.getTheatreName().trim());
        theatre.setLocation(request.getLocation().trim());
        Theatre saved = theatreRepository.save(theatre);
        return new TheatreDTO(saved.getTheatreId(), saved.getTheatreName(), saved.getLocation());
    }

    public void deleteTheatre(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with ID: " + id));
        List<Screen> screens = screenRepository.findByTheatreTheatreId(id);
        if (!screens.isEmpty()) {
            throw new BadRequestException("Cannot delete theatre containing active screens.");
        }
        theatreRepository.delete(theatre);
    }

    // --- Screen CRUD ---
    public ScreenDTO createScreen(ScreenRequest request) {
        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with ID: " + request.getTheatreId()));

        if (screenRepository.existsByTheatreTheatreIdAndScreenName(request.getTheatreId(), request.getScreenName().trim())) {
            throw new BadRequestException("Screen with name '" + request.getScreenName() + "' already exists in this theatre.");
        }

        Screen screen = new Screen(theatre, request.getScreenName().trim());
        Screen saved = screenRepository.save(screen);
        return new ScreenDTO(saved.getScreenId(), theatre.getTheatreId(), theatre.getTheatreName(), saved.getScreenName());
    }

    public ScreenDTO updateScreen(Long id, ScreenRequest request) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with ID: " + id));
        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with ID: " + request.getTheatreId()));

        screen.setTheatre(theatre);
        screen.setScreenName(request.getScreenName().trim());
        Screen saved = screenRepository.save(screen);
        return new ScreenDTO(saved.getScreenId(), theatre.getTheatreId(), theatre.getTheatreName(), saved.getScreenName());
    }

    public void deleteScreen(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with ID: " + id));
        List<Seat> seats = seatRepository.findByScreenScreenIdOrderBySeatNumberAsc(id);
        if (!seats.isEmpty()) {
            throw new BadRequestException("Cannot delete screen with configured seats. Please delete seats first.");
        }
        List<Show> shows = showRepository.findByScreenScreenId(id);
        if (!shows.isEmpty()) {
            throw new BadRequestException("Cannot delete screen scheduled for shows.");
        }
        screenRepository.delete(screen);
    }

    // --- Seat CRUD ---
    public SeatDTO createSeat(SeatRequest request) {
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with ID: " + request.getScreenId()));

        if (seatRepository.existsByScreenScreenIdAndSeatNumber(request.getScreenId(), request.getSeatNumber().trim())) {
            throw new BadRequestException("Seat number '" + request.getSeatNumber() + "' already exists in this screen.");
        }

        Seat seat = new Seat(screen, request.getSeatNumber().trim(), request.getSeatType());
        Seat saved = seatRepository.save(seat);
        return new SeatDTO(saved.getSeatId(), screen.getScreenId(), saved.getSeatNumber(), saved.getSeatType());
    }

    public SeatDTO updateSeat(Long id, SeatRequest request) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + id));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with ID: " + request.getScreenId()));

        seat.setScreen(screen);
        seat.setSeatNumber(request.getSeatNumber().trim());
        seat.setSeatType(request.getSeatType());
        Seat saved = seatRepository.save(seat);
        return new SeatDTO(saved.getSeatId(), screen.getScreenId(), saved.getSeatNumber(), saved.getSeatType());
    }

    public void deleteSeat(Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + id));
        seatRepository.delete(seat);
    }

    // --- Show CRUD ---
    public ShowDTO createShow(ShowRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with ID: " + request.getScreenId()));

        if (showRepository.existsByScreenScreenIdAndShowDateAndShowTime(request.getScreenId(), request.getShowDate(), request.getShowTime())) {
            throw new BadRequestException("A show is already scheduled on screen '" + screen.getScreenName()
                    + "' on " + request.getShowDate() + " at " + request.getShowTime());
        }

        Show show = new Show(movie, screen, request.getShowDate(), request.getShowTime(), request.getPrice());
        return catalogueService.mapShowToDTO(showRepository.save(show));
    }

    public ShowDTO updateShow(Long id, ShowRequest request) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + id));
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with ID: " + request.getScreenId()));

        show.setMovie(movie);
        show.setScreen(screen);
        show.setShowDate(request.getShowDate());
        show.setShowTime(request.getShowTime());
        show.setPrice(request.getPrice());

        return catalogueService.mapShowToDTO(showRepository.save(show));
    }

    public void deleteShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + id));

        long bookingCount = bookingRepository.countByShowShowId(id);
        if (bookingCount > 0) {
            throw new BadRequestException("Cannot delete show referenced by " + bookingCount + " booking(s).");
        }
        showRepository.delete(show);
    }

    // --- Admin Listings ---
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc().stream()
                .map(bookingService::mapBookingToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc().stream()
                .map(p -> new PaymentDTO(
                        p.getPaymentId(),
                        p.getBooking().getBookingId(),
                        p.getPaymentDate(),
                        p.getAmount(),
                        p.getMethod(),
                        p.getPaymentStatus()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScreenDTO> getAllScreens() {
        return screenRepository.findAll().stream()
                .map(s -> new ScreenDTO(s.getScreenId(), s.getTheatre().getTheatreId(), s.getTheatre().getTheatreName(), s.getScreenName()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SeatDTO> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(st -> new SeatDTO(st.getSeatId(), st.getScreen().getScreenId(), st.getSeatNumber(), st.getSeatType()))
                .collect(Collectors.toList());
    }
}
