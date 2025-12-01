const { body, validationResult } = require("express-validator");

const updateAccountRules = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("name").optional().isString().withMessage("Name must be a string"),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be 'admin' or 'user'"),

  // middleware to check validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = updateAccountRules;
