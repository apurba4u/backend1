# StudyNook Environment Configuration Setup

This document lists and explains all environment configuration variables used by the StudyNook backend API.

## Configuration Engine
The backend configures itself at startup using the `dotenv` package loaded in `src/server.js`:
```javascript
const dotenv = require("dotenv");
dotenv.config();
```
This parses parameters in the root `.env` file and appends them to Node's `process.env` registry.

---

## Environment Variables

### 1. General Server Settings
*   **`PORT`**:
    *   **Description**: The local port where the Express server listens for requests.
    *   **Default**: `5000` (if not defined).
*   **`NODE_ENV`**:
    *   **Description**: The environment stage. Determines whether detailed error stack traces are returned to API clients.
    *   **Values**: `development` or `production`.

### 2. Database (MongoDB)
*   **`MONGODB_URI`**:
    *   **Description**: Connection string for MongoDB. Contains credentials, host, and database name.
    *   **Example**: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/studynook`

### 3. JWT Authentication (Email/Password)
*   **`JWT_SECRET`**:
    *   **Description**: String key used to sign and verify JSON Web Tokens generated for email/password user sessions.
*   **`JWT_EXPIRES_IN`**:
    *   **Description**: The lifetime duration of issued JWTs.
    *   **Default**: `7d` (7 days).

### 4. Better Auth (Google OAuth & Social Sign-In)
*   **`BETTER_AUTH_URL`**:
    *   **Description**: The canonical base URL where Better Auth resides.
    *   **Default**: `http://localhost:5001`
*   **`BETTER_AUTH_SECRET`**:
    *   **Description**: Internal security key used by Better Auth to encrypt cookie sessions.
*   **`FRONTEND_URL`**:
    *   **Description**: Address of the frontend client. Whitelisted in CORS headers.
    *   **Default**: `http://localhost:3000`
*   **`GOOGLE_CLIENT_ID`**:
    *   **Description**: Google OAuth API Client ID obtained from the Google Cloud Console.
*   **`GOOGLE_CLIENT_SECRET`**:
    *   **Description**: Google OAuth Client Secret key.

---

## Security Recommendations
*   Never check the local `.env` file into source control. It is explicitly ignored in `.gitignore`.
*   Ensure that in production, `NODE_ENV` is set to `production` so that database error traces are not leaked in API responses.
