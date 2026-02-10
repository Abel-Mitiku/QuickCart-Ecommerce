"use client";
import { useRouter } from "next/navigation";
import "../style.css";

export function Arrival() {
  const router = useRouter();
  return (
    <div className="bg-[url('/arrival-bg.png')] bg-top bg-cover h-[500px] relative w-full">
      <div className="arrival">
        <div className="mt-24">
          <p className="text-6xl font-bold text-slate-800 mb-8 text-center">
            #New Arrival
          </p>
          <p className="text-slate-800">
            Discover our latest arrivals, carefully selected to match modern
            trends and everyday needs. Each new product is crafted with premium
            quality to deliver both style and durability. Shop the newest
            collections before they sell out and stay ahead of the curve. Enjoy
            seamless browsing, fast delivery, and secure checkout with every
            purchase. Upgrade your lifestyle today with products designed to
            impress and perform.
          </p>
          <button
            className="bg-orange-600 h-12 w-34 mt-6 rounded cursor-pointer text-white font-bold hover:bg-gray-300 hover:text-orange-600 hover:border hover:border-orange-600"
            onClick={() => router.push("/products")}
          >
            Shop now
          </button>
        </div>
      </div>
    </div>
  );
}
