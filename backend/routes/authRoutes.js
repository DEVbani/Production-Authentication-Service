import express from "express";
import { registerValidator } from "../validators/authValidator.js";
import { validate } from "../middlewares/authValidation.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);

export default router;
