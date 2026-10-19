package com.cinema.booking.dto.catalogue;

import com.cinema.booking.entity.SeatType;

public class SeatAvailabilityDTO {
    private Long seatId;
    private String seatNumber;
    private SeatType seatType;
    private boolean available;

    public SeatAvailabilityDTO() {
    }

    public SeatAvailabilityDTO(Long seatId, String seatNumber, SeatType seatType, boolean available) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.available = available;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
