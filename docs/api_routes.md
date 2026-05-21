# StudyNook API Routing Structure Analysis

This document outlines the routing architecture of the StudyNook backend API.

## Base Path
All API routes are prefixed with `/api`.

---

## Route Definitions

### 1. Authentication Routes
*   **Source File**: `src/routes/authRoutes.js`
*   **Prefix**: `/api/auth`

| HTTP Method | Path | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | `validate(registerSchema)` | Registers a new email/password user |
| `POST` | `/login` | `validate(loginSchema)` | Logs in an email/password user & sets JWT cookie |
| `POST` | `/logout` | *None* | Logs out the user & clears authentication cookie |
| `GET` | `/me` | `protect` | Fetches details of the currently logged-in user |

> [!NOTE]
> Better Auth endpoint handling overrides paths like `/api/auth/session`, `/api/auth/callback/google`, `/api/auth/sign-in/social`, and `/api/auth/sign-out` directly inside `app.js` using the lazy-loaded `authHandler`.

---

### 2. Room Routes
*   **Source File**: `src/routes/roomRoutes.js`
*   **Prefix**: `/api/rooms`

| HTTP Method | Path | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | *None* | Lists all study rooms with support for searching, filter queries, and pagination |
| `GET` | `/:id` | *None* | Retrieves a specific study room by its MongoDB Object ID |
| `POST` | `/` | `protect`, `validate(createRoomSchema)` | Creates a new study room (Requires authentication) |
| `PUT` | `/:id` | `protect`, `validate(updateRoomSchema)` | Updates room properties (Requires authentication & ownership) |
| `DELETE` | `/:id` | `protect` | Deletes a study room (Requires authentication & ownership) |

---

### 3. Booking Routes
*   **Source File**: `src/routes/bookingRoutes.js`
*   **Prefix**: `/api/bookings`

| HTTP Method | Path | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | `protect`, `validate(createBookingSchema)` | Creates a new study room booking (Checks time overlap conflicts) |
| `GET` | `/my-bookings` | `protect` | Retrieves all bookings created by the authenticated user |
| `PATCH` | `/:id/cancel` | `protect` | Cancels a booking (Changes status to `cancelled`) |

---

### 4. Health Check Route
*   **Source File**: `src/app.js`

| HTTP Method | Path | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | *None* | Verifies if the backend server is active and running |
