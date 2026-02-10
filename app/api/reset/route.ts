import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "No tokens", success: false });
    }
    const decoded = Jwt.verify(token, process.env.RESET_SECRET!) as {
      userId: string;
    };

    return NextResponse.json({
      message: "Please update your password",
      success: true,
    });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ error: "Token expired", success: false });
  }
}
