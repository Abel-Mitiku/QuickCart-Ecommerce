"use client";
import { useEffect } from "react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface product {
  _id: string;
  type: string;
  src: string;
  price: number;
  category: string;
}

export function Products() {
  const [products, setProducts] = useState<product[] | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payment, setPayment] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [productPrice, setProductPrice] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch("/api/homeProduct", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      console.log(res);
      if (data.success) {
        setProducts(data.result);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    if (payment && elements) {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        const card = elements.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          },
          hidePostalCode: true,
        });
        card.mount("#card-element");
      }
    }
  }, [payment, elements]);

  const addToCart = (id: string) => {
    const existingCart = localStorage.getItem("cart_item");
    const cartItems: string[] = existingCart ? JSON.parse(existingCart) : [];

    const exists = cartItems.includes(id);
    if (!exists) {
      cartItems.push(id);
      localStorage.setItem("cart_item", JSON.stringify(cartItems));
      alert("added to cart");
    }
  };

  const removeFromCart = (id: string) => {
    const existingCart = localStorage.getItem("cart_items");
    if (!existingCart) return;

    const cartItems: string[] = JSON.parse(existingCart);
    const updatedCart = cartItems.filter((itemId) => itemId !== id);

    localStorage.setItem("cart_items", JSON.stringify(updatedCart));
    console.log("Removed from cart:", id);
  };

  const handleOrder = async () => {
    const res = await fetch("/api/checkLogin", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      setPayment(true);
    } else {
      window.location.href = "/login";
    }
  };

  const handleSubmitPayment = async (productId: string) => {
    if (!stripe || !elements) return;

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
      console.log("piData :", piData);

      if (!piData.success) {
        setErrorMessage(piData.error || "Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId, amount } = piData;

      console.log(clientSecret, paymentIntentId, amount);

      console.log(`Payment amount: $${amount.toFixed(2)}`);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email:
                (
                  document.querySelector(
                    'input[type="email"]',
                  ) as HTMLInputElement
                )?.value || "customer@example.com",
            },
          },
        },
      );

      console.log(paymentIntent, error);

      if (error) {
        throw new Error(error.message || "Payment failed");
      }

      if (paymentIntent?.status !== "succeeded") {
        throw new Error("Payment not confirmed");
      }

      const orderResponse = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          products: JSON.stringify({
            id: productId,
            quantity: 1,
          }),
          paymentIntentId: paymentIntent.id,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Order creation failed");
      }

      setProducts([]);
      setPayment(false);

      alert(
        `✅ Order Placed Successfully!\n\nOrder Number: ${orderResult.orderNumber}\nTotal: $${orderResult.total.toFixed(2)}\n\nConfirmation sent to your email.`,
      );

      window.location.href = `/profile`;
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
      console.error("Payment flow error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white w-full flex flex-col items-center">
      <p className="text-6xl font-bold text-slate-800 mt-16 text-center">
        Our products
      </p>
      {payment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setPayment(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close payment form"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Secure Payment
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Details
                </label>
                <div
                  id="card-element"
                  className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Test card:{" "}
                  <span className="font-mono bg-gray-100 px-1 rounded">
                    4242 4242 4242 4242
                  </span>{" "}
                  | Exp: 12/30 | CVC: 123
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (for receipt)
                </label>
                <input
                  type="email"
                  defaultValue={localStorage.getItem("user_email") || ""}
                  className="w-full text-slate-800 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <button
              onClick={() => productId && handleSubmitPayment(productId)}
              disabled={processing || !stripe || !elements}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                processing || !stripe || !elements
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing...
                </span>
              ) : (
                `Pay $${productPrice.toFixed(2)}`
              )}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              🔒 Secure payment powered by Stripe • No card data stored on our
              servers
            </p>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={() => setPayment(false)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className="border rounded shadow-lg overflow-hidden flex flex-col items-center"
            >
              <div
                className="flex flex-col items-center bg-gray-100 w-full relative group cursor-pointer"
                onClick={() => router.push(`product?id=${product._id}`)}
              >
                <img
                  src={product.src}
                  title="Product image"
                  className="h-[250px] p-4 object-contain"
                />
                <div className="flex text-black mb-4 font-bold px-4">
                  <p className="mr-4">{product.type}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="absolute top-0 opacity-0 z-20 group-hover:bg-white/40 group-hover:opacity-100 w-full h-full flex flex-col items-center justify-center transition-all duration-100 group-hover:translate-y-0 translate-y-12">
                  <button
                    className="bg-orange-600 h-12 w-34 rounded-full cursor-pointer text-white font-bold hover:bg-gray-100 hover:text-orange-600 hover:border hover:border-orange-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product._id);
                    }}
                  >
                    Add to cart
                  </button>
                  <button
                    className="bg-slate-800 z-20 h-12 w-34 mt-2 rounded-full cursor-pointer text-white font-bold hover:bg-gray-100 hover:text-slate-800 hover:border hover:border-slate-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProductId(product._id);
                      setProductPrice(product.price);
                      handleOrder();
                    }}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <button
        className="bg-orange-600 h-12 pl-8 pr-8 duration-200 z-10 mt-6 mb-8 rounded cursor-pointer text-white font-bold hover:bg-white hover:text-orange-600 hover:border hover:border-orange-60"
        onClick={() => router.push("/products")}
      >
        View all products
      </button>
    </div>
  );
}
