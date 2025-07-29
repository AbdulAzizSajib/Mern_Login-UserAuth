import express from "express";
import { signup, login } from "../Controllers/AuthController.js";
import {
  signupValidation,
  loginValidation,
} from "../Middlewares/AuthValidation.js";

const AuthRouter = express.Router();

// Health check or placeholder
AuthRouter.get("/health", (req, res) => {
  res.send("I am alive and kicking!");
});

// Auth routes
AuthRouter.post("/signup", signupValidation, signup);
AuthRouter.post("/login", loginValidation, login);

export default AuthRouter;
