"use client";

import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      
      {/* ── Welcome Banner ── */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Purple Card */}
        <div className="flex-1 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] rounded-[1.5rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-indigo-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full"></div>
          
          <div className="relative z-10 mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back, Alex!
            </h1>
            <p className="text-indigo-100 text-sm md:text-base max-w-sm leading-relaxed">
              Let's get your portfolio ready. You're 3 steps away from completing your professional profile.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button className="bg-white hover:bg-gray-50 text-[#4f46e5] px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-rounded text-lg">bolt</span>
              Get Started
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
              View Roadmap
            </button>
          </div>
        </div>

        {/* Weekly Activity mini-card */}
        <div className="w-full md:w-72 bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 bg-[#eef2ff] rounded-2xl flex items-center justify-center text-[#4f46e5] mb-5">
              <span className="material-symbols-rounded">bar_chart</span>
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-1">Weekly Activity</h3>
           <p className="text-sm text-gray-500 mb-6">Your profile views are up 12%</p>
           
           {/* Mock Bar Chart */}
           <div className="flex items-end gap-2 h-16 w-full justify-center">
              <div className="w-6 bg-gray-100 rounded-sm h-[40%]"></div>
              <div className="w-6 bg-[#4f46e5] rounded-sm h-[80%] shadow-[0_4px_10px_rgba(79,70,229,0.3)]"></div>
              <div className="w-6 bg-gray-100 rounded-sm h-[50%]"></div>
              <div className="w-6 bg-[#4f46e5] rounded-sm h-[100%] shadow-[0_4px_10px_rgba(79,70,229,0.3)]"></div>
              <div className="w-6 bg-gray-100 rounded-sm h-[30%]"></div>
           </div>
        </div>
      </div>

      {/* ── Mid Section: Primary Actions + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Primary Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Primary Actions</h2>
          <p className="text-sm text-gray-500 mb-6">Upload your latest resume to sync your portfolio automatically.</p>
          
          <div className="bg-white rounded-[1.5rem] p-10 border-2 border-dashed border-gray-200 hover:border-[#4f46e5]/50 transition-colors cursor-pointer text-center flex flex-col items-center justify-center h-64 relative group">
             <div className="w-14 h-14 bg-[#f4f3ff] rounded-full flex items-center justify-center text-[#4f46e5] mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Resume</h3>
             <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
             <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full">PDF, DOCX up to 10MB</span>
          </div>
          
          <button className="w-full mt-4 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 transition-colors shadow-sm">
             <span className="material-symbols-rounded text-[20px]">edit_document</span>
             Input Manually
          </button>
        </div>

        {/* Right: Recent Activity */}
        <div>
           <div className="flex items-center justify-between mb-6">
             <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Activity</h2>
                <p className="text-sm text-gray-500">Track your latest updates and versions.</p>
             </div>
             <Link href="#" className="text-[#4f46e5] text-sm font-bold hover:underline">View All</Link>
           </div>
           
           <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {/* Event 1 */}
              <div className="p-5 flex items-start gap-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-rounded text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-0.5">Portfolio v2.4 Published</h4>
                   <p className="text-xs text-gray-500">Updated 2 hours ago • Public Link Active</p>
                </div>
              </div>
              
              {/* Event 2 */}
              <div className="p-5 flex items-start gap-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-rounded text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>more_horiz</span>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-0.5">AI Tailoring in Progress</h4>
                   <p className="text-xs text-gray-500">Version for "Senior UX" • 85% complete</p>
                </div>
              </div>
              
              {/* Event 3 */}
              <div className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600">
                  <span className="material-symbols-rounded text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-0.5">Backup Created</h4>
                   <p className="text-xs text-gray-500">Automatic system backup • Yesterday, 11:45 PM</p>
                </div>
              </div>
           </div>
        </div>
        
      </div>

      {/* ── Portfolio Showcase ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Showcase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* Card 1 */}
           <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden group cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-teal-900 via-teal-700 to-gray-900 relative">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] blur-2xl"></div>
                 <div className="absolute top-4 right-4 bg-white/90 text-[10px] font-bold text-gray-800 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">Design</div>
              </div>
              <div className="p-5">
                 <h4 className="text-base font-bold text-gray-900 mb-4 group-hover:text-[#4f46e5] transition-colors">Main Creative Portfolio</h4>
                 <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                       <span className="material-symbols-rounded text-[16px]">visibility</span>
                       1.2k Views
                    </div>
                    <div className="flex -space-x-2">
                       <img src="https://api.dicebear.com/9.x/notionists/svg?seed=A" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                       <img src="https://api.dicebear.com/9.x/notionists/svg?seed=B" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                       <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-[8px] font-bold flex items-center justify-center text-gray-500">+4</div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Card 2 */}
           <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden group cursor-pointer">
              <div className="h-40 bg-gray-900 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                 <div className="w-full h-1 bg-blue-500 blur-md absolute"></div>
                 <div className="absolute top-4 right-4 bg-white/90 text-[10px] font-bold text-gray-800 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">Tech</div>
              </div>
              <div className="p-5">
                 <h4 className="text-base font-bold text-gray-900 mb-4 group-hover:text-[#4f46e5] transition-colors">Product Manager Spec</h4>
                 <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                       <span className="material-symbols-rounded text-[16px]">visibility</span>
                       450 Views
                    </div>
                    <div className="flex -space-x-2">
                       <img src="https://api.dicebear.com/9.x/notionists/svg?seed=C" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                       <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-[8px] font-bold flex items-center justify-center text-gray-500">+1</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Card 3: Create New */}
           <div className="bg-[#fcfdff] rounded-[1.5rem] border-2 border-dashed border-gray-200 hover:border-[#4f46e5]/40 transition-colors flex flex-col items-center justify-center text-center p-6 h-full min-h-[260px] cursor-pointer group">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 group-hover:bg-[#4f46e5] group-hover:text-white rounded-full flex items-center justify-center mb-4 transition-colors">
                 <span className="material-symbols-rounded">add</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Create New Version</h4>
              <p className="text-xs text-gray-500">Start with a fresh template</p>
           </div>
           
        </div>
      </div>

    </div>
  );
}
