import * as userRepository from "../repositories/userRepository.js";
import * as userHash from "../utils/hash.js";
import * as userToken from "../utils/jwt.js";
import * as tokenService from "../services/tokenService.js";
import * as tokenRepository from "../repositories/tokenRepository.js";
import * as tokenUtils from "../utils/token.js";
import * as emailService from "../services/emailServices.js";
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
  const verificationToken = await tokenService.createEmailVerificationToken(
    createdUser.id,
  );
  try {
    await emailService.sendVerificationEmail(createdUser, verificationToken);
  } catch (err) {
    await userRepository.deleteUser(createdUser.id);

    throw new AppError("Cannot send mail", 500);
  }

  return {
    id: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    createdAt: createdUser.createdAt,
    verificationToken,
  };
}

async function fetchUser(email, password) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid Email or Password", 401);
  }
  const isValid = await userHash.comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid Email or Password", 401);
  }
  const accessToken = userToken.generateAccessToken(user);
  const refreshToken = userToken.generateRefreshToken(user);
  await storeSession(refreshToken, user.id);
  if (!user.isVerified) {
    throw new AppError("Please verify your email", 403);
  }
  return {
    id: user.id,
    email: user.email,
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
    isVerified: user.isVerified,
  };
}
async function refreshAccessToken(refreshToken) {
  const userDecodedPayload = userToken.verfiyRefreshToken(refreshToken);
  const storedToken = await getRefreshToken(userDecodedPayload.id);
  if (refreshToken !== storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }
  const newAccessToken = userToken.generateAccessToken(userDecodedPayload);
  const newRefreshToken = userToken.generateRefreshToken(userDecodedPayload);
  await storeSession(newRefreshToken, userDecodedPayload.id);
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

async function logout(refreshToken) {
  const userDecodedPayload = userToken.verfiyRefreshToken(refreshToken);
  await deleteRefreshToken(userDecodedPayload.id);
  return {
    ...userDecodedPayload,
  };
}

async function verifyEmail(token, id) {
  const result = await tokenService.verifyEmailVerificationToken(id, token);
  if (!result) {
    throw new AppError("Session Expired", 403);
  }
  const hashToken = tokenUtils.hashEmailVerificationToken(token);
  await tokenRepository.deleteEmailVerificationToken(hashToken);
  return await userRepository.updateEmailVerification(id);
}
export { registerUser, fetchUser, refreshAccessToken, logout, verifyEmail };
