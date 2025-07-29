const db = require("../db/query");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

async function loginPost(req, res) {
  const { username, password } = req.body;

  let user = await db.getUser(username);

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json({ success: false, message: "incorrect password" });
  }

  jwt.sign({ user: user }, process.env.SECRETKEY, (err, token) => {
    if (err) {
      return res.json({ success: false, message: "token error" });
    }

    res.json({
      token,
      success: true,
      user,
    });
  });
}

module.exports = { loginPost };
