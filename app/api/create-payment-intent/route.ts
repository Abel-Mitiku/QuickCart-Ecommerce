import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/app/lib/payment/services/stripeServices";
import { cookies } from "next/headers";
import Jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { products, currency } = await req.json();

    console.log(products, currency);

    // ✅ Normalize products to always be an array
    let productArray: any[] = [];
    console.log(typeof products);

    if (Array.isArray(products)) {
      // Already an array
      productArray = products;
    } else if (products && typeof products === "string") {
      const parsed = JSON.parse(products);
      productArray = [parsed];
    } else {
      // Invalid format
      return NextResponse.json(
        {
          error: "Invalid products data. Expected object or array.",
          success: false,
        },
        { status: 400 },
      );
    }

    // ✅ Now validate the normalized array
    if (productArray.length === 0) {
      return NextResponse.json(
        { error: "No products provided", success: false },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    try {
      Jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: "Invalid token", success: false },
        { status: 401 },
      );
    }

    const result = await createPaymentIntent(productArray, currency || "usd");

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
