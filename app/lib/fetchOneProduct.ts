import Product from "../models/products";
import { db } from "./db";

export async function FetchOneProduct(productId: string) {
  try {
    await db();
    const product = await Product.findById(productId);
    console.log(productId);
    if (!product) {
      return { error: "Out of stoke", success: false };
    }
    return { product, success: true };
  } catch (err: any) {
    console.log(err.message);
    return { error: err.message, success: false };
  }
}
