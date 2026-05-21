const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const createApp = require("./app");
const { createAuth, getAuthHandler } = require("./lib/auth");

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();

    const auth = createAuth();
    const authHandler = getAuthHandler(auth);
    app.setAuthHandler(authHandler, auth);
    console.log("Better Auth initialized with Google provider");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
