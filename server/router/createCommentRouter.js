const express = require("express");

const createCommentRouter = express();
const { createCommentPost } = require("../controller/createCommentController");

createCommentRouter.post("/", createCommentPost);

module.exports = {
  createCommentRouter,
};
