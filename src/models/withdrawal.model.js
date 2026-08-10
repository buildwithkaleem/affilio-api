import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  expireAt: {
    type: Date,
  }

}, { timestamps: true });

withdrawalSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const withdrawalModel = mongoose.model("Withdrawal", withdrawalSchema);