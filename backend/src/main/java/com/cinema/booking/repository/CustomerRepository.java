package com.cinema.booking.repository;

import com.cinema.booking.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Customer> findByPhone(String phone);
    java.util.List<Customer> findByPhoneContainingOrEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String phone, String email, String name);
}
