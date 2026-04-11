import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] bg-[#f9fafb]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Global Dashboard Header ── */}
        <header className="h-[88px] flex-shrink-0 flex items-center justify-between px-8 bg-[#f9fafb]">
          {/* Search */}
          <div className="w-full max-w-lg relative">
            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search portfolios, files, or settings..."
              className="w-full bg-gray-100/50 border border-gray-200/50 rounded-full pl-11 pr-4 py-3 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-gray-500">
              <button className="hover:text-gray-900 transition-colors">
                <span className="material-symbols-rounded" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
              </button>
              <button className="hover:text-gray-900 transition-colors relative">
                <span className="material-symbols-rounded" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
              </button>
            </div>
            
            <div className="w-px h-8 bg-gray-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Alex Rivera</p>
                <p className="text-xs font-medium text-gray-500">Product Designer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-indigo-100 transition-all">
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
