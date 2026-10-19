package com.cinema.booking.service;

import com.cinema.booking.dto.booking.BookingResponseDTO;
import com.cinema.booking.dto.booking.CreateBookingRequest;
import com.cinema.booking.dto.booking.PaymentDTO;
import com.cinema.booking.dto.booking.SimulatedPaymentRequest;
import com.cinema.booking.dto.catalogue.SeatDTO;
import com.cinema.booking.entity.*;
import com.cinema.booking.exception.BadRequestException;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.exception.SeatUnavailableException;
import com.cinema.booking.exception.UnauthorizedException;
import com.cinema.booking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PaymentRepository paymentRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final CustomerRepository customerRepository;

    public BookingService(BookingRepository bookingRepository,
                          BookingSeatRepository bookingSeatRepository,
                          PaymentRepository paymentRepository,
                          ShowRepository showRepository,
                          SeatRepository seatRepository,
                          CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.paymentRepository = paymentRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Transactional booking creation with server-side price calculation,
     * screen-seat validation, availability verification, and atomic persistence.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public BookingResponseDTO createBooking(CreateBookingRequest request, String customerEmail) {
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + customerEmail));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + request.getShowId()));

        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            throw new BadRequestException("At least one seat must be selected for booking.");
        }

        // Distinct seat IDs requested
        List<Long> distinctSeatIds = request.getSeatIds().stream().distinct().collect(Collectors.toList());
        if (distinctSeatIds.size() != request.getSeatIds().size()) {
            throw new BadRequestException("Duplicate seats found in request.");
        }

        Long screenId = show.getScreen().getScreenId();
        List<Seat> selectedSeats = seatRepository.findAllById(distinctSeatIds);

        if (selectedSeats.size() != distinctSeatIds.size()) {
            throw new BadRequestException("One or more selected seat IDs do not exist.");
        }

        // Invariant 1: Every seat must belong to the screen hosting the show
        for (Seat seat : selectedSeats) {
            if (!seat.getScreen().getScreenId().equals(screenId)) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " does not belong to "
                        + show.getScreen().getScreenName() + " where this show is hosted.");
            }
        }

        // Invariant 2: Verify seats are not already allocated for this show
        for (Seat seat : selectedSeats) {
            if (bookingSeatRepository.existsByShowShowIdAndSeatSeatId(show.getShowId(), seat.getSeatId())) {
                throw new SeatUnavailableException("Seat " + seat.getSeatNumber() + " is already booked for this show.");
            }
        }

        // Server-calculated total amount: show price * seat count
        BigDecimal unitPrice = show.getPrice();
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(selectedSeats.size()));

        // Create Booking
        Booking booking = new Booking(customer, show, BookingStatus.PENDING, totalAmount);
        Booking savedBooking = bookingRepository.save(booking);

        // Create BookingSeat allocations atomically
        List<BookingSeat> bookingSeats = new ArrayList<>();
        for (Seat seat : selectedSeats) {
            BookingSeat bookingSeat = new BookingSeat(savedBooking, seat, show);
            bookingSeats.add(bookingSeat);
        }
        bookingSeatRepository.saveAll(bookingSeats);

        return mapBookingToDTO(savedBooking, bookingSeats, null);
    }

    /**
     * Complete simulated payment for a pending booking.
     */
    @Transactional(rollbackFor = Exception.class)
    public BookingResponseDTO simulatePayment(Long bookingId, SimulatedPaymentRequest request, String customerEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        // Ownership verification
        if (!isAdmin && !booking.getCustomer().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new UnauthorizedException("You are not authorized to process payment for this booking.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Payment cannot be processed. Booking status is already: " + booking.getStatus());
        }

        // Record simulated payment
        Payment payment = new Payment(
                booking,
                LocalDateTime.now(),
                booking.getTotalAmount(),
                request.getMethod(),
                PaymentStatus.SUCCESS
        );
        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updatedBooking = bookingRepository.save(booking);

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingBookingId(bookingId);
        return mapBookingToDTO(updatedBooking, bookingSeats, savedPayment);
    }

    /**
     * Cancel booking and release seat allocations transactionally.
     */
    @Transactional(rollbackFor = Exception.class)
    public BookingResponseDTO cancelBooking(Long bookingId, String customerEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        // Ownership verification
        if (!isAdmin && !booking.getCustomer().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        // Release seat allocations from BOOKING_SEAT so they can be booked by others
        bookingSeatRepository.deleteByBookingId(bookingId);

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        // If payment existed, mark REFUNDED
        Payment payment = paymentRepository.findByBookingBookingId(bookingId).orElse(null);
        if (payment != null && payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        }

        return mapBookingToDTO(updatedBooking, new ArrayList<>(), payment);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getCustomerBookings(String customerEmail) {
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + customerEmail));

        return bookingRepository.findByCustomerCustomerIdOrderByBookingDateDesc(customer.getCustomerId()).stream()
                .map(this::mapBookingToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId, String customerEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!isAdmin && !booking.getCustomer().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new UnauthorizedException("You are not authorized to view this booking.");
        }

        return mapBookingToDTO(booking);
    }

    public BookingResponseDTO mapBookingToDTO(Booking booking) {
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingBookingId(booking.getBookingId());
        Payment payment = paymentRepository.findByBookingBookingId(booking.getBookingId()).orElse(null);
        return mapBookingToDTO(booking, bookingSeats, payment);
    }

    public BookingResponseDTO mapBookingToDTO(Booking booking, List<BookingSeat> bookingSeats, Payment payment) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setCustomerId(booking.getCustomer().getCustomerId());
        dto.setCustomerName(booking.getCustomer().getName());
        dto.setCustomerEmail(booking.getCustomer().getEmail());
        dto.setShowId(booking.getShow().getShowId());
        dto.setMovieTitle(booking.getShow().getMovie().getTitle());
        dto.setMoviePosterUrl(booking.getShow().getMovie().getPosterUrl());
        dto.setTheatreName(booking.getShow().getScreen().getTheatre().getTheatreName());
        dto.setTheatreLocation(booking.getShow().getScreen().getTheatre().getLocation());
        dto.setScreenName(booking.getShow().getScreen().getScreenName());
        dto.setShowDate(booking.getShow().getShowDate());
        dto.setShowTime(booking.getShow().getShowTime());
        dto.setUnitPrice(booking.getShow().getPrice());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStatus(booking.getStatus());
        dto.setTotalAmount(booking.getTotalAmount());

        List<SeatDTO> seatDTOs = bookingSeats.stream()
                .map(bs -> new SeatDTO(
                        bs.getSeat().getSeatId(),
                        bs.getSeat().getScreen().getScreenId(),
                        bs.getSeat().getSeatNumber(),
                        bs.getSeat().getSeatType()
                ))
                .collect(Collectors.toList());
        dto.setBookedSeats(seatDTOs);

        if (payment != null) {
            dto.setPayment(new PaymentDTO(
                    payment.getPaymentId(),
                    payment.getBooking().getBookingId(),
                    payment.getPaymentDate(),
                    payment.getAmount(),
                    payment.getMethod(),
                    payment.getPaymentStatus()
            ));
        }

        return dto;
    }
}
