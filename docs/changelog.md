# StudyNook Backend Project Changelog

This document logs development milestones and feature integrations for the StudyNook backend API.

## Version 1.1.0 - Current Phase
Integrated secure social authentication and cookie session parsing.

### Added
*   Added Better Auth package configuration (`src/lib/auth.js`) supporting Google OAuth.
*   Added dynamic route interceptor in `src/app.js` to route session, callback, social-login, and log-out endpoints to the Better Auth handler.
*   Implemented lazy-loading mechanisms in `src/server.js` to initialize authentication engines after connecting to MongoDB.
*   Updated route protection middleware (`src/middleware/authMiddleware.js`) to support Better Auth session cookies alongside local JWT cookies.
*   Added automated database synchronization in route guards to provision new local user records when new Google OAuth sessions are verified.

---

## Version 1.0.0 - Stable Baseline Release
Completed core project setup, CRUD controllers, database schemas, request validation, and database seeding.

### Added
*   Created MongoDB collection schemas via Mongoose for Users, Rooms, and Bookings under `src/models/`.
*   Implemented standard credentials authentication controller with password hashing (using `bcryptjs`) and local token management (using `jsonwebtoken`).
*   Created Room CRUD controllers (`src/controllers/roomController.js`) supporting text searches, amenity filtering, floor restrictions, and price filtering.
*   Created Booking controller (`src/controllers/bookingController.js`) with time-range conflict checks.
*   Added Zod validation middleware (`src/middleware/validate.js`) to validate incoming request bodies.
*   Added centralized error handling with a custom `ApiError` class and global Express exception interceptors.
*   Added database seeding script (`src/seed/seed.js`) pre-populated with 25 rooms and test user accounts.
*   Configured CORS whitelist filters and cookie security attributes.
