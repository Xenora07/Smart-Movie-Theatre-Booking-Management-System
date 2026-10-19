package com.cinema.booking.controller;

import com.cinema.booking.dto.catalogue.SeatAvailabilityDTO;
import com.cinema.booking.dto.catalogue.ShowDTO;
import com.cinema.booking.service.CatalogueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final CatalogueService catalogueService;

    public ShowController(CatalogueService catalogueService) {
        this.catalogueService = catalogueService;
    }

    @GetMapping("/{showId}")
    public ResponseEntity<ShowDTO> getShowById(@PathVariable Long showId) {
        return ResponseEntity.ok(catalogueService.getShowById(showId));
    }

    @GetMapping("/{showId}/seats")
    public ResponseEntity<List<SeatAvailabilityDTO>> getSeatsForShow(@PathVariable Long showId) {
        return ResponseEntity.ok(catalogueService.getSeatsForShow(showId));
    }
}
