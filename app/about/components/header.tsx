"use client";
import { Users, Heart, Award } from "lucide-react";

export function Header() {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-full py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Users
                className="w-6 h-6 md:w-7 md:h-7 text-white"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                About Us
              </h1>
              <p className="text-orange-100 mt-0.5 text-sm md:text-base">
                Our story • Our mission • Our values
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 md:gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 border border-white/20">
              <Heart
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-300"
                strokeWidth={2}
              />
              <span className="text-white font-medium text-xs md:text-sm">
                Customer First
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 border border-white/20">
              <Award
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300"
                strokeWidth={2}
              />
              <span className="text-white font-medium text-xs md:text-sm">
                Quality Guaranteed
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 border border-white/20">
              <span className="text-white font-medium text-xs md:text-sm">
                Since 2020
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
