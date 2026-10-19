# Proposed API Contract

Base URL for local development: `http://localhost:8080/api`

Antigravity must keep this document aligned with the actual implementation.

## Authentication
- `POST /auth/register` — register customer
- `POST /auth/login` — authenticate
- `POST /auth/logout` — logout/invalidate session or token, according to the chosen documented auth approach
- `GET /auth/me` — current authenticated user

## Public catalogue
- `GET /movies`
- `GET /movies/{movieId}`
- `GET /movies/{movieId}/shows`
- `GET /shows/{showId}`
- `GET /shows/{showId}/seats` — return seats and availability for this show only

## Customer
- `POST /bookings` — create a booking for a show and list of seat IDs
- `GET /bookings/my` — authenticated customer's booking history
- `GET /bookings/{bookingId}` — owner or authorized admin only
- `POST /bookings/{bookingId}/payment` — simulate payment, owner or authorized admin only
- `POST /bookings/{bookingId}/cancel` — if cancellation is implemented; apply seat-release rules transactionally

Example booking request:
```json
{
  "showId": 1,
  "seatIds": [1, 2]
}
```

The client must not submit a trusted total amount. The backend calculates it from the stored show price and seat count.

## Admin (role-protected)
- `POST /admin/movies`, `PUT /admin/movies/{id}`, `DELETE /admin/movies/{id}`
- `POST /admin/theatres`, `PUT /admin/theatres/{id}`, `DELETE /admin/theatres/{id}`
- `POST /admin/screens`, `PUT /admin/screens/{id}`, `DELETE /admin/screens/{id}`
- `POST /admin/seats`, `PUT /admin/seats/{id}`, `DELETE /admin/seats/{id}`
- `POST /admin/shows`, `PUT /admin/shows/{id}`, `DELETE /admin/shows/{id}`
- `GET /admin/bookings`
- `GET /admin/payments`

Use standard HTTP status codes, DTOs, validation, and a consistent error response. Adjust paths only if the actual implementation is documented and frontend calls match it.
