import { Register } from "@/app/lib/register";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await Register(formData);

  return NextResponse.json(result);
}
