-- Smart Movie & Theatre Booking Management System
-- MySQL 8.x | Exactly nine core tables
-- Run in a local development environment.

CREATE DATABASE IF NOT EXISTS smart_movie_booking
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE smart_movie_booking;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS PAYMENT;
DROP TABLE IF EXISTS BOOKING_SEAT;
DROP TABLE IF EXISTS BOOKING;
DROP TABLE IF EXISTS `SHOW`;
DROP TABLE IF EXISTS SEAT;
DROP TABLE IF EXISTS SCREEN;
DROP TABLE IF EXISTS THEATRE;
DROP TABLE IF EXISTS MOVIE;
DROP TABLE IF EXISTS CUSTOMER;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE CUSTOMER (
  customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(25),
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE MOVIE (
  movie_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  genre VARCHAR(80) NOT NULL,
  duration_minutes SMALLINT UNSIGNED NOT NULL,
  language VARCHAR(60) NOT NULL,
  rating DECIMAL(3,1),
  description TEXT,
  poster_url VARCHAR(1000),
  CONSTRAINT chk_movie_duration CHECK (duration_minutes > 0),
  CONSTRAINT chk_movie_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 10)),
  INDEX idx_movie_title (title)
) ENGINE=InnoDB;

CREATE TABLE THEATRE (
  theatre_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  theatre_name VARCHAR(150) NOT NULL,
  location VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE SCREEN (
  screen_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  theatre_id BIGINT NOT NULL,
  screen_name VARCHAR(100) NOT NULL,
  CONSTRAINT fk_screen_theatre FOREIGN KEY (theatre_id)
    REFERENCES THEATRE(theatre_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uq_screen_name_per_theatre UNIQUE (theatre_id, screen_name)
) ENGINE=InnoDB;

CREATE TABLE SEAT (
  seat_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  screen_id BIGINT NOT NULL,
  seat_number VARCHAR(12) NOT NULL,
  seat_type ENUM('REGULAR', 'PREMIUM', 'RECLINER') NOT NULL DEFAULT 'REGULAR',
  CONSTRAINT fk_seat_screen FOREIGN KEY (screen_id)
    REFERENCES SCREEN(screen_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uq_seat_per_screen UNIQUE (screen_id, seat_number)
) ENGINE=InnoDB;

CREATE TABLE `SHOW` (
  show_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  movie_id BIGINT NOT NULL,
  screen_id BIGINT NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_show_movie FOREIGN KEY (movie_id)
    REFERENCES MOVIE(movie_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_show_screen FOREIGN KEY (screen_id)
    REFERENCES SCREEN(screen_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_show_price CHECK (price > 0),
  CONSTRAINT uq_screen_show_time UNIQUE (screen_id, show_date, show_time),
  INDEX idx_show_movie_date (movie_id, show_date),
  INDEX idx_show_screen_date (screen_id, show_date)
) ENGINE=InnoDB;

CREATE TABLE BOOKING (
  booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  show_id BIGINT NOT NULL,
  booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING',
  total_amount DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id)
    REFERENCES CUSTOMER(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_booking_show FOREIGN KEY (show_id)
    REFERENCES `SHOW`(show_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_booking_total CHECK (total_amount >= 0),
  INDEX idx_booking_customer_date (customer_id, booking_date),
  INDEX idx_booking_show_status (show_id, status)
) ENGINE=InnoDB;

CREATE TABLE BOOKING_SEAT (
  booking_id BIGINT NOT NULL,
  seat_id BIGINT NOT NULL,
  show_id BIGINT NOT NULL,
  PRIMARY KEY (booking_id, seat_id),
  CONSTRAINT fk_booking_seat_booking FOREIGN KEY (booking_id)
    REFERENCES BOOKING(booking_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_booking_seat_seat FOREIGN KEY (seat_id)
    REFERENCES SEAT(seat_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_booking_seat_show FOREIGN KEY (show_id)
    REFERENCES `SHOW`(show_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uq_seat_once_per_show UNIQUE (show_id, seat_id),
  INDEX idx_booking_seat_show (show_id)
) ENGINE=InnoDB;

CREATE TABLE PAYMENT (
  payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT NOT NULL UNIQUE,
  payment_date TIMESTAMP NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('UPI', 'CARD_SIMULATED', 'NET_BANKING_SIMULATED', 'CASH_SIMULATED') NOT NULL,
  payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id)
    REFERENCES BOOKING(booking_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_payment_amount CHECK (amount >= 0)
) ENGINE=InnoDB;

-- Notes:
-- 1. BOOKING_SEAT.show_id must equal BOOKING.show_id.
-- 2. The seat's SCREEN must equal the SHOW's SCREEN.
-- These cross-table invariants must be checked in the Spring service within a transaction.
-- 3. Unique(show_id, seat_id) prevents concurrent duplicate allocations.
-- 4. On cancellation/failure, release active seat allocations transactionally if the chosen
--    policy allows seats to be booked again; preserve booking/payment history.
-- 5. This script drops existing tables. Use only for initial local setup, not on a database
--    containing records that must be preserved.
