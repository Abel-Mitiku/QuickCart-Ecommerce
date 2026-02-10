import { cookies } from "next/headers";
import { RefreshToken } from "../models/refreshTokens";
import { db } from "./db";

export async function Logout(userId: string, sessionId: string) {
  try {
    await db();
    await RefreshToken.deleteOne({ _id: sessionId, userId: userId });
    const cookieStore = await cookies();
    cookieStore.delete("access-token");
    cookieStore.delete("refresh-token");
    cookieStore.delete("csrf-token");
    return { message: "Logged out", success: true };
  } catch (err: any) {
    console.log(err.message);
    const cookieStore = await cookies();
    cookieStore.delete("access-token");
    cookieStore.delete("refresh-token");
    cookieStore.delete("csrf-token");

    return { message: "Logged out successfully", success: true };
  }
}
