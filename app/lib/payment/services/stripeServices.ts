import Stripe from "stripe";
import { db } from "../../db";
import Product from "@/app/models/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

async function calculateTotalFromDB(
  products: { id: string; quantity: number }[],
) {
  try {
    await db();
    const productIds = products.map((p) => p.id);
    const productsInfo = await Product.find({
      _id: { $in: productIds },
    })
      .select("_id price")
      .lean();

    const productsMap = new Map(productsInfo.map((p) => [p._id.toString(), p]));

    let totalCents = 0;

    for (const item of products) {
      const product = productsMap.get(item.id);

      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.id}`);
      }

      totalCents += Math.round(product.price * item.quantity * 100);
    }

    return totalCents;
  } catch (error: any) {
    console.error("Calculate total error:", error);
    throw error;
  }
}

// Add this helper at the top of the file
function normalizeProductsInput(
  products:
    | { id: string; quantity: number }
    | { id: string; quantity: number }[],
): { id: string; quantity: number }[] {
  if (Array.isArray(products)) {
    return products;
  }

  if (
    products &&
    typeof products === "object" &&
    typeof products.id === "string" &&
    typeof products.quantity === "number"
  ) {
    return [products];
  }

  throw new Error(
    "Invalid products format: must be object with {id, quantity} or array of such objects",
  );
}

export async function createPaymentIntent(
  products:
    | { id: string; quantity: number }
    | { id: string; quantity: number }[],
  currency: string = "usd",
) {
  try {
    // ✅ Normalize AND validate input structure
    const productArray = normalizeProductsInput(products);

    // ✅ Validate non-empty after normalization
    if (productArray.length === 0) {
      throw new Error("No valid products provided");
    }

    const totalCents = await calculateTotalFromDB(productArray);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount: totalCents / 100,
      currency: currency,
    };
  } catch (error: any) {
    console.error("Stripe create payment intent error:", error);
    return {
      success: false,
      error: error.message || "Failed to create payment intent",
    };
  }
}
interface PaymentVerificationSuccess {
  success: true;
  paymentId: string;
  transactionId: string | null;
  amount: number;
  currency: string;
}

interface PaymentVerificationFailure {
  success: false;
  error: string;
}

type PaymentVerification =
  | PaymentVerificationSuccess
  | PaymentVerificationFailure;

export async function verifyPaymentIntent(
  paymentIntentId: string,
): Promise<PaymentVerification> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      let transactionId: string | null = null;

      if (typeof paymentIntent.latest_charge === "string") {
        transactionId = paymentIntent.latest_charge;
      } else if (paymentIntent.latest_charge) {
        transactionId = paymentIntent.latest_charge.id;
      }

      return {
        success: true,
        paymentId: paymentIntent.id,
        transactionId: transactionId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } else {
      return {
        success: false,
        error: `Payment status: ${paymentIntent.status}`,
      };
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
