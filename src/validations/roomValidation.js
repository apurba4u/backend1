const { z } = require("zod");

const AMENITIES = [
  "WiFi",
  "Projector",
  "Whiteboard",
  "Power Outlets",
  "Air Conditioning",
  "Natural Light",
  "Coffee Machine",
  "Sound System",
  "Printer",
  "Meeting Display",
];

const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required").trim(),
  description: z.string().min(1, "Room description is required"),
  image: z.string().min(1, "Room image is required"),
  floor: z.number().int().min(1, "Floor must be at least 1"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  hourlyPrice: z.number().min(0, "Price cannot be negative"),
  amenities: z
    .array(z.enum(AMENITIES))
    .optional()
    .default([]),
});

const updateRoomSchema = z.object({
  name: z.string().min(1, "Room name is required").trim().optional(),
  description: z.string().min(1, "Room description is required").optional(),
  image: z.string().min(1, "Room image is required").optional(),
  floor: z.number().int().min(1, "Floor must be at least 1").optional(),
  capacity: z.number().int().min(1, "Capacity must be at least 1").optional(),
  hourlyPrice: z.number().min(0, "Price cannot be negative").optional(),
  amenities: z
    .array(z.enum(AMENITIES))
    .optional(),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
};
