const express = require("express");

const articleRouter = express();

const { articleFormGet } = require("../controller/articleCreationController");

articleRouter.get("/", articleFormGet);

module.exports = {
  articleRouter,
};
