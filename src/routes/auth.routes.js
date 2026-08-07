import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { auth } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password/:token", authController.resetPassword);
// authRouter.get("/me", auth, authController.findMe);
authRouter.post("/generate-token", authController.generateTokens);
authRouter.post("/logout", auth, authController.logout);
// authRouter.post("/updateUser", auth, authController.userUpdate);

export default authRouter