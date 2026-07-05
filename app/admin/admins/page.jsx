"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { Send, UserMinus, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal State
  const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fetchAdmins = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const response = await fetch("/api/admin/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        console.error("Failed to fetch admins:", response.statusText);
      }
    } catch (err) {
      console.error("Error loading admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/invite-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ message: "Admin invited successfully!" });
        setInviteEmail("");
        fetchAdmins(); // Refresh the list
      } else {
        alert(`Error inviting admin: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error inviting admin:", err);
      alert("Failed to invite admin. Please try again.");
    } finally {
      setInviting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleRevokeAccess = async (admin) => {
    if (!confirm(`Are you sure you want to remove admin access for ${admin.email}?`)) {
      return;
    }

    setRevokingId(admin.id || admin.email);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/remove-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: admin.id, email: admin.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ message: "Admin access removed successfully!" });
        setAdmins((prev) => prev.filter((a) => (a.id && a.id !== admin.id) || (a.email !== admin.email)));
      } else {
        alert(`Error removing access: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error removing access:", err);
      alert("Failed to remove access. Please try again.");
    } finally {
      setRevokingId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteModalAdmin || deleteConfirmText !== "DELETE") return;

    const admin = deleteModalAdmin;
    setDeletingId(admin.id || admin.email);
    setDeleteModalAdmin(null); // Close modal

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/delete-admin-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: admin.id, email: admin.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ message: "Admin account deleted permanently!" });
        setAdmins((prev) => prev.filter((a) => (a.id && a.id !== admin.id) || (a.email !== admin.email)));
      } else {
        alert(`Error deleting account: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeletingId(null);
      setDeleteConfirmText("");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-[#2E3135]/10 gap-4">
        <div>
          <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
            Admins
          </h1>
          <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
            Manage admin access for the dashboard.
          </p>
        </div>
        
        {/* Invite Form */}
        <form onSubmit={handleInvite} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={inviting}
            className="w-full md:w-64 px-4 py-3 bg-white border border-[#2E3135]/20 rounded font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-[#CDB38B] focus:ring-1 focus:ring-[#CDB38B] transition-all disabled:bg-[#F3F1EC] disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="flex items-center gap-2 bg-[#2E3135] hover:bg-[#CDB38B] text-white px-5 py-3 rounded font-inter text-[11px] font-semibold tracking-[1.5px] uppercase transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:bg-[#2E3135]"
          >
            {inviting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Send Invite
          </button>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="flex space-x-4 border-b border-gray-100 pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F3F1EC] rounded w-full animate-pulse"></div>
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4 pt-2">
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/2 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
              </div>
            ))}
          </div>
        ) : admins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Email Address</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Date Added</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                {admins.map((admin, idx) => (
                  <tr key={admin.id || idx} className="hover:bg-[#F3F1EC]/20 transition-colors">
                    {/* Email */}
                    <td className="p-5 font-medium">
                      {admin.email}
                    </td>

                    {/* Date Added */}
                    <td className="p-5 text-gray-500 text-[13px]">
                      {formatDate(admin.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleRevokeAccess(admin)}
                          disabled={revokingId === admin.id || revokingId === admin.email || deletingId === admin.id || deletingId === admin.email}
                          className="p-2 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded transition-all disabled:opacity-50"
                          title="Remove Access (Revoke Admin)"
                        >
                          {revokingId === admin.id || revokingId === admin.email ? (
                            <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <UserMinus className="w-4 h-4 stroke-[1.5]" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setDeleteModalAdmin(admin);
                            setDeleteConfirmText("");
                          }}
                          disabled={revokingId === admin.id || revokingId === admin.email || deletingId === admin.id || deletingId === admin.email}
                          className="p-2 hover:bg-red-100 text-gray-600 hover:text-red-700 rounded transition-all disabled:opacity-50"
                          title="Permanently Delete Account"
                        >
                          {deletingId === admin.id || deletingId === admin.email ? (
                            <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
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
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <h3 className="font-serif font-normal text-[24px] text-[#2E3135] mb-2 uppercase">
              No Admins Found
            </h3>
            <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px] mb-6">
              You don&apos;t have any admins. Use the form above to invite one.
            </p>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {deleteModalAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E3135]/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6">
              <h3 className="font-serif text-[24px] text-red-700 mb-2 leading-tight">
                Permanently Delete Admin Account?
              </h3>
              <p className="font-inter text-[14px] text-[#2E3135]/80 mb-6 font-light leading-relaxed">
                This cannot be undone. <strong className="font-semibold">{deleteModalAdmin.email}</strong> will lose their login entirely, not just admin access. If you just want to revoke their admin panel access instead, use &apos;Remove Access&apos; rather than this.
              </p>
              
              <div className="mb-6">
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-red-200 rounded font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModalAdmin(null);
                    setDeleteConfirmText("");
                  }}
                  className="px-5 py-2.5 rounded font-inter text-[12px] font-semibold tracking-wide uppercase text-[#2E3135] hover:bg-[#F3F1EC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE"}
                  className="px-5 py-2.5 rounded font-inter text-[12px] font-semibold tracking-wide uppercase bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
