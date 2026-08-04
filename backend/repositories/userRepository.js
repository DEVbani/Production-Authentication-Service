import { prisma } from "../config/database.js";
async function createUser(data) {
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
async function updateEmailVerification(id) {
  return await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      isVerified: true,
    },
  });
}
async function deleteUser(id) {
  return await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
}
export {
  createUser,
  findUserByEmail,
  findUserById,
  updateEmailVerification,
  deleteUser,
};
