package com.cinema.booking.dto.catalogue;

import com.cinema.booking.entity.SeatType;

public class SeatDTO {
    private Long seatId;
    private Long screenId;
    private String seatNumber;
    private SeatType seatType;

    public SeatDTO() {
    }

    public SeatDTO(Long seatId, Long screenId, String seatNumber, SeatType seatType) {
        this.seatId = seatId;
        this.screenId = screenId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
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
