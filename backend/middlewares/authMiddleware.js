import AppError from "../errors/AppError.js";
import * as userToken from "../utils/jwt.js";
import * as userRepo from "../repositories/userRepository.js";
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError("Authentication Needed!", 401);
  }

  const token = authHeader.split(" ")[1];

  const userDecodedPayload = userToken.verifyAccessToken(token);

  const userId = userDecodedPayload.id;

  const user = await userRepo.findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  req.user = user;

  next();
}
