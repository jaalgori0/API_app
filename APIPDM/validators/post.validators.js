
const validators = () => { };

const { body, param } = require("express-validator");

validators.createTourValidator = [
    param("identifier")
        .optional()
        .notEmpty()
        .withMessage("Identifier is required")
        .isMongoId()
        .withMessage("Identifier must be a Mongo ID"),
    body("title").notEmpty().withMessage("Title is required"),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 280 })
        .withMessage("Description maximum length is 280 characters"),
    body("image")
        .notEmpty()
        .withMessage("Image is required")
        .isURL()
        .withMessage("Image must be a base an URL"),
    body("duration").notEmpty().withMessage("Duration state is required"),
    body("price").notEmpty().withMessage("Price is required").isNumeric().withMessage("Price must be a number"),
    body("whaLink")
    .notEmpty()
    .isURL()
    .withMessage("whaLink is required"),
    body("mapLink")
        .notEmpty()
        .isURL()
        .withMessage("mapLink is required"),
];


validators.idInParamsValidator = [
    param("identifier")
        .notEmpty()
        .withMessage("Identifier is required")
        // .isMongoId()
        // .withMessage("Identifier must be a Mongo ID"),
];

validators.saveCommentValidator = [
    body("content")
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 280 })
      .withMessage("Content max lenght is 280 characters"),
    body("_id")
      .optional()
      .notEmpty()
      .withMessage("_id is required")
      .isMongoId()
      .withMessage("Identifier must be a Mongo ID"),
  ];


module.exports = validators;