const { Router } = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createBookingSchema } = require("../validations/bookingValidation");

const router = Router();

router.post("/", protect, validate(createBookingSchema), createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
