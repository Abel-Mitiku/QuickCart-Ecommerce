import mongoose, { model, models, Schema } from "mongoose";

const rateLimitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 10,
  },
});

export const RateLimit =
  mongoose.models.RateLimit || model("RateLimit", rateLimitSchema);
