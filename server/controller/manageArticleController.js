const db = require("../db/query");

async function publishArticleController(req, res) {
  const { articleSerialId } = req.params;

  try {
    await db.publishArticle(articleSerialId);

    return res.json({ success: true, message: "article published" });
  } catch (error) {
    console.error(
      "error in publishArticleController in manageArticleController.js",
      err
    );
  }
}

async function unPublishArticleController(req, res) {
  const { articleSerialId } = req.params;

  try {
    await db.unPublishArticle(articleSerialId);

    return res.json({ success: true, message: "article unPublished" });
  } catch (err) {
    console.error(
      "error in unPublishArticleController in manageArticle.js",
      err
    );
  }
}

async function deleteArticleController(req, res) {
  const { articleSerialId } = req.params;

  try {
    await db.deleteArticle(articleSerialId);

    return res.json({ success: true, message: "article Deleted" });
  } catch (err) {
    console.error("error in deleteArticleController", err);
  }
}

module.exports = {
  publishArticleController,
  unPublishArticleController,
  deleteArticleController,
};
