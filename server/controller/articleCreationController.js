const db = require("../db/query");

async function articleFormPost(req, res) {
  const { title, content, username } = req.body;

  await db.createArticle(title, content, username);

  res.json({ success: true, message: "Article published" });
}

async function articleSavePost(req, res) {
  const { title, content, username } = req.body;

  await db.saveArticle(title, content, username);

  res.json({ success: true, message: "Article saved" });
}

module.exports = {
  articleFormPost,
  articleSavePost,
};
