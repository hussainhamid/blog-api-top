const db = require("../db/query");

async function seeProfileCommentsController(req, res) {
  const { username } = req.params;

  const comments = await db.getAllUserComments(username);

  return res.json({
    success: true,
    message: "got all comments",
    allComments: comments,
  });
}

module.exports = {
  seeProfileCommentsController,
};
