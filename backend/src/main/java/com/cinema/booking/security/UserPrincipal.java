package com.cinema.booking.security;

import com.cinema.booking.entity.Customer;
import com.cinema.booking.entity.CustomerRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final Long customerId;
    private final String name;
    private final String email;
    private final String password;
    private final CustomerRole role;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long customerId, String name, String email, String password, CustomerRole role, Collection<? extends GrantedAuthority> authorities) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.authorities = authorities;
    }

    public static UserPrincipal create(Customer customer) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + customer.getRole().name());
        return new UserPrincipal(
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPasswordHash(),
                customer.getRole(),
                Collections.singletonList(authority)
        );
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public CustomerRole getRole() {
        return role;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
