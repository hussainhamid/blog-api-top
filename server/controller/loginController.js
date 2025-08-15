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

  jwt.sign({ user: { id: user.id } }, process.env.SECRETKEY, (err, token) => {
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

async function loginPut(req, res) {
  const { username, password, writer } = req.body;

  let user = await db.getUser(username);

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json({ success: false, message: "incorrect password" });
  }

  if (writer && user.status !== "writer") {
    user = await db.updateUser(username, writer);
  }

  jwt.sign({ user: { id: user.id } }, process.env.SECRETKEY, (err, token) => {
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

module.exports = { loginPost, loginPut };
