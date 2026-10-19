# Project Specification
## Smart Movie & Theatre Booking Management System

## 1. Problem statement

The Smart Movie & Theatre Booking Management System is a database-based application that manages movies, theatres, screens, seats, show timings, customer bookings, and payments. It enables customers to register, browse movies and shows, select seats, and book tickets while maintaining accurate records, seat availability, and payment details.

## 2. Goals

- Demonstrate a real three-layer application: React frontend, Java REST backend, and MySQL database.
- Apply DBMS concepts: entities, primary keys, foreign keys, relationships, constraints, joins, transactions, and normalization.
- Support customer registration/login and role-based admin functionality.
- Maintain accurate show-specific seat availability.
- Provide a runnable, understandable project suitable for a second-year DBMS microproject and viva.

## 3. Fixed technology stack

### Frontend
- React with JavaScript
- Vite
- React Router
- Axios
- CSS (responsive layout)

### Backend
- Java with Spring Boot
- Maven
- Spring Web
- Spring Data JPA / Hibernate
- Bean Validation
- Spring Security
- BCrypt password hashing
- A documented token/session approach appropriate to a student project

### Database
- MySQL 8.x
- JDBC driver
- SQL scripts in `database/`

Do not introduce microservices or a second database. Do not replace Java with Node.js for the backend.

## 4. Nine core tables

### CUSTOMER
- `customer_id` primary key
- `name`, `email` (unique), `phone`
- `password_hash` (never store plaintext passwords)
- `role` (`CUSTOMER` or `ADMIN`)
- `created_at`

The first admin account must be created through a documented safe seed/setup procedure. Never make every registered customer an admin.

### MOVIE
- `movie_id` primary key
- `title`, `genre`, `duration_minutes`, `language`, `rating`, `description`
- optional `poster_url`
- validate duration and rating

### THEATRE
- `theatre_id` primary key
- `theatre_name`, `location`

### SCREEN
- `screen_id` primary key
- `theatre_id` foreign key to THEATRE
- `screen_name`
- unique screen name within a theatre

### SEAT
- `seat_id` primary key
- `screen_id` foreign key to SCREEN
- `seat_number`, `seat_type`
- unique `(screen_id, seat_number)`

### SHOW
- `show_id` primary key
- `movie_id` foreign key to MOVIE
- `screen_id` foreign key to SCREEN
- `show_date`, `show_time`, `price`
- validate positive price and valid dates/times
- prevent accidental duplicate show entries where practical

### BOOKING
- `booking_id` primary key
- `customer_id` foreign key to CUSTOMER
- `show_id` foreign key to SHOW
- `booking_date`, `status`, `total_amount`
- `status` should have a small documented set such as `PENDING`, `CONFIRMED`, `CANCELLED`, `FAILED`
- `show_id` is explicitly stored on BOOKING to make the selected show unambiguous and efficient to validate.

### BOOKING_SEAT
- `booking_id` foreign key to BOOKING
- `seat_id` foreign key to SEAT
- `show_id` foreign key to SHOW
- primary key `(booking_id, seat_id)`
- unique `(show_id, seat_id)` to stop the same seat being assigned to multiple bookings for one show
- service-layer validation must ensure `BOOKING_SEAT.show_id` matches its booking's `show_id`, and that the seat's screen matches the show's screen.
- If an expired/cancelled booking releases seats, implement that consistently with the unique constraint. A robust option is to keep active seat allocations in this table and remove/release allocations transactionally on cancellation, while preserving the booking record and status.

### PAYMENT
- `payment_id` primary key
- `booking_id` foreign key to BOOKING and unique (one payment record per booking)
- `payment_date`, `amount`, `method`, `payment_status`
- payment is simulated only; no real card data or payment gateway
- store no card numbers, CVVs, or banking credentials

## 5. Relationship/cardinality rules

- CUSTOMER 1 : M BOOKING
- MOVIE 1 : M SHOW
- THEATRE 1 : M SCREEN
- SCREEN 1 : M SEAT
- SCREEN 1 : M SHOW
- SHOW 1 : M BOOKING
- BOOKING M : N SEAT through BOOKING_SEAT (scoped to a show)
- BOOKING 1 : 0..1 PAYMENT (one payment record per booking in this scope)

A show is hosted on one screen; a screen belongs to one theatre; each seat belongs to one screen. A seat can be allocated at most once for a particular show.

## 6. Customer features

