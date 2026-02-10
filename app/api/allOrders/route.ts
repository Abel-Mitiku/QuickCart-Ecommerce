import { NextResponse } from "next/server";
import { Order } from "@/app/models/order";
import { db } from "@/app/lib/db";

export async function GET(req: Request) {
  try {
    await db();
    const orders = await Order.find();
    return NextResponse.json({ orders, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, success: false });
  }
}
