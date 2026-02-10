import { NextResponse } from "next/server";
import { checkLogin } from "@/app/lib/checkLogin";

export async function POST(req: Request) {
  const user = await checkLogin();

  if (!user) {
    return NextResponse.json({ error: "Not logged in", success: false });
  }
  return NextResponse.json({ message: "Logged in", success: true });
}
