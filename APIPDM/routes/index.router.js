const express = require("express");
const router = express.Router();

const postRouter = require("./post.router");
const authRouter = require("./auth.router");
const commentRouter = require("./comment.router");

//api/....
router.use("/auth", authRouter);
router.use("/post", postRouter); 
router.use("/comment", commentRouter);


module.exports = router;