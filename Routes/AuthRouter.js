import express from "express";
import {
  signup,
  login,
  deleteUser,
  getUser,
  getSingleUser,
  updateUser,
} from "../Controllers/AuthController.js";
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

// CURD Operations
AuthRouter.get("/users", getUser);
AuthRouter.get("/users/:id", getSingleUser);
AuthRouter.put("/users/:id", updateUser);
AuthRouter.delete("/users/:id", deleteUser);

export default AuthRouter;
