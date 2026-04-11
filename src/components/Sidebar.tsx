"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard",            icon: "grid_view",        label: "Dashboard"  },
  { href: "/dashboard/portfolio",  icon: "cases",            label: "Portfolio"  },
  { href: "/dashboard/analytics",  icon: "bar_chart",        label: "Analytics"  },
  { href: "/dashboard/settings",   icon: "settings",         label: "Settings"   },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-[100dvh] bg-[#fafbfc] border-r border-gray-200/50 p-6 flex-shrink-0">
        
        {/* Logo Area */}
        <div className="mb-10 px-2">
          <Link
            href="/dashboard"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl font-extrabold tracking-tight text-[#191c1e] block"
          >
            ShortlistMe
          </Link>
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1 block">
            Premium Plan
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {NAV.map(({ href, icon, label }) => {
            // dashboard logic is strict exact match, others are startsWith
            const isActive = href === "/dashboard" 
               ? path === href 
               : path.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#eef2ff] text-[#4f46e5]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="material-symbols-rounded text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card / Bottom space */}
        <div className="mt-8 bg-[#f4f3ff] rounded-2xl p-5 border border-[#e0e7ff]">
          <h4 className="text-sm font-bold text-[#4338ca] mb-2">Upgrade to Pro</h4>
          <p className="text-xs text-[#4f46e5]/70 leading-relaxed mb-4">
            Unlock AI-powered resume tailoring and global analytics.
          </p>
          <button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg py-2 text-xs font-bold transition-colors shadow-md shadow-indigo-500/20">
            Go Premium
          </button>
        </div>

      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {NAV.map(({ href, icon, label }) => {
          const isActive = href === "/dashboard" ? path === href : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold ${
                isActive ? "text-[#4f46e5]" : "text-gray-400"
              }`}
            >
              <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
