# StudyNook Database Seeding and Sample Data

This document explains the database seeding infrastructure defined in `src/seed/`.

## Seeding Components
The project includes a seeding script under `src/seed/seed.js` along with pre-defined datasets to initialize database collections:
*   **`src/seed/users.js`**: Contains sample accounts (e.g., standard users and administrators) with pre-defined roles.
*   **`src/seed/rooms.js`**: Contains 25 distinct room blueprints, each populated with names, images, floor levels, capacities, and matching lists of amenities.
*   **`src/seed/seed.js`**: The main execution script.

---

## Seeding Operations

### 1. Seeding the Database
To populate the database with sample users and rooms, execute:
```bash
npm run seed
```
This runs `node src/seed/seed.js`, which does the following:
1.  Establishes a connection to the MongoDB cluster.
2.  Checks for the presence of existing accounts in the User collection. If users already exist, it aborts the process to prevent overwriting actual production or staging tables.
3.  Hashes raw passwords for seed users (using `bcryptjs`) before inserting them.
4.  Creates seed users and maps the created admin user's `ObjectId` as the owner of the seed study rooms.
5.  Saves the rooms to the MongoDB cluster.
6.  Disconnects from the database and terminates.

### 2. Clearing Seed Data
To wipe seeded collections, run:
```bash
npm run seed:clear
```
This triggers the clear sequence within `src/seed/seed.js` via the `--clear` argument flag. It truncates the `User`, `Room`, and `Booking` Mongoose collections.

---

## Seeding Script Design Highlights
*   **Abortion Safeguards**: In `seed()`, checking `User.countDocuments()` acts as a shield to prevent running the script on a populated database.
*   **Dynamic Referencing**: Since MongoDB generates unique `ObjectId` identifiers on creation, the script dynamically links the seeded room `owner` property to the newly generated administrative user ID.
