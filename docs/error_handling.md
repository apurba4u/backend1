# StudyNook Error Handling Architecture

This document explains the structure and mechanics of the centralized error handling pattern in StudyNook.

## System Anatomy
Error handling in StudyNook is designed around a three-tier pattern:
1.  **Custom Error Model (`src/utils/ApiError.js`)**: An extension of the standard JS `Error` class to support HTTP status codes and custom responses.
2.  **Controller Wrapper (`src/utils/asyncHandler.js`)**: An Express middleware utility that catches asynchronous operational promises and redirects them to the global Express error-handler pipeline.
3.  **Express Fallback Handler (`src/app.js`)**: The final catch-all error handling middleware in the Express application.

---

## 1. The Custom `ApiError` Class
Operational failures (like resources not found, invalid credentials, or validation issues) are explicitly thrown as instances of the custom `ApiError` class.

```javascript
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}
```
*   `statusCode`: Holds the appropriate HTTP status code (e.g., 400 for Bad Request, 401 for Unauthorized, 403 for Forbidden, 404 for Not Found).
*   `success`: Set to `false` automatically to provide a consistent response envelope.
*   `Error.captureStackTrace`: Prevents the `ApiError` constructor frame itself from polluting stack trace dumps, preserving the exact point in controllers where the error was thrown.

---

## 2. The `asyncHandler` Utility
By default, Express route handlers do not catch rejected promises automatically, requiring developers to write boilerplate `try-catch` structures inside every controller method.
To avoid this duplication, StudyNook wraps all controllers in a functional utility:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```
*   It accepts an asynchronous handler function (`fn`).
*   It executes the handler within a resolved Promise wrapper.
*   If the inner promise rejects (either via an explicit `throw new ApiError` or an unexpected runtime exception), it automatically intercepts the exception and routes it to `next(error)`.

---

## 3. Global Express Error Handler Middleware
Registered as the final middleware inside `src/app.js`:

```javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
```
*   **Response Standardisation**: Standardizes the response body format for all API errors.
*   **Environment-Aware Stack Traces**: In `development` mode, it appends the full JavaScript `stack` property to the response JSON to simplify debugging. In `production`, stack details are omitted to prevent leaking directory paths or internal dependencies.
