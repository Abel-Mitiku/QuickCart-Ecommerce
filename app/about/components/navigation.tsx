"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import "../../style.css";
import { MobileNav } from "@/app/components/mobileNav";

export function Navigation() {
  const [current, setCurrent] = useState<number | null>(2);
  const [search, setSearch] = useState<boolean | null>(false);
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [term, setTerm] = useState<string>("");
  const router = useRouter();

  return (
    <nav className="width-full flex justify-between items-center bg-white text-black dark:text-black shadow:b-lg relative">
      <a href="#">
        <img src="/logo-quick.png" title="logo" className="w-38 h-18 ml-8" />
      </a>
      <Menu
        className="burger mr-4"
        onClick={() => setMobileNav((prev) => !prev)}
      />
      {mobileNav && (
        <MobileNav isOpen={mobileNav} onClose={() => setMobileNav(false)} />
      )}
      <ul className="flex gap-6 font-bold mr-28 text-lg navigation">
        <li
          className={`hover:text-orange-600 cursor-pointer`}
          onClick={() => router.push("/")}
        >
          Home
        </li>
        <li
          className="hover:text-orange-600 cursor-pointer"
          onClick={() => router.push("products")}
        >
          Products
        </li>
        <li
          className={`hover:text-orange-600 cursor-pointer ${current == 2 && `text-orange-600`}`}
          onClick={() => router.push("about")}
        >
          About
        </li>
        <li
          className="hover:text-orange-600 cursor-pointer"
          onClick={() => router.push("contact")}
        >
          Contact
        </li>
        <li
          className="hover:text-orange-600 cursor-pointer"
          onClick={() => router.push("cart")}
        >
          <ShoppingCart />
        </li>
        <li
          className="hover:text-orange-600 cursor-pointer"
          onClick={() => setSearch((prev) => !prev)}
        >
          <Search />
        </li>
        <li
          className="hover:text-orange-600 cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <User />
        </li>
      </ul>
      {search && (
        <div className="absolute top-14 right-4 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                id="search-term"
                name="search-term"
                placeholder="Search products..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-5 py-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  console.log("term", term);
                  router.push(`/search?q=${term}`);
                }}
                className="flex-1 py-3 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSearch(false)}
                className="flex-1 py-3 rounded-full font-bold text-orange-600 border-2 border-orange-500 bg-white hover:bg-orange-50 hover:border-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500 text-center">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-xs">
                Enter
              </kbd>{" "}
              to search
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
