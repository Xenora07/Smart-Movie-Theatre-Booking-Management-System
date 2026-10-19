package com.cinema.booking.dto.booking;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateBookingRequest {

    @NotNull(message = "showId is required")
    private Long showId;

    @NotEmpty(message = "seatIds must contain at least one seat")
    private List<Long> seatIds;

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(Long showId, List<Long> seatIds) {
        this.showId = showId;
        this.seatIds = seatIds;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public List<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }
}
