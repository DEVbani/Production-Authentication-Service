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
  const tokens = await authService.fetchUser(email, password);

  return res.status(200).json({
    success: true,
    ...tokens,
  });
}
async function refresh(req, res) {
  const { token } = req.body;

  const session = await authService.refreshAccessToken(token);

  return res.status(200).json({
    success: true,
    session,
  });
}

async function logout(req, res) {
  const { token } = req.body;

  const user = await authService.logout(token);

  return res.status(200).json({
    success: true,
    user,
  });
}
export { register, login, refresh, logout };
