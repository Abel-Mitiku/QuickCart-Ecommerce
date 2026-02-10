"use client";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      console.log("Subscribed:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const accountItems = [
    { label: "Log in", path: "/login" },
    { label: "Register", path: "/register" },
    { label: "My Account", path: "/profile" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="/logo-quick.png"
                alt="QuickCart Logo"
                className="w-32 h-12 object-contain"
              />
            </div>

            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">New York City, USA</span>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">+1 212 555-0199</span>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">quickcart@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => router.push(item.path)}
                    className="text-gray-600 hover:text-orange-600 transition-colors text-sm font-medium block w-fit"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Account</h3>
            <ul className="space-y-2">
              {accountItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => router.push(item.path)}
                    className="text-gray-600 hover:text-orange-600 transition-colors text-sm font-medium block w-fit"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Newsletter</h3>
            <p className="text-gray-600 text-sm">
              Subscribe to get special offers, free giveaways, and new product
              updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 text-slate-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  aria-label="Email address for newsletter"
                />
              </div>

              <button
                type="submit"
                disabled={!email || subscribed}
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  subscribed
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {subscribed ? "✓ Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} QuickCart. All rights reserved.
            </p>

            <div className="flex gap-6">
              <button
                onClick={() => router.push("/privacy")}
                className="text-gray-500 hover:text-orange-600 text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => router.push("/terms")}
                className="text-gray-500 hover:text-orange-600 text-sm transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
