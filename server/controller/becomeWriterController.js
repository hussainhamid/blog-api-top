const db = require("../db/query");

async function becomeWriterController(req, res) {
  const { username } = req.body;

  await db.becomeWriter(username);

  res.json({ success: true, message: "user became a writer" });
}

module.exports = {
  becomeWriterController,
};
