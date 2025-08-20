const express = require("express");

const seeProfileCommentsRouter = express();

const {
  seeProfileCommentsController,
} = require("../controller/seeProfileCommentsController");

seeProfileCommentsRouter.get("/:username", seeProfileCommentsController);

module.exports = {
  seeProfileCommentsRouter,
};
