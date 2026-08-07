
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productUrl: String,

    title: String,

    slug: String,

    regularPrice: String,

    salePrice: String,

    image: String,

    persent: Number,

    affiliateCommission: Number,

  },
  {
    timestamps: true,
  }
);



export const productModel = mongoose.model("Product", productSchema);