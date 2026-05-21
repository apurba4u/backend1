# StudyNook Better Auth and Google OAuth Integration

This document outlines the integration of **Better Auth** and Google Social Authentication.

## Better Auth Architecture
Better Auth manages session token issuance, validation, and OAuth provider integrations. 

In `src/lib/auth.js`, Better Auth is configured to use the MongoDB adapter:
```javascript
const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  ...
});
```

*   **MongoDB Adapter**: Interacts with the Mongoose database connection (`mongoose.connection.db`). Better Auth creates and queries collections like `users`, `sessions`, and `accounts` directly.
*   **Social Providers Configuration**: Specifies credentials for Google OAuth.

---

## Route Interception in `src/app.js`
Better Auth requires handling specific API routes like `/api/auth/session`, `/api/auth/callback/google`, `/api/auth/sign-in/social`, and `/api/auth/sign-out`. Rather than writing individual controllers, these requests are intercepted and handled by the Better Auth Node handler:

```javascript
app.use("/api/auth", (req, res, next) => {
  const betterAuthPaths = [
    "/session",
    "/callback/google",
    "/sign-in/social",
    "/sign-out",
    "/get-session",
  ];

  const isBetterAuthRequest = betterAuthPaths.some(
    (path) => req.path === path || req.path.startsWith(path + "/")
  );

  if (isBetterAuthRequest) {
    if (!authHandler) {
      return res.status(503).json({ success: false, message: "Auth service not ready" });
    }
    return authHandler(req, res);
  }
  next();
});
```

### Flow Breakdown
1.  **Incoming Path Check**: If the endpoint matches a social sign-in route, the request is routed to the Better Auth handler.
2.  **Fall-through for Credentials**: Other authentication routes (e.g. `/register`, `/login`, `/logout`, `/me`) fall through to `authRoutes.js` and are handled by the custom `authController`.

---

## Session Synchronization in `authMiddleware.js`
When a user logs in via Google Social Login, Better Auth stores session cookies (`better-auth.session_token`).
To authenticate these users on standard endpoints, the `protect` middleware synchronizes Better Auth sessions with Mongoose's `User` collection:

1.  **Retrieve Session**: Calls `req.app._betterAuth.api.getSession({ headers })` to verify the session cookie.
2.  **Verify or Create Local Record**: If the session is valid, the middleware searches the Mongoose `User` collection for a matching email.
3.  **Auto-Registration**: If no local record exists, a new `User` document is created using OAuth profile details (name, email, and Google avatar image URL).
4.  **Context Injection**: The Mongoose user document is attached to `req.user` for downstream controller access.
