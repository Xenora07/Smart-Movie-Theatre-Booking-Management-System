# Smart Movie & Theatre Booking Management System (DBMS Microproject)

A production-grade, full-stack Movie & Theatre Booking Web Application designed and verified for a second-year Database Management Systems (DBMS) microproject and viva.

---

## 🏛️ Architecture & Core Design

The system implements a decoupled, secure 3-tier architecture:

```
[ React 18 + Vite Frontend ]
       │  (Port 5173 - JWT Bearer in Axios Interceptor)
       ▼
[ Spring Boot 3.3.5 REST Backend ]
       │  (Port 8080 - Spring Data JPA / Hibernate Validator / Spring Security)
       ▼
[ MySQL 8 Relational Database ]
       (Port 3306 - Exactly 9 Core Tables)
```

- **Frontend**: React 18 + Vite + React Router v6 + Axios + Cinematic Dark Responsive CSS.
- **Backend**: Java 17 + Spring Boot 3.3.5 + Spring Data JPA + Hibernate 6 + Spring Security + JJWT 0.12.6.
- **Database**: MySQL 8 with strict referential integrity, check constraints, foreign keys, and unique indexes.
- **No Mock Data**: Every movie, theatre, screen, seat layout, showtime, customer booking, and payment record is queried and persisted in MySQL.

---

## 🗄️ Exactly Nine Core Database Tables

The database schema strictly adheres to the nine-table boundary without introducing auxiliary role or user tables:

1. **`CUSTOMER`**: Customer authentication (BCrypt `password_hash`), profile details, and role (`CUSTOMER` / `ADMIN`).
2. **`MOVIE`**: Film catalogue (title, genre, duration in minutes, language, rating 0.0–10.0, poster URL, description).
3. **`THEATRE`**: Cinema physical locations and venues.
4. **`SCREEN`**: Individual auditoriums within a theatre (screen name, total seats).
5. **`SEAT`**: Physical seat definitions per screen (`REGULAR`, `PREMIUM`, `RECLINER`).
6. **`SHOW`**: Scheduled movie screenings linking Movie, Screen, Date, Start Time, and Base Price.
7. **`BOOKING`**: Customer reservation master records with status (`PENDING`, `CONFIRMED`, `CANCELLED`).
8. **`BOOKING_SEAT`**: Show-seat allocation junction enforcing `UNIQUE (show_id, seat_id)` to physically prevent double-booking.
9. **`PAYMENT`**: 1-to-1 simulated payment audit records (`UPI`, `CARD_SIMULATED`, `NET_BANKING_SIMULATED`, `CASH_SIMULATED`) with status (`SUCCESS`, `FAILED`, `REFUNDED`) and transaction reference.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Java**: OpenJDK 17 or higher
- **Node.js**: v18+ and `npm`
- **MySQL Server**: 8.0+ running on port `3306`
- **Maven**: 3.8+ (or use the backend root)

### 2. Database Initialization
Log into MySQL and execute the schema and sample data scripts:

```bash
# Connect to MySQL
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS smart_movie_booking;"

# Apply DDL schema (9 core tables, foreign keys, unique constraints)
mysql -u root -p smart_movie_booking < database/schema.sql

# Seed realistic initial data (theatres, screens, seats, shows, movies, seed users)
mysql -u root -p smart_movie_booking < database/sample_data.sql
```

### 3. Start Spring Boot Backend (Port 8080)

Set database environment variables and launch:

```bash
cd backend
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_NAME="smart_movie_booking"
export DB_USERNAME="root"
export DB_PASSWORD="<Your-MySQL-Password>"
export JWT_SECRET="CinemaSmartBookingSecretKey2026SecureDBMSMicroprojectKeyLongEnoughFor256Bits!"

mvn spring-boot:run
```
*Backend initializes on `http://localhost:8080` with `ddl-auto=validate` verifying all 9 entities.*

### 4. Start React Frontend (Port 5173)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with automatic proxy / direct CORS integration.*

---

## 🔐 Demo Credentials (Pre-seeded in MySQL)

