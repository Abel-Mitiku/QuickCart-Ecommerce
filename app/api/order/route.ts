// app/api/order/route.ts
import { placeOrder } from "@/app/lib/placeOrder";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { products, paymentIntentId } = await req.json(); // ✅ paymentIntentId from frontend

    if (!products || !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
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

    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // ✅ Place order AFTER payment succeeds (verifies payment first)
    const result = await placeOrder(products, decoded.userId, paymentIntentId);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Place order error:", err);
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 },
    );
  }
}
