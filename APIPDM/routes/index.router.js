const express = require("express");
const router = express.Router();

const postRouter = require("./post.router");
const authRouter = require("./auth.router");

//api/....
router.use("/auth", authRouter);
router.use("/post", postRouter); 


module.exports = router;