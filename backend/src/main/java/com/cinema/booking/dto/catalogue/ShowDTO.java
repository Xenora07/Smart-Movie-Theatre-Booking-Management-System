package com.cinema.booking.dto.catalogue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ShowDTO {
    private Long showId;
    private Long movieId;
    private String movieTitle;
    private Long screenId;
    private String screenName;
    private Long theatreId;
    private String theatreName;
    private String theatreLocation;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal price;

    public ShowDTO() {
    }

    public ShowDTO(Long showId, Long movieId, String movieTitle, Long screenId, String screenName, Long theatreId, String theatreName, String theatreLocation, LocalDate showDate, LocalTime showTime, BigDecimal price) {
        this.showId = showId;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.screenId = screenId;
        this.screenName = screenName;
        this.theatreId = theatreId;
        this.theatreName = theatreName;
        this.theatreLocation = theatreLocation;
        this.showDate = showDate;
        this.showTime = showTime;
        this.price = price;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public Long getTheatreId() {
        return theatreId;
    }

    public void setTheatreId(Long theatreId) {
        this.theatreId = theatreId;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public String getTheatreLocation() {
        return theatreLocation;
    }

    public void setTheatreLocation(String theatreLocation) {
        this.theatreLocation = theatreLocation;
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
