const { body, validationResult } = require("express-validator");

const verifyLoginRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be a 6 digits number")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),

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

module.exports = verifyLoginRules;
