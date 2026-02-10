"use client";
import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("USA");

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
      newErrors.phone = "Invalid phone number format";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters";
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    if (!street.trim()) {
      newErrors.street = "Street address is required";
      isValid = false;
    }
    if (!city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      console.log(data.errors);

      if (data.success) {
        alert(data.message);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.errors || "Registration failed" });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-800">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join Quick Cart and start shopping today
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 bg-orange-50 border-b">
              <h3 className="text-xl font-bold text-slate-800">
                Personal Information
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700 font-medium">{errors.submit}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) {
                          setErrors((prev: Record<string, string>) => ({
                            ...prev,
                            firstName: undefined,
                          }));
                        }
                      }}
                      className={`block w-full pl-10 pr-4 py-3 border text-slate-800 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="John"
                      required
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) {
                          setErrors((prev: Record<string, string>) => ({
                            ...prev,
                            lastName: undefined,
                          }));
                        }
                      }}
                      name="last-name"
                      className={`block w-full pl-10 pr-4 py-3 border text-slate-800 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Doe"
                      required
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    name="phone"
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          phone: undefined,
                        }));
                      }
                    }}
                    className={`block w-full pl-10 pr-4 py-3 border text-slate-800 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="+1 (212) 555-0199"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    className={`block w-full pl-10 pr-4 py-3 border text-slate-800 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      name="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev: Record<string, string>) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      className={`block w-full pl-10 pr-12 py-3 border text-slate-800 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      name="confirm-password"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev: Record<string, string>) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      className={`block w-full pl-10 pr-12 py-3 border text-slate-800 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-50 border-b">
              <h3 className="text-xl font-bold text-slate-800">
                Shipping Address
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Street Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="street"
                    type="text"
                    value={street}
                    name="street-address"
                    onChange={(e) => {
                      setStreet(e.target.value);
                      if (errors.street) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          street: undefined,
                        }));
                      }
                    }}
                    className={`block w-full pl-10 pr-4 py-3 border text-slate-800 ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    name="city"
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          city: undefined,
                        }));
                      }
                    }}
                    className={`block w-full px-4 py-3 border text-slate-800 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="New York"
                    required
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    State *
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    name="state"
                    onChange={(e) => {
                      setState(e.target.value);
                      if (errors.state) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          state: undefined,
                        }));
                      }
                    }}
                    className={`block w-full px-4 py-3 border text-slate-800 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="NY"
                    required
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ZIP Code *
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    value={zipCode}
                    name="zip-code"
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      if (errors.zipCode) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          zipCode: undefined,
                        }));
                      }
                    }}
                    className={`block w-full px-4 py-3 border text-slate-800 ${
                      errors.zipCode ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="10001"
                    required
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Country *
                </label>
                <select
                  id="country"
                  value={country}
                  name="country"
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (errors.country) {
                      setErrors((prev: Record<string, string>) => ({
                        ...prev,
                        country: undefined,
                      }));
                    }
                  }}
                  className="block w-full px-4 py-3 border border-gray-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AUS">Australia</option>
                  <option value="IND">India</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-6 bg-gray-50 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="px-6 py-4 text-center border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
