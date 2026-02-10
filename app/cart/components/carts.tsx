"use client";
import { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import StripeProvider from "./StripeProvider";

interface QuantityItem {
  productId: string;
  productQuantity: number;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function Cart() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<QuantityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<boolean>(false);

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (products.length > 0) {
      const initializeQTY = products.map((p) => ({
        productId: p._id.toString(),
        productQuantity: 1,
      }));
      setQuantity(initializeQTY);
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    console.log(products);
    console.log(quantity);
  }, [quantity]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, productQuantity: newQuantity }
          : item,
      ),
    );
  };

  const getQuantity = (productId: string) => {
    const item = quantity.find((q) => q.productId === productId);
    return item ? item.productQuantity : 1;
  };

  const getProductSubtotal = (product: any) => {
    const qty = getQuantity(product._id.toString());
    return (product.price * qty).toFixed(2);
  };

  const getCartTotal = () => {
    return products.reduce((total, product) => {
      const qty = getQuantity(product._id.toString());
      return total + product.price * qty;
    }, 0);
  };

  useEffect(() => {
    const existingCart = localStorage.getItem("cart_item");
    const cartIds = existingCart ? JSON.parse(existingCart) : [];
    console.log(cartIds);

    const fetchProducts = async () => {
      const res = await fetch("/api/fetchProducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Ids: cartIds }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        console.log("failed to fetch");
      }
    };
    fetchProducts();
  }, []);

  const removeFromCart = (id: string) => {
    console.log("Deleting", id);

    const existingCart = localStorage.getItem("cart_item");
    if (!existingCart) return;

    const cartItems: string[] = JSON.parse(existingCart);
    const updatedCart = cartItems.filter((itemId) => itemId !== id);

    localStorage.setItem("cart_item", JSON.stringify(updatedCart));

    setProducts((prev) => prev.filter((p) => p._id !== id));
    setQuantity((prev) => prev.filter((q) => q.productId !== id));

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

  const handleSubmitPayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMessage(null);

    try {
      const piResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          products: products.map((p) => ({
            id: p._id,
            quantity: getQuantity(p._id.toString()),
          })),
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
          products: products.map((p) => ({
            id: p._id,
            quantity: getQuantity(p._id.toString()),
          })),
          paymentIntentId: paymentIntent.id,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Order creation failed");
      }

      localStorage.removeItem("cart_item");
      setProducts([]);
      setQuantity([]);
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

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Looks like you haven't added any items to your cart yet. Start
            shopping to add products!
          </p>
          <a
            href="/"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
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
              onClick={handleSubmitPayment}
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
                `Pay $${getCartTotal().toFixed(2)}`
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

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {products.length} item{products.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {products.map((product) => {
                const qty = getQuantity(product._id.toString());
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-r">
                        <img
                          src={product.src}
                          alt={product.type}
                          className="max-h-64 object-contain transition-transform duration-300 hover:scale-105"
                        />
                      </div>

                      <div className="md:w-2/3 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {product.type}
                          </h3>
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                            title="Remove item"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="mb-4">
                          <span className="text-3xl font-bold text-orange-600">
                            ${product.price}
                          </span>
                          <span className="text-gray-500 ml-2">each</span>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700">
                              Quantity:
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                title="reduce-quantity"
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    product._id.toString(),
                                    qty - 1,
                                  )
                                }
                                disabled={qty <= 1}
                                className={`p-2 rounded-lg transition-colors ${
                                  qty <= 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                }`}
                              >
                                <Minus className="w-5 h-5" />
                              </button>

                              <span className="w-12 text-center text-lg font-semibold text-gray-900">
                                {qty}
                              </span>

                              <button
                                title="add-quantity"
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    product._id.toString(),
                                    qty + 1,
                                  )
                                }
                                className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="ml-auto">
                              <span className="text-sm text-gray-500">
                                Subtotal:
                              </span>
                              <span className="block text-xl font-bold text-gray-900">
                                ${getProductSubtotal(product)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Subtotal (
                      {products.reduce(
                        (sum, p) => sum + getQuantity(p._id.toString()),
                        0,
                      )}{" "}
                      item{products.length !== 1 ? "s" : ""}):
                    </span>
                    <span className="font-semibold">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className="font-semibold">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span className="font-semibold">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total:
                    </span>
                    <span className="text-3xl font-bold text-orange-600">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={handleOrder}
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  or{" "}
                  <a
                    href="/"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    continue shopping
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
