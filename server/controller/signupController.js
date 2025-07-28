const db = require("../db/query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function signupPost(req, res) {
  const { userName, password } = req.body;

  const existingUser = await db.getUser(userName);

  if (existingUser) {
    return res.json({ success: false, exists: true, message: "user exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.createUser(userName, hashedPassword);

  jwt.sign({ user: user }, process.env.SECRETKEY, (err, token) => {
    if (err) {
      return res.status(500).json({ success: false, message: "token problem" });
    }

    res.json({ token: token, user: user, success: true });
  });
}

module.exports = {
  signupPost,
};
