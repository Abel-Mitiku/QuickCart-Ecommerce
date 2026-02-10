"use client";

import { useState, useEffect } from "react";

interface Product {
  _id?: string;
  type: string;
  src: string;
  price: number;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialData?: Product | null;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  submitError = null,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    src: "/products/",
    price: "",
    category: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          type: initialData.type,
          src: initialData.src,
          price: initialData.price.toString(),
          category: initialData.category,
        });
      } else {
        setFormData({ type: "", src: "/products/", price: "", category: "" });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product: Product = {
      ...(initialData?._id && { _id: initialData._id }),
      type: formData.type,
      src: formData.src,
      price: parseFloat(formData.price),
      category: formData.category,
    };

    onSubmit(product);
  };

  if (!isOpen) return null;

  const isEditMode = !!initialData;
  const title = isEditMode ? "Edit Product" : "Add New Product";
  const submitLabel = isEditMode ? "💾 Update Product" : "➕ Add Product";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border text-slate-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Group products for filtering
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
                Enter numeric value only
              </p>
            </div>

            <div>
              <label
                htmlFor="src"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Image Path <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="src"
                name="src"
                value={formData.src}
                onChange={handleChange}
                placeholder="/products/p1.png"
                className="w-full px-4 py-3 border text-slate-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition font-mono"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Relative path from public folder
              </p>
            </div>
          </div>

          {submitError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-start">
                <span className="mr-2">⚠️</span>
                <span>{submitError}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all transform ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500 active:scale-[0.98]"
              } shadow-md hover:shadow-lg`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
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
                  Processing...
                </span>
              ) : (
                submitLabel
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
