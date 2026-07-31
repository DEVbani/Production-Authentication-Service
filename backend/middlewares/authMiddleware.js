import AppError from "../errors/AppError.js";
import * as userToken from "../utils/jwt.js";
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError("Authentication Needed!", 401);
  }

  const token = authHeader.split(" ")[1];

  req.user = userToken.verifyAccessToken(token);

  next();
}
