"use client";
import { Package, TrendingUp, Star } from "lucide-react";

export function Header() {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Our Products
              </h1>
              <p className="text-orange-100 mt-1 text-sm md:text-base">
                Discover quality items at amazing prices
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border border-white/20">
              <TrendingUp className="w-4 h-4 text-orange-300" />
              <span className="text-white font-medium text-sm">
                New Arrivals
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border border-white/20">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-medium text-sm">
                Best Sellers
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border border-white/20">
              <span className="text-white font-medium text-sm">100+ Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
