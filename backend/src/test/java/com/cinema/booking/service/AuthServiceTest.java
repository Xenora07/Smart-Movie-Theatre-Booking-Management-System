package com.cinema.booking.service;

import com.cinema.booking.dto.auth.AuthResponse;
import com.cinema.booking.dto.auth.LoginRequest;
import com.cinema.booking.dto.auth.RegisterRequest;
import com.cinema.booking.entity.Customer;
import com.cinema.booking.entity.CustomerRole;
import com.cinema.booking.exception.BadRequestException;
import com.cinema.booking.repository.CustomerRepository;
import com.cinema.booking.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private Customer customer;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("Test User", "test@cinema.local", "1234567890", "Secret@123");
        loginRequest = new LoginRequest("test@cinema.local", "Secret@123");
        customer = new Customer("Test User", "test@cinema.local", "1234567890", "$2a$10$hashedpassword", CustomerRole.CUSTOMER);
        customer.setCustomerId(10L);
    }

    @Test
    void register_success_returnsTokenAndProfile() {
        when(customerRepository.existsByEmail("test@cinema.local")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("$2a$10$hashedpassword");
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt.token.here");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("test@cinema.local", response.getEmail());
        assertEquals(CustomerRole.CUSTOMER, response.getRole());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void register_duplicateEmail_throwsBadRequestException() {
        when(customerRepository.existsByEmail("test@cinema.local")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void login_success_returnsToken() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt.token.here");
        when(customerRepository.findByEmail("test@cinema.local")).thenReturn(Optional.of(customer));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("test@cinema.local", response.getEmail());
    }

    @Test
    void login_invalidCredentials_throwsBadCredentialsException() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}
