import { notificationModel } from "../models/notification.model.js";
import { responseHandler } from "../utils/responseHandler.js";

// 🔥 GET ALL NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    const notifications = await notificationModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    return responseHandler(
      res,
      200,
      { notifications },
      "Notifications fetched successfully"
    );
  } catch (error) {
    return responseHandler(res, 500, {}, error.message, false);
  }
};


// 🔥 MARK SINGLE AS READ
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await notificationModel.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      {
        isRead: true,
      },
      {
        returnDocument: "after"
      }
    );

    return responseHandler(
      res,
      200,
      { notification },
      "Notification marked as read"
    );
  } catch (error) {
    return responseHandler(res, 500, {}, error.message, false);
  }
};


// 🔥 UNREAD COUNT (FOR BELL 🔔)
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id;

    const count = await notificationModel.countDocuments({
      user: userId,
      isRead: false,
    });

    return responseHandler(
      res,
      200,
      { count },
      "Unread count fetched"
    );
  } catch (error) {
    return responseHandler(res, 500, {}, error.message, false);
  }
};



// export const getSingleNotification = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const notification = await notificationModel
//       .findOne({
//         _id: req.params.id,
//         user: userId, // 🔐 security
//       })
//       .populate("user", "userName email"); // optional

//     if (!notification) {
//       return responseHandler(res, 404, {}, "Notification not found", false);
//     }

//     // 🔥 optional: auto mark as read
//     if (!notification.isRead) {
//       notification.isRead = true;
//       await notification.save();
//     }

//     return responseHandler(res, 200, notification, "Success");

//   } catch (error) {
//     return responseHandler(res, 500, {}, error.message, false);
//   }
// };
