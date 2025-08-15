const db = require("../db/query");

async function createCommentPost(req, res) {
  const { articleSerialId, userId, comment } = req.body;

  await db.createComment(articleSerialId, userId, comment);

  return res.json({ success: true, message: "comment created" });
}

module.exports = { createCommentPost };
