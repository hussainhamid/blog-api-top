const express = require("express");

const deleteUserCommentRouter = express();

const {
  deleteCommentController,
} = require("../controller/manageCommentscController");

deleteUserCommentRouter.delete("/:commentSerialId", deleteCommentController);

module.exports = {
  deleteUserCommentRouter,
};