1. Register with name, email, phone, and password.
2. Log in and log out.
3. Browse movies retrieved from MySQL through the API.
4. View movie details and available shows.
5. Select a theatre/show and view its seats.
6. Select available seats and see a server-validated price estimate.
7. Confirm booking.
8. Complete a simulated payment (e.g. choose a demo payment method and click Pay).
9. View confirmation and booking history.
10. See clear validation and error messages.

## 7. Admin dashboard

A separate admin area must be protected by backend authorization, not merely hidden in React.

Admin can:
- Create, read, update, and delete movies.
- Manage theatres and screens.
- Manage seats.
- Create, view, update, and delete shows, subject to foreign-key and booking-integrity rules.
- View bookings and payment statuses.

Use soft deletion or reject deletion where historical bookings depend on a record. Never cascade-delete financial/booking history unintentionally.

## 8. Non-negotiable integration rules

- React uses Axios or `fetch` to call real Spring Boot endpoints.
- Spring Boot uses repositories/JPA and a MySQL JDBC connection.
- All persistent business records are stored in MySQL.
- No local arrays, browser storage, or fake JSON server as the source of truth.
- Frontend loading, success, empty, and error states are required.
- Configure CORS narrowly for the local frontend origin.
- Use environment variables or ignored local configuration for database credentials.
- Never expose DB credentials or secrets to the React bundle.
- Validate input in the backend.
- Use correct HTTP status codes and consistent error responses.
- Keep code modular and explainable: controller → service → repository → database.
- Do not claim tests passed unless they were executed.

## 9. Booking concurrency and transaction rules

Booking creation must run inside a database transaction:
1. Load and validate the show.
2. Verify every requested seat belongs to the show's screen.
3. Validate requested seats are not already allocated to the same show.
4. Compute the total on the server using the show's price and selected seat count.
5. Create the booking and seat allocations atomically.
6. If any seat is unavailable or any insert fails, roll back the entire booking operation.
7. Record the simulated payment and update booking status consistently.
8. Return the persisted booking details.

Use the database unique constraint as the final defense against concurrent duplicate seat allocations. Handle duplicate-key/conflict exceptions cleanly. Do not rely only on a frontend availability check.

For a failed simulated payment, define and document whether the booking becomes `FAILED` and its seat allocations are released. Apply the chosen policy consistently.

## 10. Security requirements

- Hash passwords with BCrypt or another approved password hash through Spring Security.
- Never store or log plaintext passwords.
- Do not return `password_hash` in API responses.
- Enforce customer/admin roles on backend endpoints.
- A customer can view only their own booking history and details.
- Validate ownership of bookings before payment or cancellation actions.
- Use parameterized ORM/repository operations; do not concatenate untrusted input into SQL.
- Do not collect real payment-card data.
- Seed demo credentials only for local development, and document them clearly.

## 11. Deliverables

- Complete runnable frontend and backend source.
- `database/schema.sql` and `database/sample_data.sql`.
- Configuration example with placeholders, not real secrets.
- Setup guide with exact commands.
- API contract / endpoint list.
- Validation and integration tests.
- Viva notes covering ER diagram, schema, PK/FK, cardinalities, joins, normalization, transactions, constraints, and architecture.
- Screenshots are optional; do not fabricate test results.

## 12. Acceptance tests

- [ ] Database can be created from schema.sql on MySQL 8.
- [ ] Sample data loads without errors.
- [ ] Registration creates a CUSTOMER row with a password hash.
- [ ] Login works; invalid credentials are rejected.
- [ ] Customer cannot access admin endpoints.
- [ ] Admin can create a movie; it appears in the React movie list after an API fetch.
- [ ] Admin can create theatres, screens, seats, and shows with valid foreign keys.
- [ ] Customer can book available seats for a show.
- [ ] Booking, booking-seat rows, and payment record persist in MySQL.
- [ ] Reloading the frontend still shows persisted data.
- [ ] A seat booked for Show A can still be available for Show B if the show uses the same screen and time/seat context is valid.
- [ ] Two concurrent attempts to book the same seat for the same show cannot both succeed.
- [ ] A seat from a different screen cannot be booked for the show.
- [ ] Server calculates the booking total; it does not trust a client-supplied total.
- [ ] Payment status and booking status remain consistent.
- [ ] A customer cannot read another customer's booking.
- [ ] Errors are handled without leaving partial booking/seat/payment rows.
- [ ] Setup and run commands in README are tested and accurate.

## 13. Out of scope

- Real payment gateway or real card data
- Microservices
- Separate inventory/analytics service
- Mobile application
- AI recommendations
- Deployment to production cloud infrastructure unless explicitly requested later
