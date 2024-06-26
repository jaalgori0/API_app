const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const validateComment = require("../validators/comment.validator");
const { authentication } = require("../middlewares/auth.middlewares");

router.post("/:idtour", authentication, validateComment, commentController.createComment);

router.get("/:tourId", commentController.getCommentsByTour);

module.exports = router;
