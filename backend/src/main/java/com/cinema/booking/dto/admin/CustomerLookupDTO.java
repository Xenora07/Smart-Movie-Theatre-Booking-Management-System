package com.cinema.booking.dto.admin;

import com.cinema.booking.entity.CustomerRole;

public class CustomerLookupDTO {
    private Long customerId;
    private String name;
    private String email;
    private String phone;
    private CustomerRole role;

    public CustomerLookupDTO() {
    }

    public CustomerLookupDTO(Long customerId, String name, String email, String phone, CustomerRole role) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
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
}
