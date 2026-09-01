import express from "express";

import {
  getNotifications,
  markAsRead,
  getUnreadCount,
  getSingleNotification,
} from "../controllers/notification.controller.js";

import { auth } from "../middleware/authMiddleware.js";

const notificationRouter = express.Router();

// 🔔 GET ALL
notificationRouter.get("/", auth, getNotifications);

// 🔢 UNREAD COUNT
notificationRouter.get(
  "/unreadCount",
  auth,
  getUnreadCount
);

// GET SINGLE
notificationRouter.get(
  "/:id",
  auth,
  getSingleNotification
);

// ✅ MARK ONE AS READ
notificationRouter.post(
  "/read/:id",
  auth,
  markAsRead
);

export default notificationRouter;