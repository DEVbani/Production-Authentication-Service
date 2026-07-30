import * as authService from "../services/authService.js";
async function register(req, res) {
  const data = req.body;

  const user = await authService.registerUser(data);

  return res.status(201).json({
    message: "201 created",
    user,
  });
}
export { register };
