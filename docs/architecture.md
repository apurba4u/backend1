# StudyNook Backend Architecture

This document provides a high-level overview of the StudyNook backend architecture.

## Overview
StudyNook is a study room booking application. The backend is designed as an Express-based RESTful API using Node.js and MongoDB (via Mongoose). It follows the Model-View-Controller (MVC) architectural pattern (where the "View" is represented by JSON API responses).

## Directory Structure
```
backend/
├── docs/                      # Project documentation and architecture notes
├── src/
│   ├── app.js                 # Express application initialization & middleware setup
│   ├── server.js              # Server entry point & database connection bootstrapping
│   ├── config/                # Configuration files (database connection)
│   ├── controllers/           # Request handlers containing business logic
│   ├── lib/                   # Third-party service initializations (Better Auth configuration)
│   ├── middleware/            # Custom Express middleware (authentication, request validation)
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Express routing definitions
│   ├── seed/                  # Database seeding scripts and sample data
│   ├── services/              # Business logic layers (currently reserved for future refactoring)
│   ├── utils/                 # Utility helper classes and functions (e.g., custom ApiError, asyncHandler)
│   └── validations/           # Input validation schemas (using Zod)
├── package.json               # Manifest file containing dependencies & scripts
├── package-lock.json          # Dependency lockfile
└── .env                       # Environment variables (git-ignored)
```

## Architectural Components

### 1. Entry Points
*   **`src/server.js`**: Initiates the application. It secures the database connection first, configures authentication providers (Better Auth), and then spins up the Express server on the specified port.
*   **`src/app.js`**: Houses the Express app instance, registers standard middleware (CORS, body-parser, cookie-parser), routes authentication handlers, mounts API routes, and defines the global error fallback handler.

### 2. Database Layer
StudyNook uses MongoDB as its primary datastore.
*   Mongoose is used for Object Data Modeling (ODM).
*   Schemas enforce data validation and document structure at the application level.
*   Data integrity is maintained using Mongoose references (`ObjectId`) for relational properties (e.g., Room referencing User as owner, Booking referencing Room and User).

### 3. Routing and Controllers
*   Express Routers (`src/routes/*`) direct incoming client requests to their respective controllers.
*   Controllers (`src/controllers/*`) unpack the request parameters, perform the necessary data operations via Mongoose models, and construct the response JSON.

### 4. Middleware & Utility Layer
*   **Validation**: Inputs are validated at the router level via a custom Zod validation wrapper.
*   **Authentication**: Custom middleware extracts cookies to verify user session tokens (JWT or Better Auth OAuth session tokens).
*   **Error Handling**: Standardized controller errors are thrown using a custom `ApiError` class and intercepted by a global Express error handler.
