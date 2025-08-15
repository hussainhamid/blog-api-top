const express = require("express");

const articleRouter = express();
const articleSaveRouter = express();

const {
  articleFormPost,
  articleSavePost,
} = require("../controller/articleCreationController");

articleRouter.post("/", articleFormPost);
articleSaveRouter.post("/", articleSavePost);

module.exports = {
  articleRouter,
  articleSaveRouter,
};
