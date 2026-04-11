import Sidebar from "@/components/Sidebar";
import { Search, Moon, Bell } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] bg-background-secondary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Global Dashboard Header ── */}
        <header className="h-[88px] flex-shrink-0 flex items-center justify-between px-8 bg-background-secondary">
          {/* Search */}
          <div className="w-full max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search portfolios, files, or settings..."
              className="w-full bg-background-tertiary/50 border border-border-strong/50 rounded-full pl-11 pr-4 py-3 text-sm font-medium text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-text-secondary">
              <ThemeToggle />
              <button className="hover:text-text transition-colors relative">
                <Bell className="w-5 h-5 fill-current" strokeWidth={2} />
                <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 border border-background rounded-full"></span>
              </button>
            </div>
            
            <div className="w-px h-8 bg-border-strong"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text leading-tight">Alex Rivera</p>
                <p className="text-xs font-medium text-text-secondary">Product Designer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-primary-light transition-all">
                 <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Alex&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-8 pt-0 pb-24 md:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
