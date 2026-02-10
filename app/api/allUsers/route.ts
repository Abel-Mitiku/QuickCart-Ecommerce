import { NextResponse } from "next/server";
import { getAllUsers } from "@/app/lib/allUsers";

export async function GET(req: Request) {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users: users.users, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, success: false });
  }
}
