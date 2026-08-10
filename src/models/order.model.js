import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    affiliate_ref: {
      type: String,
      required: true,
      index: true,
    },

    order: {
      id: {
        type: Number,
        required: true,
        unique: true,
      },

      status: {
        type: String,
        required: true,
      },

      created_at: {
        type: Date,
        required: true,
      },
    },

    customer: {
      id: {
        type: Number,
        required: true,
      },
    },

    products: [
      {
        id: {
          type: Number,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },
    affiliateCommission: Number,
  },
  {
    timestamps: true,
  }
);

export const orderModel = mongoose.model("Order", orderSchema);
