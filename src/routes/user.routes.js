import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { auth } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.get("/me", auth, userController.findMe);
userRouter.post("/updateUser", auth, userController.userUpdate);

userRouter.post("/pymentMethodAddEdit", auth, userController.pymentMethodAddEdit);
userRouter.get("/getPaymentMethod", auth, userController.getPaymentMethod);

userRouter.post("/withdrawalReq", auth, userController.withdrawalReq);
userRouter.get("/getUserWithdrawals", auth, userController.getUserWithdrawals);

userRouter.get("/getAllProducts", 
  auth, 
  userController.getAllProducts);

export default userRouter;