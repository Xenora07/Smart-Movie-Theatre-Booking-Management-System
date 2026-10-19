package com.cinema.booking.service;

import com.cinema.booking.dto.catalogue.*;
import com.cinema.booking.entity.BookingSeat;
import com.cinema.booking.entity.Movie;
import com.cinema.booking.entity.Seat;
import com.cinema.booking.entity.Show;
import com.cinema.booking.entity.Theatre;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CatalogueService {

    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TheatreRepository theatreRepository;

    public CatalogueService(MovieRepository movieRepository,
                            ShowRepository showRepository,
                            SeatRepository seatRepository,
                            BookingSeatRepository bookingSeatRepository,
                            TheatreRepository theatreRepository) {
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.theatreRepository = theatreRepository;
    }

    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAllByOrderByTitleAsc().stream()
                .map(this::mapMovieToDTO)
                .collect(Collectors.toList());
    }

    public MovieDTO getMovieById(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + movieId));
        return mapMovieToDTO(movie);
    }

    public List<ShowDTO> getShowsForMovie(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("Movie not found with ID: " + movieId);
        }
        return showRepository.findByMovieMovieIdOrderByShowDateAscShowTimeAsc(movieId).stream()
                .map(this::mapShowToDTO)
                .collect(Collectors.toList());
    }

    public ShowDTO getShowById(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + showId));
        return mapShowToDTO(show);
    }

    public List<SeatAvailabilityDTO> getSeatsForShow(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + showId));

        Long screenId = show.getScreen().getScreenId();
        List<Seat> allSeats = seatRepository.findByScreenScreenIdOrderBySeatNumberAsc(screenId);

        // Find all seat IDs that have active allocations for this show
        Set<Long> bookedSeatIds = bookingSeatRepository.findByShowShowId(showId).stream()
                .map(bs -> bs.getSeat().getSeatId())
                .collect(Collectors.toSet());

        return allSeats.stream()
                .map(seat -> new SeatAvailabilityDTO(
                        seat.getSeatId(),
                        seat.getSeatNumber(),
                        seat.getSeatType(),
                        !bookedSeatIds.contains(seat.getSeatId())
                ))
                .collect(Collectors.toList());
    }

    public List<TheatreDTO> getAllTheatres() {
        return theatreRepository.findAllByOrderByTheatreNameAsc().stream()
                .map(t -> new TheatreDTO(t.getTheatreId(), t.getTheatreName(), t.getLocation()))
                .collect(Collectors.toList());
    }

    public MovieDTO mapMovieToDTO(Movie movie) {
        return new MovieDTO(
                movie.getMovieId(),
                movie.getTitle(),
                movie.getGenre(),
                movie.getDurationMinutes(),
                movie.getLanguage(),
                movie.getRating(),
                movie.getDescription(),
                movie.getPosterUrl()
        );
    }

    public ShowDTO mapShowToDTO(Show show) {
        return new ShowDTO(
                show.getShowId(),
                show.getMovie().getMovieId(),
                show.getMovie().getTitle(),
                show.getScreen().getScreenId(),
                show.getScreen().getScreenName(),
                show.getScreen().getTheatre().getTheatreId(),
                show.getScreen().getTheatre().getTheatreName(),
                show.getScreen().getTheatre().getLocation(),
                show.getShowDate(),
                show.getShowTime(),
                show.getPrice()
        );
    }
}
