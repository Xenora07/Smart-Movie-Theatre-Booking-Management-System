# Smart Movie & Theatre Booking Management System

A DBMS microproject built with React + JavaScript, Java Spring Boot, and MySQL 8.

## Architecture

React frontend → Spring Boot REST API → MySQL database

All customer, movie, theatre, show, booking, seat-allocation, and payment data must persist in MySQL. The frontend must not use hardcoded mock data as a substitute for API integration.

## Nine core tables

1. `CUSTOMER`
2. `MOVIE`
3. `THEATRE`
4. `SCREEN`
5. `SEAT`
6. `SHOW`
7. `BOOKING`
8. `BOOKING_SEAT`
9. `PAYMENT`

Authentication fields and the `CUSTOMER`/`ADMIN` role are stored in `CUSTOMER`; do not create a separate users or roles table.

## Planned folder structure

```text
Smart-Movie-Theatre-Booking/
├── frontend/                  # React + JavaScript + Axios
├── backend/                   # Java + Spring Boot + Maven
├── database/
│   ├── schema.sql
│   └── sample_data.sql
├── docs/
│   ├── PROJECT_SPECIFICATION.md
│   ├── ANTIGRAVITY_PROMPT.md
│   ├── API_CONTRACT.md
│   └── VIVA_NOTES.md
└── README.md
```

## Prerequisites

- Java JDK 21 (or a compatible version selected consistently by the generated backend)
- Node.js LTS and npm
- MySQL Server 8.x and a MySQL client
- Antigravity
- Git (recommended)

## Initial database setup

1. Start MySQL.
2. Run `database/schema.sql`.
3. Run `database/sample_data.sql`.
4. Configure the backend's database connection using environment variables or a local, uncommitted configuration file.
5. Start the Spring Boot backend.
6. Start the React frontend.
7. Open the frontend and verify that its movie list comes from the backend API and MySQL.

Do not commit real passwords, JWT secrets, or other credentials.

## Required implementation order

1. Inspect this specification and database schema.
2. Implement the Spring Boot entities, repositories, services, controllers, authentication, and validation.
3. Test the backend against MySQL.
4. Implement the React pages and Axios API client.
5. Integrate the frontend with the running backend.
6. Run the acceptance tests in `docs/PROJECT_SPECIFICATION.md`.
7. Update documentation with the actual ports, commands, API routes, and test results.

Antigravity must not claim that integration is working unless it has actually run and verified it.
