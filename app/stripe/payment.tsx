"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { X } from "lucide-react";

interface PaymentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  amount: number;
  quantity?: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentOverlay({
  isOpen,
  onClose,
  productId,
  amount,
  quantity = 1,
  currency = "usd",
  onSuccess,
  onError,
}: PaymentOverlayProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("user_email") || ""
      : "",
  );

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setEmail(localStorage.getItem("user_email") || "");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Payment system not ready. Please try again.");
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
      const piResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          products: JSON.stringify({
            id: productId,
            quantity: 1,
          }),
          currency: "usd",
        }),
      });

      const piData = await piResponse.json();
      if (!piData.success) {
        throw new Error(piData.error || "Failed to initialize payment");
      }

      const { clientSecret, paymentIntentId } = piData;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: email || "customer@example.com",
            },
          },
        },
      );

      if (error) throw new Error(error.message || "Payment failed");
      if (paymentIntent?.status !== "succeeded") {
        throw new Error("Payment not confirmed");
      }

      const orderResponse = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          products: { id: productId, quantity },
          paymentIntentId: paymentIntent.id,
        }),
      });

      const orderResult = await orderResponse.json();
      if (!orderResult.success) {
        throw new Error(orderResult.error || "Order creation failed");
      }

      if (email) localStorage.setItem("user_email", email);

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      console.error("Payment flow error:", err);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close payment form"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            Secure Checkout
          </span>
        </h2>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 hover:border-orange-400 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#2d3748",
                      fontFamily: '"Inter", -apple-system, sans-serif',
                      fontSmoothing: "antialiased",
                      fontWeight: "500",
                      "::placeholder": {
                        color: "#a0aec0",
                      },
                    },
                    invalid: {
                      color: "#e53e3e",
                      iconColor: "#e53e3e",
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="mr-2">💳</span>
              Test card:{" "}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded ml-1">
                4242 4242 4242 4242
              </span>
              <span className="mx-1">|</span>
              Exp: 12/30 <span className="mx-1">|</span> CVC: 123
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email for Receipt
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-slate-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 flex items-center">
            <span className="mr-2">⚠️</span>
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={processing || !stripe || !elements}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
            processing || !stripe || !elements
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>

        <p className="mt-5 text-center text-xs text-gray-500 flex items-center justify-center">
          <span className="mr-2">🔒</span>
          Secure payment powered by Stripe • No card data stored on our servers
        </p>

        <div className="mt-6 pt-5 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-orange-500 font-medium flex items-center justify-center mx-auto"
          >
            <span className="mr-1.5">←</span>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
