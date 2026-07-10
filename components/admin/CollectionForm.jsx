"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin as supabase } from "@/lib/supabase";

function ImageUploadBox({ label, currentUrl, setImageUrl, isRequired, hasError }) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Upload failed");
        alert(errData.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Network error");
      alert("Network error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setImageUrl("");
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-inter text-[10px] font-semibold tracking-wider text-[#2E3135]/60 uppercase min-h-[30px] flex items-center">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={`relative aspect-square max-w-[300px] border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-[#FBFBFA] overflow-hidden group hover:border-[#CDB38B] transition-colors ${
        hasError ? "border-red-400" : "border-[#E5E5E5]"
      }`}>
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-5 h-5 border-2 border-[#CDB38B]/20 border-t-[#CDB38B] rounded-full animate-spin"></div>
            <span className="font-inter text-[10px] text-[#888] uppercase tracking-widest">Uploading...</span>
          </div>
        ) : currentUrl ? (
          <>
            <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer px-4 py-2 bg-white text-[#2E3135] font-inter text-[11px] uppercase tracking-wider font-semibold hover:bg-[#F3F1EC] transition-colors mb-2">
                Change
                <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
              </label>
              <button onClick={handleRemove} className="text-white font-inter text-[11px] uppercase tracking-wider hover:text-red-400 transition-colors">
                Remove
              </button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#888] hover:text-[#CDB38B] transition-colors">
            <svg className="w-6 h-6 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-inter text-[10px] uppercase tracking-widest">Select File</span>
            <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
          </label>
        )}
      </div>
      <span className="font-inter text-[10px] text-[#888888] font-light leading-tight max-w-[300px]">
        Best fit: landscape or square image, max 5MB
      </span>
    </div>
  );
}

export default function CollectionForm({ collectionId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!collectionId);
  const [errorMsg, setErrorMsg] = useState("");
  const [validated, setValidated] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Fetch data if editing
  useEffect(() => {
    if (!collectionId) return;

    async function loadCollection() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(`/api/admin/collections?id=${collectionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const c = await response.json();
          setName(c.name || "");
          setSlug(c.slug || "");
          setCoverImageUrl(c.cover_image_url || "");
        } else {
          setErrorMsg("Could not load collection details. It may have been deleted.");
        }
      } catch (err) {
        console.error("Error loading collection:", err);
        setErrorMsg("An unexpected error occurred while fetching details.");
      } finally {
        setFetching(false);
      }
    }

    loadCollection();
  }, [collectionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setErrorMsg("");

    if (!name || !name.trim()) {
      setErrorMsg("Collection Name is required.");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      slug: slug || null,
      cover_image_url: coverImageUrl || null,
    };

    if (collectionId) {
      payload.id = collectionId;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const url = "/api/admin/collections";
      const method = collectionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/collections");
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Failed to save collection.");
      }
    } catch (err) {
      console.error("Error saving collection:", err);
      setErrorMsg("Failed to connect to the database API.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F1EC] rounded w-1/4"></div>
        <div className="h-12 bg-[#F3F1EC] rounded max-w-[50%]"></div>
        <div className="h-40 bg-[#F3F1EC] rounded max-w-[300px]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md font-inter text-[13px]">
          {errorMsg}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collection Name */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Collection Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bridal Collection"
              className={`w-full px-4 py-2.5 border rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all max-w-[500px] ${
                validated && !name ? "border-red-400 focus:border-red-400" : "border-[#E5E5E5]"
              }`}
            />
          </div>

          {/* Slug (Auto-Generated) */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Slug (Auto-Generated if empty)
            </label>
            <input
              type="text"
              readOnly
              value={slug}
              placeholder="Auto-generating on save..."
              className="w-full px-4 py-2.5 border border-[#E5E5E5] bg-[#FBFBFA] rounded-md font-inter text-[13px] text-gray-500 focus:outline-none cursor-not-allowed max-w-[500px]"
            />
          </div>
          
          <div className="md:col-span-2">
            <ImageUploadBox 
              label="Cover Image"
              currentUrl={coverImageUrl}
              setImageUrl={setCoverImageUrl}
              isRequired={false}
            />
          </div>

        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-[#2E3135]/10">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-[#2E3135] hover:bg-[#CDB38B] text-white font-inter text-[11px] font-semibold tracking-[1.5px] uppercase rounded transition-all duration-300 flex items-center justify-center min-w-[150px] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save Collection"
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/admin/collections")}
            className="px-6 py-3.5 bg-white border border-[#2E3135] text-[#2E3135] hover:bg-[#F3F1EC] font-inter text-[11px] font-semibold tracking-[1.5px] uppercase rounded transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
