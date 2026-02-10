import { error } from "console";
import { NextResponse } from "next/server";
import { FetchOneProduct } from "@/app/lib/fetchOneProduct";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    console.log;
    if (!productId) {
      return NextResponse.json({
        error: "Unexpected error happened",
        success: false,
      });
    }
    const result = await FetchOneProduct(productId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message, success: false });
  }
}
