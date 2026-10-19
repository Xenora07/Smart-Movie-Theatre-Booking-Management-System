package com.cinema.booking.service;

import com.cinema.booking.dto.auth.AuthResponse;
import com.cinema.booking.dto.auth.LoginRequest;
import com.cinema.booking.dto.auth.RegisterRequest;
import com.cinema.booking.dto.auth.UserProfileDTO;
import com.cinema.booking.entity.Customer;
import com.cinema.booking.entity.CustomerRole;
import com.cinema.booking.exception.BadRequestException;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.repository.CustomerRepository;
import com.cinema.booking.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Customer customer = new Customer(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getPhone() != null ? request.getPhone().trim() : null,
                passwordEncoder.encode(request.getPassword()),
                CustomerRole.CUSTOMER
        );

        Customer savedCustomer = customerRepository.save(customer);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        savedCustomer.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                savedCustomer.getCustomerId(),
                savedCustomer.getName(),
                savedCustomer.getEmail(),
                savedCustomer.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        Customer customer = customerRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + request.getEmail()));

        return new AuthResponse(
                token,
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getRole()
        );
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUser(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        return new UserProfileDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getRole(),
                customer.getCreatedAt()
        );
    }
}
