"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products:", response.statusText);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const errData = await response.json();
        alert(`Error deleting product: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id, currentIsActive, name) => {
    setTogglingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`/api/admin/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          is_active: !currentIsActive,
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: !currentIsActive } : p))
        );
        const actionText = currentIsActive ? "Product delisted" : "Product listed";
        setToast({ message: actionText });
        setTimeout(() => setToast(null), 3000);
      } else {
        const errData = await response.json();
        alert(`Error updating product status: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating product status:", err);
      alert("Failed to update product status. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center pb-5 border-b border-[#2E3135]/10">
        <div>
          <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
            Products
          </h1>
          <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
            Manage your inventory, pricing, and display settings.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#2E3135] hover:bg-[#CDB38B] text-white px-5 py-3 rounded font-inter text-[11px] font-semibold tracking-[1.5px] uppercase transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Product
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="flex space-x-4 border-b border-gray-100 pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F3F1EC] rounded w-full animate-pulse"></div>
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4 pt-2">
                <div className="h-12 bg-[#F3F1EC]/60 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/3 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/12 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/12 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Image</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Name</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">SKU</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Style Number</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Category</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-right">Price</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Stock</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Status</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                {products.map((product) => {
                  const imageSrc = Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : product.image || "";

                  return (
                    <tr key={product.id} className="hover:bg-[#F3F1EC]/20 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="p-5">
                        <div className="w-[50px] h-[50px] relative rounded-md border border-[#E5E5E5] overflow-hidden bg-[#F3F1EC]">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium bg-[#F3F1EC]">
                              No Img
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="p-5 font-medium max-w-[220px]">
                        <div className="truncate" title={product.name}>
                          {product.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate max-w-[180px]">
                          {product.slug}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-5 font-mono text-[12px] text-[#2E3135] whitespace-nowrap">
                        {product.sku || "-"}
                      </td>

                      {/* Style Number */}
                      <td className="p-5 font-mono text-[12px] text-[#2E3135]/80 whitespace-nowrap">
                        {product.style_number || "-"}
                      </td>

                      {/* Category */}
                      <td className="p-5 text-gray-500 uppercase text-[11px] tracking-wider font-semibold">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="p-5 text-right font-medium text-[14px]">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                        {product.compare_price && (
                          <div className="text-[11px] text-gray-400 line-through font-light mt-0.5">
                            ₹{Number(product.compare_price).toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-5 text-center font-mono text-[13px]">
                        <div className="flex items-center justify-center gap-2">
                          <span>{product.stock_quantity ?? product.stock ?? 0}</span>
                          {(product.stock_quantity ?? product.stock ?? 0) === 0 ? (
                            <span className="bg-[#DC2626] text-white font-inter font-medium text-[10px] tracking-[1px] uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                              Out of Stock
                            </span>
                          ) : (product.stock_quantity ?? product.stock ?? 0) >= 1 && (product.stock_quantity ?? product.stock ?? 0) <= 5 ? (
                            <span className="bg-[#D97706] text-white font-inter font-medium text-[10px] tracking-[1px] uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                              Low Stock
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                            product.is_active
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {product.is_active ? "Active" : "Delisted"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 hover:bg-[#F3F1EC] text-gray-600 hover:text-[#CDB38B] rounded transition-all"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4 stroke-[1.5]" />
                          </Link>
                          <button
                            onClick={() => handleToggleActive(product.id, product.is_active, product.name)}
                            disabled={togglingId === product.id}
                            className="p-2 hover:bg-[#F3F1EC] text-gray-600 hover:text-[#CDB38B] rounded transition-all disabled:opacity-50"
                            title={product.is_active ? "Delist Product" : "List Product"}
                          >
                            {togglingId === product.id ? (
                              <div className="w-4 h-4 border-2 border-[#CDB38B] border-t-transparent rounded-full animate-spin"></div>
                            ) : product.is_active ? (
                              <Eye className="w-4 h-4 stroke-[1.5]" />
                            ) : (
                              <EyeOff className="w-4 h-4 stroke-[1.5]" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deletingId === product.id}
                            className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded transition-all disabled:opacity-50"
                            title="Delete Product"
                          >
                            {deletingId === product.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4 stroke-[1.5]" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <h3 className="font-serif font-normal text-[24px] text-[#2E3135] mb-2 uppercase">
              No Products Found
            </h3>
            <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px] mb-6">
              Your store currently does not have any items in the inventory. Click below to add your first product.
            </p>
            <Link
              href="/admin/products/new"
              className="px-6 py-3.5 bg-[#2E3135] text-white font-inter font-semibold text-[11px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300 rounded shadow"
            >
              Add First Product
            </Link>
          </div>
        )}
      </div>
      {toast && (
        <>
          <style>{`
            @keyframes slideInUp {
              from {
                transform: translateY(100%) scale(0.9);
                opacity: 0;
              }
              to {
                transform: translateY(0) scale(1);
                opacity: 1;
              }
            }
            .animate-toast {
              animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#2E3135] text-white px-5 py-3.5 rounded shadow-xl border border-[#CDB38B]/40 font-inter text-[13px] tracking-wide animate-toast">
            <div className="w-2 h-2 rounded-full bg-[#CDB38B] animate-pulse"></div>
            <span>{toast.message}</span>
          </div>
        </>
      )}
    </div>
  );
}
