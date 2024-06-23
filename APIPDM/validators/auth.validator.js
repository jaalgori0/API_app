const { body } = require("express-validator");

const validators = {};
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/;

validators.registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("Username format incorrect"),
  body("name")
    .notEmpty()
    .withMessage("Name is required"),
  body("lastname")
    .notEmpty()
    .withMessage("Lastname is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format incorret"),
    body("telephoneNumber")
    .notEmpty()
    .withMessage("telephoneNumber is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(passwordRegexp)
    .withMessage("Password format incorret"),
];

module.exports = validators;
