-- Smart Movie & Theatre Booking Management System
-- Sample Seed Data for MySQL 8.x
-- Run after schema.sql.
USE smart_movie_booking;

-- ---------------------------------------------------------
-- 1. CUSTOMER (Demo Admin and Customers)
-- Passwords are generated and verified using Spring Security BCryptPasswordEncoder:
-- Admin:    admin@cinema.local   / Admin@1234
-- Customer: alice@cinema.local   / Customer@1234
-- Customer: bob@cinema.local     / Customer@1234
-- ---------------------------------------------------------
INSERT INTO CUSTOMER (name, email, phone, password_hash, role)
VALUES
('Cinema Administrator', 'admin@cinema.local', '9876543210', '$2a$10$fcOng8FdyxTmEdkiODrhn.ZC0hMyR2ArJcUx7duQpd9NKAmgU.xi.', 'ADMIN'),
('Alice Sharma', 'alice@cinema.local', '9876543211', '$2a$10$sHldaAyZ6oIIJbaJ2DCkLeeWrz5JIWtrX4297Rz7cQit1BohR5tMK', 'CUSTOMER'),
('Bob Patel', 'bob@cinema.local', '9876543212', '$2a$10$sHldaAyZ6oIIJbaJ2DCkLeeWrz5JIWtrX4297Rz7cQit1BohR5tMK', 'CUSTOMER');

-- ---------------------------------------------------------
-- 2. MOVIE
-- ---------------------------------------------------------
INSERT INTO MOVIE (title, genre, duration_minutes, language, rating, description, poster_url)
VALUES
('The Last Orbit', 'Science Fiction', 132, 'English', 8.2, 'A gripping expedition across uncharted orbital boundaries in search of humanity''s next sanctuary.', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'),
('Monsoon Letters', 'Drama', 118, 'Hindi', 7.8, 'A heartfelt tale of rediscovered family letters and reconciliation across generations.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'),
('City of Secrets', 'Thriller', 124, 'Hindi', 8.0, 'A tenacious detective unearths a web of deception buried beneath a neon metropolis.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'),
('Echoes of Eternity', 'Fantasy', 145, 'English', 8.5, 'An epic mythic saga of ancient kingdoms, forgotten magic, and timeless destinies.', 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800');

-- ---------------------------------------------------------
-- 3. THEATRE
-- ---------------------------------------------------------
INSERT INTO THEATRE (theatre_name, location)
VALUES
('Harbour Cinemas', 'Navi Mumbai'),
('Central Screens', 'Mumbai');

-- ---------------------------------------------------------
-- 4. SCREEN
-- ---------------------------------------------------------
INSERT INTO SCREEN (theatre_id, screen_name)
VALUES
(1, 'Screen 1'),
(1, 'Screen 2'),
(2, 'Screen 1');

-- ---------------------------------------------------------
-- 5. SEAT
-- Screen 1 (14 seats: 5 Regular, 5 Premium, 4 Recliner)
-- Screen 2 (10 seats: 4 Regular, 4 Premium, 2 Recliner)
-- Screen 3 (10 seats: 4 Regular, 4 Premium, 2 Recliner)
-- ---------------------------------------------------------
INSERT INTO SEAT (screen_id, seat_number, seat_type)
VALUES
-- Screen 1 (IDs 1 - 14)
(1, 'A1', 'REGULAR'), (1, 'A2', 'REGULAR'), (1, 'A3', 'REGULAR'), (1, 'A4', 'REGULAR'), (1, 'A5', 'REGULAR'),
(1, 'B1', 'PREMIUM'), (1, 'B2', 'PREMIUM'), (1, 'B3', 'PREMIUM'), (1, 'B4', 'PREMIUM'), (1, 'B5', 'PREMIUM'),
(1, 'C1', 'RECLINER'), (1, 'C2', 'RECLINER'), (1, 'C3', 'RECLINER'), (1, 'C4', 'RECLINER'),
-- Screen 2 (IDs 15 - 24)
(2, 'A1', 'REGULAR'), (2, 'A2', 'REGULAR'), (2, 'A3', 'REGULAR'), (2, 'A4', 'REGULAR'),
(2, 'B1', 'PREMIUM'), (2, 'B2', 'PREMIUM'), (2, 'B3', 'PREMIUM'), (2, 'B4', 'PREMIUM'),
(2, 'C1', 'RECLINER'), (2, 'C2', 'RECLINER'),
-- Screen 3 (IDs 25 - 34)
(3, 'A1', 'REGULAR'), (3, 'A2', 'REGULAR'), (3, 'A3', 'REGULAR'), (3, 'A4', 'REGULAR'),
(3, 'B1', 'PREMIUM'), (3, 'B2', 'PREMIUM'), (3, 'B3', 'PREMIUM'), (3, 'B4', 'PREMIUM'),
(3, 'C1', 'RECLINER'), (3, 'C2', 'RECLINER');

-- ---------------------------------------------------------
-- 6. SHOW
-- Dates scheduled for upcoming days relative to CURRENT_DATE
-- ---------------------------------------------------------
INSERT INTO `SHOW` (movie_id, screen_id, show_date, show_time, price)
VALUES
(1, 1, CURRENT_DATE + INTERVAL 1 DAY, '12:00:00', 250.00),
(1, 1, CURRENT_DATE + INTERVAL 1 DAY, '18:00:00', 300.00),
(2, 2, CURRENT_DATE + INTERVAL 1 DAY, '15:30:00', 200.00),
(3, 3, CURRENT_DATE + INTERVAL 2 DAY, '19:00:00', 220.00),
(4, 1, CURRENT_DATE + INTERVAL 2 DAY, '14:00:00', 280.00);

-- ---------------------------------------------------------
-- 7. BOOKING (Initial confirmed demo booking for Alice)
-- Customer 2 (Alice Sharma) books Show 1 (Price 250.00 x 2 seats = 500.00)
-- ---------------------------------------------------------
INSERT INTO BOOKING (customer_id, show_id, status, total_amount)
VALUES
(2, 1, 'CONFIRMED', 500.00);

-- ---------------------------------------------------------
-- 8. BOOKING_SEAT (Seats A1 and A2 allocated for Show 1)
-- Seat IDs 1 ('A1') and 2 ('A2') belong to Screen 1 (same screen as Show 1)
-- ---------------------------------------------------------
INSERT INTO BOOKING_SEAT (booking_id, seat_id, show_id)
VALUES
(1, 1, 1),
(1, 2, 1);

-- ---------------------------------------------------------
-- 9. PAYMENT (Simulated successful UPI payment for Booking 1)
-- ---------------------------------------------------------
INSERT INTO PAYMENT (booking_id, payment_date, amount, method, payment_status)
VALUES
(1, CURRENT_TIMESTAMP, 500.00, 'UPI', 'SUCCESS');
