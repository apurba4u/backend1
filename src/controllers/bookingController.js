const Booking = require("../models/Booking");
const Room = require("../models/Room");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Convert "HH:MM" to minutes since midnight for overlap comparison.
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Calculate the number of hours between two "HH:MM" time strings.
 */
const calculateHours = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return (end - start) / 60;
};

// ─── Create Booking ──────────────────────────────────────────────────────────

const createBooking = asyncHandler(async (req, res) => {
  const { room: roomId, date, startTime, endTime } = req.body;

  // Validate time order
  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    throw new ApiError(400, "End time must be after start time.");
  }

  // Find the room
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  // Check for overlapping bookings on the same date
  const bookingDate = new Date(date);
  // Normalize to start of day for consistent comparison
  const dayStart = new Date(bookingDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(bookingDate);
  dayEnd.setHours(23, 59, 59, 999);

  const overlappingBooking = await Booking.findOne({
    room: roomId,
    date: { $gte: dayStart, $lte: dayEnd },
    status: "confirmed",
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (overlappingBooking) {
    throw new ApiError(
      400,
      "This room is already booked for the selected time slot. Please choose a different time."
    );
  }

  // Calculate total price
  const hours = calculateHours(startTime, endTime);
  if (hours <= 0) {
    throw new ApiError(400, "Invalid time range.");
  }
  const totalPrice = Math.round(hours * room.pricePerHour * 100) / 100;

  // Create booking
  const booking = await Booking.create({
    room: roomId,
    user: req.user._id,
    date: bookingDate,
    startTime,
    endTime,
    totalPrice,
  });

  // Increment room booking count
  await Room.findByIdAndUpdate(roomId, { $inc: { bookingCount: 1 } });

  // Return booking with room details
  const populatedBooking = await Booking.findById(booking._id).populate(
    "room"
  );

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking: populatedBooking,
  });
});

// ─── Get My Bookings ─────────────────────────────────────────────────────────

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("room")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// ─── Cancel Booking ──────────────────────────────────────────────────────────

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  // Check ownership
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this booking.");
  }

  // Check if already cancelled
  if (booking.status === "cancelled") {
    throw new ApiError(400, "This booking is already cancelled.");
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking,
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
