package com.cinema.booking.controller;

import com.cinema.booking.dto.catalogue.MovieDTO;
import com.cinema.booking.dto.catalogue.ShowDTO;
import com.cinema.booking.service.CatalogueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final CatalogueService catalogueService;

    public MovieController(CatalogueService catalogueService) {
        this.catalogueService = catalogueService;
    }

    @GetMapping
    public ResponseEntity<List<MovieDTO>> getAllMovies() {
        return ResponseEntity.ok(catalogueService.getAllMovies());
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<MovieDTO> getMovieById(@PathVariable Long movieId) {
        return ResponseEntity.ok(catalogueService.getMovieById(movieId));
    }

    @GetMapping("/{movieId}/shows")
    public ResponseEntity<List<ShowDTO>> getShowsForMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(catalogueService.getShowsForMovie(movieId));
    }
}
