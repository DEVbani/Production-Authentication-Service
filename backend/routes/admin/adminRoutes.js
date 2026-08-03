import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/authorizationMiddleware.js";
const router = express.Router();

router.get("/users",authMiddleware,authorize("ADMIN"),(req, res, next) => {
  return res.status(200).json({
    message: "Welcome admin",
  });
});

export default router;