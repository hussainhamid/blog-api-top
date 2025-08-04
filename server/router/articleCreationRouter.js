const express = require("express");

const articleRouter = express();

const { articleFormPost } = require("../controller/articleCreationController");

articleRouter.post("/", articleFormPost);

module.exports = {
  articleRouter,
};
