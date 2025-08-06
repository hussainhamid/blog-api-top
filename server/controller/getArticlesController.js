const db = require("../db/query");

async function getAllArticlesController(req, res) {
  const allArticles = await db.getAllArticles();

  return res.json({
    success: true,
    message: "got all the articles",
    allArticles,
  });
}

module.exports = {
  getAllArticlesController,
};
