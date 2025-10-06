import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    imageID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
