const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * Protects routes by verifying authentication.
 * Checks JWT cookie first (email/password login),
 * then Better Auth session (Google OAuth login).
 */
const protect = async (req, res, next) => {
  try {
    // 1. Try JWT cookie (email/password auth)
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          return next();
        }
      } catch {
        // JWT invalid or expired, fall through to Better Auth check
      }
    }

    // 2. Try Better Auth session (Google OAuth auth)
    const sessionCookie =
      req.cookies["better-auth.session_token"] ||
      req.cookies["__Secure-better-auth.session_token"];
    if (sessionCookie && req.app._betterAuth) {
      try {
        // Dynamic import: better-auth/node is ESM-only
        const { fromNodeHeaders } = await import("better-auth/node");
        const headers = fromNodeHeaders(req.headers);
        const session = await req.app._betterAuth.api.getSession({
          headers,
        });

        if (session?.user) {
          let user = await User.findOne({ email: session.user.email });
          if (!user) {
            user = await User.create({
              name: session.user.name || session.user.email.split("@")[0],
              email: session.user.email,
              avatar: session.user.image || session.user.avatar || "",
              role: "user",
            });
          }
          req.user = user;
          return next();
        }
      } catch {
        // Better Auth session check failed, fall through
      }
    }

    throw new ApiError(401, "Not authenticated. Please log in.");
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(401, "Invalid or expired token. Please log in again."));
  }
};

module.exports = protect;
