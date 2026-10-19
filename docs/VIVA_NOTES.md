# DBMS Microproject Viva Voce Study & Reference Guide

This document prepares you for questions commonly asked by examiners during a second-year Database Management Systems (DBMS) practical viva examination.

---

## 1. Project Overview & Architecture

### Q1: What is the high-level architecture of your project?
**Answer:**
The system is built on a 3-tier client-server architecture:
1. **Presentation Layer (Frontend)**: React 18 with Vite, React Router, and Axios. It provides the customer seat-selection layout, catalogue, and admin dashboards.
2. **Business / Application Layer (Backend)**: Java 17 and Spring Boot 3.3.5. REST controllers expose API endpoints, Spring Data JPA / Hibernate handles ORM object-relational mapping, and Spring Security handles stateless JWT authentication and role-based authorization.
3. **Data Tier (Database)**: MySQL 8 relational database with InnoDB storage engine enforcing ACID transactions, foreign keys, and unique indexes.

### Q2: Why are there exactly nine tables?
**Answer:**
The schema is strictly normalized into exactly nine tables:
- `CUSTOMER`: Users, authentication, and roles (`CUSTOMER`, `ADMIN`).
- `MOVIE`: Film metadata (duration, genre, rating).
- `THEATRE`: Cinema locations and venues.
- `SCREEN`: Individual halls/auditoriums in a theatre.
- `SEAT`: Physical seats attached to a screen.
- `SHOW`: Scheduled screenings of a movie on a screen at a specific date and time.
- `BOOKING`: Customer ticket reservation master record.
- `BOOKING_SEAT`: Junction table allocating specific seats for a specific show.
- `PAYMENT`: Simulated payment transactions linked 1-to-1 with bookings.

Role-based access is maintained via `CUSTOMER.role`, avoiding unnecessary auxiliary tables while maintaining strict referential integrity.

---

## 2. Normalization & Schema Design

### Q3: What normal forms does your schema satisfy?
**Answer:**
The schema is normalized to **Third Normal Form (3NF) / Boyce-Codd Normal Form (BCNF)**:
1. **1NF**: All columns contain atomic (indivisible) values. There are no repeating groups or comma-separated lists (e.g. seats are stored in individual rows in `BOOKING_SEAT`, not as a string of seat IDs).
2. **2NF**: It is in 1NF and every non-key attribute is fully functionally dependent on the entire primary key. In composite primary key or junction tables like `BOOKING_SEAT`, each attribute relates directly to the allocation.
3. **3NF**: It is in 2NF and there are no transitive dependencies ($X \rightarrow Y$ and $Y \rightarrow Z$). For example, `SEAT` does not store `theatre_id` directly; it references `screen_id`, which references `theatre_id`.

### Q4: Why is `BOOKING_SEAT` separated from `BOOKING`?
**Answer:**
There is a **many-to-many relationship** between `BOOKING` and `SEAT`. A single booking can reserve multiple seats (e.g., A1 and A2), and over time a physical seat is reserved across multiple shows and bookings. `BOOKING_SEAT` acts as the associative entity / junction table.

---

## 3. Concurrency Control & Double Booking

### Q5: How do you prevent two customers from booking the same seat simultaneously?
**Answer:**
We prevent double booking using a **defense-in-depth approach** at two levels:
1. **Application-Level Isolation**:
   In `BookingService.java`, the booking operation is annotated with `@Transactional(isolation = Isolation.READ_COMMITTED)`. Before inserting, the service queries if any active allocation exists for `(show_id, seat_id)`. If found, it throws `SeatUnavailableException` returning HTTP 409 Conflict.
2. **Database-Level Integrity Constraint**:
   In `BOOKING_SEAT`, a composite unique constraint is defined:
   ```sql
   CONSTRAINT uq_seat_once_per_show UNIQUE (show_id, seat_id);
   ```
   If two requests pass the application check simultaneously, MySQL's B-Tree unique index rejects the second insert with `ERROR 1062 (Duplicate entry)`. The backend translates this into an HTTP 409 Conflict and rolls back the transaction.

### Q6: What happens when a booking is cancelled?
**Answer:**
To allow other customers to reserve the seats again, the backend transactional service removes the rows from `BOOKING_SEAT` for that show, while keeping the `BOOKING` row with `status = 'CANCELLED'` and the `PAYMENT` row with `status = 'REFUNDED'` for audit and accounting purposes.

