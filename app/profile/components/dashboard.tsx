"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { set } from "mongoose";
import { useRouter } from "next/navigation";

interface user {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
}
interface order {
  productId: string;
  date: Date;
  type: string;
  subTotal: number;
  status: string;
  items: number;
}

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<user | null>(null);
  const [orders, setOrders] = useState<order[] | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    const check = window.confirm("Do you want to log out?");
    if (check) {
      try {
        const res = await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          window.location.href = "/";
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/checkLogin", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        window.location.href = "/login";
      } else {
        const res = await fetch("/api/fetchUser", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          setUser(data.userInfo[0]);
        } else {
          // window.location.href = "/login";
          // console.log(data.error);
        }
      }
    };

    const fetchOrders = async () => {
      const res = await fetch("/api/fetchOrders", {
        method: "POST",
        body: JSON.stringify({ userId: user?._id }),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.result.result);
      if (data.success) {
        setOrders(data.result.result);
      } else {
        setOrders([]);
      }
    };
    fetchUser();
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-800">My Account</h1>
          <p className="text-gray-600 mt-1">Manage your profile and orders</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  {user && (
                    <p className="font-bold text-slate-800">
                      {user?.firstName}
                    </p>
                  )}
                  {user && (
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  )}
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === "overview"
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === "profile"
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === "orders"
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Order History</span>
                </button>

                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === "payment"
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </button>

                <div className="border-t my-3"></div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Personal Information
                    </h2>
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                      Edit Profile →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <User className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
                      {user && (
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-slate-800">
                            {user?.firstName}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-slate-800">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-slate-800">
                          {user?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Shipping Address
                        </p>
                        <p className="font-medium text-slate-800">
                          {user?.streetAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      View All →
                    </button>
                  </div>

                  {orders && orders?.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.productId}
                          className="border rounded-lg p-5 hover:shadow-md transition cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-lg text-slate-600">
                                Order #{order.productId}
                              </p>
                              {/* <p className="text-gray-600 text-sm mt-1">
                                {order.date}
                              </p> */}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-gray-600">
                              <Package className="w-4 h-4" />
                              <span>
                                {order.type} item{order.items > 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-slate-600">
                                ${order.subTotal.toFixed(2)}
                              </p>
                              <button className="text-orange-600 hover:text-orange-700 text-sm mt-1">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <button
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                        onClick={() => router.push("/products")}
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Edit Profile
                </h2>

                <form className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.firstName}
                      id="name"
                      className="w-full text-slate-600 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      id="email"
                      className="w-full text-slate-600 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      id="phone"
                      className="w-full px-4 text-slate-600 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <textarea
                      defaultValue={user?.streetAddress}
                      rows={3}
                      id="address"
                      className="w-full text-slate-600 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    All Orders
                  </h2>
                  <button className="text-gray-600 hover:text-orange-600 text-sm">
                    ← Back to Overview
                  </button>
                </div>

                {orders && orders?.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.productId}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div>
                            <p className="font-bold text-lg text-slate-600">
                              Order #{order.productId}
                            </p>
                            {/* <p className="text-gray-600 text-sm mt-1">
                              {order.date}
                            </p> */}
                          </div>

                          <div>
                            <p className="text-gray-600 text-sm">Status</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </div>

                          <div>
                            <p className="text-gray-600 text-sm text-slate-600">
                              Items
                            </p>
                            <p className="font-medium mt-1 text-slate-600">
                              {order.items}
                            </p>
                            <p className="font-medium mt-1 text-slate-600">
                              {order.type}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-slate-600">
                              ${order.subTotal.toFixed(2)}
                            </p>
                            <button className="text-orange-600 hover:text-orange-700 mt-2">
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-4">
                      No orders found
                    </p>
                    <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Payment Methods
                  </h2>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700">
                    Add New Card
                  </button>
                </div>

                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No payment methods saved</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Add a payment method to make checkout faster and easier
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
