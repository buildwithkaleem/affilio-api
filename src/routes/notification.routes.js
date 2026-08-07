import express from "express";
import {
  getNotifications,
  markAsRead,
  // markAllAsRead,
  getUnreadCount,
  // getSingleNotification
} from "../controllers/notification.controller.js";
import { auth } from "../middleware/authMiddleware.js";

const notificationRouter = express.Router();

// 🔔 GET ALL
notificationRouter.get("/", auth, getNotifications);

// ✅ MARK ONE
notificationRouter.post("/read/:id", auth, markAsRead);

// 🔢 UNREAD COUNT
notificationRouter.get("/unreadCount", auth, getUnreadCount);


// // GET SINGAL
// router.get("/:id", auth, getSingleNotification);

// // ✅ MARK ALL
// router.put("/read-all", auth, markAllAsRead);

export default notificationRouter;