
import Notification from "../models/Notification.js";

// ======================================
// GET MY NOTIFICATIONS
// ======================================
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .populate("relatedItem", "title type image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
};

// ======================================
// GET UNREAD COUNT
// ======================================
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "Get unread count error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load unread count",
    });
  }
};

// ======================================
// MARK ONE NOTIFICATION AS READ
// ======================================
export const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

// ======================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications read error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};

