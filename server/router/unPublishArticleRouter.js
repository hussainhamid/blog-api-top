const express = require("express");

const unPublishArticleRouter = express();

const {
  unPublishArticleController,
} = require("../controller/manageArticleController");

unPublishArticleRouter.put("/:articleSerialId", unPublishArticleController);

module.exports = {
  unPublishArticleRouter,
};
