"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { 
  ChevronRight, 
  Calendar, 
  ChevronDown, 
  Download, 
  Filter, 
  MoreVertical, 
  Share2, 
  Globe, 
  Hash, 
  AtSign, 
  Link2,
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer2,
  Clock,
  Monitor,
  Smartphone,
  Laptop
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface AnalyticsData {
  metrics: {
    totalViews: number;
    uniqueVisitors: number;
    linkClicks: number;
    totalTime: string;
    avgTime: string;
    growth: {
      views: number;
      visitors: number;
      clicks: number;
      time: number;
      avgTime: number;
    };
  };
  chartData: {
    date: string;
    views: number;
    visitors: number;
  }[];
  referrers: {
    name: string;
    visits: number;
  }[];
  platforms: {
    name: string;
    pct: number;
    icon: string;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/stats?days=${days}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [days]);

  const fallbackData: AnalyticsData = {
    metrics: { 
      totalViews: 0, 
      uniqueVisitors: 0, 
      linkClicks: 0, 
      totalTime: "0m 0s", 
      avgTime: "0m 0s",
      growth: { views: 0, visitors: 0, clicks: 0, time: 0, avgTime: 0 }
    },
    chartData: [],
    referrers: [],
    platforms: []
  };

  const displayData = data || fallbackData;

  const metricCards = useMemo(() => [
    { 
      label: "Total Views", 
      value: (displayData.metrics.totalViews ?? 0).toLocaleString(), 
      growth: displayData.metrics.growth?.views ?? 0,
      icon: Globe,
      color: "emerald"
    },
    { 
      label: "Unique Visitors", 
      value: (displayData.metrics.uniqueVisitors ?? 0).toLocaleString(), 
      growth: displayData.metrics.growth?.visitors ?? 0, 
      icon: Users,
      color: "indigo"
    },
    { 
      label: "Total Time", 
      value: displayData.metrics.totalTime ?? "0m 0s", 
      growth: displayData.metrics.growth?.time ?? 0, 
      icon: Clock,
      color: "amber"
    },
    { 
      label: "Avg. Time", 
      value: displayData.metrics.avgTime ?? "0m 0s", 
      growth: displayData.metrics.growth?.avgTime ?? 0, 
      icon: Clock,
      color: "amber"
    },
    { 
      label: "Link Clicks", 
      value: (displayData.metrics.linkClicks ?? 0).toLocaleString(), 
      growth: displayData.metrics.growth?.clicks ?? 0, 
      icon: MousePointer2,
      color: "rose"
    },
  ], [displayData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-sm font-bold text-text-secondary">Loading your insights...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-8 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 pb-12">
      
      {/* ── Page Header ── */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-black text-text tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Analytics<span className="text-emerald-500">.</span>
        </h1>
        <p className="text-text-secondary font-medium outline-none">Track your professional engine's performance and audience engagement.</p>
      </div>

      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {metricCards.map((card, i) => (
           <div key={i} className="bg-background rounded-3xl p-6 shadow-sm border border-border hover:border-emerald-500/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${card.color}-500/10 text-${card.color}-500`}>
                    <card.icon className="w-5 h-5" />
                 </div>
                 {card.growth !== 0 && (
                   <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                     card.growth > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                   }`}>
                      {card.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(card.growth)}%
                   </div>
                 )}
              </div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-2xl font-black text-text">{card.value}</p>
           </div>
         ))}
      </div>

      {/* ── Main Graph ── */}
      <div className="bg-background rounded-[2rem] p-8 shadow-sm border border-border">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
               <h2 className="text-xl font-black text-text mb-1" style={{ fontFamily: "var(--font-display)" }}>Visitor Trends</h2>
               <p className="text-sm text-text-secondary">Track your portfolio visibility over the last {days} days.</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
               <select 
                 value={days} 
                 onChange={(e) => setDays(Number(e.target.value))}
                 className="bg-background border border-border text-xs sm:text-sm font-bold text-text rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-background-tertiary transition-colors"
               >
                 <option value={7}>Last 7 days</option>
                 <option value={14}>Last 14 days</option>
                 <option value={30}>Last 30 days</option>
                 <option value={90}>Last 90 days</option>
               </select>
               <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  Views
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  Link Clicks
               </div>
            </div>
         </div>
         
         <div className="h-[300px] w-full mt-4">
           {data?.chartData && data.chartData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.chartData}>
                 <defs>
                   <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                 <XAxis 
                   dataKey="date" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }}
                   tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                   }}
                   minTickGap={30}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }}
                 />
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: 'var(--background)',
                     borderRadius: '16px', 
                     border: '1px solid var(--border)', 
                     boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                     fontSize: '12px',
                     fontWeight: '700',
                     color: 'var(--text)'
                   }} 
                   labelStyle={{ color: 'var(--text-muted)' }}
                   itemStyle={{ color: 'var(--text)' }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    animationDuration={1500}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                    animationDuration={2000}
                 />
               </AreaChart>
             </ResponsiveContainer>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center bg-background-tertiary/30 rounded-2xl border border-dashed border-border">
                <Globe className="w-10 h-10 text-text-muted mb-3 opacity-20" />
                <p className="text-sm font-bold text-text-muted">No data available yet</p>
                <p className="text-xs text-text-muted/60">Data is captured once your portfolio is visited.</p>
             </div>
           )}
         </div>
      </div>

      {/* ── Bottom Row Data ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         {/* Left Col: Geographic Distribution (Hinted Placeholder) */}
         <div className="lg:col-span-2 bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col">
            <h2 className="text-xl font-bold text-text mb-8" style={{ fontFamily: "var(--font-display)" }}>Top Platforms</h2>
            
            <div className="flex flex-col gap-6 flex-1">
               {data?.platforms && data.platforms.length > 0 ? (
                 data.platforms.map((item) => (
                    <div key={item.name}>
                       <div className="flex justify-between items-center text-sm font-bold mb-2">
                          <div className="flex items-center gap-3">
                             <div className="p-1.5 rounded-lg bg-background-tertiary border border-border">
                                {item.icon === 'monitor' ? <Monitor className="w-4 h-4 text-emerald-500" /> :
                                 item.icon === 'smartphone' ? <Smartphone className="w-4 h-4 text-emerald-500" /> :
                                 item.icon === 'laptop' ? <Laptop className="w-4 h-4 text-emerald-500" /> :
                                 <Globe className="w-4 h-4 text-emerald-500" />}
                             </div>
                             <span className="text-text">{item.name}</span>
                          </div>
                          <span className="text-text-secondary">{item.pct}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.pct}%` }}></div>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center py-6 mt-4 opacity-50">
                   <p className="text-sm font-bold text-text-muted">No platform data available yet.</p>
                 </div>
               )}
               <p className="mt-auto text-[10px] text-center text-text-muted font-bold uppercase tracking-widest pt-6 border-t border-border mt-8">
                  OS & Browser analysis
               </p>
            </div>
         </div>

         {/* Right Col: Referral Sources */}
         <div className="lg:col-span-3 bg-background rounded-3xl p-8 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-text" style={{ fontFamily: "var(--font-display)" }}>Referral Sources</h2>
               <Filter className="w-4 h-4 text-text-muted" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead>
                    <tr className="border-b border-border">
                       <th className="pb-4 font-bold text-text-muted uppercase tracking-widest text-[10px]">Source</th>
                       <th className="pb-4 font-bold text-text-muted uppercase tracking-widest text-[10px] text-right">Visits</th>
                    </tr>
                 </thead>
                 <tbody className="font-bold text-text">
                     {data?.referrers && data.referrers.length > 0 ? (
                       data.referrers.map((row, i) => (
                        <tr key={i} className="border-b border-border hover:bg-background-tertiary/20 transition-colors">
                           <td className="py-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-secondary">
                                 {row.name.includes("linkedin") ? <Share2 className="w-4 h-4" /> : 
                                  row.name.includes("twitter") || row.name.includes("t.co") ? <Hash className="w-4 h-4" /> : 
                                  row.name === "Direct Traffic" ? <Globe className="w-4 h-4" /> :
                                  <Link2 className="w-4 h-4" />}
                              </div>
                              <span className="truncate max-w-[200px]">{row.name}</span>
                           </td>
                           <td className="py-4 text-text-secondary text-right">{row.visits.toLocaleString()}</td>
                        </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={2} className="py-12 text-center text-text-muted">
                           No referral data available yet.
                         </td>
                       </tr>
                     )}
                 </tbody>
              </table>
            </div>
         </div>
      </div>
      
    </div>
  );
}
