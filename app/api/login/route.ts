import { NextResponse } from "next/server";
import { Login } from "@/app/lib/login";

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await Login(formData);

  return NextResponse.json({ result });
}
