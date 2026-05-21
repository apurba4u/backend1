const mongoose = require("mongoose");

/**
 * Initialize Better Auth with MongoDB adapter and Google provider.
 * Must be called after mongoose.connect().
 * Uses dynamic import() because better-auth is ESM-only.
 */
async function createAuth() {
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection not established. Call connectDB() first.");
  }

  const auth = betterAuth({
    database: mongodbAdapter(db),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5001",
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
    user: {
      modelName: "users",
      fields: {
        emailVerified: "emailVerified",
        image: "avatar",
      },
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24,     // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    advanced: {
      generateId: () => undefined, // Let MongoDB generate IDs
    },
  });

  return auth;
}

/**
 * Get the Node.js request handler for Express.
 * Uses dynamic import() because better-auth/node is ESM-only.
 */
async function getAuthHandler(auth) {
  const { toNodeHandler } = await import("better-auth/node");
  return toNodeHandler(auth);
}

module.exports = { createAuth, getAuthHandler };
