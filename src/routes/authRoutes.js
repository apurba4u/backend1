const { Router } = require("express");
const { register, login, logout, getMe } = require("../controllers/authController");
const { googleAuth } = require("../controllers/googleAuthController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validations/authValidation");

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/google", googleAuth);

module.exports = router;
