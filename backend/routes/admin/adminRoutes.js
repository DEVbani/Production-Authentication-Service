import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/authorizationMiddleware.js";
import { persmission } from "../../permission.js";
import { rolePermission } from "../../rolePermission.js";
const router = express.Router();

router.get(
  "/users",
  authMiddleware,
  authorize(persmission.VIEW_USER),
  (req, res, next) => {
    return res.status(200).json({
      message: "Welcome admin",
    });
  },
);

router.get(
  "/user/:id",
  authMiddleware,
  authorize(persmission.DELETE_USER),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: `User ${req.params.id} deleted .`,
    });
  },
);
export default router;
