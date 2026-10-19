# Backend — Smart Movie & Theatre Booking Management System

Spring Boot 3.3.5 REST API built with Java 17, Spring Data JPA, Hibernate, Spring Security, BCrypt, and JJWT.

---

## Architecture Overview

A clean layered architecture:
```
backend/src/main/java/com/cinema/booking/
├── config/        # SecurityConfig, CORS (allows http://localhost:5173), password encoder bean
├── controller/    # REST API endpoints (Auth, Movies, Shows, Bookings, Admin)
├── dto/           # Request/Response data transfer objects (no direct entity leakage)
├── entity/        # Exactly 9 JPA entities mapped to MySQL 8 InnoDB tables
├── exception/     # Custom exceptions and GlobalExceptionHandler (@RestControllerAdvice)
├── repository/    # Spring Data JPA repositories with query methods
├── security/      # JWT provider, authentication filter, UserPrincipal, CustomUserDetailsService
└── service/       # Business logic (AuthService, CatalogueService, BookingService, AdminService)
```

---

## Exactly 9 Core JPA Entities

1. `Customer` &rarr; `CUSTOMER` (handles authentication & `CUSTOMER`/`ADMIN` roles)
2. `Movie` &rarr; `MOVIE`
3. `Theatre` &rarr; `THEATRE`
4. `Screen` &rarr; `SCREEN`
5. `Seat` &rarr; `SEAT`
6. `Show` &rarr; `` `SHOW` `` (mapped with identifier quoting for MySQL keyword safety)
7. `Booking` &rarr; `BOOKING`
8. `BookingSeat` &rarr; `BOOKING_SEAT` (composite primary key `BookingSeatId`)
9. `Payment` &rarr; `PAYMENT` (1-to-1 with `BOOKING`)

---

## Configuration & Environment Variables

Hibernate is strictly configured with:
```properties
spring.jpa.hibernate.ddl-auto=validate
```
Never uses `create`, `update`, or `create-drop`.

Environment variables with placeholder defaults:
| Variable | Description | Default Fallback |
| :--- | :--- | :--- |
| `DB_URL` | JDBC Connection URL | `jdbc:mysql://localhost:3306/smart_movie_booking?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
| `DB_USERNAME` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `""` (Set locally via env var) |
| `JWT_SECRET` | 256-bit secret key for HMAC-SHA256 | `smartMovieBookingSecureJwtKeyForHmacSha256MustBe32BytesLong!` |
| `JWT_EXPIRATION_MS` | JWT expiry duration | `86400000` (24 hours) |

A local template is provided in `backend/application-local.properties.example`.

---

## Demo Credentials (Seeded with BCrypt)

| Role | Email | Plaintext Password | Password Hash |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cinema.local` | `Admin@1234` | `$2a$10$fcOng8FdyxTmEdkiODrhn.ZC0hMyR2ArJcUx7duQpd9NKAmgU.xi.` |
| **CUSTOMER** | `alice@cinema.local` | `Customer@1234` | `$2a$10$sHldaAyZ6oIIJbaJ2DCkLeeWrz5JIWtrX4297Rz7cQit1BohR5tMK` |
| **CUSTOMER** | `bob@cinema.local` | `Customer@1234` | `$2a$10$sHldaAyZ6oIIJbaJ2DCkLeeWrz5JIWtrX4297Rz7cQit1BohR5tMK` |

---

## Running the Application

### 1. Build and Run Tests
```bash
export JAVA_HOME="/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
export DB_PASSWORD="your_mysql_password"

cd backend
mvn test
```

### 2. Run Backend Server
```bash
mvn spring-boot:run
```
The REST API will be available at `http://localhost:8080/api`.

---

## API Endpoints Implemented

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register customer account (BCrypt hashed)
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `POST /api/auth/logout` — Logout confirmation
- `GET /api/auth/me` — Current authenticated user profile (password hash never returned)

### Public Catalogue (`/api`)
- `GET /api/movies` — List all active movies
- `GET /api/movies/{id}` — Get movie details
- `GET /api/movies/{id}/shows` — List scheduled shows for a movie
- `GET /api/shows/{id}` — Get show details
- `GET /api/shows/{id}/seats` — Get all seats with show-specific availability (`available: true/false`)

### Customer Bookings (`/api/bookings`)
- `POST /api/bookings` — Create transactional booking (validates screen, seats, server calculates total)
- `GET /api/bookings/my` — Customer's booking history
- `GET /api/bookings/{id}` — Specific booking details (owner or admin only)
- `POST /api/bookings/{id}/payment` — Simulate payment (`UPI`, `CARD_SIMULATED`, etc.)
- `POST /api/bookings/{id}/cancel` — Cancel booking and transactionally release seat allocations

### Admin Management (`/api/admin` — Role `ADMIN` required)
- `POST /api/admin/movies`, `PUT /api/admin/movies/{id}`, `DELETE /api/admin/movies/{id}`
- `GET /api/admin/theatres`, `POST /api/admin/theatres`, `PUT /api/admin/theatres/{id}`, `DELETE /api/admin/theatres/{id}`
- `GET /api/admin/screens`, `POST /api/admin/screens`, `PUT /api/admin/screens/{id}`, `DELETE /api/admin/screens/{id}`
- `GET /api/admin/seats`, `POST /api/admin/seats`, `PUT /api/admin/seats/{id}`, `DELETE /api/admin/seats/{id}`
- `GET /api/admin/shows`, `POST /api/admin/shows`, `PUT /api/admin/shows/{id}`, `DELETE /api/admin/shows/{id}`
- `GET /api/admin/bookings` — View all customer bookings
- `GET /api/admin/payments` — View all payment transactions
