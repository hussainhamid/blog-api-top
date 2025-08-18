const db = require("../db/query");

async function publishArticle(req, res) {}

async function unPublishArticle(req, res) {}

async function deleteArticle(req, res) {
  const articleSerialId = req.body;

  await db.deleteArticle(articleSerialId);

  return res.json({ success: true, message: "article Deleted" });
}

module.exports = {
  deleteArticle,
};
