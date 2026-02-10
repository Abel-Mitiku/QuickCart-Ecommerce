"use client";
import { useState } from "react";
import { Truck, Gift, Award } from "lucide-react";
import "../style.css";

export function Blog() {
  return (
    <div className="bg-white w-full flex flex-col items-center">
      <p className="text-6xl font-bold text-slate-800 mt-8 text-center">
        Why Shop With Us
      </p>
      <div className="mt-8 flex gap-4 mb-16 blog">
        <div className="bg-slate-800 rounded flex flex-col items-center justify-center card">
          <Truck className="w-16 h-16 mb-2" />
          <p className="font-bold text-xl mb-2">Fast Delivery</p>
          <p className="text-center">
            Lightning-fast delivery that gets your order to you without delays.
          </p>
        </div>
        <div className="bg-slate-800 rounded flex flex-col items-center justify-center card">
          <Gift className="w-16 h-16 mb-2" />
          <p className="font-bold text-xl mb-2">Free Shiping</p>
          <p className="text-center">
            Enjoy free shipping on all orders with no hidden extra costs.
          </p>
        </div>
        <div className="bg-slate-800 rounded flex flex-col items-center justify-center card">
          <Award className="w-16 h-16 mb-2" />
          <p className="font-bold text-xl mb-2">Best Quality</p>
          <p className="text-center">
            Premium quality products built to last and impress every time.
          </p>
        </div>
      </div>
    </div>
  );
}
