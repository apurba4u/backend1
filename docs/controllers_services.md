# StudyNook Controller-Service Separation Analysis

This document provides a design review of the controllers in StudyNook and discusses potential future architecture changes to separate business logic into a Service Layer.

## Current Architecture
Presently, StudyNook uses a direct Controller-to-Model pattern. Business logic is placed within the controllers:
*   `src/controllers/authController.js`
*   `src/controllers/bookingController.js`
*   `src/controllers/roomController.js`

### Responsibilities Handled by Controllers
1.  **Request Handling**: Extracting payload params, query strings (`req.query`), route parameter identifiers (`req.params.id`), and user context (`req.user`).
2.  **Input Validation Triggering**: Input schemas are verified via router middleware, but logic validation (such as checking booking duration ranges or room ownership constraints) occurs inside controller logic.
3.  **Business logic**:
    *   Validating booking dates/times, overlapping booking checks (e.g., verifying if a study room is free for the chosen slot in `bookingController.js`).
    *   Ownership check before allowing mutations on study rooms in `roomController.js`.
    *   Password hashing and signature generation for JSON Web Tokens in `authController.js`.
4.  **Database Operations**: Querying, updating, and saving documents directly using Mongoose schemas.
5.  **Response Construction**: Formatting success/failure payloads, setting auth cookie parameters, and assigning HTTP status codes.

---

## Analysis of Separation & Service Layer Refactoring
While the direct controller-to-model approach works well for simple CRUD setups, introducing a dedicated **Service Layer** under `src/services/` (which is currently empty) would separate HTTP concerns from core business domains.

### Proposed Service Layer Refactoring Plan

```
┌────────────────┐      ┌─────────────────┐      ┌───────────────┐
│ Express Router │ ───> │   Controller    │ ───> │ Domain Service│
└────────────────┘      │ (HTTP & Cookies)│      │(Business Logic)│
                        └─────────────────┘      └───────────────┘
                                                         │
                                                         ▼
                                                 ┌───────────────┐
                                                 │ Mongoose Model│
                                                 └───────────────┘
```

#### 1. Authentication Service (`src/services/authService.js`)
*   **Responsibilities**: Password comparison, JWT signing, user creation logic.
*   **Controller Benefit**: `authController` only handles cookie storage options and HTTP responses.

#### 2. Room Service (`src/services/roomService.js`)
*   **Responsibilities**: Encapsulating room filtering queries, verifying owner permission levels, managing CRUD operations.
*   **Controller Benefit**: Simplifies pagination arithmetic and error mapping in `roomController`.

#### 3. Booking Service (`src/services/bookingService.js`)
*   **Responsibilities**: Wrapping time parsing, overlap queries, and pricing calculations into a transaction-safe workflow.
*   **Controller Benefit**: Removes datetime math and database querying from `bookingController`.
