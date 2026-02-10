import { updateProduct } from "@/app/lib/updateProduct";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function POST(req: Request) {
  try {
    const { product } = await req.json();
    if (!product) {
      return NextResponse.json({ error: "Product missing", success: false });
    }
    const update = await updateProduct(product);
    return NextResponse.json(update);
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
