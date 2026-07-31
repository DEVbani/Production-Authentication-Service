import { body } from "express-validator";

export const registerValidator = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Not a valid Email"),

  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters"),

  body("name")
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name field cannot be empty"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .normalizeEmail()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Not a valid email"),
];
