# StudyNook Utility Helpers and Controller Utilities

This document reviews the helper functions and utilities used across the backend in `src/utils/` and individual controllers.

---

## 1. Request Sanitization (`src/utils/sanitize.js`)
To prevent leaking sensitive user data (like hashed passwords), the application uses `sanitizeUser` to process user documents before returning them in API responses:

```javascript
const sanitizeUser = (user) => {
  if (!user) return null;

  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  return sanitized;
};
```
*   **Mongoose Document Check**: It verifies if `user` is a Mongoose document. If so, it calls `.toObject()` to strip out Mongoose-specific metadata; otherwise, it creates a shallow copy.
*   **Password Removal**: It deletes the `password` property from the object before returning it to controllers for serialization.

---

## 2. Booking Controller Utilities (`src/controllers/bookingController.js`)
The booking controller implements helper methods to manage reservation schedule checks:

### Time Conversion (`timeToMinutes`)
```javascript
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
```
*   **Purpose**: Converts 24-hour time strings (`"HH:MM"` format, e.g., `"14:30"`) into an integer representing total minutes since midnight (e.g. `870` minutes).
*   **Usage**: Enables simple mathematical comparisons (`<` or `>`) to detect schedule conflicts when users attempt to book overlapping reservation intervals.

### Duration Math (`calculateHours`)
```javascript
const calculateHours = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return (end - start) / 60;
};
```
*   **Purpose**: Computes the duration in hours between two time strings.
*   **Usage**: Multiplies duration by a room's `hourlyPrice` to calculate the reservation's `totalPrice`.
