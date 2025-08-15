const express = require("express");
const signupRouter = express();

const { signupPost } = require("../controller/signupController");

signupRouter.post("/", signupPost);

module.exports = {
  signupRouter,
};
