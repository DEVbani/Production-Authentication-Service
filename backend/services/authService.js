import * as userRepository from "../repositories/userRepository.js";
import * as userHash from "../utils/hash.js";
import * as userToken from "../utils/jwt.js";
import {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "../repositories/redisRepository.js";
import AppError from "../errors/AppError.js";
import { storeSession } from "./sessionService.js";

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
  const accessToken = userToken.generateAccessToken(user);
  const refreshToken = userToken.generateRefreshToken(user);
  //store refresh token in redis
  await storeSession(refreshToken, user.id);
  return {
    id: user.id,
    email: user.email,
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
}
async function refreshAccessToken(refreshToken) {
  //1. check if the given token is a real jwt token or not.
  const userDecodedPayload = userToken.verfiyRefreshToken(refreshToken);
  //2. once it checked it is a jwt token then
  //3. the rt that is stored in redis is matched with this token
  const storedToken = await getRefreshToken(userDecodedPayload.id);
  if (refreshToken !== storedToken) {
    throw new AppError("Authentication required", 401);
  }
  //4. once this is also matched then generate new access token
  const newAccessToken = userToken.generateAccessToken(userDecodedPayload);
  //5. genereate new refresh token also:
  const newRefreshToken = userToken.generateRefreshToken(userDecodedPayload);
  //6.store the newRefresh token in redis
  await storeSession(newRefreshToken,userDecodedPayload.id);
  //7. return this new access token
  return {
    accessToken: newAccessToken,
    refreshToken:newRefreshToken,
  };
}

async function logout(refreshToken) {
  //1. verify the jwt token
  const userDecodedPayload = userToken.verfiyRefreshToken(refreshToken);
  //2. from the decoded payload , get the user id
  //3. delete the refresh:userId from redis
  await deleteRefreshToken(userDecodedPayload.id);
  //4. return success
  return {
    ...userDecodedPayload,
  };
}
export { registerUser, fetchUser, refreshAccessToken, logout };
