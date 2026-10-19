package com.cinema.booking.dto.auth;

import com.cinema.booking.entity.CustomerRole;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long customerId;
    private String name;
    private String email;
    private CustomerRole role;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long customerId, String name, String email, CustomerRole role) {
        this.token = token;
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

    public CustomerRole getRole() {
        return role;
    }

    public void setRole(CustomerRole role) {
        this.role = role;
    }
}
