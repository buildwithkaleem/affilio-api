
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productUrl: String,

    productId: String,

    productTitle: String,

    productSlug: String,

    regularPrice: String,

    salePrice: String,

    productImage: String,

    persent: Number,

    affiliateCommission: Number,

  },
  {
    timestamps: true,
  }
);



export const productModel = mongoose.model("Product", productSchema);