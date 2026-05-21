# StudyNook CORS and Cookie Security Policies

This document explains the security configurations implemented in the StudyNook backend API.

## 1. Cross-Origin Resource Sharing (CORS)
The Express app in `src/app.js` configures CORS middleware to secure access to the API:

```javascript
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:5001",
    ],
    credentials: true,
  })
);
```

### Key Security Policies
*   **Restricted Origins**: The API limits incoming traffic to specific origins: the frontend client address (defined in `process.env.FRONTEND_URL`, defaulting to `http://localhost:3000`) and the default Better Auth proxy host (`http://localhost:5001`). Using wildcard `*` domains is avoided.
*   **Credentials Whitelisting**: `credentials: true` enables the browser client to send and receive secure, HTTP-only cookies in cross-origin requests.

---

## 2. Cookie Security Configuration
StudyNook relies on cookies for session tracking. Both the JWT cookie and Better Auth session cookies are configured with security parameters in `src/controllers/authController.js` and `src/lib/auth.js`:

```javascript
const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Cookie Attribute Safeguards
1.  **`httpOnly: true`**:
    *   **Purpose**: Prevents client-side scripts (e.g. `document.cookie`) from reading the cookie values.
    *   **Vulnerability Mitigated**: Cross-Site Scripting (XSS) attacks trying to access session tokens.
2.  **`sameSite: "strict"`**:
    *   **Purpose**: Instructs the browser to only send cookies in requests originating from the same site.
    *   **Vulnerability Mitigated**: Cross-Site Request Forgery (CSRF) attacks.
3.  **`secure: process.env.NODE_ENV === "production"`**:
    *   **Purpose**: Configures the browser to only transmit the cookie over secure HTTPS connections. In development environments (`localhost`), this flag is disabled to support standard HTTP connections.
    *   **Vulnerability Mitigated**: Man-in-the-Middle (MITM) session interception.
4.  **`maxAge`**: Sets the session cookie duration to 7 days, after which it is deleted.
