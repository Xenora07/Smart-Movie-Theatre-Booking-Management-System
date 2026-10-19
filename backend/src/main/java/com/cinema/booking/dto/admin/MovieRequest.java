package com.cinema.booking.dto.admin;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class MovieRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Genre is required")
    @Size(max = 80, message = "Genre must not exceed 80 characters")
    private String genre;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Short durationMinutes;

    @NotBlank(message = "Language is required")
    @Size(max = 60, message = "Language must not exceed 60 characters")
    private String language;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Rating must be at most 10.0")
    private BigDecimal rating;

    private String description;

    @Size(max = 1000, message = "Poster URL must not exceed 1000 characters")
    private String posterUrl;

    public MovieRequest() {
    }

    public MovieRequest(String title, String genre, Short durationMinutes, String language, BigDecimal rating, String description, String posterUrl) {
        this.title = title;
        this.genre = genre;
        this.durationMinutes = durationMinutes;
        this.language = language;
        this.rating = rating;
        this.description = description;
        this.posterUrl = posterUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Short getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Short durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}
