const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("./config/passport");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const db = require("./db/query");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { loginRouter } = require("./router/loginRouter");
const { signupRouter } = require("./router/signupROuter");
const { logoutRouter } = require("./router/logoutRouter");
const { articleRouter } = require("./router/articleCreationRouter");
const { becomeWriterRouter } = require("./router/becomeWriterRouter");

const passport = require("passport");

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: `hello ${req.user.username}, you are autharized` });
  }
);

app.post("/comment", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRETKEY, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "comment created",
        authData,
      });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

app.use("/log-in", loginRouter);
app.use("/sign-up", signupRouter);
app.use("/log-out", logoutRouter);
app.use("/article", articleRouter);
app.use("/become-writer", becomeWriterRouter);

app.get("/me", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.SECRETKEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: authData.user.id },
      });

      if (!user) {
        return res
          .sendStatus(404)
          .json({ success: false, message: "user not found" });
      }

      res.json({
        success: true,
        user,
      });
    } catch (err) {
      console.error("error in /me in app.js", err);
      res.sendStatus(500).json({ success: false, message: "server error" });
    }
  });
});

app.listen("3000", () => {
  console.log("server running on port 3000");
});
