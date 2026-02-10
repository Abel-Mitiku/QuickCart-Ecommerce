// components/Logo.tsx
"use client";
import { useRouter } from "next/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function Logo({ size = "md", clickable = true }: LogoProps) {
  const router = useRouter();

  const sizes = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const handleClick = () => {
    if (clickable) router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2.5 ${clickable ? "cursor-pointer hover:opacity-90 transition-opacity" : "cursor-default"}`}
      aria-label={clickable ? "Go to homepage" : "QuickCart logo"}
    >
      {/* High-contrast logo badge for white background */}
      <div
        className={`bg-orange-600 rounded-full flex items-center justify-center ${sizes[size]} shadow-md`}
      >
        <span className="text-white font-bold tracking-tight">QC</span>
      </div>

      {/* Brand text with dark "Quick" + orange "Cart" */}
      <span className={`font-bold ${textSizes[size]} text-gray-800`}>
        Quick<span className="text-orange-600">Cart</span>
      </span>
    </button>
  );
}
