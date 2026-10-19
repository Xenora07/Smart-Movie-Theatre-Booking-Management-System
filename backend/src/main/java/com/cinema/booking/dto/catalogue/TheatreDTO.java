package com.cinema.booking.dto.catalogue;

public class TheatreDTO {
    private Long theatreId;
    private String theatreName;
    private String location;

    public TheatreDTO() {
    }

    public TheatreDTO(Long theatreId, String theatreName, String location) {
        this.theatreId = theatreId;
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
