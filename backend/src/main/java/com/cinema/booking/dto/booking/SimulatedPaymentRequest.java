package com.cinema.booking.dto.booking;

import com.cinema.booking.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class SimulatedPaymentRequest {

    @NotNull(message = "Payment method is required (UPI, CARD_SIMULATED, NET_BANKING_SIMULATED, CASH_SIMULATED)")
    private PaymentMethod method;

    public SimulatedPaymentRequest() {
    }

    public SimulatedPaymentRequest(PaymentMethod method) {
        this.method = method;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }
}
