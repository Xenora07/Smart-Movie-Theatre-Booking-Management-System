package com.cinema.booking.controller;

import com.cinema.booking.dto.catalogue.TheatreDTO;
import com.cinema.booking.service.CatalogueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    private final CatalogueService catalogueService;

    public TheatreController(CatalogueService catalogueService) {
        this.catalogueService = catalogueService;
    }

    @GetMapping
    public ResponseEntity<List<TheatreDTO>> getAllTheatres() {
        return ResponseEntity.ok(catalogueService.getAllTheatres());
    }
}
