package com.cinema.booking.service;

import com.cinema.booking.dto.booking.BookingResponseDTO;
import com.cinema.booking.dto.booking.CreateBookingRequest;
import com.cinema.booking.dto.booking.SimulatedPaymentRequest;
import com.cinema.booking.entity.*;
import com.cinema.booking.exception.BadRequestException;
import com.cinema.booking.exception.SeatUnavailableException;
import com.cinema.booking.exception.UnauthorizedException;
import com.cinema.booking.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingSeatRepository bookingSeatRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ShowRepository showRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private BookingService bookingService;

    private Customer customer;
    private Movie movie;
    private Theatre theatre;
    private Screen screen1;
    private Screen screen2;
    private Seat seat1;
    private Seat seat2;
    private Seat seatWrongScreen;
    private Show show;

    @BeforeEach
    void setUp() {
        customer = new Customer("Alice Sharma", "alice@cinema.local", "9876543211", "hash", CustomerRole.CUSTOMER);
        customer.setCustomerId(1L);

        movie = new Movie("The Last Orbit", "Sci-Fi", (short) 130, "English", new BigDecimal("8.0"), "Desc", "url");
        movie.setMovieId(1L);

        theatre = new Theatre("Harbour Cinemas", "Mumbai");
        theatre.setTheatreId(1L);

        screen1 = new Screen(theatre, "Screen 1");
        screen1.setScreenId(1L);

        screen2 = new Screen(theatre, "Screen 2");
        screen2.setScreenId(2L);

        seat1 = new Seat(screen1, "A1", SeatType.REGULAR);
        seat1.setSeatId(101L);

        seat2 = new Seat(screen1, "A2", SeatType.REGULAR);
        seat2.setSeatId(102L);

        seatWrongScreen = new Seat(screen2, "A1", SeatType.REGULAR);
        seatWrongScreen.setSeatId(201L);

        show = new Show(movie, screen1, LocalDate.now().plusDays(1), LocalTime.of(18, 0), new BigDecimal("250.00"));
        show.setShowId(10L);
    }

    @Test
    void createBooking_success_calculatesServerPriceAndSavesAtomically() {
        CreateBookingRequest request = new CreateBookingRequest(10L, Arrays.asList(101L, 102L));

        when(customerRepository.findByEmail("alice@cinema.local")).thenReturn(Optional.of(customer));
        when(showRepository.findById(10L)).thenReturn(Optional.of(show));
        when(seatRepository.findAllById(any())).thenReturn(Arrays.asList(seat1, seat2));
        when(bookingSeatRepository.existsByShowShowIdAndSeatSeatId(10L, 101L)).thenReturn(false);
        when(bookingSeatRepository.existsByShowShowIdAndSeatSeatId(10L, 102L)).thenReturn(false);

        Booking savedBooking = new Booking(customer, show, BookingStatus.PENDING, new BigDecimal("500.00"));
        savedBooking.setBookingId(100L);
        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        BookingResponseDTO response = bookingService.createBooking(request, "alice@cinema.local");

        assertNotNull(response);
        assertEquals(100L, response.getBookingId());
        assertEquals(BookingStatus.PENDING, response.getStatus());
        // 2 seats * 250.00 = 500.00 server calculated
        assertEquals(new BigDecimal("500.00"), response.getTotalAmount());
        assertEquals(2, response.getBookedSeats().size());
        verify(bookingSeatRepository, times(1)).saveAll(any());
    }

    @Test
    void createBooking_seatFromWrongScreen_throwsBadRequestException() {
        CreateBookingRequest request = new CreateBookingRequest(10L, Arrays.asList(101L, 201L));

        when(customerRepository.findByEmail("alice@cinema.local")).thenReturn(Optional.of(customer));
        when(showRepository.findById(10L)).thenReturn(Optional.of(show));
        when(seatRepository.findAllById(any())).thenReturn(Arrays.asList(seat1, seatWrongScreen));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> bookingService.createBooking(request, "alice@cinema.local"));

        assertTrue(ex.getMessage().contains("does not belong to"));
        verify(bookingRepository, never()).save(any(Booking.class));
        verify(bookingSeatRepository, never()).saveAll(any());
    }

    @Test
    void createBooking_alreadyBookedSeat_throwsSeatUnavailableException() {
        CreateBookingRequest request = new CreateBookingRequest(10L, List.of(101L));

        when(customerRepository.findByEmail("alice@cinema.local")).thenReturn(Optional.of(customer));
        when(showRepository.findById(10L)).thenReturn(Optional.of(show));
        when(seatRepository.findAllById(any())).thenReturn(List.of(seat1));
        when(bookingSeatRepository.existsByShowShowIdAndSeatSeatId(10L, 101L)).thenReturn(true);

        assertThrows(SeatUnavailableException.class,
                () -> bookingService.createBooking(request, "alice@cinema.local"));

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void simulatePayment_owner_success() {
        Booking booking = new Booking(customer, show, BookingStatus.PENDING, new BigDecimal("250.00"));
        booking.setBookingId(50L);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(i -> i.getArgument(0));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        SimulatedPaymentRequest req = new SimulatedPaymentRequest(PaymentMethod.UPI);
        BookingResponseDTO res = bookingService.simulatePayment(50L, req, "alice@cinema.local", false);

        assertNotNull(res);
        assertEquals(BookingStatus.CONFIRMED, res.getStatus());
        assertNotNull(res.getPayment());
        assertEquals(PaymentStatus.SUCCESS, res.getPayment().getPaymentStatus());
    }

    @Test
    void simulatePayment_nonOwner_throwsUnauthorizedException() {
        Booking booking = new Booking(customer, show, BookingStatus.PENDING, new BigDecimal("250.00"));
        booking.setBookingId(50L);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));

        SimulatedPaymentRequest req = new SimulatedPaymentRequest(PaymentMethod.UPI);
        assertThrows(UnauthorizedException.class,
                () -> bookingService.simulatePayment(50L, req, "intruder@cinema.local", false));

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void cancelBooking_releasesSeatAllocations() {
        Booking booking = new Booking(customer, show, BookingStatus.CONFIRMED, new BigDecimal("250.00"));
        booking.setBookingId(50L);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        BookingResponseDTO res = bookingService.cancelBooking(50L, "alice@cinema.local", false);

        assertEquals(BookingStatus.CANCELLED, res.getStatus());
        verify(bookingSeatRepository, times(1)).deleteByBookingId(50L);
    }
}
