"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { Plus, Edit3, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [productCounts, setProductCounts] = useState({});

  const fetchCollections = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const collectionsRes = await fetch("/api/admin/collections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (collectionsRes.ok) {
        const data = await collectionsRes.json();
        setCollections(data);
        
        // Fetch product counts for these collections
        // For efficiency in a larger app this would be an RPC or an aggregated query
        // But for our purposes, we can fetch all products and count, or make separate queries.
        // We'll fetch all products once to count.
        const productsRes = await fetch("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (productsRes.ok) {
          const products = await productsRes.json();
          const counts = {};
          data.forEach(c => {
            counts[c.id] = products.filter(p => p.collection_ids?.includes(c.id)).length;
          });
          setProductCounts(counts);
        }
      } else {
        console.error("Failed to fetch collections:", collectionsRes.statusText);
      }
    } catch (err) {
      console.error("Error loading collections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will remove it from all products.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`/api/admin/collections?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCollections((prev) => prev.filter((c) => c.id !== id));
      } else {
        const errData = await response.json();
        alert(`Error deleting collection: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting collection:", err);
      alert("Failed to delete collection. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center pb-5 border-b border-[#2E3135]/10">
        <div>
          <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
            Collections
          </h1>
          <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
            Manage your product collections and group items together.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 bg-[#2E3135] hover:bg-[#CDB38B] text-white px-5 py-3 rounded font-inter text-[11px] font-semibold tracking-[1.5px] uppercase transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Collection
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="flex space-x-4 border-b border-gray-100 pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F3F1EC] rounded w-full animate-pulse"></div>
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4 pt-2">
                <div className="h-12 bg-[#F3F1EC]/60 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/3 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
              </div>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Cover Image</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Name & Slug</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Products</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                {collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-[#F3F1EC]/20 transition-colors">
                    {/* Image Thumbnail */}
                    <td className="p-5">
                      <div className="w-[80px] h-[50px] relative rounded-md border border-[#E5E5E5] overflow-hidden bg-[#F3F1EC]">
                        {collection.cover_image_url ? (
                          <img
                            src={collection.cover_image_url}
                            alt={collection.name}
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
                    <td className="p-5 font-medium max-w-[300px]">
                      <div className="truncate text-[14px]" title={collection.name}>
                        {collection.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate max-w-[250px]">
                        /{collection.slug}
                      </div>
                    </td>

                    {/* Products Count */}
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[12px] font-mono font-medium">
                        {productCounts[collection.id] !== undefined ? productCounts[collection.id] : "..."} items
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/admin/collections/edit/${collection.id}`}
                          className="p-2 hover:bg-[#F3F1EC] text-gray-600 hover:text-[#CDB38B] rounded transition-all"
                          title="Edit Collection"
                        >
                          <Edit3 className="w-4 h-4 stroke-[1.5]" />
                        </Link>
                        <button
                          onClick={() => handleDelete(collection.id, collection.name)}
                          disabled={deletingId === collection.id}
                          className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded transition-all disabled:opacity-50"
                          title="Delete Collection"
                        >
                          {deletingId === collection.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <h3 className="font-serif font-normal text-[24px] text-[#2E3135] mb-2 uppercase">
              No Collections Found
            </h3>
            <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px] mb-6">
              You haven't created any collections yet. Group your products together for better discovery.
            </p>
            <Link
              href="/admin/collections/new"
              className="px-6 py-3.5 bg-[#2E3135] text-white font-inter font-semibold text-[11px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300 rounded shadow"
            >
              Add First Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
