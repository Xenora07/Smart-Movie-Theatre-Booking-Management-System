package com.cinema.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "THEATRE")
public class Theatre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "theatre_id")
    private Long theatreId;

    @Column(name = "theatre_name", nullable = false, length = 150)
    private String theatreName;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    public Theatre() {
    }

    public Theatre(String theatreName, String location) {
        this.theatreName = theatreName;
        this.location = location;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
