const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const db = require("./db/query");

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.post("/log-in", async (req, res) => {
  const { userName, password } = req.query;

  await db.createUser(userName, password);

  const user = await prisma.user.findFirst({
    where: {
      username: userName,
    },
  });

  jwt.sign({ user: user }, "secretkey", (err, token) => {
    res.json({
      token,
    });
  });
});

app.post("/comment", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
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

app.listen("3000", () => {
  console.log("server running on port 3000");
});
