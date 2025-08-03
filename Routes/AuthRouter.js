import express from "express";
import {
  signup,
  login,
  deleteUser,
  getUser,
  getSingleUser,
  updateUser,
  updateProfile,
  changePassword,
  adminLogin,
} from "../Controllers/AuthController.js";
import {
  signupValidation,
  loginValidation,
} from "../Middlewares/AuthValidation.js";
// import ensureAuthenticated from "../Middlewares/Auth.js";
import adminAuth from "../Middlewares/adminAuth.js";

const AuthRouter = express.Router();

// Health check or placeholder
AuthRouter.get("/health", (req, res) => {
  res.send("I am alive and kicking!");
});

// Auth routes
AuthRouter.post("/signup", signupValidation, signup);
AuthRouter.post("/login", loginValidation, login);
AuthRouter.post("/admin-login", adminLogin);

// CURD Operations
AuthRouter.get("/users", adminAuth, getUser);
AuthRouter.get("/users/:id", adminAuth, getSingleUser);
AuthRouter.put("/users/:id", adminAuth, updateUser);
AuthRouter.delete("/users/:id", adminAuth, deleteUser);
AuthRouter.put("/users/update-profile/:id", adminAuth, updateProfile);
AuthRouter.put("/users/change-password/:id", adminAuth, changePassword);

export default AuthRouter;
