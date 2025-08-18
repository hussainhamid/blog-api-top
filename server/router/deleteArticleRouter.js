const express = require("express");

const deleteArticleRouter = express();

const {
  deleteArticleController,
} = require("../controller/manageArticleController");

deleteArticleRouter.delete("/:articleSerialId", deleteArticleController);

module.exports = {
  deleteArticleRouter,
};
