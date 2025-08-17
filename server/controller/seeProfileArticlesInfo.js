const db = require("../db/query");

async function seeProfileArticlesController(req, res) {
  const allPublishedArticles = await db.getAllPublishedArticles();

  const allUnpublishedArticles = await db.getAllUnPublishedArticles();

  return res.json({
    publishedArticles: allPublishedArticles,
    unpublishedArticles: allUnpublishedArticles,
    success: true,
    message: "gotArticleInfo",
  });
}

module.exports = {
  seeProfileArticlesController,
};
