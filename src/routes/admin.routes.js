import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { auth } from "../middleware/authMiddleware.js";

const adminRouter = Router();

adminRouter.get('/getAllUsers', auth, adminController.getAllUser);
adminRouter.delete('/deleteUser/:id', auth, adminController.deleteUser);
adminRouter.post('/updateUser/:id', auth, adminController.updateUser);

adminRouter.get('/getAllWithdrawals',
  auth,
  adminController.getAllWithdrawals);
adminRouter.post('/withdrawalApproval/:id',
  auth,
  adminController.withdrawalApproval);

adminRouter.post('/addAffilliateProducts',
  auth,
  adminController.addAffilliateProducts);

// Order
adminRouter.get('/getAllOrders',
  auth,
  adminController.getAllOrders);

adminRouter.post('/releaseAffiliateCommission/:id',
  auth,
  adminController.releaseAffiliateCommission);

adminRouter.delete('/deleteOrder/:id',
  auth,
  adminController.deleteOrder);



export default adminRouter