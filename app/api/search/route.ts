import { NextResponse } from "next/server";
import { FindProduct } from "@/app/lib/findProduct";

export async function POST(req: Request) {
  const { term } = await req.json();

  if (!term) {
    return NextResponse.json({ error: "No query", success: false });
  }
  const result = await FindProduct(term);
  return NextResponse.json(result);
}
