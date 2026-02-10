import { FetchUserInfo } from "@/app/lib/user/fetchUser";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No tokens", success: false });
    }
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const result = await FetchUserInfo(decoded.userId);

    return NextResponse.json(result);
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ error: err.message, success: false });
  }
}
