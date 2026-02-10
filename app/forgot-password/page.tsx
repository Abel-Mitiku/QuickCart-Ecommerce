"use client";
import { useState } from "react";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setSuccess(true);
        setSubmitted(true);
        setEmail("");
      } else {
        setError(data.error || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 text-slate-600 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                loading || !email.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email!
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{" "}
              <span className="font-medium text-gray-900">{email}</span>.<br />
              The link will expire in 10 min.
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
