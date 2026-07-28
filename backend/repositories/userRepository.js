import { prisma } from "../config/database.js";
async function createUser(data) {
    console.log("from repository",data)
  return await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
    },
  });
}
async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}
async function findUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

export { createUser, findUserByEmail, findUserById };
