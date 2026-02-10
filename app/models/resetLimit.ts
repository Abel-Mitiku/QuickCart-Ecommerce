import mongoose, { model, models, Schema } from "mongoose";

const resetLimitSchema = new Schema({
  email: {
    type: String,
    required: true,
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

export const ResetLimit =
  mongoose.models.RateLimit || model("ResetLimit", resetLimitSchema);
