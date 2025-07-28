const express = require("express");
const loginRouter = express();

const { loginPost } = require("../controller/loginController");

loginRouter.post("/", loginPost);

module.exports = {
  loginRouter,
};
