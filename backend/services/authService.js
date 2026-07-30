import * as userRepository from "../repositories/userRepository.js";
import * as userHash from "../utils/hash.js";
import AppError from "../errors/AppError.js";

async function registerUser(data) {
  const user = await userRepository.findUserByEmail(data.email);
  if (user) {
    throw new AppError("User already exists",409);
  }
  const hashedPassword = await userHash.hashPassword(data.password);

  const createdUser = await userRepository.createUser({
    email: data.email,
    passwordHash: hashedPassword,
  });

  return {
    id: createdUser.id,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
  };
}

export { registerUser };
