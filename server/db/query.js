const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getComment(userId) {
  return await prisma.comments.findFirst({
    where: {
      userId: userId,
    },
    select: {
      comment: true,
      userId: true,
    },
  });
}

async function getUser(username) {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
}

async function createUser(userName, password, writer) {
  return await prisma.user.create({
    data: {
      username: userName,
      password: password,
      status: writer ? "writer" : "reader",
    },
  });
}

async function updateUser(username, writer) {
  return await prisma.user.update({
    data: {
      status: writer ? "writer" : "reader",
    },
    where: {
      username: username,
    },
  });
}

async function createArticle(title, content, username) {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    include: {
      articles: true,
    },
  });

  if (!user) throw new Error("user not found");

  await prisma.articles.create({
    data: {
      title: title,
      content: content,
      userId: user.id,
    },
  });
}

async function becomeWriter(username) {
  await prisma.user.update({
    data: {
      status: "writer",
    },
    where: {
      username: username,
    },
  });
}

async function getAllArticles() {
  return await prisma.articles.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

module.exports = {
  getComment,
  getUser,
  createUser,
  updateUser,
  createArticle,
  becomeWriter,
  getAllArticles,
};
