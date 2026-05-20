/**
 * Factory that returns Express middleware to validate req.body against a Zod schema.
 * On failure, responds 400 with structured error details.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  req.body = result.data;
  next();
};

module.exports = validate;
