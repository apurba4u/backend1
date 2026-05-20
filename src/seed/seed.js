const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Load environment variables from the backend root .env
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const User = require("../models/User");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const usersData = require("./users");
const roomsData = require("./rooms");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a Date object N days from today (0 = today) */
function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Build 12 realistic sample bookings spread across users and rooms.
 *
 * Each booking has:
 *  - A date within the next 30 days
 *  - A startTime / endTime pair (24-h HH:MM)
 *  - A totalPrice calculated from the room's pricePerHour x duration
 *  - A status of "confirmed" or "cancelled"
 */
function buildBookings(createdUsers, createdRooms) {
  const timeSlots = [
    { startTime: "08:00", endTime: "10:00" },
    { startTime: "09:00", endTime: "12:00" },
    { startTime: "10:00", endTime: "11:30" },
    { startTime: "11:00", endTime: "13:00" },
    { startTime: "13:00", endTime: "15:00" },
    { startTime: "14:00", endTime: "16:00" },
    { startTime: "15:00", endTime: "17:00" },
    { startTime: "16:00", endTime: "18:00" },
    { startTime: "09:00", endTime: "11:00" },
    { startTime: "10:00", endTime: "12:00" },
    { startTime: "13:00", endTime: "16:00" },
    { startTime: "17:00", endTime: "19:00" },
  ];

  const bookings = timeSlots.map((slot, i) => {
    const room = createdRooms[i % createdRooms.length];
    const user = createdUsers[i % createdUsers.length];

    // Calculate duration in hours (supports half-hours)
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    const durationHours = (eh * 60 + em - (sh * 60 + sm)) / 60;

    const totalPrice = parseFloat((room.hourlyPrice * durationHours).toFixed(2));

    // First 8 bookings are confirmed, last 4 are cancelled
    const status = i < 8 ? "confirmed" : "cancelled";

    // Spread bookings across the next 30 days
    const date = futureDate((i % 30) + 1);

    return {
      user: user._id,
      room: room._id,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      totalPrice,
      status,
    };
  });

  return bookings;
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  const shouldClear = process.argv.includes("--clear");

  try {
    // ── Connect ────────────────────────────────────────────────────
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.\n");

    // ── Clear (optional) ──────────────────────────────────────────
    if (shouldClear) {
      console.log("--clear flag detected. Dropping all collections...");
      await Promise.all([
        User.deleteMany({}),
        Room.deleteMany({}),
        Booking.deleteMany({}),
      ]);
      console.log("All collections cleared.\n");
    }

    // ── Seed Users ────────────────────────────────────────────────
    console.log("Seeding users...");
    const salt = await bcrypt.genSalt(10);
    const usersToInsert = await Promise.all(
      usersData.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, salt),
      }))
    );
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`  Created ${createdUsers.length} users.`);

    // ── Seed Rooms ────────────────────────────────────────────────
    console.log("Seeding rooms...");
    const roomsToInsert = roomsData.map((r) => ({
      ...r,
      owner: createdUsers[0]._id, // admin owns all rooms
    }));
    const createdRooms = await Room.insertMany(roomsToInsert);
    console.log(`  Created ${createdRooms.length} rooms.`);

    // ── Seed Bookings ─────────────────────────────────────────────
    console.log("Seeding bookings...");
    const bookingsToInsert = buildBookings(createdUsers, createdRooms);
    const createdBookings = await Booking.insertMany(bookingsToInsert);
    console.log(`  Created ${createdBookings.length} bookings.`);

    // ── Done ──────────────────────────────────────────────────────
    console.log("\nSeeding complete!");
    console.log("──────────────────────────────────────");
    console.log(`  Users:    ${createdUsers.length}`);
    console.log(`  Rooms:    ${createdRooms.length}`);
    console.log(`  Bookings: ${createdBookings.length}`);
    console.log("──────────────────────────────────────");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
