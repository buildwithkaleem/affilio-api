import { Router } from "express";
import * as authController from "../controllers/admin.controller.js";
import { auth } from "../middleware/authMiddleware.js";

const adminRouter = Router();

adminRouter.get('/getAllUsers',auth,authController.getAllUser);
adminRouter.delete('/deleteUser/:id', auth, authController.deleteUser);
adminRouter.post('/updateUser/:id', auth, authController.updateUser);

adminRouter.get('/getAllWithdrawals', 
  auth, 
  authController.getAllWithdrawals);
adminRouter.post('/withdrawalApproval/:id', 
  auth, 
  authController.withdrawalApproval);

adminRouter.post('/addAffilliateProducts', 
  auth, 
  authController.addAffilliateProducts);

export default adminRouter