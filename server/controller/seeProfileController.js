const db = require("../db/query");

async function seeProfileController(req, res) {
  const { username } = req.body;

  const userInfo = await db.getUserInfo(username);

  return res.json({ success: true, message: "got user info", userInfo });
}

module.exports = {
  seeProfileController,
};
