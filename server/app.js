const express = require("express");
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const db = require("./db/query");

app.get("/", async (req, res) => {
  //   await db.creatingUserAndComment();
  res.send("hello world");
});

app.get("/get", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      username: "new2",
    },
  });

  const comment = await db.getComment(user.id);

  res.json({ message: "found comments", data: comment });
});

app.listen("3000", () => {
  console.log("server running on port 3000");
});
