const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const createApp = require("../src/app");
const { createAuth, getAuthHandler } = require("../src/lib/auth");

let isConnected = false;
let authInitialized = false;

const app = createApp(async (req, res, next) => {
  try {
    // Connect to MongoDB (cached across invocations)
    if (!isConnected || mongoose.connection.readyState !== 1) {
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error("MONGODB_URI is not set");
      await mongoose.connect(uri, { maxPoolSize: 10 });
      isConnected = true;
    }

    // Initialize Better Auth (once)
    if (!authInitialized) {
      const auth = createAuth();
      const authHandler = await getAuthHandler(auth);
      app.setAuthHandler(authHandler, auth);
      authInitialized = true;
    }

    next();
  } catch (err) {
    console.error("Init error:", err.message);
    res.status(500).json({ success: false, message: "Server initialization failed" });
  }
});

module.exports = app;
