package com.cinema.booking.dto.auth;

import com.cinema.booking.entity.CustomerRole;
import java.time.LocalDateTime;

public class UserProfileDTO {
    private Long customerId;
    private String name;
    private String email;
    private String phone;
    private CustomerRole role;
    private LocalDateTime createdAt;

    public UserProfileDTO() {
    }

    public UserProfileDTO(Long customerId, String name, String email, String phone, CustomerRole role, LocalDateTime createdAt) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public CustomerRole getRole() {
        return role;
    }

    public void setRole(CustomerRole role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
