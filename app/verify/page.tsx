"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<any | null>(null);
  const [resend, setResend] = useState<boolean>(false);
  const [message, setMessage] = useState<any | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`/api/verify?token=${token}`);
      const data = await res.json();

      console.log(data);

      if (data.result.error) {
        setError(data.result.error);
        setResend(true);
      } else {
        alert(data.result.message);
        setMessage(data.result.message);
      }
    };
    verifyToken();
  }, []);

  const handleResend = async () => {
    const res = await fetch("/api/resendVerification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    console.log(data);
    if (!data.success) {
      setError(data.error);
    } else {
      alert(data.message);
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-indigo-100 mt-1">Secure your account access</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-3 text-red-700 font-medium">{error}</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Didn't receive the email? Check your spam folder or request a
                  new verification link below.
                </p>

                <button
                  onClick={handleResend}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 text-white font-medium py-3 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Resend Verification Email
                </button>

                <p className="text-sm text-gray-500">
                  Link expires in 15 minutes • Max 10 attempts per 10 min
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="space-y-6 text-center">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-3 text-green-700 font-medium">{message}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600">
                  Your email has been successfully verified! You may now access
                  your account.
                </p>

                <a
                  href="/"
                  className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200 text-white font-medium py-3 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Go to Login
                </a>

                <p className="text-sm text-gray-500">
                  Redirecting automatically in 5 seconds...
                </p>
              </div>
            </div>
          )}

          {!error && !message && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Verifying your email...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
