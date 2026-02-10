import { NextResponse } from "next/server";
import { Logout } from "@/app/lib/logout";
import { db } from "@/app/lib/db";
import { cookies } from "next/headers";
import Jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh-token")?.value;
    if (!token) {
      cookieStore.delete("access-token");
      cookieStore.delete("refresh-token");
      cookieStore.delete("csrf-token");
      return NextResponse.json({
        message: "Logged out successfully",
        success: true,
      });
    }
    const decoded = Jwt.verify(token, process.env.REFRESH_SECRET!) as {
      userId: string;
      sessionId: string;
    };
    const userId = decoded.userId;
    const sessionId = decoded.sessionId;
    const result = await Logout(userId, sessionId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.log(err.message);
    const cookieStore = await cookies();
    cookieStore.delete("access-token");
    cookieStore.delete("refresh-token");
    cookieStore.delete("csrf-token");

    return NextResponse.json({
      message: "Logged out (session terminated)",
      success: true,
    });
  }
}
