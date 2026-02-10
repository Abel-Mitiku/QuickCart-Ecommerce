import { sendResetEmail } from "@/app/lib/forgot-password/reset";
import { NextResponse } from "next/server";
import User from "@/app/models/users";
import { db } from "@/app/lib/db";
import Jwt from "jsonwebtoken";
import { ResetLimit } from "@/app/models/resetLimit";

export async function POST(req: Request) {
  try {
    await db();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Empty email", success: false });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({
        error: "Something went wrong",
        success: false,
      });
    }
    let limit = await ResetLimit.findOne({ email: email });
    if (!limit) {
      limit = await ResetLimit.create({ email: email });
      limit.count++;
      await limit.save();
    }
    limit.count++;
    limit.save();
    if (limit.count > 10) {
      return NextResponse.json({
        error: "Too many requests please try again later",
        success: false,
      });
    }
    const resetToken = Jwt.sign(
      { userId: user._id },
      process.env.RESET_SECRET!,
      { expiresIn: "10m" },
    );
    user.resetToken = resetToken;
    await user.save();
    console.log(user.email);
    await sendResetEmail(user.email, resetToken);
    return NextResponse.json({
      message: "Reset link sent to email",
      success: true,
    });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ error: err.message, success: false });
  }
}
