const jwt = require("jsonwebtoken");
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
const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * Verify Google ID token and extract user info.
 * Uses Google's tokeninfo endpoint for verification.
 */
async function verifyGoogleToken(idToken) {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );

  if (!response.ok) {
    throw new ApiError(400, "Invalid Google token");
  }

  const tokenInfo = await response.json();

  // Verify the token is for our app
  if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(400, "Token was not issued for this application");
  }

  return {
    googleId: tokenInfo.sub,
    email: tokenInfo.email,
    name: tokenInfo.name || tokenInfo.email.split("@")[0],
    avatar: tokenInfo.picture || "",
    emailVerified: tokenInfo.email_verified === "true",
  };
}

/**
 * Handle Google OAuth authentication.
 * Receives ID token, verifies it, finds/creates user, returns JWT.
 */
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  // Verify token and get user info
  const googleUser = await verifyGoogleToken(idToken);

  if (!googleUser.email) {
    throw new ApiError(400, "Could not get email from Google account");
  }

  // Find existing user by email or googleId
  let user = await User.findOne({
    $or: [
      { email: googleUser.email },
      { googleId: googleUser.googleId },
    ],
  });

  if (user) {
    // Update Google ID and avatar if not set
    if (!user.googleId) {
      user.googleId = googleUser.googleId;
    }
    if (!user.avatar && googleUser.avatar) {
      user.avatar = googleUser.avatar;
    }
    await user.save();
  } else {
    // Create new user
    user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.avatar,
      googleId: googleUser.googleId,
      password: jwt.sign({ google: true, date: Date.now() }, process.env.JWT_SECRET), // Random password for Google users
    });
  }

  // Generate JWT and set cookie
  const token = generateToken(user._id);

  res.status(200).cookie("token", token, getCookieOptions()).json({
    success: true,
    message: "Google authentication successful",
    user: sanitizeUser(user),
  });
});

module.exports = {
  googleAuth,
};
