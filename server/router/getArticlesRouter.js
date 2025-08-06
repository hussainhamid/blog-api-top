const {
  getAllArticlesController,
} = require("../controller/getArticlesController");

const express = require("express");
const getArticlesRouter = express();

getArticlesRouter.get("/", getAllArticlesController);

module.exports = {
  getArticlesRouter,
};
