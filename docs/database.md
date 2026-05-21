# StudyNook Database Integration Overview

This document explains the database integration architecture using MongoDB and Mongoose in StudyNook.

## Mongoose Database Configuration
Database connection logic resides in `src/config/db.js`. It utilizes the official Mongoose library (`mongoose`) to connect to a MongoDB cluster.

### Setup and Lifecycle
1.  **Environment Variable Retrieval**: The connection URI is loaded from `process.env.MONGODB_URI`. If the variable is absent, the connection routine throws a descriptive error immediately, preventing the server from starting.
2.  **Connection Invocation**: Mongoose initiates the connection asynchronously using `mongoose.connect(uri)`.
3.  **App Level Bootstrapping**:
    Inside `src/server.js`, the startup sequence awaits database connectivity before executing any other initialization logic:
    ```javascript
    const startServer = async () => {
      try {
        await connectDB();
        
        // Initialize Better Auth after MongoDB connection
        const auth = createAuth();
        ...
        app.listen(PORT, ...);
      } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
      }
    };
    ```
    This sequential boot process guarantees that the web server never opens ports to accept client traffic until its database dependencies are fully ready.

## Database Adaptability and Drivers
*   **Mongoose Models**: Define schemas with validations (types, requirements, default values, min/max limits).
*   **Social Sign-In Sessions**: Better Auth relies on the official `@better-auth/mongodb-adapter` which utilizes the raw MongoDB connection instance (`mongoose.connection.db`) to create and manage its tables (`session`, `account`, `verification`) in the same MongoDB instance.

## Schema Modeling Features
*   **Timestamps**: Every model schema specifies `{ timestamps: true }`, which instructs Mongoose to automatically manage `createdAt` and `updatedAt` field properties.
*   **Populations**: Mongoose `.populate()` is heavily utilized in controllers (e.g., loading booking documents alongside room details, or loading rooms together with their owner information) to handle relationships cleanly.
*   **Indexing**: The `unique: true` modifier on user emails automatically sets up unique constraints in MongoDB to prevent duplicate accounts.
