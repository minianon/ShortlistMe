"use client";

import { useState } from "react";
import { Globe, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VisibilityToggle({ 
  username, 
  primaryColor = "#10b981",
  accentText = "#ffffff"
}: { 
  username: string, 
  primaryColor?: string,
  accentText?: string
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleMakePublic = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicVisibility: true })
      });
      
      if (!res.ok) throw new Error("Failed to update");
      
      setSuccess(true);
      // Wait a moment so the user sees the success state before refreshing
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (e) {
      console.error(e);
      alert("Failed to make portfolio public");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMakePublic}
      disabled={loading || success}
      className="h-14 px-8 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-[0.98] group relative overflow-hidden whitespace-nowrap"
      style={{ 
        backgroundColor: success ? "#10b981" : primaryColor,
        color: accentText,
        boxShadow: `0 10px 30px -10px ${success ? "#10b981" : primaryColor}80`
      }}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentText }} />
      ) : success ? (
        <Check className="w-5 h-5" style={{ color: accentText }} />
      ) : (
        <Globe className="w-5 h-5" style={{ color: accentText }} />
      )}
      {success ? "Success!" : "Make it Public"}
    </button>
  );
}
