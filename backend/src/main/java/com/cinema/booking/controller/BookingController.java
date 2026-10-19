package com.cinema.booking.controller;

import com.cinema.booking.dto.booking.BookingResponseDTO;
import com.cinema.booking.dto.booking.CreateBookingRequest;
import com.cinema.booking.dto.booking.SimulatedPaymentRequest;
import com.cinema.booking.security.UserPrincipal;
import com.cinema.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponseDTO response = bookingService.createBooking(request, userPrincipal.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BookingResponseDTO> bookings = bookingService.getCustomerBookings(userPrincipal.getUsername());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        BookingResponseDTO booking = bookingService.getBookingById(bookingId, userPrincipal.getUsername(), isAdmin);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/payment")
    public ResponseEntity<BookingResponseDTO> simulatePayment(
            @PathVariable Long bookingId,
            @Valid @RequestBody SimulatedPaymentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        BookingResponseDTO response = bookingService.simulatePayment(bookingId, request, userPrincipal.getUsername(), isAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        BookingResponseDTO response = bookingService.cancelBooking(bookingId, userPrincipal.getUsername(), isAdmin);
        return ResponseEntity.ok(response);
    }
}
