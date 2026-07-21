"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { Plus, Edit3, Trash2, X, Check } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_percentage: "",
    collection_id: "",
    start_date: "",
    end_date: "",
    is_active: true,
    show_in_banner: false,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      discount_percentage: "",
      collection_id: "",
      start_date: "",
      end_date: "",
      is_active: true,
      show_in_banner: false,
    });
    setEditingId(null);
    setError("");
  };

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      // Fetch promo codes via API
      const codesRes = await fetch("/api/admin/promo-codes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (codesRes.ok) {
        const codes = await codesRes.json();
        setPromoCodes(codes || []);
      } else {
        console.error("Error fetching promo codes:", codesRes.statusText);
      }

      // Fetch collections for dropdown via API
      const colsRes = await fetch("/api/admin/collections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (colsRes.ok) {
        const cols = await colsRes.json();
        setCollections(cols || []);
      } else {
        console.error("Error fetching collections:", colsRes.statusText);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-dismiss success messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError("Unauthorized");
        setSaving(false);
        return;
      }

      const codeUpper = formData.code.trim().toUpperCase();

      if (!codeUpper) {
        setError("Promo code is required.");
        setSaving(false);
        return;
      }

      if (!formData.discount_percentage || parseFloat(formData.discount_percentage) <= 0 || parseFloat(formData.discount_percentage) > 100) {
        setError("Discount must be between 1 and 100.");
        setSaving(false);
        return;
      }

      // Validate uniqueness locally using the loaded promoCodes
      const isDuplicate = promoCodes.some(
        (p) => p.code.toUpperCase() === codeUpper && p.id !== editingId
      );

      if (isDuplicate) {
        setError(`A promo code "${codeUpper}" already exists.`);
        setSaving(false);
        return;
      }

      const payload = {
        code: codeUpper,
        discount_percentage: parseFloat(formData.discount_percentage),
        collection_id: formData.collection_id || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
        show_in_banner: formData.show_in_banner,
      };

      if (editingId) {
        // Update via API
        const response = await fetch("/api/admin/promo-codes", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: editingId, ...payload }),
        });

        if (!response.ok) {
          const errData = await response.json();
          setError(`Failed to update: ${errData.error || response.statusText}`);
          setSaving(false);
          return;
        }
        setSuccessMsg(`Promo code "${codeUpper}" updated successfully.`);
      } else {
        // Insert via API
        const response = await fetch("/api/admin/promo-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json();
          setError(`Failed to save: ${errData.error || response.statusText}`);
          setSaving(false);
          return;
        }
        setSuccessMsg(`Promo code "${codeUpper}" created successfully.`);
      }

      resetForm();
      setShowForm(false);
      await fetchData();
    } catch (err) {
      console.error("Save error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (promo) => {
    setEditingId(promo.id);
    setFormData({
      code: promo.code || "",
      discount_percentage: promo.discount_percentage?.toString() || "",
      collection_id: promo.collection_id || "",
      start_date: promo.start_date ? promo.start_date.split("T")[0] : "",
      end_date: promo.end_date ? promo.end_date.split("T")[0] : "",
      is_active: promo.is_active ?? true,
      show_in_banner: promo.show_in_banner ?? false,
    });
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        alert("Unauthorized");
        return;
      }

      const response = await fetch(`/api/admin/promo-codes?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`Error deleting: ${errData.error || response.statusText}`);
      } else {
        setPromoCodes((prev) => prev.filter((p) => p.id !== id));
        setSuccessMsg(`Promo code "${code}" deleted.`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (promo) => {
    const newVal = !promo.is_active;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const response = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: promo.id, is_active: newVal }),
      });

      if (response.ok) {
        setPromoCodes((prev) =>
          prev.map((p) => (p.id === promo.id ? { ...p, is_active: newVal } : p))
        );
      } else {
        console.error("Failed to toggle status");
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-5 border-b border-[#2E3135]/10">
        <div>
          <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
            Promo Codes
          </h1>
          <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
            Create and manage discount codes for your collections.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-[#2E3135] hover:bg-[#CDB38B] text-white px-5 py-3 rounded font-inter text-[11px] font-semibold tracking-[1.5px] uppercase transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {showForm ? (
            <>
              <X className="w-3.5 h-3.5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add Promo Code
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded font-inter text-[13px]">
          <Check className="w-4 h-4 text-green-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-6 sm:p-8">
          <h2 className="font-serif font-normal text-[24px] text-[#2E3135] uppercase mb-6">
            {editingId ? "Edit Promo Code" : "New Promo Code"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 font-inter text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Code + Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                  Promo Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. BRIDAL20"
                  className="w-full h-11 border border-[#E5E5E5] bg-white rounded focus:outline-none focus:border-[#CDB38B] px-4 font-inter text-[14px] text-[#2E3135] font-mono tracking-wider uppercase"
                  required
                />
              </div>
              <div>
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                  Discount Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="e.g. 20"
                    className="w-full h-11 border border-[#E5E5E5] bg-white rounded focus:outline-none focus:border-[#CDB38B] px-4 pr-10 font-inter text-[14px] text-[#2E3135]"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] font-inter text-[14px]">%</span>
                </div>
              </div>
            </div>

            {/* Row 2: Collection */}
            <div>
              <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                Collection (optional — leave blank for store-wide)
              </label>
              <select
                value={formData.collection_id}
                onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                className="w-full sm:w-1/2 h-11 border border-[#E5E5E5] bg-white rounded focus:outline-none focus:border-[#CDB38B] px-4 font-inter text-[14px] text-[#2E3135] appearance-none"
                required
              >
                <option value="" disabled>Select a collection</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                  Start Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full h-11 border border-[#E5E5E5] bg-white rounded focus:outline-none focus:border-[#CDB38B] px-4 font-inter text-[14px] text-[#2E3135]"
                />
              </div>
              <div>
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full h-11 border border-[#E5E5E5] bg-white rounded focus:outline-none focus:border-[#CDB38B] px-4 font-inter text-[14px] text-[#2E3135]"
                />
              </div>
            </div>

            {/* Row 4: Toggles */}
            <div className="flex flex-wrap gap-8">
              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                    formData.is_active ? "bg-[#2E3135]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      formData.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="font-inter text-[13px] text-[#2E3135]">Active</span>
              </label>

              {/* Show in Banner Toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setFormData({ ...formData, show_in_banner: !formData.show_in_banner })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                    formData.show_in_banner ? "bg-[#CDB38B]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      formData.show_in_banner ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="font-inter text-[13px] text-[#2E3135]">Show in Banner</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#2E3135] text-white font-inter font-semibold text-[11px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-all duration-300 rounded shadow-md disabled:opacity-60"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : editingId ? (
                  "Update Promo Code"
                ) : (
                  "Create Promo Code"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="flex space-x-4 border-b border-gray-100 pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F3F1EC] rounded w-full animate-pulse" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4 pt-2">
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto" />
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto" />
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto" />
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto" />
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto" />
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/12 animate-pulse my-auto" />
              </div>
            ))}
          </div>
        ) : promoCodes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Code</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Discount</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Collection</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Status</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Date Range</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Banner</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                {promoCodes.map((promo) => (
                  <tr key={promo.id} className="hover:bg-[#F3F1EC]/20 transition-colors">
                    {/* Code */}
                    <td className="p-5">
                      <span className="font-mono font-semibold text-[14px] tracking-wider bg-[#F3F1EC] px-3 py-1 rounded">
                        {promo.code}
                      </span>
                    </td>

                    {/* Discount */}
                    <td className="p-5 text-center">
                      <span className="font-semibold text-[#CDB38B] text-[15px]">
                        {promo.discount_percentage}%
                      </span>
                    </td>

                    {/* Collection */}
                    <td className="p-5">
                      <span className="text-[13px]">
                        {promo.collections?.name || "Store-wide"}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleToggleActive(promo)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase transition-colors ${
                          promo.is_active
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${promo.is_active ? "bg-green-500" : "bg-gray-400"}`} />
                        {promo.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Date Range */}
                    <td className="p-5 text-center text-[12px] text-[#888]">
                      {formatDate(promo.start_date)} — {formatDate(promo.end_date)}
                    </td>

                    {/* Banner */}
                    <td className="p-5 text-center">
                      {promo.show_in_banner ? (
                        <span className="text-[#CDB38B] text-[11px] font-semibold uppercase tracking-wider">Yes</span>
                      ) : (
                        <span className="text-gray-400 text-[11px] uppercase tracking-wider">No</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(promo)}
                          className="p-2 hover:bg-[#F3F1EC] text-gray-600 hover:text-[#CDB38B] rounded transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id, promo.code)}
                          disabled={deletingId === promo.id}
                          className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === promo.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
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
              No Promo Codes Yet
            </h3>
            <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px] mb-6">
              Create your first promo code to offer discounts on collections.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3.5 bg-[#2E3135] text-white font-inter font-semibold text-[11px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300 rounded shadow"
            >
              Add First Promo Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
