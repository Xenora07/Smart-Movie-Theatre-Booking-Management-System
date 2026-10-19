package com.cinema.booking.entity;

import java.math.BigDecimal;

public enum SeatType {
    REGULAR(new BigDecimal("1.0")),
    PREMIUM(new BigDecimal("1.2")),
    RECLINER(new BigDecimal("1.5"));

    private final BigDecimal priceMultiplier;

    SeatType(BigDecimal priceMultiplier) {
        this.priceMultiplier = priceMultiplier;
    }

    public BigDecimal getPriceMultiplier() {
        return priceMultiplier;
    }
}
