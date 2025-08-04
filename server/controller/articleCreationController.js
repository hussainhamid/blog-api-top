const db = require("../db/query");

async function articleFormPost(req, res) {
  const { title, content, username } = req.body;

  await db.createArticle(title, content, username);

  res.json({ success: true, message: "article created in db" });
}

module.exports = {
  articleFormPost,
};
