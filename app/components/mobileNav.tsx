"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  Info,
  Mail,
  ShoppingCart,
  X,
  Search as SearchIcon,
  User,
  ChevronLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close nav and reset search when navigating
  const handleNavigation = (path: string) => {
    if (path === pathname) return;
    router.push(path);
    setIsSearchActive(false);
    onClose();
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchActive(false);
      onClose();
    }
  };

  // Handle search button click
  const triggerSearch = () => {
    if (searchQuery.trim()) {
      handleSearch(new Event("submit") as unknown as React.FormEvent);
    } else {
      searchInputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  // Helper to check active state
  const isActive = (path: string) =>
    pathname === path || (path === "/" && pathname === "/");

  return (
    <div
      className="fixed inset-0 bg-white z-50 p-4 animate-fade-in min-[800px]:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Close button - top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Close menu"
      >
        <X size={24} aria-hidden="true" />
      </button>

      {/* Search mode */}
      {isSearchActive ? (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => {
                setIsSearchActive(false);
                setSearchQuery(""); // Reset query when exiting search
              }}
              className="p-1.5 hover:bg-gray-100 rounded-full mr-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Back to menu"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Search</h2>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                autoFocus
                className="w-full p-4 pl-10 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                aria-label="Search store"
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e as any)}
              />
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
                aria-hidden="true"
              />

              {/* SEARCH BUTTON (RIGHT SIDE) - ALWAYS VISIBLE */}
              <button
                type="button"
                onClick={triggerSearch}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                  searchQuery.trim()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "text-gray-400 hover:text-orange-500"
                }`}
                aria-label={
                  searchQuery.trim()
                    ? "Search"
                    : "Click to search (or press Enter)"
                }
                title={searchQuery.trim() ? "Search" : "Type to search"}
              >
                <SearchIcon size={18} aria-hidden="true" />
              </button>

              {/* CLEAR BUTTON (OVERLAPS SEARCH BUTTON WHEN NEEDED) */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 p-1"
                  aria-label="Clear search"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Optional: Keep "Cancel" button below for explicit exit */}
            <button
              type="button"
              onClick={() => {
                setIsSearchActive(false);
                setSearchQuery("");
              }}
              className="mt-3 w-full py-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
              aria-label="Cancel search"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        /* Navigation menu with icons for EVERY item */
        <ul className="flex flex-col gap-2 mt-8">
          {[
            { name: "Home", path: "/", icon: Home, active: isActive("/") },
            {
              name: "Products",
              path: "/products",
              icon: Package,
              active: isActive("/products"),
            },
            {
              name: "About",
              path: "/about",
              icon: Info,
              active: isActive("/about"),
            },
            {
              name: "Contact",
              path: "/contact",
              icon: Mail,
              active: isActive("/contact"),
            },
            {
              name: "Cart",
              path: "/cart",
              icon: ShoppingCart,
              active: isActive("/cart"),
            },
            {
              name: "Account",
              path: "/profile",
              icon: User,
              active: isActive("/profile"),
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 w-full py-3 px-2 rounded-lg transition-colors ${
                    item.active
                      ? "bg-orange-50 text-orange-700 font-semibold"
                      : "hover:bg-gray-50 text-gray-700 hover:text-orange-600"
                  }`}
                  aria-current={item.active ? "page" : undefined}
                >
                  <Icon
                    size={20}
                    className={item.active ? "text-orange-600" : ""}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}

          {/* Dedicated Search button */}
          <li>
            <button
              onClick={() => {
                setIsSearchActive(true);
                // Focus will be handled by autoFocus in input
              }}
              className="flex items-center gap-3 w-full py-3 px-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-orange-600 mt-2"
              aria-label="Open search"
            >
              <SearchIcon size={20} aria-hidden="true" />
              <span className="font-medium">Search</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
