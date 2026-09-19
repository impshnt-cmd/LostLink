
import express from "express";

import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getMyNotifications
);

router.get(
  "/unread-count",
  authMiddleware,
  getUnreadCount
);

router.put(
  "/read-all",
  authMiddleware,
  markAllAsRead
);

router.put(
  "/:id/read",
  authMiddleware,
  markAsRead
);

export default router;
