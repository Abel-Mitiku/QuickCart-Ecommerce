import mongoose, { model, models, Schema } from "mongoose";

const refreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7,
  },
});

export const RefreshToken =
  mongoose.models.RefreshToken || model("RefreshToken", refreshTokenSchema);
