import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  methodType: {
    type: String,
    required: [true],
    enum: ["jazzcash", "easypaisa"]
  },
  accountHolderName: {
    type: String,
  },
  accountNumber: {
    type: String,
    maxLength: 11,
    minLength: 11
  }

}, { timestamps: true });



export const paymentMethodModel = mongoose.model("PaymentMethod", paymentMethodSchema);