const Room = require("../models/Room");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// ─── Get All Rooms ───────────────────────────────────────────────────────────

const getAllRooms = asyncHandler(async (req, res) => {
  const {
    search,
    amenities,
    floor,
    priceMin,
    priceMax,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  // Text search on room name (case-insensitive regex)
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // Filter by amenities (comma-separated list)
  if (amenities) {
    const amenityList = amenities.split(",").map((a) => a.trim());
    filter.amenities = { $in: amenityList };
  }

  // Filter by floor
  if (floor) {
    filter.floor = Number(floor);
  }

  // Filter by price range
  if (priceMin || priceMax) {
    filter.hourlyPrice = {};
    if (priceMin) filter.hourlyPrice.$gte = Number(priceMin);
    if (priceMax) filter.hourlyPrice.$lte = Number(priceMax);
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .populate("owner", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Room.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    rooms,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// ─── Get Room By ID ──────────────────────────────────────────────────────────

const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("owner", "-password");

  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  res.status(200).json({
    success: true,
    room,
  });
});

// ─── Create Room ─────────────────────────────────────────────────────────────

const createRoom = asyncHandler(async (req, res) => {
  const { name, description, image, floor, capacity, hourlyPrice, amenities } =
    req.body;

  const room = await Room.create({
    name,
    description,
    image,
    floor,
    capacity,
    hourlyPrice,
    amenities: amenities || [],
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    room,
  });
});

// ─── Update Room ─────────────────────────────────────────────────────────────

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  // Check ownership
  if (room.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this room.");
  }

  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    room: updatedRoom,
  });
});

// ─── Delete Room ─────────────────────────────────────────────────────────────

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  // Check ownership
  if (room.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this room.");
  }

  await Room.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
