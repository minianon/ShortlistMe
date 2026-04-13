"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LayoutGrid,
  Briefcase,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",           Icon: LayoutGrid, label: "Dashboard"  },
  { href: "/dashboard/portfolio", Icon: Briefcase,  label: "Portfolio"  },
  { href: "/dashboard/analytics", Icon: BarChart2,  label: "Analytics"  },
  { href: "/dashboard/settings",  Icon: Settings,   label: "Settings"   },
];

export default function Sidebar() {
  const path = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-[100dvh] bg-[var(--dash-sidebar-bg)] border-r border-[var(--dash-sidebar-border)] p-6 flex-shrink-0 transition-colors duration-300">

        {/* Logo */}
        <div className="mb-10 px-2">
          <Link
            href="/dashboard"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl font-extrabold tracking-tight text-text block"
          >
            Shortlist<span className="text-emerald-500">Me</span>
          </Link>
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-500/70 mt-1 block">
            AI Portfolio Engine
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ href, Icon, label }) => {
            const isActive = href === "/dashboard"
              ? path === href
              : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-text-secondary hover:bg-background-tertiary hover:text-text"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-all ${
                    isActive ? "text-emerald-500" : "group-hover:text-text"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        <div className="mt-6 rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
            <h4 className="text-sm font-bold text-text">Upgrade to Pro</h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Unlock AI resume tailoring, custom domains, and global analytics.
          </p>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95">
            Go Premium
          </button>
        </div>

        {/* User + Logout */}
        <div className="mt-4 pt-4 border-t border-[var(--dash-sidebar-border)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex-shrink-0 overflow-hidden border border-emerald-500/20">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-500 font-bold text-xs">
                {user?.firstName?.[0] ?? "U"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-text-muted truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="text-text-muted hover:text-red-500 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-[var(--dash-sidebar-border)] flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {NAV.map(({ href, Icon, label }) => {
          const isActive = href === "/dashboard" ? path === href : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold ${
                isActive ? "text-emerald-500" : "text-text-muted"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
