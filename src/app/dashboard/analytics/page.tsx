"use client";

import Link from "next/link";
import { ChevronRight, Calendar, ChevronDown, Download, Filter, MoreVertical, Share2, Globe, Hash, AtSign, Link2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <div className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
               <Link href="/dashboard/portfolio" className="hover:text-text transition-colors">Portfolio</Link>
               <ChevronRight className="w-4 h-4 mx-1" />
               <span className="text-text">Analytics</span>
            </div>
            <h1 className="text-3xl font-extrabold text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
               Portfolio Analytics
            </h1>
         </div>
         <div className="flex items-center gap-3">
            <button className="bg-border-strong hover:bg-gray-300 text-text px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
               <Calendar className="w-[18px] h-[18px]" />
               Last 30 days
               <ChevronDown className="w-[18px] h-[18px]" />
            </button>
            <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md shadow-primary/20 flex items-center gap-2">
               <Download className="w-[18px] h-[18px]" />
               Export Report
            </button>
         </div>
      </div>

      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Card 1 */}
         <div className="bg-background rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
               <h3 className="text-sm font-semibold text-text-secondary">Total Views</h3>
               <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-3xl font-bold text-text mb-6">24.8k</p>
            {/* Mini Chart */}
            <div className="flex items-end gap-1 h-8 w-full">
               {[40, 70, 50, 100, 60, 40].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i === 3 ? 'bg-[#4338ca]' : 'bg-background-tertiary'}`} style={{ height: `${h}%` }}></div>
               ))}
            </div>
         </div>

         {/* Card 2 */}
         <div className="bg-background rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
               <h3 className="text-sm font-semibold text-text-secondary">Unique Visitors</h3>
               <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">+5.4%</span>
            </div>
            <p className="text-3xl font-bold text-text mb-6">12.1k</p>
            {/* Mini Chart */}
            <div className="flex items-end gap-1 h-8 w-full">
               {[30, 90, 50, 40, 60, 80].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i === 1 ? 'bg-[#4338ca]' : 'bg-background-tertiary'}`} style={{ height: `${h}%` }}></div>
               ))}
            </div>
         </div>

         {/* Card 3 */}
         <div className="bg-background rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
               <h3 className="text-sm font-semibold text-text-secondary">Avg. Time on Page</h3>
               <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">-2.1%</span>
            </div>
            <p className="text-3xl font-bold text-text mb-6">3m 42s</p>
            {/* Mini Chart */}
            <div className="flex items-end gap-1 h-8 w-full">
               {[60, 70, 80, 50, 90, 40].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i === 4 ? 'bg-[#4338ca]' : 'bg-background-tertiary'}`} style={{ height: `${h}%` }}></div>
               ))}
            </div>
         </div>

         {/* Card 4 */}
         <div className="bg-background rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
               <h3 className="text-sm font-semibold text-text-secondary">Link Clicks</h3>
               <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">+18%</span>
            </div>
            <p className="text-3xl font-bold text-text mb-6">4,208</p>
            {/* Mini Chart */}
            <div className="flex items-end gap-1 h-8 w-full">
               {[20, 40, 60, 100, 80, 50].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i === 3 ? 'bg-[#4338ca]' : 'bg-background-tertiary'}`} style={{ height: `${h}%` }}></div>
               ))}
            </div>
         </div>
      </div>

      {/* ── Main Graph ── */}
      <div className="bg-background rounded-3xl p-8 shadow-sm border border-border">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
               <h2 className="text-xl font-bold text-text mb-1">Visitor Trends</h2>
               <p className="text-sm text-text-secondary">Traffic volume analyzed per day over the selected period</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  Page Views
               </div>
               <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-light"></div>
                  Visitors
               </div>
            </div>
         </div>
         
         {/* Mock Graph using SVG Path to represent the curve */}
         <div className="w-full h-64 relative bg-[#fafafa] rounded-xl overflow-hidden border border-border/50 flex flex-col justify-end">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-indigo-50 absolute bottom-0 left-0">
               <path d="M0,200 L0,150 Q200,50 300,120 T600,100 T1000,180 L1000,200 Z" fill="currentColor" opacity="0.8" />
            </svg>
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-[#eef2ff] absolute bottom-0 left-0">
               <path d="M0,200 L0,180 Q250,100 400,160 T700,50 T1000,150 L1000,200 Z" fill="currentColor" fillOpacity="0.8" />
            </svg>
            
            {/* Interactive Data Point Mock */}
            <div className="absolute top-1/4 left-[64%] flex flex-col items-center group -translate-x-1/2">
               <div className="bg-[#191c1e] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg mb-2 relative z-10">
                  1,402 Views
                  <div className="w-2 h-2 bg-[#191c1e] absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45"></div>
               </div>
               <div className="w-2.5 h-2.5 bg-primary rounded-full border-2 border-background shadow-md relative z-10"></div>
               {/* Vertical drop line */}
               <div className="w-px h-32 bg-primary/20 absolute top-8 left-1/2 -translate-x-1/2"></div>
            </div>

            {/* X Axis Labels */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-[10px] font-bold text-text-muted tracking-wider">
               <span>OCT 01</span>
               <span>OCT 08</span>
               <span>OCT 15</span>
               <span>OCT 22</span>
               <span>OCT 30</span>
            </div>
         </div>
      </div>

      {/* ── Bottom Row Data ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         {/* Left Col: Geographic Distribution */}
         <div className="lg:col-span-2 bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col">
            <h2 className="text-xl font-bold text-text mb-8">Geographic Distribution</h2>
            
            <div className="flex flex-col gap-6 flex-1">
               {[
                  { country: "United States", pct: 42, flag: "US" },
                  { country: "United Kingdom", pct: 18, flag: "GB" },
                  { country: "Germany", pct: 12, flag: "DE" },
                  { country: "Canada", pct: 9, flag: "CA" },
                  { country: "Japan", pct: 7, flag: "JP" },
               ].map((item) => (
                  <div key={item.country}>
                     <div className="flex justify-between items-center text-sm font-semibold mb-2">
                        <div className="flex items-center gap-3">
                           <img src={`https://flagsapi.com/${item.flag}/flat/24.png`} alt={item.country} className="w-6 h-6 rounded overflow-hidden" />
                           <span className="text-text">{item.country}</span>
                        </div>
                        <span className="text-text-secondary">{item.pct}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }}></div>
                     </div>
                  </div>
               ))}
               <div className="mt-auto text-center pt-6">
                  <Link href="#" className="text-primary text-sm font-bold hover:underline">View full list</Link>
               </div>
            </div>
         </div>

         {/* Right Col: Referral Sources */}
         <div className="lg:col-span-3 bg-background rounded-3xl p-8 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-text">Referral Sources</h2>
               <div className="flex items-center gap-3 text-text-muted">
                  <button className="hover:text-text transition-colors"><Filter className="w-5 h-5" /></button>
                  <button className="hover:text-text transition-colors"><MoreVertical className="w-5 h-5" /></button>
               </div>
            </div>

            <table className="w-full text-left text-sm">
               <thead>
                  <tr className="border-b border-border">
                     <th className="pb-4 font-bold text-text-muted uppercase tracking-widest text-[10px]">Source</th>
                     <th className="pb-4 font-bold text-text-muted uppercase tracking-widest text-[10px]">Visits</th>
                     <th className="pb-4 font-bold text-text-muted uppercase tracking-widest text-[10px]">Bounce Rate</th>
                     <th className="pb-4 font-bold text-text-muted uppercase tracking-widest text-[10px] text-right">Avg. Duration</th>
                  </tr>
               </thead>
               <tbody className="font-semibold text-text">
                   {[
                     { name: "LinkedIn", icon: Share2, visits: "8,432", bounce: "24.5%", dir: "4m 12s" },
                     { name: "Direct Traffic", icon: Globe, visits: "4,102", bounce: "32.1%", dir: "2m 45s" },
                     { name: "Twitter / X", icon: Hash, visits: "2,845", bounce: "41.8%", dir: "1m 58s" },
                     { name: "Email Newsletter", icon: AtSign, visits: "1,204", bounce: "12.5%", dir: "6m 30s" },
                     { name: "Behance Portfolio", icon: Link2, visits: "894", bounce: "18.2%", dir: "5m 05s" },
                  ].map((row, i) => (
                     <tr key={i} className="border-b border-border hover:bg-background-secondary/50 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-secondary">
                              <row.icon className="w-4 h-4" />
                           </div>
                           {row.name}
                        </td>
                        <td className="py-4 text-text-secondary">{row.visits}</td>
                        <td className="py-4 text-text-secondary">{row.bounce}</td>
                        <td className="py-4 text-text-secondary text-right">{row.dir}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      
    </div>
  );
}