---

## 4. Transactions and ACID Properties

### Q7: Explain ACID properties in the context of your booking process:
**Answer:**
- **Atomicity**: When creating a booking, creating the `BOOKING` record and inserting each `BOOKING_SEAT` allocation occur inside one database transaction. If any seat is already booked or a database error occurs, everything rolls back; no orphan booking is left behind.
- **Consistency**: Database constraints (foreign keys, `CHECK (price > 0)`, `CHECK (rating >= 0 AND rating <= 10)`, and `UNIQUE (show_id, seat_id)`) are never violated.
- **Isolation**: Handled using `READ_COMMITTED` isolation, preventing dirty reads of uncommitted bookings by other concurrent users.
- **Durability**: Once a transaction is committed, MySQL writes the data to the InnoDB redo log and disk; confirmed bookings remain persisted even during system restarts or crashes.

---

## 5. Security & Authentication

### Q8: How are passwords stored and authenticated?
**Answer:**
- Passwords are never stored in plaintext. They are hashed using **BCrypt** with an adaptive work factor (salt + cryptographic one-way hashing).
- During login, `BCryptPasswordEncoder.matches(rawPassword, encodedHash)` verifies the password.
- Password hashes are marked `@JsonIgnore` and are never exposed in API responses or sent to the frontend.
- Communication after login uses stateless **JSON Web Tokens (JWT)** signed with HMAC-SHA256 containing customer ID, email, and role.

---

## 6. Practical SQL Queries to Know for Viva

### 1. Show all confirmed bookings with customer, movie, screen, and theatre details:
```sql
SELECT 
    b.booking_number,
    c.name AS customer_name,
    m.title AS movie_title,
    t.theatre_name,
    sc.screen_name,
    s.show_date,
    s.show_time,
    b.total_amount,
    b.status
FROM BOOKING b
JOIN CUSTOMER c ON b.customer_id = c.customer_id
JOIN `SHOW` s ON b.show_id = s.show_id
JOIN MOVIE m ON s.movie_id = m.movie_id
JOIN SCREEN sc ON s.screen_id = sc.screen_id
JOIN THEATRE t ON sc.theatre_id = t.theatre_id
WHERE b.status = 'CONFIRMED';
```

### 2. Find which seats are booked for a particular show (e.g., Show ID 1):
```sql
SELECT 
    bs.booking_seat_id,
    st.seat_number,
    st.seat_type,
    b.booking_number,
    c.name AS booked_by
FROM BOOKING_SEAT bs
JOIN SEAT st ON bs.seat_id = st.seat_id
JOIN BOOKING b ON bs.booking_id = b.booking_id
JOIN CUSTOMER c ON b.customer_id = c.customer_id
WHERE bs.show_id = 1;
```

### 3. Calculate total revenue generated per movie from successful payments:
```sql
SELECT 
    m.title,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    SUM(p.amount) AS total_revenue
FROM PAYMENT p
JOIN BOOKING b ON p.booking_id = b.booking_id
JOIN `SHOW` s ON b.show_id = s.show_id
JOIN MOVIE m ON s.movie_id = m.movie_id
WHERE p.payment_status = 'SUCCESS'
GROUP BY m.movie_id, m.title;
```

### 4. Find all available (unbooked) seats for a given show:
```sql
SELECT 
    st.seat_id,
    st.seat_number,
    st.seat_type
FROM SEAT st
JOIN `SHOW` s ON s.screen_id = st.screen_id
WHERE s.show_id = 1
  AND st.seat_id NOT IN (
      SELECT bs.seat_id 
      FROM BOOKING_SEAT bs 
      WHERE bs.show_id = 1
  )
ORDER BY st.seat_number;
```

---

## 7. Key Viva Definitions

- **DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP` — defines database structures.
- **DML (Data Manipulation Language)**: `SELECT`, `INSERT`, `UPDATE`, `DELETE` — manipulates data records.
- **Primary Key**: A column or combination of columns that uniquely identifies each row in a table. Does not allow NULLs.
- **Foreign Key**: A column that creates a link between two tables, ensuring referential integrity by referencing the primary key of another table.
- **Composite Key**: A primary key or unique key made up of two or more columns (e.g. `(show_id, seat_id)` in `BOOKING_SEAT`).
- **Index**: A data structure (typically B+ Tree in MySQL InnoDB) that improves the speed of data retrieval operations on a database table.
