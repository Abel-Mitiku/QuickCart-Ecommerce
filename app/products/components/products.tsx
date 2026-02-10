"use client";
import { useState } from "react";
import { useEffect } from "react";
import { PaymentOverlay } from "@/app/stripe/payment";
import { useRouter } from "next/navigation";

interface product {
  _id: string;
  src: string;
  type: string;
  price: number;
  category: string;
}

export function Product() {
  const [products, setProducts] = useState<product[] | null>(null);
  const [payment, setPayment] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/allProducts", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.result);
      }
    };
    fetchProducts();
  }, []);

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

  return (
    <div
      className={`bg-white flex flex-col items-center ${!products && "h-screen"}`}
    >
      <p className="text-4xl font-bolds mt-16 text-slate-800">Our Products</p>
      {payment && (
        <PaymentOverlay
          isOpen={payment}
          onClose={() => setPayment(false)}
          productId={productId || ""}
          amount={Number(productPrice) * quantity || 0}
          onSuccess={() => {
            alert("✅ Order placed successfully!");
            localStorage.removeItem("cart_item");
            window.location.href = "/profile";
          }}
          onError={(error) => {
            console.error("Payment failed:", error);
          }}
        />
      )}
      {!products && <p className="mt-16 text-slate-800">Loading products</p>}
      <div className="grid grid-cols mt-8 min-[900px]:grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 mb-16">
        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className="border rounded shadow-lg overflow-hidden m-2 flex flex-col items-center max-[1000px]:w-[250px] max-[1200px]:w-[280px] min-[1200px]:w-[350px] min-[900px]:h-[300px] max-[600px]:w-[400px]"
            >
              <div
                className="flex flex-col items-center bg-gray-100 w-[95%] relative"
                onClick={() => router.push(`product?id=${product._id}`)}
              >
                <img
                  src={product.src}
                  title="Product image"
                  className="h-[250px] p-4"
                />
                <div className="flex text-black mb-4 font-bold">
                  <p className="mr-4">{product.type}</p>
                  <p>Price:{product.price}</p>
                </div>
                <div className="absolute top-0 opacity-0 hover:bg-white/40 hover:opacity-100 w-full h-full flex flex-col items-center justify-center transition-all duration-100 translate-y-12 hover:translate-y-0">
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
                    className="bg-slate-800 h-12 w-34 mt-2 rounded-full cursor-pointer text-white font-bold hover:bg-gray-100 hover:text-slate-800 hover:border hover:border-slate-800"
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
    </div>
  );
}
