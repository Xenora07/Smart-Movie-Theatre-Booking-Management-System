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
}
