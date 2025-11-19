const { body, validationResult } = require("express-validator");

const categoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    // if validation fails, send 400 and error details
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = categoryValidation;
