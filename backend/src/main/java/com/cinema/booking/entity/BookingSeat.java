package com.cinema.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "BOOKING_SEAT")
public class BookingSeat {

    @EmbeddedId
    private BookingSeatId id = new BookingSeatId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingId")
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("seatId")
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    public BookingSeat() {
    }

    public BookingSeat(Booking booking, Seat seat, Show show) {
        this.booking = booking;
        this.seat = seat;
        this.show = show;
        this.id = new BookingSeatId(
                booking != null ? booking.getBookingId() : null,
                seat != null ? seat.getSeatId() : null
        );
    }

    public BookingSeatId getId() {
        return id;
    }

    public void setId(BookingSeatId id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
        if (booking != null) {
            this.id.setBookingId(booking.getBookingId());
        }
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
        if (seat != null) {
            this.id.setSeatId(seat.getSeatId());
        }
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }
}
