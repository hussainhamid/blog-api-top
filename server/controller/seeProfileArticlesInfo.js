const db = require("../db/query");

async function seeProfileArticlesController(req, res) {
  const { username } = req.params;

  const allPublishedArticles = await db.getAllUserPublishedArticles(username);

  const allUnpublishedArticles = await db.getAllUserUnPublishedArticles(
    username
  );

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
