const express = require("express");

const becomeWriterRouter = express();
const {
  becomeWriterController,
} = require("../controller/becomeWriterController");

becomeWriterRouter.put("/", becomeWriterController);

module.exports = {
  becomeWriterRouter,
};
