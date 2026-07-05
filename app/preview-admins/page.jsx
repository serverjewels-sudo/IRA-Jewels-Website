"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Send, Trash2, UserMinus } from "lucide-react";

export default function PreviewAdmins() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // For forcing the modal open in the preview
  const deleteModalAdmin = { email: "dipak08v14@gmail.com", created_at: "2024-01-15T10:00:00Z" };
  const deleteConfirmText = "DEL"; // Partial typed text to show the button state

  const admins = [
    deleteModalAdmin
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F3F1EC] text-[#2E3135]">
      {/* Sidebar Mock */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-grow p-4 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full relative">
        <div className="space-y-8" id="admin-page-content">
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
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                value="newadmin@example.com"
                readOnly
                className="w-full md:w-64 px-4 py-3 bg-white border border-[#2E3135]/20 rounded font-inter text-[13px] text-[#2E3135] focus:outline-none transition-all"
              />
              <button
                type="button"
                className="flex items-center gap-2 bg-[#2E3135] hover:bg-[#CDB38B] text-white px-5 py-3 rounded font-inter text-[11px] font-semibold tracking-[1.5px] uppercase transition-all duration-300 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Send Invite
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
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
                    <tr key={idx} className="hover:bg-[#F3F1EC]/20 transition-colors">
                      <td className="p-5 font-medium">{admin.email}</td>
                      <td className="p-5 text-gray-500 text-[13px]">
                        Jan 15, 2024
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="p-2 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded transition-all"
                            title="Remove Access (Revoke Admin)"
                          >
                            <UserMinus className="w-4 h-4 stroke-[1.5]" />
                          </button>

                          <button
                            className="p-2 hover:bg-red-100 text-gray-600 hover:text-red-700 rounded transition-all"
                            title="Permanently Delete Account"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete Account Modal (Forced Open for Screenshot) */}
        <div id="delete-modal" className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#2E3135]/60 backdrop-blur-sm" style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6 text-left">
              <h3 className="font-serif text-[24px] text-red-700 mb-2 leading-tight">
                Permanently Delete Admin Account?
              </h3>
              <p className="font-inter text-[14px] text-[#2E3135]/80 mb-6 font-light leading-relaxed">
                This cannot be undone. <strong className="font-semibold">{deleteModalAdmin.email}</strong> will lose their login entirely, not just admin access. If you just want to revoke their admin panel access instead, use 'Remove Access' rather than this.
              </p>
              
              <div className="mb-6">
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase mb-2">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  readOnly
                  placeholder="DELETE"
                  className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-red-200 rounded font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-5 py-2.5 rounded font-inter text-[12px] font-semibold tracking-wide uppercase text-[#2E3135] hover:bg-[#F3F1EC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled
                  className="px-5 py-2.5 rounded font-inter text-[12px] font-semibold tracking-wide uppercase bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
