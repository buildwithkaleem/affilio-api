import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  message: String,
  amount: Number,
  status: String,
  orderId: String,
  isRead: {
    type: Boolean,
    default: false
  },
  expireAt: {
    type: Date,
  }
}, { timestamps: true });

notificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const notificationModel = mongoose.model("Notification", notificationSchema);