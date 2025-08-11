const db = require("../db/query");

async function getAllPublishedArticlesController(req, res) {
  const allArticles = await db.getAllPublishedArticles();

  return res.json({
    success: true,
    message: "got all the articles",
    allArticles,
  });
}

async function getOneArticle(req, res) {
  const { articleSerialId } = req.body;

  try {
    const article = await db.getOneArticle(articleSerialId);

    return res.json({ success: true, message: "created a comment", article });
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  getAllPublishedArticlesController,
  getOneArticle,
};
