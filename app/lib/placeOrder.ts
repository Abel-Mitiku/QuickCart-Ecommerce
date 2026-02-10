import Product from "../models/products";
import { Order } from "../models/order";
import { db } from "./db";
import { verifyPaymentIntent } from "./payment/services/stripeServices";

interface ProductItem {
  id: string;
  quantity: number;
}

// ✅ Add this helper to normalize input
function normalizeProducts(products: any): ProductItem[] {
  // Handle stringified JSON
  if (typeof products === "string") {
    try {
      products = JSON.parse(products);
    } catch (e) {
      throw new Error("Invalid products JSON format");
    }
  }

  // Handle single object
  if (products && typeof products === "object" && !Array.isArray(products)) {
    return [
      {
        id: products.productId || products.id || products._id,
        quantity: products.quantity,
      },
    ];
  }

  // Handle array
  if (Array.isArray(products)) {
    return products.map((item) => ({
      id: item.productId || item.id || item._id,
      quantity: item.quantity,
    }));
  }

  throw new Error("Invalid products format");
}

async function calculateOrderDetails(products: ProductItem[]) {
  try {
    await db();
    const productIds = products.map((p) => p.id);
    const productsInfo = await Product.find({
      _id: { $in: productIds },
    })
      .select("_id type price src")
      .lean();

    const productsMap = new Map(productsInfo.map((p) => [p._id.toString(), p]));

    let total = 0;
    let orderItems: any[] = [];

    for (const item of products) {
      const product = productsMap.get(item.id);

      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.id}`);
      }

      const subTotal = product.price * item.quantity;
      total += subTotal;

      orderItems.push({
        productId: product._id,
        type: product.type,
        price: product.price,
        quantity: item.quantity,
        subTotal: subTotal,
        image: product.src,
      });
    }

    return {
      total,
      orderItems,
      success: true,
    };
  } catch (error: any) {
    console.error("Calculate order details error:", error);
    throw error;
  }
}

export async function placeOrder(
  products: any, // ✅ Changed from ProductItem[] to any
  userId: string,
  paymentIntentId: string,
) {
  try {
    // ✅ Normalize products first
    const normalizedProducts = normalizeProducts(products);

    // ✅ Validate normalized products
    if (normalizedProducts.length === 0) {
      throw new Error("No products provided");
    }

    const { total: expectedTotal, orderItems } =
      await calculateOrderDetails(normalizedProducts);

    const paymentVerification = await verifyPaymentIntent(paymentIntentId);

    if (!paymentVerification.success) {
      return {
        error: paymentVerification.error || "Payment verification failed",
        success: false,
      };
    }

    if (Math.abs(paymentVerification.amount - expectedTotal) > 0.01) {
      console.error("⚠️ PAYMENT AMOUNT MISMATCH!");
      console.error(
        `Expected: $${expectedTotal}, Paid: $${paymentVerification.amount}`,
      );
      return {
        error:
          "Payment amount does not match order total. Order cancelled for security.",
        success: false,
      };
    }

    const order = await Order.create({
      userId: userId,
      items: orderItems,
      total: expectedTotal,
      currency: paymentVerification.currency,
      paymentStatus: "paid",
      paymentId: paymentVerification.paymentId,
      transactionId: paymentVerification.transactionId,
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });

    return {
      message: "Order placed successfully!",
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: expectedTotal,
    };
  } catch (err: any) {
    console.error("Order placement error:", err);
    return { error: err.message, success: false };
  }
}
