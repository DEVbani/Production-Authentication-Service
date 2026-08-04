import crypto, { hash } from "crypto";
import * as tokenRepository from "../repositories/tokenRepository.js";
import * as tokenUtils from "../utils/token.js";

async function createEmailVerificationToken(userId) {
  const rawToken = tokenUtils.generateEmailVerificationToken();
  const hashToken = tokenUtils.hashEmailVerificationToken(rawToken);
  await tokenRepository.storeEmailVerificationToken({
    userId: userId,
    hashToken,
    type: "Email-Verification",
  });
  return rawToken;
}
async function verifyEmailVerificationToken(userId, rawToken) {
  const receivedTokenHash = tokenUtils.hashEmailVerificationToken(rawToken);

  const storedUserId = await tokenRepository.getStoredUserId(receivedTokenHash);

  return storedUserId === userId;
}

async function getSavedUserId(rawToken) {
  const hashToken = tokenUtils.hashEmailVerificationToken(rawToken);
  return await tokenRepository.getStoredUserId(hashToken);
}

export {
  createEmailVerificationToken,
  verifyEmailVerificationToken,
  getSavedUserId,
};
