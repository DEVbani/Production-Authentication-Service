import * as userRepository from "../repositories/userRepository.js";
import * as userHash from "../utils/hash.js";
import * as userToken from "../utils/jwt.js";
import AppError from "../errors/AppError.js";

async function registerUser(data) {
  const user = await userRepository.findUserByEmail(data.email);
  if (user) {
    throw new AppError("User already exists", 409);
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

async function fetchUser(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid Email or Password", 401);
  }

  //now compare password
  const isValid = await userHash.comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid Email or Password", 401);
  }
  //now the user is valid
  //generate tokens
  const accessToken = userToken.generateAccessToken(
    user.id,
    user.email,
  );
  const refreshToken = userToken.generateRefreshToken(
    user.id,
    user.email,
  );

  return {
    id: user.id,
    email: user.email,
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
}

export { registerUser, fetchUser };
