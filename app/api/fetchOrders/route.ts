import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Fetchorders } from "@/app/lib/user/fetchOrders";
import { verifyJWT } from "@/app/lib/verifyJWT";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const cookieStore = await cookies();
  if (!userId) {
    const token = cookieStore.get("access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token", success: false });
    }
    const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
    if (decoded.success && decoded.userId) {
      const result = await Fetchorders(decoded!.userId);
      return NextResponse.json({ result, success: true });
    }
  }
  const result = await Fetchorders(userId);
  return NextResponse.json(result);
}
