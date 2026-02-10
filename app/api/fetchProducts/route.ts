import Product from "@/app/models/products";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const { Ids } = await req.json();
    console.log("Started");
    console.log(Ids);
    await db();
    if (!Array.isArray(Ids) || Ids.length == 0) {
      return NextResponse.json({
        error: "No product Ids procided",
        success: false,
      });
    }
    const products = await Product.find({
      _id: { $in: Ids },
    })
      .select("_id type price src")
      .lean();
    const productsMap = new Map(products.map((p) => [p._id.toString(), p]));
    const orderedProducts = Ids.map((id) => productsMap.get(id)).filter(
      Boolean,
    );
    console.log(orderedProducts);

    return NextResponse.json({
      success: true,
      products: orderedProducts,
      count: orderedProducts.length,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
