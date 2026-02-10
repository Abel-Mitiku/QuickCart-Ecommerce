import Product from "../models/products";
import { db } from "./db";

interface product {
  _id: string;
  type: string;
  src: string;
  price: number;
  category: string;
}

export async function updateProduct(product: product) {
  try {
    await db();
    if (!product.type || !product.src || !product.price || !product.category) {
      return { error: "Invalid info", success: false };
    }
    const result = await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          type: product.type,
          src: product.src,
          price: product.price,
          category: product.category,
        },
      },
    );
    if (result) {
      return { message: "Updated successfully", success: true };
    }
    return { error: "Mongo error", success: false };
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
