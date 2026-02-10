"use client";
import { Truck, Gift, Award } from "lucide-react";

export function Cards() {
  return (
    <div className="bg-white w-full py-12 px-4 sm:px-6 lg:px-8">
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-10 text-center">
        Why Shop With Us
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto dark:text-white">
        <div className="bg-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-900 transition-colors duration-300 shadow-lg hover:shadow-xl">
          <div className="bg-white rounded-full p-4 mb-6">
            <Truck className="w-12 h-12 sm:w-16 sm:h-16 text-slate-800" />
          </div>
          <p className="font-bold text-xl sm:text-2xl mb-3 text-white">
            Fast Delivery
          </p>
          <p className="text-slate-300 leading-relaxed">
            Lightning-fast delivery that gets your order to you without delays.
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-900 transition-colors duration-300 shadow-lg hover:shadow-xl">
          <div className="bg-white rounded-full p-4 mb-6">
            <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-slate-800" />
          </div>
          <p className="font-bold text-xl sm:text-2xl mb-3 text-white">
            Free Shipping
          </p>
          <p className="text-slate-300 leading-relaxed">
            Enjoy free shipping on all orders with no hidden extra costs.
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-900 transition-colors duration-300 shadow-lg hover:shadow-xl">
          <div className="bg-white rounded-full p-4 mb-6">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-slate-800" />
          </div>
          <p className="font-bold text-xl sm:text-2xl mb-3 text-white">
            Best Quality
          </p>
          <p className="text-slate-300 leading-relaxed">
            Premium quality products built to last and impress every time.
          </p>
        </div>
      </div>
    </div>
  );
}
