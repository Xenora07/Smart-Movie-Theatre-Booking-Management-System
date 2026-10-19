-- Demo catalogue data only. Run after schema.sql.
USE smart_movie_booking;

INSERT INTO MOVIE (title, genre, duration_minutes, language, rating, description)
VALUES
('The Last Orbit', 'Science Fiction', 132, 'English', 8.2, 'A fictional space adventure for demo purposes.'),
('Monsoon Letters', 'Drama', 118, 'Hindi', 7.8, 'A fictional story about family and second chances.'),
('City of Secrets', 'Thriller', 124, 'Hindi', 8.0, 'A fictional mystery set in a busy city.');

INSERT INTO THEATRE (theatre_name, location)
VALUES
('Harbour Cinemas', 'Navi Mumbai'),
('Central Screens', 'Mumbai');

INSERT INTO SCREEN (theatre_id, screen_name)
VALUES
(1, 'Screen 1'),
(1, 'Screen 2'),
(2, 'Screen 1');

INSERT INTO SEAT (screen_id, seat_number, seat_type)
VALUES
(1, 'A1', 'REGULAR'), (1, 'A2', 'REGULAR'), (1, 'A3', 'REGULAR'),
(1, 'B1', 'PREMIUM'), (1, 'B2', 'PREMIUM'), (1, 'B3', 'PREMIUM'),
(2, 'A1', 'REGULAR'), (2, 'A2', 'REGULAR'), (2, 'B1', 'RECLINER'),
(3, 'A1', 'REGULAR'), (3, 'A2', 'REGULAR'), (3, 'B1', 'PREMIUM');

INSERT INTO `SHOW` (movie_id, screen_id, show_date, show_time, price)
VALUES
(1, 1, CURRENT_DATE + INTERVAL 1 DAY, '12:00:00', 220.00),
(1, 1, CURRENT_DATE + INTERVAL 1 DAY, '18:00:00', 280.00),
(2, 2, CURRENT_DATE + INTERVAL 1 DAY, '15:30:00', 200.00),
(3, 3, CURRENT_DATE + INTERVAL 2 DAY, '19:00:00', 250.00);

-- Create an admin through the application's documented seed/setup mechanism so that
-- password_hash contains a real BCrypt hash. Do not insert a plaintext password here.
-- Customer registration should create CUSTOMER-role accounts only.
