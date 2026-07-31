import express from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/authValidation.js";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, (req, res, next) => {
  return res.json(req.user);
});
export default router;
