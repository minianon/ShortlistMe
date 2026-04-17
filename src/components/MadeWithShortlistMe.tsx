"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Zap, Sparkles } from "lucide-react";

interface ThemeStyles {
  primaryHex: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  text: string;
  textSecondary: string;
  accentText: string;
}

export default function MadeWithShortlistMe({ username, themeStyles }: { username: string, themeStyles?: ThemeStyles }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("shortlistme_branding_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem("shortlistme_branding_dismissed", "true");
  };

  if (!isVisible) return null;

  // Fallback values if themeStyles isn't passed for some reason
  const primaryHex = themeStyles?.primaryHex || "#10b981";
  const surface = themeStyles?.surfaceSecondary || "rgba(0,0,0,0.8)";
  const border = themeStyles?.border || "rgba(255,255,255,0.1)";
  const text = themeStyles?.text || "#ffffff";
  const textSecondary = themeStyles?.textSecondary || "rgba(255,255,255,0.6)";
  const accentText = themeStyles?.accentText || "#ffffff";

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-fade-up max-w-[320px]">
      <div 
        className="relative group overflow-hidden rounded-2xl shadow-2xl p-4 backdrop-blur-xl border transition-colors duration-300"
        style={{ 
          backgroundColor: surface.startsWith('#') ? `${surface}F2` : surface,
          borderColor: border 
        }}
      >
        {/* Subtle glow effect using the theme primary color */}
        <div 
          className="absolute -inset-10 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
          style={{ backgroundColor: primaryHex }}
        />
        
        <div className="relative z-10 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div 
              className="w-10 h-10 rounded-xl border flex items-center justify-center p-1 shadow-md bg-[#0a0a0a] border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
                <text x="50%" y="54%" dominantBaseline="central" textAnchor="middle" style={{ fontFamily: "system-ui, sans-serif", fontWeight: 900, fontSize: "20px", letterSpacing: "-1px" }}>
                  <tspan fill="#10b981">S</tspan><tspan fill="#ffffff">M</tspan>
                </text>
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-sm font-bold leading-tight mb-1" style={{ color: text }}>
              Love this portfolio?
            </h4>
            <p className="text-xs leading-relaxed mb-3" style={{ color: textSecondary }}>
              <span className="font-bold text-emerald-500" style={{ color: primaryHex }}>{username}</span> built it in seconds. Create your own premium portfolio today.
            </p>
            
            <Link 
              href={`/sign-up?ref=portfolio_${username}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg"
              style={{ 
                backgroundColor: primaryHex, 
                color: accentText,
                boxShadow: `0 10px 15px -3px ${primaryHex}40`
              }}
            >
              <Zap className="w-3 h-3" />
              Build Yours
            </Link>
          </div>
        </div>

        {/* Ensure close button has a high z-index and click propagation is clear */}
        <button 
          onClick={handleClose}
          type="button"
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-20"
          style={{ color: textSecondary }}
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
