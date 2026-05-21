# StudyNook Authentication Middleware Flow

This document describes how incoming client requests are authenticated in StudyNook.

## Dual-Strategy Authentication Overview
The backend supports two distinct mechanisms of user authentication, managed dynamically by the `protect` middleware in `src/middleware/authMiddleware.js`:

1.  **JWT Strategy**: Used for standard email/password authentication. The server signs a JSON Web Token and stores it in the HTTP-only `token` cookie.
2.  **Better Auth Strategy**: Used for Google OAuth login. Better Auth issues cookie session tokens (`better-auth.session_token`).

```mermaid
flowchart TD
    A[Incoming Request] --> B{JWT "token" Cookie Present?}
    B -- Yes --> C[Verify JWT with JWT_SECRET]
    C -- Success --> D[Find User in Mongoose DB]
    D -- User Found --> E[Attach User to req.user]
    E --> F[Call next()]
    
    B -- No / Fails --> G{Better Auth Session Cookie Present?}
    G -- Yes --> H[Call betterAuth.api.getSession()]
    H -- Session Valid --> I{User exists in Mongoose DB?}
    I -- No --> J[Create new User in DB using OAuth details]
    I -- Yes --> K[Attach User to req.user]
    J --> K
    K --> F
    
    G -- No / Fails --> L[Throw 401 ApiError]
```

## Detailed Flow Breakdown

### Phase 1: JWT Verification
*   The middleware checks for the presence of `req.cookies.token`.
*   If found, it attempts to verify the signature using `process.env.JWT_SECRET`.
*   If the token is valid, the user's ID is decoded, and the user profile is loaded from the Database (excluding the hashed password field: `.select("-password")`).
*   If the user is successfully resolved, they are attached to `req.user`, and control is handed over to the route handler via `next()`.
*   If JWT parsing fails (e.g., token expired or corrupted), the flow moves to Phase 2.

### Phase 2: Better Auth (OAuth) Session Verification
*   The middleware checks for the session token in cookies: `better-auth.session_token` or `__Secure-better-auth.session_token`.
*   If a session token is present and the server has lazy-initialized Better Auth (`req.app._betterAuth`), it extracts headers and validates the session with:
    `await req.app._betterAuth.api.getSession({ headers })`
*   If the session is verified:
    1.  The middleware queries the database for a user matching the session's email address.
    2.  If the user does not exist in Mongoose's `User` collection (meaning they logged in via Google OAuth for the first time), a corresponding MongoDB user document is automatically created using their Google profile name, email, avatar, and a default role of `"user"`.
    3.  The user object is attached to `req.user`, and execution continues.

### Phase 3: Failure Handler
*   If both strategies fail to authenticate the client, the middleware throws a `401 Unauthorized` error with the message `"Not authenticated. Please log in."`.
*   This error is captured by the global error handler which responds to the client with a `401` HTTP status code.
