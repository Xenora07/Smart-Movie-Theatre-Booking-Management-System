# Antigravity Master Prompt
## Smart Movie & Theatre Booking Management System

You are implementing a second-year DBMS microproject. Read `README.md` and `docs/PROJECT_SPECIFICATION.md` completely before coding. Treat them as the source of truth.

### Mission
Build a complete, runnable, fully integrated movie and theatre booking web application with:
- Frontend: React + JavaScript + Vite + React Router + Axios + CSS
- Backend: Java + Spring Boot + Maven + Spring Data JPA/Hibernate + Spring Security
- Database: MySQL 8
- Exactly nine core database tables: CUSTOMER, MOVIE, THEATRE, SCREEN, SEAT, SHOW, BOOKING, BOOKING_SEAT, PAYMENT

Do not substitute a Node/Express backend. Do not add a tenth core business table. Authentication and the CUSTOMER/ADMIN role must be implemented using CUSTOMER.

### Mandatory workflow
Work in small, verifiable stages. Do not generate the entire app blindly in one pass.

Stage 1 — Inspect and plan:
1. Inspect the repository and the specification.
2. Present a concise implementation plan and note any genuine schema conflicts.
3. Preserve the nine-table limit.
4. Do not ask questions that the specification already answers.

Stage 2 — Database:
1. Finalize `database/schema.sql` and `database/sample_data.sql`.
2. Ensure all tables, PKs, FKs, unique constraints, indexes, and checks are coherent with MySQL 8.
3. Include sample movies, theatres, screens, seats, shows, customers, and an explicitly documented local-only admin seed.
4. Never seed a plaintext password into `password_hash`. If a demo admin is provided, use a generated BCrypt hash and clearly document the local demo credentials.
5. Explain how to run the scripts and verify the tables.

Stage 3 — Backend:
1. Create a clean Spring Boot Maven application in `backend/`.
2. Use a layered structure: entity, repository, service, controller, DTO, configuration, exception.
3. Configure MySQL using environment variables or an ignored local config. Provide a placeholder example.
4. Implement registration/login with hashed passwords and backend-enforced authorization.
5. Implement customer and admin endpoints per the API contract.
6. Implement booking in a transactional service. Server verifies show, seat/screen relationship, availability, price, and booking ownership.
7. Enforce unique `(show_id, seat_id)` in BOOKING_SEAT and handle concurrent conflicts gracefully.
8. Ensure failed operations roll back atomically.
9. Never expose password hashes or database secrets in API responses/logs.
10. Add meaningful validation and integration tests.

Stage 4 — Frontend:
1. Create a polished, responsive cinema booking UI with a clear navigation structure.
2. Use Axios service modules for every backend interaction.
3. Do not hardcode business data or replace API calls with fake/local data.
4. Build customer registration/login, movie listing/detail, show selection, interactive seat selection, checkout/payment simulation, booking confirmation/history.
5. Build a separate admin dashboard with protected routes and CRUD forms.
6. Show loading, empty, success, validation, and API error states.
7. Keep UI code maintainable and suitable for a student to explain in a viva.

Stage 5 — Integration and testing:
1. Start with the MySQL schema and verify connectivity.
2. Run backend tests and endpoint smoke tests.
3. Start frontend and test complete real API flows.
4. Verify persisted data by querying MySQL after registration and booking.
5. Test a duplicate/concurrent seat booking and verify only one succeeds.
6. Test role protection and customer booking ownership.
7. Fix discovered errors rather than documenting them as acceptable.
8. Update README with exact commands, ports, environment variables, endpoints, demo credentials (if any), and actual test results.
9. Clearly distinguish tests actually executed from tests not run. Never claim success without evidence.

### Design and coding constraints
- Use clear naming and beginner-friendly comments where useful.
- Avoid unnecessary abstractions, microservices, extra databases, and paid services.
- Use DTOs rather than exposing persistence entities directly.
- Do not return password hashes.
- Backend authorization is mandatory; hiding buttons in React is not security.
- Use safe deletion behavior for records referenced by booking history.
- Simulated payment only. Do not ask for or store real card numbers/CVV.
- Use transactions and database constraints, not frontend checks alone, to prevent double booking.
- Do not store secrets in committed source files.
- Keep the database as the source of truth.

### Final response after implementation
Report:
1. Files and modules created.
2. Exact setup/run commands.
3. Database initialization commands.
4. Implemented API endpoints.
5. Tests actually run and their results.
6. Any remaining limitations.
7. A short viva walkthrough of the React → Spring Boot → MySQL flow.

Start by inspecting the project and proposing Stage 1. Do not claim the project is complete until the acceptance tests in the specification have been run.
