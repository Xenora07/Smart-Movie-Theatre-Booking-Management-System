package com.cinema.booking.dto.admin;

import com.cinema.booking.entity.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CounterBookingRequest {

    @NotNull(message = "Show ID is required")
    private Long showId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> seatIds;

    private Long existingCustomerId;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod = PaymentMethod.CASH_SIMULATED;

    public CounterBookingRequest() {
    }

    public CounterBookingRequest(Long showId, List<Long> seatIds, Long existingCustomerId, String customerName, String customerPhone, String customerEmail, PaymentMethod paymentMethod) {
        this.showId = showId;
        this.seatIds = seatIds;
        this.existingCustomerId = existingCustomerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.paymentMethod = paymentMethod != null ? paymentMethod : PaymentMethod.CASH_SIMULATED;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public List<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }

    public Long getExistingCustomerId() {
        return existingCustomerId;
    }

    public void setExistingCustomerId(Long existingCustomerId) {
        this.existingCustomerId = existingCustomerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
