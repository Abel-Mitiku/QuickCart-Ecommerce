"use client";
import { Wrench, RefreshCw, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function MaintenancePage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Wrench className="w-10 h-10 text-white" strokeWidth={1.8} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            We'll Be Right Back!
          </h1>
          <p className="text-orange-100 text-lg">
            Quick<span className="text-orange-300">Cart</span> is getting an
            upgrade
          </p>
        </div>

        <div className="p-8">
          <div className="text-center space-y-6">
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-2">
                Sorry for the inconvenience
              </p>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We're currently performing scheduled maintenance to bring you an
                even better shopping experience. Our team is working hard to get
                everything ready for you!
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  Estimated time remaining:
                </span>
              </div>
              <div className="flex justify-center gap-4">
                {[
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-orange-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: RefreshCw,
                  title: "Refreshing Design",
                  desc: "A sleeker, faster interface",
                },
                {
                  icon: Wrench,
                  title: "Upgrading Systems",
                  desc: "Better performance & security",
                },
                {
                  icon: Clock,
                  title: "Adding Features",
                  desc: "More ways to shop smarter",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => router.push("/")}
                className="px-8 py-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                ← Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-white text-orange-600 font-bold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors w-full sm:w-auto"
              >
                Check Again
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Need immediate help?{" "}
              <a
                href="mailto:support@quickcart.com"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} QuickCart. We appreciate your patience!
          </p>
        </div>
      </div>
    </div>
  );
}
