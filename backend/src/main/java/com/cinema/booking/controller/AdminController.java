package com.cinema.booking.controller;

import com.cinema.booking.dto.admin.*;
import com.cinema.booking.dto.booking.BookingResponseDTO;
import com.cinema.booking.dto.booking.PaymentDTO;
import com.cinema.booking.dto.catalogue.*;
import com.cinema.booking.dto.common.ApiResponse;
import com.cinema.booking.service.AdminService;
import com.cinema.booking.service.CatalogueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final CatalogueService catalogueService;

    public AdminController(AdminService adminService, CatalogueService catalogueService) {
        this.adminService = adminService;
        this.catalogueService = catalogueService;
    }

    // --- Movies ---
    @PostMapping("/movies")
    public ResponseEntity<MovieDTO> createMovie(@Valid @RequestBody MovieRequest request) {
        return new ResponseEntity<>(adminService.createMovie(request), HttpStatus.CREATED);
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<MovieDTO> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return ResponseEntity.ok(adminService.updateMovie(id, request));
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<ApiResponse> deleteMovie(@PathVariable Long id) {
        adminService.deleteMovie(id);
        return ResponseEntity.ok(new ApiResponse(true, "Movie deleted successfully."));
    }

    // --- Theatres ---
    @GetMapping("/theatres")
    public ResponseEntity<List<TheatreDTO>> getAllTheatres() {
        return ResponseEntity.ok(catalogueService.getAllTheatres());
    }

    @PostMapping("/theatres")
    public ResponseEntity<TheatreDTO> createTheatre(@Valid @RequestBody TheatreRequest request) {
        return new ResponseEntity<>(adminService.createTheatre(request), HttpStatus.CREATED);
    }

    @PutMapping("/theatres/{id}")
    public ResponseEntity<TheatreDTO> updateTheatre(@PathVariable Long id, @Valid @RequestBody TheatreRequest request) {
        return ResponseEntity.ok(adminService.updateTheatre(id, request));
    }

    @DeleteMapping("/theatres/{id}")
    public ResponseEntity<ApiResponse> deleteTheatre(@PathVariable Long id) {
        adminService.deleteTheatre(id);
        return ResponseEntity.ok(new ApiResponse(true, "Theatre deleted successfully."));
    }

    // --- Screens ---
    @GetMapping("/screens")
    public ResponseEntity<List<ScreenDTO>> getAllScreens() {
        return ResponseEntity.ok(adminService.getAllScreens());
    }

    @PostMapping("/screens")
    public ResponseEntity<ScreenDTO> createScreen(@Valid @RequestBody ScreenRequest request) {
        return new ResponseEntity<>(adminService.createScreen(request), HttpStatus.CREATED);
    }

    @PutMapping("/screens/{id}")
    public ResponseEntity<ScreenDTO> updateScreen(@PathVariable Long id, @Valid @RequestBody ScreenRequest request) {
        return ResponseEntity.ok(adminService.updateScreen(id, request));
    }

    @DeleteMapping("/screens/{id}")
    public ResponseEntity<ApiResponse> deleteScreen(@PathVariable Long id) {
        adminService.deleteScreen(id);
        return ResponseEntity.ok(new ApiResponse(true, "Screen deleted successfully."));
    }

    // --- Seats ---
    @GetMapping("/seats")
    public ResponseEntity<List<SeatDTO>> getAllSeats() {
        return ResponseEntity.ok(adminService.getAllSeats());
    }

    @PostMapping("/seats")
    public ResponseEntity<SeatDTO> createSeat(@Valid @RequestBody SeatRequest request) {
        return new ResponseEntity<>(adminService.createSeat(request), HttpStatus.CREATED);
    }

    @PutMapping("/seats/{id}")
    public ResponseEntity<SeatDTO> updateSeat(@PathVariable Long id, @Valid @RequestBody SeatRequest request) {
        return ResponseEntity.ok(adminService.updateSeat(id, request));
    }

    @DeleteMapping("/seats/{id}")
    public ResponseEntity<ApiResponse> deleteSeat(@PathVariable Long id) {
        adminService.deleteSeat(id);
        return ResponseEntity.ok(new ApiResponse(true, "Seat deleted successfully."));
    }

    // --- Shows ---
    @GetMapping("/shows")
    public ResponseEntity<List<ShowDTO>> getAllShows() {
        List<MovieDTO> movies = catalogueService.getAllMovies();
        List<ShowDTO> allShows = movies.stream()
                .flatMap(m -> catalogueService.getShowsForMovie(m.getMovieId()).stream())
                .toList();
        return ResponseEntity.ok(allShows);
    }

    @PostMapping("/shows")
    public ResponseEntity<ShowDTO> createShow(@Valid @RequestBody ShowRequest request) {
        return new ResponseEntity<>(adminService.createShow(request), HttpStatus.CREATED);
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<ShowDTO> updateShow(@PathVariable Long id, @Valid @RequestBody ShowRequest request) {
        return ResponseEntity.ok(adminService.updateShow(id, request));
    }

    @DeleteMapping("/shows/{id}")
    public ResponseEntity<ApiResponse> deleteShow(@PathVariable Long id) {
        adminService.deleteShow(id);
        return ResponseEntity.ok(new ApiResponse(true, "Show deleted successfully."));
    }

    // --- Bookings & Payments ---
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(adminService.getAllPayments());
    }

    // --- Counter Booking ---
    @GetMapping("/customers/search")
    public ResponseEntity<List<CustomerLookupDTO>> searchCustomers(@RequestParam String query) {
        return ResponseEntity.ok(adminService.searchCustomers(query));
    }

    @PostMapping("/counter-bookings")
    public ResponseEntity<BookingResponseDTO> createCounterBooking(@Valid @RequestBody CounterBookingRequest request) {
        return new ResponseEntity<>(adminService.createCounterBooking(request), HttpStatus.CREATED);
    }
}
