package com.cinema.booking.dto.admin;

import com.cinema.booking.entity.SeatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SeatRequest {

    @NotNull(message = "screenId is required")
    private Long screenId;

    @NotBlank(message = "seatNumber is required")
    @Size(max = 12, message = "Seat number must not exceed 12 characters")
    private String seatNumber;

    @NotNull(message = "seatType is required (REGULAR, PREMIUM, RECLINER)")
    private SeatType seatType;

    public SeatRequest() {
    }

    public SeatRequest(Long screenId, String seatNumber, SeatType seatType) {
        this.screenId = screenId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
    }

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public SeatType getSeatType() {
        return seatType;
    }

    public void setSeatType(SeatType seatType) {
        this.seatType = seatType;
    }
}
