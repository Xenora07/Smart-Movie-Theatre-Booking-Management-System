package com.cinema.booking.dto.catalogue;

public class ScreenDTO {
    private Long screenId;
    private Long theatreId;
    private String theatreName;
    private String screenName;

    public ScreenDTO() {
    }

    public ScreenDTO(Long screenId, Long theatreId, String theatreName, String screenName) {
        this.screenId = screenId;
        this.theatreId = theatreId;
        this.theatreName = theatreName;
        this.screenName = screenName;
    }

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
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

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }
}
