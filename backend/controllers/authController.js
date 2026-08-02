import AppError from "../errors/AppError.js";
import * as authService from "../services/authService.js";
async function register(req, res) {
  const data = req.body;

  const user = await authService.registerUser(data);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
}
async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.fetchUser(email, password);
  //set cookie
  console.log(result.tokens.refreshToken);
  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    id: result.id,
    email: result.email,
    accessToken: result.tokens.accessToken,
  });
}
async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Authentication required", 401);
  }
  const session = await authService.refreshAccessToken(refreshToken);
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    accessToken: session.accessToken,
  });
}

async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Authentication required", 401);
  }
  const user = await authService.logout(refreshToken);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    user,
  });
}
export { register, login, refresh, logout };
