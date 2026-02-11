import User from "../models/users";
import { RefreshToken } from "../models/refreshTokens";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "./verifyRefreshToken";
import { db } from "./db";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export async function requestRefreshToken() {
  console.log("refresh started");
  try {
    await db();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token")?.value;
    if (!refreshToken) {
      return;
    }
    const result = verifyRefreshToken(
      refreshToken,
      process.env.REFRESH_SECRET!,
    );
    console.log(result);
    if (result.success) {
      const storedRefreshToken = await RefreshToken.findOne({
        userId: result.userId,
      });
      if (!storedRefreshToken) {
        return { error: "Invalid token" };
      }
      const isValid = await bcrypt.compare(
        refreshToken,
        storedRefreshToken.refreshToken,
      );

      if (isValid) {
        const newAccessToken = Jwt.sign(
          { userId: result.userId, session: storedRefreshToken._id },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" },
        );
        console.log("token generated");
        cookieStore.set("access-token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 15 * 60,
        });
        console.log("done");
        return { message: "token generated", success: true };
      }
      return {
        error: "Token doesn't match",
        success: false,
        userId: result.userId,
      };
    }
    return { error: "Couldn't generate token" };
  } catch (err: any) {
    console.log(err.message);
    return { error: err.message, success: false };
  }
}
