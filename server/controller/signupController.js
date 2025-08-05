const db = require("../db/query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function signupPost(req, res) {
  const { username, password, writer } = req.body;

  const existingUser = await db.getUser(username);

  if (existingUser) {
    return res.json({ success: false, exists: true, message: "user exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.createUser(username, hashedPassword, writer);

  jwt.sign({ user: { id: user.id } }, process.env.SECRETKEY, (err, token) => {
    if (err) {
      return res.status(500).json({ success: false, message: "token problem" });
    }

    res.json({ token: token, user: user, success: true });
  });
}

module.exports = {
  signupPost,
};
