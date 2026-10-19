package com.cinema.booking.controller;

import com.cinema.booking.dto.booking.BookingResponseDTO;
import com.cinema.booking.dto.booking.CreateBookingRequest;
import com.cinema.booking.dto.booking.SimulatedPaymentRequest;
import com.cinema.booking.security.UserPrincipal;
import com.cinema.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    private String resolveUsername(UserPrincipal userPrincipal, Authentication authentication) {
        if (userPrincipal != null) {
            return userPrincipal.getUsername();
        }
        if (authentication != null) {
            return authentication.getName();
        }
        return null;
    }

    private boolean resolveIsAdmin(UserPrincipal userPrincipal, Authentication authentication) {
        if (userPrincipal != null) {
            return userPrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }
        return false;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Authentication authentication) {
        BookingResponseDTO response = bookingService.createBooking(request, resolveUsername(userPrincipal, authentication));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Authentication authentication) {
        List<BookingResponseDTO> bookings = bookingService.getCustomerBookings(resolveUsername(userPrincipal, authentication));
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Authentication authentication) {
        boolean isAdmin = resolveIsAdmin(userPrincipal, authentication);
        BookingResponseDTO booking = bookingService.getBookingById(bookingId, resolveUsername(userPrincipal, authentication), isAdmin);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/payment")
    public ResponseEntity<BookingResponseDTO> simulatePayment(
            @PathVariable Long bookingId,
            @Valid @RequestBody SimulatedPaymentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Authentication authentication) {
        boolean isAdmin = resolveIsAdmin(userPrincipal, authentication);
        BookingResponseDTO response = bookingService.simulatePayment(bookingId, request, resolveUsername(userPrincipal, authentication), isAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Authentication authentication) {
        boolean isAdmin = resolveIsAdmin(userPrincipal, authentication);
        BookingResponseDTO response = bookingService.cancelBooking(bookingId, resolveUsername(userPrincipal, authentication), isAdmin);
        return ResponseEntity.ok(response);
    }
}
