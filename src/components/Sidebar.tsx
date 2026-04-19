"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Briefcase,
  BarChart2,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",           Icon: LayoutGrid, label: "Overview"  },
  { href: "/dashboard/portfolio", Icon: Briefcase,  label: "Portfolio Studio"  },
  { href: "/dashboard/analytics", Icon: BarChart2,  label: "Insights"    },
  { href: "/dashboard/settings",  Icon: Settings,   label: "Settings"    },
];

export default function Sidebar() {
  const path = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Persistence logic
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setIsCollapsed(JSON.parse(saved));
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col min-h-[100dvh] bg-[var(--dash-sidebar-bg)] border-r border-[var(--dash-sidebar-border)] flex-shrink-0 transition-colors duration-300 relative"
      >
        <div className="flex flex-col h-full p-4 lg:p-6 overflow-hidden">
          {/* Logo & Toggle Section */}
          <div className={`mb-10 flex ${isCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between px-2'}`}>
            <Link
              href="/dashboard"
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-extrabold tracking-tight text-text whitespace-nowrap"
            >
              {isCollapsed ? (
                <span className="text-emerald-500">S<span className="text-text">M</span></span>
              ) : (
                <>Shortlist<span className="text-emerald-500">Me</span></>
              )}
            </Link>

            <button
              onClick={toggleCollapse}
              className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-500/10 text-text-muted hover:text-emerald-500 transition-all active:scale-95`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>

          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold tracking-widest uppercase text-emerald-500/70 px-2 mb-4 block whitespace-nowrap"
            >
              AI Portfolio Engine
            </motion.span>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5 flex-1">
            {NAV.map(({ href, Icon, label }) => {
              const isActive = href === "/dashboard"
                ? path === href
                : path.startsWith(href);
              const tourTarget = label === "Portfolio Studio" ? "tour-portfolio-studio" : label === "Insights" ? "tour-insights" : label === "Settings" ? "tour-settings" : "";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${tourTarget} ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-text-secondary hover:bg-background-tertiary hover:text-text"
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? label : ""}
                  data-tour-pos="right"
                >
                  <Icon
                    className={`w-[18px] h-[18px] flex-shrink-0 transition-all ${
                      isActive ? "text-emerald-500" : "group-hover:text-text"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User + Logout */}
          <div className="mt-4 pt-4 border-t border-[var(--dash-sidebar-border)]">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col gap-4' : ''}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex-shrink-0 overflow-hidden border border-emerald-500/20">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-500 font-bold text-xs">
                      {user?.firstName?.[0] ?? "U"}
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs font-bold text-text truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </motion.div>
                )}
              </div>
              
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className={`text-text-muted hover:text-red-500 transition-colors flex-shrink-0 p-1.5 hover:bg-red-500/5 rounded-lg active:scale-90 ${isCollapsed ? 'mt-1' : ''}`}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-[var(--dash-sidebar-border)] flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {NAV.map(({ href, Icon, label }) => {
          const isActive = href === "/dashboard" ? path === href : path.startsWith(href);
          const tourTarget = label === "Portfolio Studio" ? "tour-portfolio-studio" : label === "Insights" ? "tour-insights" : label === "Settings" ? "tour-settings" : "";
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold ${tourTarget} ${
                isActive ? "text-emerald-500" : "text-text-muted"
              }`}
              data-tour-pos="top"
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
