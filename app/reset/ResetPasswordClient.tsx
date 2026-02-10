"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  XCircle,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      console.log(token);

      if (!token) {
        if (isMounted.current) {
          setError("Invalid reset link: Missing token");
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`/api/reset?token=${token}`);
        if (!isMounted.current) return;

        const data = await res.json();
        if (!isMounted.current) return;

        if (data.success) {
          setIsValidToken(true);
          setUserEmail(data.email || "");
        } else {
          setError(data.error || "Invalid or expired reset token");
        }
      } catch (err) {
        if (isMounted.current) {
          setError("Failed to validate reset token. Please try again.");
          console.error("Token validation error:", err);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    if (success) {
      redirectTimer = setTimeout(() => {
        if (isMounted.current) {
          router.push("/login");
        }
      }, 2000);
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 10) {
      setError("Password must be at least 10 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/updatePassword?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      if (!isMounted.current) return;

      const data = await res.json();
      console.log(data);
      if (!isMounted.current) return;

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch (err) {
      if (isMounted.current) {
        setError("An error occurred. Please try again.");
        console.error("Password update error:", err);
      }
    } finally {
      if (isMounted.current) {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Validating Token...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your reset link...
          </p>
        </div>
      </div>
    );
  }

  if (error && !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Link Invalid
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <div className="flex items-start">
              <XCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>
                Please request a new password reset link from the{" "}
                <a
                  href="/forgot-password"
                  className="underline hover:text-red-800 font-medium"
                >
                  Forgot Password
                </a>{" "}
                page.
              </span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <Mail className="w-4 h-4 mr-1.5" />
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Password Updated!
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully changed.
            <br />
            Redirecting to login...
          </p>
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              aria-label="Go to login immediately"
            >
              <Mail className="w-4 h-4 mr-1.5" />
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          {userEmail && (
            <p className="text-gray-600">
              Enter a new password for{" "}
              <span className="font-medium text-gray-900">{userEmail}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-slate-600 pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter new password"
                disabled={isSubmitting}
                minLength={8}
                required
                // aria-invalid={password && password.length < 8 ? "true":"false"}
                aria-describedby={
                  password && password.length < 8 ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {password && password.length < 8 && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-slate-600 pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Confirm new password"
                disabled={isSubmitting}
                required
                // aria-invalid={confirmPassword && password !== confirmPassword ? "true":"false"}
                aria-describedby={
                  confirmPassword && password !== confirmPassword
                    ? "confirm-error"
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p
                id="confirm-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                Passwords do not match
              </p>
            )}
          </div>

          {error && isValidToken && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start"
              role="alert"
            >
              <XCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              password.length < 8 ||
              password !== confirmPassword
            }
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
              isSubmitting ||
              password.length < 10 ||
              password !== confirmPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            // aria-busy={isSubmitting ? "true":"false"}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Updating Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mx-auto"
            aria-label="Back to login page"
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
