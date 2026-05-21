const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

/**
 * Create and configure the Express app.
 * @param {Function|null} initMiddleware - Async middleware for DB/auth init (runs BEFORE routes)
 * @returns {express.Application}
 */
function createApp(initMiddleware) {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "https://frontend-opal-theta-mydgygpet3.vercel.app",
        "http://localhost:5001",
      ],
      credentials: true,
    })
  );

  // Body parsing and cookie parsing
  app.use(express.json());
  app.use(cookieParser());

  // Init middleware MUST run before routes (DB connection for serverless)
  if (initMiddleware) {
    app.use(initMiddleware);
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "StudyNook API is running" });
  });

  // Better Auth handler (lazy initialized after DB connects)
  let authHandler = null;

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
        return res.status(503).json({
          success: false,
          message: "Auth service not ready",
        });
      }
      return authHandler(req, res);
    }

    next();
  });

  // Mount routes
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/bookings", bookingRoutes);

  /**
   * Set the Better Auth handler after DB connection is established.
   */
  app.setAuthHandler = (handler, auth) => {
    authHandler = handler;
    app._betterAuth = auth;
  };

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  });

  return app;
}

module.exports = createApp;
