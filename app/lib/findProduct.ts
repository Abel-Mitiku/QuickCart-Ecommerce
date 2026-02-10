import { db } from "./db";
import Product from "../models/products";

export async function FindProduct(query: string) {
  try {
    await db();
    const products = await Product.find({
      $or: [{ type: { $regex: query, $options: "i" } }],
    }).limit(20);
    let suggestions = [];

    const popularCategories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);
    suggestions = popularCategories.map((cat) => ({
      type: cat._id,
      suggestion: `Try "${cat._id}"`,
      isSuggestion: true,
    }));

    if (products.length > 0) {
      return { products: products, success: true };
    }

    return { error: "try something like shirt", success: false };
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
