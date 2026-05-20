/**
 * Strips sensitive fields from a user document before sending in a response.
 * Returns a plain object without the password field.
 */
const sanitizeUser = (user) => {
  if (!user) return null;

  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  return sanitized;
};

module.exports = sanitizeUser;
