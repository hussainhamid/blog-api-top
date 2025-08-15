const {
  getAllPublishedArticlesController,
  getOneArticle,
} = require("../controller/getArticlesController");

const express = require("express");
const getArticlesRouter = express();
const getOneArticleRouter = express();

getArticlesRouter.get("/", getAllPublishedArticlesController);
getOneArticleRouter.post("/:articleSerialId", getOneArticle);

module.exports = {
  getArticlesRouter,
  getOneArticleRouter,
};
