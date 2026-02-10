"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { PaymentOverlay } from "../stripe/payment";
import StripeProvider from "../cart/components/StripeProvider";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  price: number;
  type: string;
  src: string;
}

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<boolean>(false);

  useEffect(() => {
    setProductId(searchParams.get("id")?.toString() ?? null);
  }, [searchParams]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.log("Failed to load product");
      }
    };

    if (productId) {
      fetchDetail();
    }
  }, [productId]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.type || "Check out this product",
          text: `Check out ${product?.type} - $${product?.price}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <StripeProvider>
        <PaymentOverlay
          isOpen={payment}
          onClose={() => setPayment(false)}
          productId={product?._id || ""}
          amount={product?.price * quantity || 0}
          onSuccess={() => {
            alert("✅ Order placed successfully!");
            localStorage.removeItem("cart_item");
            window.location.href = "/profile";
          }}
          onError={(error) => {
            console.error("Payment failed:", error);
          }}
        />
      </StripeProvider>
      <div className="relative w-full h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg">
        <Image
          src={product.src}
          alt={product.type}
          fill
          className="object-contain p-8"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {product.type}
        </h1>

        <div className="mb-8">
          <span className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-3 max-w-40">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 text-gray-800 font-semibold flex items-center justify-center hover:border-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              -
            </button>
            <span className="text-2xl font-bold text-gray-900 w-10 text-center">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 text-gray-800 font-semibold flex items-center justify-center hover:border-black hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleOrder}
            disabled={loading}
            className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-white hover:text-slate-800 hover:border hover:border-slate-800 hover:scale-[1.02] active:scale-[0.98]"
            } shadow-lg hover:shadow-xl`}
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>

          <button
            onClick={() => addToCart(product._id)}
            className="w-full py-5 rounded-xl font-bold text-lg border-2 border-black text-gray-900 bg-white hover:bg-slate-800 hover:text-white hover:border hover:border-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            Add to Cart
          </button>
        </div>

        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Shipping Information
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-0.5">✓</span>
              <span className="text-gray-700 font-medium">
                Free shipping on orders over $50
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-0.5">✓</span>
              <span className="text-gray-700 font-medium">
                2-3 business days delivery
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-0.5">✓</span>
              <span className="text-gray-700 font-medium">
                30-day hassle-free returns
              </span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-4 rounded-xl flex items-center justify-center gap-3 text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="font-semibold">Share Product</span>
        </button>
      </div>
    </div>
  );
}
