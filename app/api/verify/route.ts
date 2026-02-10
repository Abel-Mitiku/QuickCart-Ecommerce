import { NextResponse } from "next/server";
import { verifyEmail } from "@/app/lib/verify";
import { db } from "@/app/lib/db";

export async function GET(req: Request) {
  await db();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return { error: "token missing", success: false };
  }
  const result = await verifyEmail(token);
  return NextResponse.json({ result });
}
