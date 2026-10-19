package com.cinema.booking.dto.booking;

import com.cinema.booking.entity.PaymentMethod;
import com.cinema.booking.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTO {
    private Long paymentId;
    private Long bookingId;
    private LocalDateTime paymentDate;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus paymentStatus;

    public PaymentDTO() {
    }

    public PaymentDTO(Long paymentId, Long bookingId, LocalDateTime paymentDate, BigDecimal amount, PaymentMethod method, PaymentStatus paymentStatus) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.method = method;
        this.paymentStatus = paymentStatus;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
