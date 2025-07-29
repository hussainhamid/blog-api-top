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

async function createUser(userName, password) {
  return await prisma.user.create({
    data: {
      username: userName,
      password: password,
    },
  });
}

module.exports = {
  getComment,
  getUser,
  createUser,
};
