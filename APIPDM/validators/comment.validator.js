const { body, validationResult } = require("express-validator");

const validateComment = [
  body("tourId").notEmpty().withMessage("Tour ID is required"),
  body("content").notEmpty().withMessage("Content is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateComment;
