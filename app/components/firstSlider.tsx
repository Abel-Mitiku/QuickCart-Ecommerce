"use client";
import "../style.css";
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { useRef } from "react";

export function FirstSlider() {
  const [current, setCurrent] = useState<number>(0);
  const dots = [useRef(null), useRef(null), useRef(null)];
  const slides = [useRef(null), useRef(null), useRef(null)];
  const interval = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    slides.map((slide) =>
      gsap.fromTo(
        slide.current,
        {
          x: 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
        },
      ),
    );
  }, [current]);

  useEffect(() => {
    interval.current = setInterval(() => {
      setCurrent((prev) => (prev == 2 ? 0 : prev + 1));
    }, 3000);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  const startAutoPlay = () => {
    interval.current = setInterval(() => {
      setCurrent((prev) => (prev === 2 ? 0 : prev + 1));
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  };

  const currentSlide = (num: number) => {
    stopAutoPlay();
    setCurrent(num);
    startAutoPlay();
  };

  return (
    <div className="bg-[url('/slider-bg.jpg')] bg-cover bg-top h-[700px] w-full relative none-overflow-x">
      <div className="absolute left-5 w-full p-2">
        <div className="flex flex-col items-start text-div w-[55%]">
          {current === 0 && (
            <div ref={slides[0]}>
              <p className="text-6xl font-bold text-orange-700">Sale 20% Off</p>
              <p className="text-6xl font-bold text-slate-800">On Everything</p>
              <p className="text-slate-900 mt-8">
                Upgrade your shopping experience with unbeatable deals across
                our entire store. From daily essentials to special finds,
                everything is included in this offer. Shop smarter, save more,
                and make every purchase count today.
              </p>
              <button className="bg-orange-600 h-12 w-34 mt-6 rounded cursor-pointer text-white font-bold hover:bg-gray-300 hover:text-orange-600 hover:border hover:border-orange-600">
                Shop now
              </button>
            </div>
          )}
          {current == 1 && (
            <div ref={slides[1]}>
              <p className="text-6xl font-bold text-orange-700">New Arrivals</p>
              <p className="text-6xl font-bold text-slate-800">Just Landed</p>
              <p className="text-slate-900 mt-8">
                Discover the latest trends carefully curated for your lifestyle.
                From stylish essentials to standout pieces, our new collection
                has it all. Fresh designs, premium quality, and prices that make
                sense. Explore what’s new and upgrade your everyday look today.
              </p>
              <button className="bg-orange-600 h-12 w-34 mt-6 rounded cursor-pointer text-white font-bold hover:bg-gray-300 hover:text-orange-600 hover:border hover:border-orange-600">
                Shop now
              </button>
            </div>
          )}
          {current == 2 && (
            <div ref={slides[1]}>
              <p className="text-6xl font-bold text-orange-700">
                Free Delivery
              </p>
              <p className="text-6xl font-bold text-slate-800">On All Orders</p>
              <p className="text-slate-900 mt-8">
                Enjoy fast and reliable delivery on every order you place. No
                extra costs, no surprises — just smooth shopping from start to
                finish. Shop your favorite products and get them delivered
                straight to your door. Hurry up and take advantage of free
                shipping while it lasts.
              </p>
              <button className="bg-orange-600 h-12 w-34 mt-6 rounded cursor-pointer text-white font-bold hover:bg-gray-300 hover:text-orange-600 hover:border hover:border-orange-600">
                Shop now
              </button>
            </div>
          )}
          <div className="flex gap-2 mt-8 items-center">
            <div
              className={`${current == 0 && `bg-orange-600 w-6 h-6`} cursor-pointer bg-gray-100 w-4 h-4 rounded-full`}
              onClick={() => currentSlide(0)}
            ></div>
            <div
              className={`${current == 1 && `bg-orange-600 w-6 h-6`} cursor-pointer bg-gray-100 w-4 h-4 rounded-full`}
              onClick={() => currentSlide(1)}
            ></div>
            <div
              className={`${current == 2 && `bg-orange-600 w-6 h-6`} cursor-pointer bg-gray-100 w-4 h-4 rounded-full`}
              onClick={() => currentSlide(2)}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
