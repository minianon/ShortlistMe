"use client";

import Link from "next/link";
import { Zap, BarChart2, UploadCloud, FileText, CheckCircle, MoreHorizontal, History, Eye, Plus } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      
      {/* ── Welcome Banner ── */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Primary Accent Card */}
        <div className="flex-1 bg-gradient-to-br from-primary to-primary-dark rounded-[1.5rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-background/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 border border-background/10 rounded-full"></div>
          
          <div className="relative z-10 mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back, Alex!
            </h1>
            <p className="text-primary-light text-sm md:text-base max-w-sm leading-relaxed">
              Let's get your portfolio ready. You're 3 steps away from completing your professional profile.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button className="bg-background hover:bg-background-secondary text-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2">
              <Zap className="w-[18px] h-[18px]" />
              Get Started
            </button>
            <button className="bg-background/10 hover:bg-background/20 border border-background/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
              View Roadmap
            </button>
          </div>
        </div>

        {/* Weekly Activity mini-card */}
        <div className="w-full md:w-72 bg-background rounded-[1.5rem] p-8 shadow-sm border border-border flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-5">
              <BarChart2 className="w-6 h-6" />
           </div>
           <h3 className="text-lg font-bold text-text mb-1">Weekly Activity</h3>
           <p className="text-sm text-text-secondary mb-6">Your profile views are up 12%</p>
           
           {/* Mock Bar Chart */}
           <div className="flex items-end gap-2 h-16 w-full justify-center">
              <div className="w-6 bg-background-tertiary rounded-sm h-[40%]"></div>
              <div className="w-6 bg-primary rounded-sm h-[80%] shadow-[0_4px_10px_rgba(79,70,229,0.3)]"></div>
              <div className="w-6 bg-background-tertiary rounded-sm h-[50%]"></div>
              <div className="w-6 bg-primary rounded-sm h-[100%] shadow-[0_4px_10px_rgba(79,70,229,0.3)]"></div>
              <div className="w-6 bg-background-tertiary rounded-sm h-[30%]"></div>
           </div>
        </div>
      </div>

      {/* ── Mid Section: Primary Actions + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Primary Actions */}
        <div>
          <h2 className="text-xl font-bold text-text mb-2">Primary Actions</h2>
          <p className="text-sm text-text-secondary mb-6">Upload your latest resume to sync your portfolio automatically.</p>
          
          <div className="bg-background rounded-[1.5rem] p-10 border-2 border-dashed border-border-strong hover:border-primary/50 transition-colors cursor-pointer text-center flex flex-col items-center justify-center h-64 relative group">
             <div className="w-14 h-14 bg-[#f4f3ff] rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 fill-current" />
             </div>
             <h3 className="text-lg font-bold text-text mb-1">Upload Resume</h3>
             <p className="text-sm text-text-secondary mb-4">Drag and drop or click to browse</p>
             <span className="bg-background-tertiary text-text-muted text-[10px] font-bold px-3 py-1 rounded-full">PDF, DOCX up to 10MB</span>
          </div>
          
          <button className="w-full mt-4 bg-background border border-border-strong hover:border-border-strong rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-text transition-colors shadow-sm">
             <FileText className="w-5 h-5" />
             Input Manually
          </button>
        </div>

        {/* Right: Recent Activity */}
        <div>
           <div className="flex items-center justify-between mb-6">
             <div>
                <h2 className="text-xl font-bold text-text mb-2">Recent Activity</h2>
                <p className="text-sm text-text-secondary">Track your latest updates and versions.</p>
             </div>
             <Link href="#" className="text-primary text-sm font-bold hover:underline">View All</Link>
           </div>
           
           <div className="bg-background rounded-[1.5rem] border border-border shadow-sm flex flex-col overflow-hidden">
              {/* Event 1 */}
              <div className="p-5 flex items-start gap-4 border-b border-border hover:bg-background-secondary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-text mb-0.5">Portfolio v2.4 Published</h4>
                   <p className="text-xs text-text-secondary">Updated 2 hours ago • Public Link Active</p>
                </div>
              </div>
              
              {/* Event 2 */}
              <div className="p-5 flex items-start gap-4 border-b border-border hover:bg-background-secondary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                  <MoreHorizontal className="w-5 h-5 fill-current" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-text mb-0.5">AI Tailoring in Progress</h4>
                   <p className="text-xs text-text-secondary">Version for "Senior UX" • 85% complete</p>
                </div>
              </div>
              
              {/* Event 3 */}
              <div className="p-5 flex items-start gap-4 hover:bg-background-secondary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600">
                  <History className="w-5 h-5 fill-current" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-text mb-0.5">Backup Created</h4>
                   <p className="text-xs text-text-secondary">Automatic system backup • Yesterday, 11:45 PM</p>
                </div>
              </div>
           </div>
        </div>
        
      </div>

      {/* ── Portfolio Showcase ── */}
      <div>
        <h2 className="text-xl font-bold text-text mb-6">Portfolio Showcase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* Card 1 */}
           <div className="bg-background rounded-[1.5rem] border border-border shadow-sm overflow-hidden group cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-teal-900 via-teal-700 to-gray-900 relative">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] blur-2xl"></div>
                 <div className="absolute top-4 right-4 bg-background/90 text-[10px] font-bold text-text px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">Design</div>
              </div>
              <div className="p-5">
                 <h4 className="text-base font-bold text-text mb-4 group-hover:text-primary transition-colors">Main Creative Portfolio</h4>
                 <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                       <Eye className="w-4 h-4" />
                       1.2k Views
                    </div>
                    <div className="flex -space-x-2">
                       <img src="https://api.dicebear.com/9.x/notionists/svg?seed=A" className="w-6 h-6 rounded-full border-2 border-background bg-background-tertiary" />
                       <img src="https://api.dicebear.com/9.x/notionists/svg?seed=B" className="w-6 h-6 rounded-full border-2 border-background bg-background-tertiary" />
                       <div className="w-6 h-6 rounded-full border-2 border-background bg-background-tertiary text-[8px] font-bold flex items-center justify-center text-text-secondary">+4</div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Card 2 */}
           <div className="bg-background rounded-[1.5rem] border border-border shadow-sm overflow-hidden group cursor-pointer">
              <div className="h-40 bg-text relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                 <div className="w-full h-1 bg-blue-500 blur-md absolute"></div>
                 <div className="absolute top-4 right-4 bg-background/90 text-[10px] font-bold text-text px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">Tech</div>
              </div>
              <div className="p-5">
                 <h4 className="text-base font-bold text-text mb-4 group-hover:text-primary transition-colors">Product Manager Spec</h4>
                 <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                       <Eye className="w-4 h-4" />
                       450 Views
                    </div>
                    <div className="flex -space-x-2">
                       <img src="https://api.dicebear.com/9.x/notionists/svg?seed=C" className="w-6 h-6 rounded-full border-2 border-background bg-background-tertiary" />
                       <div className="w-6 h-6 rounded-full border-2 border-background bg-background-tertiary text-[8px] font-bold flex items-center justify-center text-text-secondary">+1</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Card 3: Create New */}
           <div className="bg-background-secondary rounded-[1.5rem] border-2 border-dashed border-border-strong hover:border-primary/40 transition-colors flex flex-col items-center justify-center text-center p-6 h-full min-h-[260px] cursor-pointer group">
              <div className="w-12 h-12 bg-background-tertiary text-text-muted group-hover:bg-primary group-hover:text-white rounded-full flex items-center justify-center mb-4 transition-colors">
                 <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-text mb-1">Create New Version</h4>
              <p className="text-xs text-text-secondary">Start with a fresh template</p>
           </div>
           
        </div>
      </div>

    </div>
  );
}
