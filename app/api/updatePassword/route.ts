import Jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import User from "@/app/models/users";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await db();
    const { password, confirmPassword } = await req.json();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      console.log("no token");
      return NextResponse.json({ error: "No token", success: false });
    }
    const decoded = Jwt.verify(token, process.env.RESET_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("No user");
    }
    if (!password || password.trim().length === 0) {
      return NextResponse.json({
        error: "Password is required",
        success: false,
      });
    } else if (password.length < 10) {
      return NextResponse.json({
        error: "Password must be at least 10 characters",
        success: false,
      });
    } else if (!/[A-Z]/.test(password)) {
      return NextResponse.json({
        error: "Password must contain at least one uppercase letter",
        success: false,
      });
    } else if (!/[a-z]/.test(password)) {
      return NextResponse.json({
        error: "Password must contain at least one lowercase letter",
        success: false,
      });
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json({
        error: "Password must contain at least one symbol (!@#$%^&*)",
        success: false,
      });
    }

    if (!confirmPassword || confirmPassword.trim().length === 0) {
      return NextResponse.json({
        error: "Please confirm your password",
        success: false,
      });
    } else if (password !== confirmPassword) {
      return NextResponse.json({
        error: "Passwords do not match",
        success: false,
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    await user.save();
    return NextResponse.json({ message: "Password updated", success: true });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({
      error: "Token expired please try again",
      success: false,
    });
  }
}
