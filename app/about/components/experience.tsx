"use client";
import { useRouter } from "next/navigation";

export function Experience() {
  const router = useRouter();
  return (
    <div className="text-center text-slate-800 bg-white pb-16">
      <p className="text-gray-600 mb-">
        Ready to experience seamless shopping?
      </p>
      <button
        onClick={() => router.push("/products")}
        className="bg-orange-600 h-12 pl-8 pr-8 duration-200 z-10 mt-6 mb-8 rounded cursor-pointer text-white font-bold hover:bg-white hover:text-orange-600 hover:border hover:border-orange-60"
      >
        Shop Now
      </button>
    </div>
  );
}
