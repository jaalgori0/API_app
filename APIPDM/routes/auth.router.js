const express = require("express");
const router = express.Router(); //Objeto para configurar ruta

const authController = require("../controllers/auth.controller");
const runValidation = require("../validators/index.middleware");
const { registerValidator } = require("../validators/auth.validator");
const { authentication } = require("../middlewares/auth.middlewares");
const { UpdatedValidator } = require("../validators/auth.validator");

router.post("/register",
  registerValidator,
  runValidation,
  authController.register
);


router.get("/login", authController.login);

router.get("/whoami", authentication, authController.whoami);

router.put("/update", authentication, UpdatedValidator, authController.updateUser);

module.exports = router;