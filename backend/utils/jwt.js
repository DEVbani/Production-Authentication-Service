import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../errors/AppError.js";
dotenv.config();

function generateAccessToken(user) {
  const payLoad = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payLoad, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    subject: String(user.id),
    audience: "web-app",
    issuer: "auth-service",
  });
}

function generateRefreshToken(user) {
  const payLoad = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    subject: String(user.id),
    audience: "web-app",
    issuer: "auth-service",
  });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: "auth-service",
      audience: "web-app",
    });
  } catch {
    throw new AppError("Authentication required", 401);
  }
}

function verfiyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: "auth-service",
      audience: "web-app",
    });
  } catch {
    throw new AppError("Authentication required", 401);
  }
}

export {
  generateAccessToken,
  generateRefreshToken,
  verfiyRefreshToken,
  verifyAccessToken,
};
