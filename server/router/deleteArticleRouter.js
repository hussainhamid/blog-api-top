const express = require("express");

const deleteArticleRouter = express();

const { deleteArticle } = require("../controller/manageArticleController");

deleteArticleRouter.delete("/", deleteArticle);

module.exports = {
  deleteArticleRouter,
};
