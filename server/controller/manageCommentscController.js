const db = require("../db/query");

async function deleteCommentController(req, res) {
  const { commentSerialId } = req.params;

  await db.deleteUserComment(commentSerialId);

  return res.json({ success: true, message: "comment deleted" });
}

module.exports = {
  deleteCommentController,
};
