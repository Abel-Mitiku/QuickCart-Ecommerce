import Jwt from "jsonwebtoken";
import User from "../models/users";

export async function verifyEmail(token: string) {
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return { error: "User not found", success: false };
    }
    if (user.verificationToken !== token) {
      return { error: "Invalid verification token", success: false };
    }

    user.verificationToken = true;
    user.verificationToken = undefined;
    user.verified = true;
    await user.save();

    return { message: "Email verified", success: true };
  } catch (err: any) {
    return { error: "Token expired or invalid", success: false };
  }
}
