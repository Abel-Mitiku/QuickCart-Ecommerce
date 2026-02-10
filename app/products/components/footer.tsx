"use client";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
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
      setTimeout(() => setSubscribed(false), 2000);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-500">Reach Us</h3>

            <div className="space-y-4 text-slate-300">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                <span className="text-sm">New York City, USA</span>
              </div>

              <div className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                <span className="text-sm">+1 212 555-0199</span>
              </div>

              <div className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                <span className="text-sm">quickcart@gmail.com</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-700">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-orange-600 flex items-center justify-center transition-all duration-300"
                    aria-label={`${social.icon.name} link`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-500">Quick Links</h3>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-slate-300">
              {navLinks.map((link, index) => (
                <li
                  key={link.path}
                  className={`relative cursor-pointer hover:text-orange-500 transition-colors ${
                    index < navLinks.length - 1
                      ? "pr-6 after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-4 after:bg-slate-600"
                      : ""
                  }`}
                  onClick={() => router.push(link.path)}
                >
                  {link.label}
                </li>
              ))}
            </ul>

            <div className="space-y-2 mt-6">
              <h4 className="text-lg font-semibold text-orange-500">Account</h4>
              <ul className="space-y-2 text-slate-300">
                {[
                  { label: "Login", path: "/login" },
                  { label: "Register", path: "/register" },
                  { label: "My Account", path: "/profile" },
                ].map((item) => (
                  <li
                    key={item.path}
                    className="cursor-pointer hover:text-orange-500 transition-colors w-fit"
                    onClick={() => router.push(item.path)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-500">Newsletter</h3>
            <p className="text-slate-300 text-sm">
              Subscribe to get special offers, free giveaways, and new arrivals.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-white text-sm placeholder-slate-400"
                  aria-label="Email address for newsletter"
                />
              </div>

              <button
                type="submit"
                disabled={!email || subscribed}
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  subscribed
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {subscribed ? "✓ Subscribed!" : "Subscribe Now"}
              </button>
            </form>

            <div className="space-y-3 mt-6">
              <h4 className="text-lg font-semibold text-orange-500">
                Payment Methods
              </h4>
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-sm font-medium text-slate-400 border border-slate-600"
                  >
                    {["Visa", "MC", "Amex", "PayPal", "Apple"][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Quick Cart E-commerce Portfolio
              Project by Abel
            </p>

            <div className="flex gap-6 flex-wrap justify-center">
              {[
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" },
                { label: "Shipping", path: "/shipping" },
                { label: "Returns", path: "/returns" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="text-slate-400 hover:text-orange-500 text-sm transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
