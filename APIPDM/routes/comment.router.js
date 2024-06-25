const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const validateComment = require("../validators/comment.validator");
const { authentication } = require("../middleware/auth.middleware");

router.post('/', authentication, validateComment, commentController.createComment);
router.get('/:tourId', commentController.getCommentsByTour);

module.exports = router;
