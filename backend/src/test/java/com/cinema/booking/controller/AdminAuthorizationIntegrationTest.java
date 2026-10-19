package com.cinema.booking.controller;

import com.cinema.booking.dto.catalogue.MovieDTO;
import com.cinema.booking.service.CatalogueService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CatalogueService catalogueService;

    @MockBean
    private com.cinema.booking.service.AdminService adminService;

    @MockBean
    private com.cinema.booking.service.BookingService bookingService;

    @Test
    void publicCatalogue_accessibleWithoutAuthentication() throws Exception {
        when(catalogueService.getAllMovies()).thenReturn(List.of(
                new MovieDTO(1L, "The Last Orbit", "Sci-Fi", (short) 130, "English", new BigDecimal("8.0"), "Desc", "url")
        ));

        mockMvc.perform(get("/api/movies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("The Last Orbit"));
    }

    @Test
    void adminEndpoint_anonymousUser_returns401() throws Exception {
        mockMvc.perform(post("/api/admin/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test\",\"genre\":\"Action\",\"durationMinutes\":120,\"language\":\"Hindi\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "customer@cinema.local", roles = {"CUSTOMER"})
    void adminEndpoint_customerRole_returns403Forbidden() throws Exception {
        mockMvc.perform(post("/api/admin/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test\",\"genre\":\"Action\",\"durationMinutes\":120,\"language\":\"Hindi\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "customer@cinema.local", roles = {"CUSTOMER"})
    void adminAuditBookings_customerRole_returns403Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/bookings"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@cinema.local", roles = {"ADMIN"})
    void adminAuditBookings_adminRole_returns200() throws Exception {
        when(adminService.getAllBookings()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/bookings"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin@cinema.local", roles = {"ADMIN"})
    void customerBookingCreation_adminRole_returns403Forbidden() throws Exception {
        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"showId\":1,\"seatIds\":[1,2]}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@cinema.local", roles = {"ADMIN"})
    void customerMyBookings_adminRole_returns403Forbidden() throws Exception {
        mockMvc.perform(get("/api/bookings/my"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@cinema.local", roles = {"ADMIN"})
    void customerPaymentSimulation_adminRole_returns403Forbidden() throws Exception {
        mockMvc.perform(post("/api/bookings/1/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"method\":\"UPI\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "customer@cinema.local", roles = {"CUSTOMER"})
    void customerMyBookings_customerRole_returns200() throws Exception {
        when(bookingService.getCustomerBookings("customer@cinema.local")).thenReturn(List.of());

        mockMvc.perform(get("/api/bookings/my"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin@cinema.local", roles = {"ADMIN"})
    void counterBooking_adminRole_returns201Created() throws Exception {
        when(adminService.createCounterBooking(org.mockito.ArgumentMatchers.any()))
                .thenReturn(new com.cinema.booking.dto.booking.BookingResponseDTO());

        mockMvc.perform(post("/api/admin/counter-bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"showId\":1,\"seatIds\":[1,2],\"customerName\":\"Walkin User\",\"customerPhone\":\"9998887776\",\"paymentMethod\":\"CASH_SIMULATED\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "customer@cinema.local", roles = {"CUSTOMER"})
    void counterBooking_customerRole_returns403Forbidden() throws Exception {
        mockMvc.perform(post("/api/admin/counter-bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"showId\":1,\"seatIds\":[1,2],\"customerName\":\"Walkin User\",\"customerPhone\":\"9998887776\",\"paymentMethod\":\"CASH_SIMULATED\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@cinema.local", roles = {"ADMIN"})
    void searchCustomers_adminRole_returns200Ok() throws Exception {
        when(adminService.searchCustomers("Alice")).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/customers/search?query=Alice"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "customer@cinema.local", roles = {"CUSTOMER"})
    void searchCustomers_customerRole_returns403Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/customers/search?query=Alice"))
                .andExpect(status().isForbidden());
    }
}
