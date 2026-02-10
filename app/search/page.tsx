"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  type: string;
  src: string;
  price: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const term = searchParams.get("q")?.toString();
  const [result, setResult] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getProduct = async () => {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ term }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.products);
      } else {
        setError(data.error);
      }
    };
    getProduct();
  }, [term]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Search Results for "{term}"
          </h1>
          {result !== null && (
            <p className="text-lg text-gray-600">
              {result?.length || 0} product{result?.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          )}
        </div>

        {result === null && error === null && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Searching products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg mb-10">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Search Error
                </h3>
                <p className="mt-1 text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result?.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <div className="text-7xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No products found for "{term}"
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 px-4">
              Try different keywords like "shirt", "dress", or "pants". We have
              great options waiting for you!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Men's Shirt", "Women's Dress", "T-Shirt", "Pants"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() =>
                      (window.location.href = `/search?q=${encodeURIComponent(suggestion)}`)
                    }
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium text-gray-800 transition-colors shadow-sm hover:shadow"
                  >
                    Try "{suggestion}"
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {result && result.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {result.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                onClick={() => router.push(`/product?id=${product._id}`)}
              >
                <div className="h-64 bg-gray-50 flex items-center justify-center p-6">
                  <img
                    src={product.src}
                    alt={product.type}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-1">
                    {product.type}
                  </h3>
                  <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                    <span className="text-2xl font-bold text-orange-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
