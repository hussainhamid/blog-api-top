const db = require("../db/query");

async function articleFormGet(req, res) {
  const success = req.body;

  if (success) {
    res.json({ success: true, message: "article form get working" });
  } else {
    res.json({ success: false, message: "cannot get article form" });
  }
}

async function articleFormPost(req, res) {}

module.exports = {
  articleFormGet,
};
