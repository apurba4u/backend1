const mongoose = require("mongoose");

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

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Room description is required"],
    },
    image: {
      type: String,
      required: [true, "Room image is required"],
    },
    floor: {
      type: Number,
      required: [true, "Floor is required"],
      min: [1, "Floor must be at least 1"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
      min: [0, "Price cannot be negative"],
    },
    amenities: {
      type: [String],
      enum: AMENITIES,
      default: [],
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Room owner is required"],
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.statics.AMENITIES = AMENITIES;

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
