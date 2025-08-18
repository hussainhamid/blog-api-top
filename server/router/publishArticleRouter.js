const express = require("express");

const publishArticleRouter = express();

const {
  publishArticleController,
} = require("../controller/manageArticleController");

publishArticleRouter.put("/:articleSerialId", publishArticleController);

module.exports = {
  publishArticleRouter,
};
