import mongoose, { models, model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subTotal: { type: Number, required: true },
        image: { type: String },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.models.Order || model("Order", orderSchema);
