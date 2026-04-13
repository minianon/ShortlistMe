"use client";

import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className="flex min-h-[100dvh] bg-background-secondary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Global Dashboard Header ── */}
        <header className="h-[72px] flex-shrink-0 flex items-center justify-between px-6 lg:px-8 bg-background-secondary border-b border-[var(--dash-sidebar-border)] sticky top-0 z-40 backdrop-blur-sm">

          {/* Search */}
          <div className="w-full max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search portfolios, files..."
              className="w-full bg-[var(--dash-upload-bg)] border border-[var(--dash-card-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-4">
            <ThemeToggle />

            <button className="relative w-9 h-9 rounded-xl bg-[var(--dash-upload-bg)] border border-[var(--dash-card-border)] flex items-center justify-center text-text-secondary hover:text-text hover:border-emerald-500/30 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 border-2 border-background-secondary rounded-full" />
            </button>

            <div className="w-px h-6 bg-[var(--dash-card-border)]" />

            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-text leading-tight">
                  {user?.firstName ?? "Loading..."} {user?.lastName ?? ""}
                </p>
                <p className="text-[10px] font-medium text-text-muted">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-emerald-500">
                    {user?.firstName?.[0] ?? "U"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-6 lg:p-8 pt-6 pb-24 md:pb-8">
            {children}
          </main>
          <PublicFooter />
        </div>
      </div>
    </div>
  );
}
