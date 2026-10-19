package com.cinema.booking.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TheatreRequest {

    @NotBlank(message = "Theatre name is required")
    @Size(max = 150, message = "Theatre name must not exceed 150 characters")
    private String theatreName;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    public TheatreRequest() {
    }

    public TheatreRequest(String theatreName, String location) {
        this.theatreName = theatreName;
        this.location = location;
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
