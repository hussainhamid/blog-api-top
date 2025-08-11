const express = require("express");

const seeProfileRouter = express();

const { seeProfileController } = require("../controller/seeProfileController");

seeProfileRouter.post("/", seeProfileController);

module.exports = {
  seeProfileRouter,
};
