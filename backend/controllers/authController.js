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
export { register, login };
