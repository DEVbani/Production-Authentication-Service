import AppError from "../errors/AppError.js";
import * as authService from "../services/authService.js";
import * as tokenService from "../services/tokenService.js";
import { AuthConfig } from "../config/authConfig.js";
async function register(req, res) {
  const data = req.body;

  const user = await authService.registerUser(data);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    },
  });
}
async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.fetchUser(email, password);
  //set cookie
  res.cookie("refreshToken", result.tokens.refreshToken, AuthConfig.cookie);
  return res.status(200).json({
    success: true,
    message: "Logged in",
    data: {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      accessTk: result.tokens.accessToken,
    },
  });
}
async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }
  const session = await authService.refreshAccessToken(refreshToken);
  res.cookie("refreshToken", session.refreshToken, AuthConfig.cookie);
  return res.status(200).json({
    success: true,
    message: "Refreshed successfully",
    data: {
      accessTk: session.accessToken,
    },
  });
}

async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }
  const user = await authService.logout(refreshToken);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "Log out successfully",
    data: {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    },
  });
}
async function verify(req, res) {
  const token = req.params.token;
  const userId = await tokenService.getSavedUserId(token);
  if (userId === null) {
    return res.status(200).json({
      success: true,
      message: "Email already verified",
    });
  }
  const result = await authService.verifyEmail(token, userId);
  return res.status(200).json({
    success: true,
    message:"Verification completed",
    data:{
      ...result,
    }
  });
}
export { register, login, refresh, logout, verify };
