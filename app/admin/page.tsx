"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Package,
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import { ProductModal } from "./editOverlay";

interface Product {
  _id?: string;
  type: string;
  src: string;
  price: number;
  category: string;
}
interface user {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<any[] | null>(null); // Will be populated when backend ready
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmiting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const [ordersLoading, setOrdersLoaing] = useState<boolean>(false);
  const [users, setUsers] = useState<user[] | null>(null);

  const [formData, setFormData] = useState({
    type: "",
    src: "/products/",
    price: "",
    category: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/checkLogin", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (!data.success) {
          router.push("/login");
          return;
        }

        const roleRes = await fetch("/api/role", {
          method: "POST",
          credentials: "include",
        });
        const roleData = await roleRes.json();

        if (roleData.success) {
          const productsRes = await fetch("/api/allProducts", {
            method: "POST",
          });
          const productsData = await productsRes.json();

          if (productsData.success) {
            setProducts(productsData.result);
          } else {
            setError("Failed to fetch products");
          }
          const orderRes = await fetch("/api/allOrders");
          const orderData = await orderRes.json();
          console.log(orderData);
          if (orderData.success) {
            setOrders(orderData.orders);
          } else {
            alert(orderData.error);
          }
          const userRes = await fetch("/api/allUsers");
          const data = await userRes.json();
          console.log(data);
          if (data.success) {
            setUsers(data.users);
          }
        } else {
          setError(roleData.error || "Unauthorized access");
        }
      } catch (err) {
        setError("An error occurred during authentication");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (product: Product) => {
    setSubmitError(null);
    const res = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ product }),
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      alert(data.message);
      setIsModalOpen(false);
    } else {
      setSubmitError(data.error);
    }
  };

  const handleDelete = async (productId: string) => {
    const des = confirm("Are you sure you want to delete this product?");
    if (des) {
      const res = await fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        const productsRes = await fetch("/api/allProducts", {
          method: "POST",
        });
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.result);
        }
      } else {
        alert(data.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">QC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quick<span className="text-orange-600">Cart</span> Admin
                </h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Package className="w-5 h-5" />
                Manage Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                View Orders
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-orange-500" />
                  Add New Product
                </h2>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="e.g., Men's Shirt, Women's Dress"
                    className="w-full px-4 py-3 text-slate-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Visible product name shown to customers
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Shirt, Dress, Pants"
                    className="w-full px-4 py-3 text-slate-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Group products for filtering (case-sensitive)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="79.99"
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-3 text-slate-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter numeric value only (no currency symbols)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="src"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Image Path <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="src"
                      name="src"
                      value={formData.src}
                      onChange={handleChange}
                      placeholder="/products/p1.png"
                      className="w-full px-4 py-3 border text-slate-600 border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      required
                    />
                    <button
                      type="button"
                      className="px-4 bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 transition flex items-center"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      📁 Upload
                    </button>
                    <input
                      title="file"
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            src: `/products/${file.name}`,
                          }));
                        }
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Relative path from public folder (e.g., /products/p1.png)
                  </p>
                </div>

                <div className="md:col-span-2 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-500" />
                    Product Catalog
                  </h2>
                  <p className="mt-1 text-gray-600">
                    Total products: {products?.length || 0}
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products?.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {product._id?.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                            <img
                              src={product.src}
                              alt={product.type}
                              className="max-w-full max-h-full object-contain p-1"
                              onError={(e) =>
                                (e.currentTarget.innerHTML =
                                  '<div class="text-xs text-gray-400">No image</div>')
                              }
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {product.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-600">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 transition-colors flex items-center gap-1"
                            onClick={() => {
                              if (product._id) {
                                handleDelete(product._id?.toString());
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products && products.length === 0 && (
                <div className="text-center py-12 bg-gray-50">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-medium text-gray-900">
                    No products found
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Add your first product using the form above
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-green-500" />
                Order Management
              </h2>
            </div>

            {ordersLoading && orders === null && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading orders...</p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!ordersLoading && orders !== null && orders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900">
                  No orders yet
                </h3>
                <p className="mt-1 text-gray-600">
                  Customers haven't placed any orders.
                </p>
              </div>
            )}

            {!ordersLoading && orders && orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                          #{order._id.toString().padStart(6, "0")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">
                              {
                                users?.find((user) => user._id === order.userId)
                                  ?.firstName
                              }
                            </p>
                            <p className="text-xs text-gray-500">
                              {
                                users?.find((user) => user._id === order.userId)
                                  ?.email
                              }
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.quantity} item
                          {order.quantity > 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "processing" ||
                                    order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              router.push(`/admin/order/${order.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1 group"
                            aria-label={`View details for order #${order.id}`}
                          >
                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
                  <p>
                    Showing {orders.length} order
                    {orders.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
                      1
                    </button>
                    <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSubmitError(null);
          }}
          onSubmit={handleProductSubmit}
          initialData={editingProduct}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </div>
    </div>
  );
}
