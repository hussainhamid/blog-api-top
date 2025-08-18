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

async function saveArticle(title, content, username) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      articles: true,
    },
  });

  if (!user) throw new Error("user not found while saving article");

  await prisma.articles.create({
    data: {
      title,
      content,
      userId: user.id,
      status: "notPublished",
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

async function getAllPublishedArticles() {
  return await prisma.articles.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

async function getAllUnPublishedArticles() {
  return await prisma.articles.findMany({
    where: {
      status: "notPublished",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

async function getOneArticle(articleSerialId) {
  return await prisma.articles.findUnique({
    where: {
      articleSerialId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

async function createComment(articleSerialId, userId, comment) {
  const article = await prisma.articles.findUnique({
    where: {
      articleSerialId,
    },
  });

  if (!article) throw new Error("article not found while creating a comment");

  await prisma.comments.create({
    data: {
      comment: comment,
      userId: userId,
      articleId: articleSerialId,
    },

    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

async function getUserInfo(username) {
  return await prisma.user.findFirst({
    where: {
      username,
    },

    include: {
      articles: true,
      Comments: true,

      _count: {
        select: {
          articles: true,
          Comments: true,
        },
      },
    },
  });
}

async function deleteArticle(articleSerialId) {
  await prisma.articles.delete({
    where: {
      articleSerialId: articleSerialId,
    },
  });
}

module.exports = {
  getComment,
  getUser,
  createUser,
  updateUser,
  createArticle,
  saveArticle,
  becomeWriter,
  getAllPublishedArticles,
  getOneArticle,
  createComment,
  getUserInfo,
  getAllUnPublishedArticles,
  deleteArticle,
};
