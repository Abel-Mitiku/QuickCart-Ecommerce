import User from "../models/users";
import { db } from "./db";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { RefreshToken } from "../models/refreshTokens";
import { RateLimit } from "../models/rateLimit";

export async function Login(formData: FormData) {
  const cookieStore = await cookies();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email) {
    return { error: "Email is required", success: false };
  }
  if (!password) {
    return { error: "Password is required", success: false };
  }
  if (!password.trim()) {
    return { error: "Password is required", success: false };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter valid email", success: false };
  }
  try {
    await db();
    const user = await User.findOne({ email: email });
    if (!user) {
      return { error: "Invalide credintials", success: false };
    }

    let limit = await RateLimit.findOne({ userId: user._id });
    if (!limit) {
      await RateLimit.create({ userId: user._id });
    }
    const limitCount = await RateLimit.findOne({ userId: user._id });
    console.log(limitCount);

    if (!user.verified) {
      return { error: "Email not verified", success: false };
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      if (limitCount.count > 10) {
        // await limitCount.save();
        return {
          error: "Too many attempts please try again later",
          success: false,
        };
      }
      limitCount.count++;
      await limitCount.save();
      return { error: "Invalid credintials", success: false };
    }

    const session = await RefreshToken.create({
      userId: user._id,
      refreshToken: "temp",
    });

    const refreshToken = Jwt.sign(
      { userId: user._id, sessionId: session._id.toString() },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" },
    );
    const csrfToken = Jwt.sign({ userId: user._id }, process.env.CSRF_SECRET!, {
      expiresIn: "7d",
    });

    const ACCESS_TOKEN_MAX_AGE = 15 * 60;
    const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
    const CSRF_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await RefreshToken.findByIdAndUpdate(session._id, {
      refreshToken: hashedRefreshToken,
    });
    await RateLimit.findByIdAndDelete(limitCount._id);
    const accessToken = Jwt.sign(
      { userId: user._id, sessionId: session._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );
    cookieStore.set("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    cookieStore.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    cookieStore.set("csrf-token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: CSRF_TOKEN_MAX_AGE,
    });

    return { message: "Login successful", success: true };
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
