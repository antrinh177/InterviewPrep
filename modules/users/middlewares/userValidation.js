const { body, validationResult } = require("express-validator");

const userValidation = [
  body("id").optional().isInt().withMessage("ID must be an integer"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string")
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin or user"),

  (req, res, next) => {
    const errors = validationResult(req);
    // if validation fails, send 400 and error details
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = userValidation;
