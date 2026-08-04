import AppError from "../errors/AppError.js";
import crypto from "crypto";
import { redisClient } from "../config/redis.js";
import { AuthConfig } from "../config/authConfig.js";
async function storeEmailVerificationToken(data) {
  try {
    return await redisClient.set(
      `verify-email:${data.hashToken}`,
      data.userId,
      {
        EX: AuthConfig.verificationTokenTTL,
      },
    );
  } catch {
    throw new AppError("Server error", 500);
  }
}
async function getStoredUserId(tokenHash) {
  try {
    return await redisClient.get(`verify-email:${tokenHash}`);
  } catch {
    throw new AppError("Key not found", 404);
  }
}
async function deleteEmailVerificationToken(id) {
  try {
    return await redisClient.del(`verify-email:${id}`);
  } catch {
    throw new AppError("Key not found", 404);
  }
}
export {
  storeEmailVerificationToken,
  getStoredUserId,
  deleteEmailVerificationToken,
};
