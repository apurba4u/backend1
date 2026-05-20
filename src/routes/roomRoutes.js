const { Router } = require("express");
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createRoomSchema, updateRoomSchema } = require("../validations/roomValidation");

const router = Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", protect, validate(createRoomSchema), createRoom);
router.put("/:id", protect, validate(updateRoomSchema), updateRoom);
router.delete("/:id", protect, deleteRoom);

module.exports = router;
