package com.cinema.booking.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ScreenRequest {

    @NotNull(message = "theatreId is required")
    private Long theatreId;

    @NotBlank(message = "screenName is required")
    @Size(max = 100, message = "Screen name must not exceed 100 characters")
    private String screenName;

    public ScreenRequest() {
    }

    public ScreenRequest(Long theatreId, String screenName) {
        this.theatreId = theatreId;
        this.screenName = screenName;
    }

    public Long getTheatreId() {
        return theatreId;
    }

    public void setTheatreId(Long theatreId) {
        this.theatreId = theatreId;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }
}
