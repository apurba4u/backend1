# StudyNook Request Validation Workflow Notes

This document describes the request validation infrastructure built using **Zod** schema modeling and Express middleware.

## Validation Design
Validation is performed declaratively at the router layer using schema objects defined under `src/validations/*` and executed via custom Express middleware in `src/middleware/validate.js`.

```
[Incoming Request] ──> [Express Router] ──> [Validate Middleware (Zod Schema)]
                                                     │
                                 ┌───────────────────┴───────────────────┐
                                 ▼ (Success)                             ▼ (Failure)
                       [Parse & Sanitize Data]                  [Respond 400 Bad Request]
                       [Attach to req.body]                     [Return structured errors]
                                 │
                                 ▼
                         [Route Handler]
```

## Validation Middleware (`src/middleware/validate.js`)
The validation middleware acts as a factory function that wraps a Zod schema:

*   **`safeParse` execution**: It validates `req.body` against the Zod schema. This is non-throwing; it returns a status indicator (`success`) and payload details (`data` or `error`).
*   **Error formatting**: On validation failure, it maps the Zod issues into a readable, standardized response array:
    ```json
    {
      "success": false,
      "message": "Validation failed",
      "errors": [
        { "field": "email", "message": "Please provide a valid email address" }
      ]
    }
    }
    ```
    This ensures that client apps receive descriptive errors for field validation failures.
*   **Sanitization**: On success, it assigns the parsed output (`result.data`) back to `req.body`. This guarantees that fields not specified in the Zod schema are stripped out before they reach the controller, avoiding parameter injection.

## Active Schemas

### 1. Authentication (`src/validations/authValidation.js`)
*   **`registerSchema`**:
    *   `name`: Non-empty string, trimmed, minimum 2 characters.
    *   `email`: Valid email format, trimmed, transformed to lowercase.
    *   `password`: Minimum 6 characters.
*   **`loginSchema`**:
    *   `email`: Valid email format, trimmed, transformed to lowercase.
    *   `password`: Non-empty string.

### 2. Room Operations (`src/validations/roomValidation.js`)
*   **`createRoomSchema`**:
    *   `name` / `description` / `image`: Required non-empty strings.
    *   `floor`: Required integer, minimum value of `1`.
    *   `capacity`: Required integer, minimum value of `1`.
    *   `hourlyPrice`: Required number, minimum value of `0` (prevents negative values).
    *   `amenities`: Optional array matching permitted string enums (e.g., `"WiFi"`, `"Projector"`, `"Whiteboard"`, etc.).
*   **`updateRoomSchema`**:
    *   Mimics `createRoomSchema`, but all properties are marked as `.optional()` to support partial patches.

### 3. Booking Operations (`src/validations/bookingValidation.js`)
*   **`createBookingSchema`**:
    *   `room`: String (valid Mongoose ObjectId reference).
    *   `date`: Date representation string.
    *   `startTime` / `endTime`: Regex-validated 24-hour time strings (`HH:MM` format).
