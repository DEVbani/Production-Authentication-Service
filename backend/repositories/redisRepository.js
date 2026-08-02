import { redisClient } from "../config/redis.js";
import AppError from "../errors/AppError.js";
export async function storeRefreshToken(token, userId) {
  try {
    return await redisClient.set(`refresh:${userId}`, token, {
      EX: 7 * 24 * 60 * 60,
    });
  } catch {
    throw new AppError("Server error", 500);
  }
}
export async function getRefreshToken(userId) {
  try {
    return await redisClient.get(`refresh:${userId}`);
  } catch {
    throw new AppError("Key not found", 404);
  }
}

export async function deleteRefreshToken(userId) {
  try {
    return await redisClient.del(`refresh:${userId}`);
  } catch {
    throw new AppError("Key not found", 404);
  }
}
