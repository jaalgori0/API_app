const express = require("express");
const router = express.Router();

const ROLES = require("../data/roles.constants.json");


const {
  createTourValidator,
  idInParamsValidator,
  saveCommentValidator
} = require("../validators/post.validators");

const {
  authentication, authorization,
} = require("../middlewares/auth.middlewares");


const validateFields = require("../validators/index.middleware");
const TourController = require("../controllers/post.controller");

// Rutas para tour



//eliminar

// Rutas para tour
router.get("/", TourController.findAllTours);
router.get(
  "/own",
  authentication,
  authorization(ROLES.USER),
  TourController.findOwnTour
);

router.get("/:identifier",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  validateFields,
  TourController.finOneTourById
);

router.post(
  ["/", "/:identifier"],
  authentication,
  authorization(ROLES.USER),
  createTourValidator,
  validateFields,
  TourController.saveTour
);
//eliminar
router.delete(
  "/:identifier",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  validateFields,
  TourController.deleteTourByid,
);

router.patch(
  "/comment/:identifier",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  saveCommentValidator,
  validateFields,
  TourController.saveCommentTour
);

router.patch(
  "/save/:identifier",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  validateFields,
  TourController.saveATour
  );

router.patch(
  "/visibility/:identifier",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  validateFields,
  TourController.toggleHiddenTour
);

router.get(
  "/user/:identifier",
  idInParamsValidator,
  validateFields,
  TourController.findByUserTour
);



router.get(
  "/saved",
  authentication,
  authorization(ROLES.USER),
  TourController.findSavedTour
);

module.exports = router;