const express = require("express");
const loginRouter = express();

const { loginPost, loginPut } = require("../controller/loginController");

loginRouter.post("/", loginPost);
loginRouter.put("/", loginPut);

module.exports = {
  loginRouter,
};
