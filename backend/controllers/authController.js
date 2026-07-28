import * as authService from "../services/authService.js";
async function register(req, res) {
  try {
    const data = req.body;

    const user = await authService.registerUser(data);

    return res.status(201).json({
      message: "201 created",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}
export { register };
