"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-[#CDB38B] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
    </div>
  );
}