All passwords are cryptographically hashed using **BCrypt** (`$2a$10$...`) inside MySQL `CUSTOMER.password_hash`:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@cinema.local` | `Admin@1234` | Full catalogue CRUD, show scheduling, all bookings & payments audit |
| **Customer** | `alice@cinema.local` | `Customer@1234` | Browse shows, pick seats, make reservations, view personal history |
| **Customer** | `bob@cinema.local` | `Customer@1234` | Browse shows, pick seats, make reservations, view personal history |

---

## 📡 REST API Contract Summary

All endpoints follow RESTful standards under `/api`:

### Public / Catalogue Endpoints
- `GET /api/movies` — List all active movies with genre, rating, duration, and poster.
- `GET /api/movies/{id}` — Get single movie details.
- `GET /api/movies/{id}/shows` — List available scheduled shows for a movie.
- `GET /api/shows/{showId}/seats` — Real-time seat layout showing available vs booked seats for that specific show.

### Authentication Endpoints
- `POST /api/auth/register` — Register new customer account (`name`, `email`, `phone`, `password`).
- `POST /api/auth/login` — Authenticate and receive signed JWT Bearer token + role.
- `GET /api/auth/me` — Authenticated profile lookup.
- `POST /api/auth/logout` — Client-side token invalidation.

### Customer Booking Endpoints (Bearer Token Required)
- `POST /api/bookings` — Create a new ticket booking (`showId`, `seatIds[]`). Server verifies seat/screen compatibility and locks seats.
- `POST /api/bookings/{id}/payment` — Simulate payment (`UPI`, `CARD_SIMULATED`, `NET_BANKING_SIMULATED`, `CASH_SIMULATED`). Sets status to `CONFIRMED`.
- `GET /api/bookings/my` — Fetch customer's own booking history with ticket receipts.
- `GET /api/bookings/{id}` — Fetch specific booking details.
- `POST /api/bookings/{id}/cancel` — Cancel booking, mark payment `REFUNDED`, and immediately release seats back to the show.

### Admin Endpoints (`ROLE_ADMIN` Required)
- `POST /api/admin/movies`, `PUT /api/admin/movies/{id}`, `DELETE /api/admin/movies/{id}` — Movie CRUD.
- `GET /api/admin/theatres`, `POST /api/admin/theatres`, `PUT /api/admin/theatres/{id}`, `DELETE /api/admin/theatres/{id}` — Theatre CRUD.
- `GET /api/admin/screens`, `POST /api/admin/screens`, `PUT /api/admin/screens/{id}`, `DELETE /api/admin/screens/{id}` — Screen CRUD.
- `GET /api/admin/seats`, `POST /api/admin/seats`, `PUT /api/admin/seats/{id}`, `DELETE /api/admin/seats/{id}` — Seat CRUD.
- `GET /api/admin/shows`, `POST /api/admin/shows`, `PUT /api/admin/shows/{id}`, `DELETE /api/admin/shows/{id}` — Show scheduling.
- `GET /api/admin/bookings` — Complete system booking audit trail.
- `GET /api/admin/payments` — Complete system payment audit trail.

---

## 🛡️ Concurrency & Double-Booking Prevention

Double-booking is guarded at two distinct layers:
1. **Application Layer (`BookingService.java`)**:
   Runs inside `@Transactional(isolation = Isolation.READ_COMMITTED)`. The service queries `bookingSeatRepository.existsByShow_ShowIdAndSeat_SeatId(showId, seatId)`. If taken, it throws `SeatUnavailableException` returning `HTTP 409 Conflict`.
2. **Database Layer (`BOOKING_SEAT` Table Constraint)**:
   ```sql
   CONSTRAINT uq_seat_once_per_show UNIQUE (show_id, seat_id)
   ```
   Even under simultaneous race conditions, MySQL's B-Tree unique index constraint blocks concurrent inserts at the storage engine level with `ERROR 1062 (23000) Duplicate entry`. The Spring Boot `DataIntegrityViolationException` handler catches this and returns a clean HTTP 409 response.

---

## 🧪 Automated End-to-End Acceptance Verification

An automated verification script tests all 12 operational workflows:

```bash
python3 - << 'EOF'
# (See conversation transcript or run the test suite directly)
EOF
```

**Verification Results:**
- `GET /api/movies` ➔ **HTTP 200 OK** (4 movies returned)
- `POST /api/auth/register` ➔ **HTTP 201 Created** (New customer token issued)
- `GET /api/shows/2/seats` ➔ **HTTP 200 OK** (14 seats fetched)
- `POST /api/bookings` ➔ **HTTP 201 Created** (Booking #5 created, status `PENDING`)
- `POST /api/bookings` (Duplicate Seat) ➔ **HTTP 409 Conflict** (`Seat A1 is already booked for this show`)
- `POST /api/bookings/{id}/payment` ➔ **HTTP 200 OK** (Status updated to `CONFIRMED`)
- `GET /api/bookings/my` ➔ **HTTP 200 OK** (Personal booking history verified)
- Customer accessing `/api/admin/bookings` ➔ **HTTP 403 Forbidden** (Security barrier enforced)
- Admin login (`admin@cinema.local`) ➔ **HTTP 200 OK** (Admin token issued)
- Admin query `/api/admin/bookings` & `/payments` ➔ **HTTP 200 OK** (Full audit trail fetched)
- `POST /api/bookings/{id}/cancel` ➔ **HTTP 200 OK** (Status `CANCELLED`, Payment `REFUNDED`, seats released)

---

## 🎓 DBMS Viva Voce Quick Revision

Refer to [`docs/VIVA_NOTES.md`](docs/VIVA_NOTES.md) for detailed viva preparation. Key points:
1. **ACID Properties**:
   - **Atomicity**: Either the Booking, Seat Allocations, and Payment all commit, or none do.
   - **Consistency**: Unique constraints `(show_id, seat_id)` and foreign keys prevent invalid states.
   - **Isolation**: `READ_COMMITTED` transaction isolation prevents dirty reads.
   - **Durability**: InnoDB redo logs ensure confirmed reservations persist after server restart.
2. **Database Normalization**:
   - Normalized to **3NF / BCNF**. Transitive dependencies are removed by separating `THEATRE`, `SCREEN`, and `SEAT`.
3. **Password Security**:
   - Passwords are salted and hashed using BCrypt. Plaintext passwords never touch the database or network responses.
