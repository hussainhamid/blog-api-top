const express = require("express");
const logoutRouter = express();

const { logOut } = require("../controller/logOutController");

logoutRouter.get("/", logOut);

module.exports = {
  logoutRouter,
};
