import express from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/authValidation.js";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
import { persmission } from "../permission.js";
const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", authController.login);
router.get(
  "/profile",
  authMiddleware,
  authorize(persmission.VIEW_PROFILE),
  (req, res, next) => {
    return res.json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      signedUp: req.user.createdAt.toLocaleDateString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    });
  },
);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/verify/:token", authController.verify);
export default router;
