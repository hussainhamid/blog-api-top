const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function creatingUserAndComment() {
  const user = await prisma.user.create({
    data: {
      username: "new2",
      password: "new",
    },
  });

  const comment = await prisma.comments.create({
    data: {
      comment: "hello there world!",
      userId: user.id,
    },
  });
}

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

async function createUser(userName, password) {
  await prisma.user.create({
    data: {
      username: userName,
      password: password,
    },
  });
}

module.exports = {
  creatingUserAndComment,
  getComment,
  createUser,
};
