const express = require("express");

const seeProfileArticleRouter = express();

const {
  seeProfileArticlesController,
} = require("../controller/seeProfileArticlesInfo");

seeProfileArticleRouter.get("/:username", seeProfileArticlesController);

module.exports = {
  seeProfileArticleRouter,
};
