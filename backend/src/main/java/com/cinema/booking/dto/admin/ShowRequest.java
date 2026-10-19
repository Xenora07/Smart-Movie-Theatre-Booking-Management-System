package com.cinema.booking.dto.admin;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ShowRequest {

    @NotNull(message = "movieId is required")
    private Long movieId;

    @NotNull(message = "screenId is required")
    private Long screenId;

    @NotNull(message = "showDate is required")
    private LocalDate showDate;

    @NotNull(message = "showTime is required")
    private LocalTime showTime;

    @NotNull(message = "price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    public ShowRequest() {
    }

    public ShowRequest(Long movieId, Long screenId, LocalDate showDate, LocalTime showTime, BigDecimal price) {
        this.movieId = movieId;
        this.screenId = screenId;
        this.showDate = showDate;
        this.showTime = showTime;
        this.price = price;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public void setShowDate(LocalDate showDate) {
        this.showDate = showDate;
    }

    public LocalTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalTime showTime) {
        this.showTime = showTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
