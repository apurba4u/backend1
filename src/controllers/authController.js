const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sanitizeUser = require("../utils/sanitize");

/**
 * Generate a signed JWT for the given user id.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Cookie options shared across login and register.
 */
const isHttps = (process.env.BETTER_AUTH_URL || "").startsWith("https://");

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: isHttps ? "none" : "lax",
  secure: isHttps,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// ─── Register ────────────────────────────────────────────────────────────────

const register = asyncHandler(async (req, res) => {
  const { name, email, password, photoURL } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "An account with this email already exists.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    photoURL,
  });

  // Generate token and set cookie
  const token = generateToken(user._id);

  res.status(201).cookie("token", token, getCookieOptions()).json({
    success: true,
    message: "Registration successful",
    user: sanitizeUser(user),
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include password for comparison)
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Generate token and set cookie
  const token = generateToken(user._id);

  res.status(200).cookie("token", token, getCookieOptions()).json({
    success: true,
    message: "Login successful",
    user: sanitizeUser(user),
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────────

const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("token", getCookieOptions())
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// ─── Get Current User ────────────────────────────────────────────────────────

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
