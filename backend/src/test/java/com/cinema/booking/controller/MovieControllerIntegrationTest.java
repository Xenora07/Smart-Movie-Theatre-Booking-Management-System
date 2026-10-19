package com.cinema.booking.controller;

import com.cinema.booking.dto.catalogue.MovieDTO;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.service.CatalogueService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import com.cinema.booking.exception.GlobalExceptionHandler;
import com.cinema.booking.security.CustomUserDetailsService;
import com.cinema.booking.security.JwtTokenProvider;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = MovieController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class MovieControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CatalogueService catalogueService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getMovieById_invalidUndefinedId_returns400BadRequest() throws Exception {
        mockMvc.perform(get("/api/movies/undefined"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("The parameter 'movieId' must be of type Long."));
    }

    @Test
    void getShowsForMovie_invalidUndefinedId_returns400BadRequest() throws Exception {
        mockMvc.perform(get("/api/movies/undefined/shows"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("The parameter 'movieId' must be of type Long."));
    }

    @Test
    void getMovieById_notFound_returns404() throws Exception {
        when(catalogueService.getMovieById(999999L))
                .thenThrow(new ResourceNotFoundException("Movie not found with ID: 999999"));

        mockMvc.perform(get("/api/movies/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Movie not found with ID: 999999"));
    }

    @Test
    void getMovieById_validId_returnsMovie() throws Exception {
        MovieDTO movie = new MovieDTO(1L, "Inception", "Sci-Fi", (short) 148, "English", new BigDecimal("8.8"), "Dream world", "https://example.com/poster.jpg");
        when(catalogueService.getMovieById(1L)).thenReturn(movie);

        mockMvc.perform(get("/api/movies/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.movieId").value(1))
                .andExpect(jsonPath("$.title").value("Inception"));
    }
}
