const { z } = require("zod");

const createBookingSchema = z.object({
  room: z.string().min(1, "Room ID is required"),
  date: z.string().min(1, "Booking date is required"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:MM (24h) format"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:MM (24h) format"),
});

module.exports = {
  createBookingSchema,
};
