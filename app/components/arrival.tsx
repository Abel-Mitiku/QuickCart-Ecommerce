"use client";
import { useRouter } from "next/navigation";

export function Arrival() {
  const router = useRouter();

  return (
    <div className="bg-[url('/arrival-bg.png')] bg-top bg-cover bg-no-repeat relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center text-white backdrop-blur-sm bg-black/30 rounded-2xl p-8 sm:p-12 md:p-16">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          #New Arrival
        </p>

        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-slate-200 leading-relaxed max-w-3xl mx-auto">
          Discover our latest arrivals, carefully selected to match modern
          trends and everyday needs. Each new product is crafted with premium
          quality to deliver both style and durability.
        </p>

        <button
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
          onClick={() => router.push("/products")}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}
