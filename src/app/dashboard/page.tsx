"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud, Sparkles, ArrowRight,
  CheckCircle2, Globe, Zap,
  X, Loader2,
  Edit3, BarChart2, Settings, ChevronRight,
  Activity, Eye, Users, FilePlus2,
  Award, Target, Layers, ExternalLink,
  MousePointer2, TrendingUp, Trophy, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

// ── Types ──────────────────────────────────────────────

interface PortfolioStatus {
  id: string;
  slug: string;
  publishedVersionId: string | null;
  updatedAt: string;
  _count: { versions: number };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
}

// Matches the renderIcon in layout.tsx exactly
function renderNotifIcon(iconName: string) {
  const cls = "w-3.5 h-3.5";
  if (iconName === "MousePointer2") return <MousePointer2 className={cls} />;
  if (iconName === "TrendingUp") return <TrendingUp className={cls} />;
  if (iconName === "Globe") return <Globe className={cls} />;
  if (iconName === "Zap") return <Zap className={cls} />;
  if (iconName === "Trophy") return <Trophy className={cls} />;
  if (iconName === "Star") return <Star className={cls} />;
  return <CheckCircle2 className={cls} />;
}

type Stage = "idle" | "uploading" | "generating" | "done" | "error";

// ── Helpers ────────────────────────────────────────────
function timeAgo(dateString: string) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = new Date(dateString).getTime() - Date.now();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  if (Math.abs(diffSecs) < 60) return "just now";
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  return rtf.format(diffDays, "day");
}

// Generate sparkline data
function generateSparkData(total: number, points = 7) {
  if (total === 0) return Array.from({ length: points }, (_, i) => ({ v: 0, day: i }));
  const arr: { v: number; day: number }[] = [];
  let remaining = total;
  for (let i = 0; i < points - 1; i++) {
    const share = Math.round(remaining * (0.1 + Math.random() * 0.25));
    arr.push({ v: share, day: i });
    remaining -= share;
  }
  arr.push({ v: Math.max(0, remaining), day: points - 1 });
  return arr.sort((a, b) => a.day - b.day);
}

// ── Skeleton ───────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-16 pt-6 animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-3 w-24 skeleton rounded-full" />
        <div className="h-9 w-52 skeleton rounded-lg" />
        <div className="h-3 w-72 skeleton rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 skeleton rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <div className="h-44 skeleton rounded-[2rem]" />
          <div className="h-10 skeleton rounded-2xl" />
          <div className="h-64 skeleton rounded-[2rem]" />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <div className="h-56 skeleton rounded-[2rem]" />
          <div className="h-40 skeleton rounded-[2rem]" />
          <div className="h-52 skeleton rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}

// ── Stat Pill Card ─────────────────────────────────────
function StatPill({
  icon: Icon, label, value, growth, color = "emerald", sparkData,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  growth: number;
  color?: "emerald" | "violet" | "sky";
  sparkData: { v: number; day: number }[];
}) {
  const colors = {
    emerald: { bg: "from-emerald-500/8 to-emerald-500/0", border: "border-emerald-500/20", icon: "text-emerald-500 bg-emerald-500/10", badge: "text-emerald-400 bg-emerald-500/10", stroke: "#10b981" },
    violet: { bg: "from-violet-500/8 to-violet-500/0", border: "border-violet-500/20", icon: "text-violet-400 bg-violet-500/10", badge: "text-violet-400 bg-violet-500/10", stroke: "#8b5cf6" },
    sky: { bg: "from-sky-500/8 to-sky-500/0", border: "border-sky-500/20", icon: "text-sky-400 bg-sky-500/10", badge: "text-sky-400 bg-sky-500/10", stroke: "#0ea5e9" },
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-3xl border bg-gradient-to-br ${colors.bg} ${colors.border} bg-[var(--dash-card-bg)] overflow-hidden p-5 flex flex-col gap-3`}
    >
      {/* Subtle top shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
          {growth >= 0 ? "+" : ""}{growth}%
        </span>
      </div>

      <div>
        <p className="text-2xl font-black text-text tracking-tight leading-none">{value.toLocaleString()}</p>
        <p className="text-[11px] font-medium text-text-muted mt-0.5">{label}</p>
      </div>

      {/* Sparkline */}
      <div className="h-10 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={colors.stroke} strokeWidth={1.5} fill={`url(#grad-${color})`} dot={false} />
            <Tooltip
              contentStyle={{ display: "none" }}
              cursor={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function DashboardHome() {
  const router = useRouter();
  const { user } = useUser();

  const [portfolio, setPortfolio] = useState<PortfolioStatus | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage === "done") {
      const t = setTimeout(() => router.push("/dashboard/portfolio?edit=true"), 3000);
      return () => clearTimeout(t);
    }
  }, [stage, router]);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [portfolioRes, notifRes, analyticsRes] = await Promise.all([
        fetch("/api/portfolio/status").catch(() => null),
        fetch("/api/notifications").catch(() => null),
        fetch("/api/analytics/stats").catch(() => null),
      ]);
      if (portfolioRes?.ok) {
        const d = await portfolioRes.json().catch(() => ({}));
        setPortfolio(d.portfolio ?? null);
      }
      if (notifRes?.ok) {
        const d = await notifRes.json().catch(() => []);
        setNotifications(Array.isArray(d) ? d : d.notifications ?? []);
      }
      if (analyticsRes?.ok) {
        const d = await analyticsRes.json().catch(() => null);
        setAnalytics(d);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const runPipeline = useCallback(async (file: File) => {
    setError(null);
    setStage("uploading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/resume/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Upload failed");
    } catch (e: any) { setError(e.message); setStage("error"); return; }
    setStage("generating");
    try {
      const r = await fetch("/api/portfolio/generate", { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Generation failed");
      setStage("done");
      fetchData(true);
    } catch (e: any) { setError(e.message); setStage("error"); }
  }, [fetchData]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) runPipeline(f);
    e.target.value = "";
  };

  const isProcessing = stage === "uploading" || stage === "generating";
  const firstName = user?.firstName ?? "there";
  const hasPortfolio = !!portfolio;
  const isPublished = !!portfolio?.publishedVersionId;
  const portfolioData = (portfolio as any)?.versions?.[0]?.data ?? (portfolio as any)?.publishedVersion?.data ?? {};

  // Dynamic app URL — matches the settings page pattern exactly
  const [appUrl, setAppUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppUrl(window.location.host + "/");
    }
  }, []);

  const checklistItems = [
    {
      label: "Profile Summary",
      hint: "Write a 2–3 sentence bio about yourself",
      priority: "Must" as const,
      done: !!portfolioData.bio,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "Work Experience",
      hint: "Add at least 1 job or role",
      priority: "Must" as const,
      done: (portfolioData.experience?.length || 0) > 0,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "Skills",
      hint: "List at least 3 of your core skills",
      priority: "Must" as const,
      done: (portfolioData.skills?.length || 0) > 0,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "Education",
      hint: "Add at least 1 degree or certification",
      priority: "Recommended" as const,
      done: (portfolioData.education?.length || 0) > 0,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "Featured Projects",
      hint: "Showcase at least 1 project you built",
      priority: "Recommended" as const,
      done: (portfolioData.projects?.length || 0) > 0,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "Email Address",
      hint: "Ensure your contact email is set",
      priority: "Must" as const,
      done: !!portfolioData.email,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "Profile Photo",
      hint: "Upload a professional display picture",
      priority: "Optional" as const,
      done: !!portfolioData.photoUrl,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "LinkedIn Profile",
      hint: "Add your LinkedIn profile URL",
      priority: "Optional" as const,
      done: !!portfolioData.linkedin,
      href: "/dashboard/portfolio?edit=true",
    },
    {
      label: "GitHub Profile",
      hint: "Add your GitHub profile URL",
      priority: "Optional" as const,
      done: !!portfolioData.github,
      href: "/dashboard/portfolio?edit=true",
    },
  ];
  const doneCount = checklistItems.filter(i => i.done).length;
  const strengthPct = Math.round((doneCount / checklistItems.length) * 100);

  const priorityWeight = { Must: 1, Recommended: 2, Optional: 3 };
  const sortedChecklistItems = [...checklistItems].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  const totalViews = analytics?.metrics?.totalViews ?? 0;
  const totalVisitors = analytics?.metrics?.uniqueVisitors ?? 0;
  const viewGrowth = analytics?.metrics?.growth?.views ?? 0;
  const visitorGrowth = analytics?.metrics?.growth?.visitors ?? 0;
  const viewSparkData = generateSparkData(totalViews);
  const visitorSparkData = generateSparkData(totalVisitors);
  const strengthSparkData = generateSparkData(strengthPct * 10, 7);

  const navActions = [
    { icon: Edit3, label: "Portfolio Studio", sub: "Edit & publish your site", href: "/dashboard/portfolio?edit=true", badge: null },
    { icon: BarChart2, label: "Analytics", sub: "Views, clicks & engagement", href: "/dashboard/analytics", badge: totalViews > 0 ? totalViews.toLocaleString() : null },
    { icon: FilePlus2, label: "Claim Username", sub: "Personalize your public URL", href: "/dashboard/settings?tab=General", badge: !user?.username ? "New" : null },
    { icon: Settings, label: "Settings", sub: "Account & preferences", href: "/dashboard/settings", badge: null },
  ];

  const getStrengthLabel = () => {
    if (strengthPct < 40) return { label: "Getting Started", color: "text-amber-500" };
    if (strengthPct < 70) return { label: "Looking Good", color: "text-sky-400" };
    if (strengthPct < 100) return { label: "Almost Perfect", color: "text-violet-400" };
    return { label: "Profile Complete", color: "text-emerald-500" };
  };
  const strengthStatus = getStrengthLabel();

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          {user?.username && (
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              @{user.username}
            </div>
          )}
          <h1
            className="text-4xl lg:text-[2.75rem] font-black text-text tracking-tight leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Good evening, {firstName}<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2.5 leading-relaxed">
            {isPublished
              ? "Your professional brand is live — keep it sharp and growing."
              : hasPortfolio
              ? "Your portfolio is drafted — review and launch to the world."
              : "Upload your resume and go live in under 60 seconds."}
          </p>
        </div>

        {/* Live Status Chip */}
        {hasPortfolio && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-black ${
              isPublished
                ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-500"
                : "bg-amber-500/8 border-amber-500/20 text-amber-500"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse shadow-[0_0_6px_theme(colors.emerald.500)]" : "bg-amber-400"}`} />
              {isPublished ? "Live" : "Draft"}
            </div>
            {portfolio?.slug && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg)] text-[11px] font-medium text-text-muted">
                <Globe className="w-3 h-3" />
                {appUrl}{portfolio.slug}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* ── STAT RIBBON ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <StatPill icon={Eye} label="Total Profile Views" value={totalViews} growth={viewGrowth} color="emerald" sparkData={viewSparkData} />
        <StatPill icon={Users} label="Unique Visitors" value={totalVisitors} growth={visitorGrowth} color="violet" sparkData={visitorSparkData} />
        <StatPill icon={Target} label="Profile Strength" value={strengthPct} growth={doneCount} color="sky" sparkData={strengthSparkData} />
      </motion.div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-5">

          {/* UPLOAD / SUCCESS CARD */}
          <AnimatePresence mode="wait">
            {stage === "done" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative rounded-[2rem] overflow-hidden border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-8 flex items-center gap-6"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-text">Portfolio Built!</h3>
                  <p className="text-sm text-text-secondary mt-0.5">Opening Studio to review your details…</p>
                </div>
                <Link href="/dashboard/portfolio?edit=true" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
                  Open Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {/* Premium Upload Card */}
                <div
                  className={`relative rounded-[2rem] border overflow-hidden transition-all group ${
                    isProcessing
                      ? "bg-[var(--dash-card-bg)] border-[var(--dash-card-border)]"
                      : "bg-[var(--dash-card-bg)] border-[var(--dash-card-border)] hover:border-emerald-500/40 cursor-pointer"
                  }`}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                >
                  {/* Top shine line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Left accent gradient bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0" />

                  <div className="flex flex-col sm:flex-row items-center gap-6 px-8 py-7">
                    {/* Animated Icon zone */}
                    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isProcessing ? "bg-emerald-500/10" : "bg-emerald-500/8 group-hover:bg-emerald-500/15"
                    }`}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 animate-pulse" />
                        </>
                      ) : (
                        <UploadCloud className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                      )}
                    </div>

                    {/* Copy */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-lg font-black text-text">
                        {isProcessing
                          ? (stage === "uploading" ? "Uploading resume…" : "AI is crafting your portfolio…")
                          : hasPortfolio ? "Sync with new resume" : "Build your portfolio with AI"}
                      </h2>
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed max-w-sm">
                        {isProcessing
                          ? "Extracting your details, structuring your brand…"
                          : hasPortfolio
                            ? "Upload a fresh resume to instantly refresh your entire profile in one click."
                            : "Drop your resume and watch AI extract your experience, skills, and projects automatically."}
                      </p>
                      {isProcessing && (
                        <div className="mt-3 w-full max-w-[200px] mx-auto sm:mx-0 h-1 bg-border rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: stage === "uploading" ? "40%" : "85%" }}
                            transition={{ duration: 8, ease: "easeOut" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    {!isProcessing && (
                      <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
                      >
                        <Zap className="w-4 h-4" />
                        {hasPortfolio ? "Sync Resume" : "Drop & Build"}
                      </button>
                    )}
                  </div>

                  {!isProcessing && (
                    <div className="px-8 py-2.5 border-t border-[var(--dash-card-border)] bg-background-tertiary/20 flex items-center gap-2">
                      <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em]">Accepts</span>
                      {["PDF", "DOCX"].map(f => (
                        <span key={f} className="px-1.5 py-0.5 rounded bg-border text-[9px] font-black text-text-muted uppercase">{f}</span>
                      ))}
                      <span className="ml-auto flex items-center gap-1 text-[9px] text-text-muted font-medium">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                        AI-powered extraction
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChange} accept=".pdf,.docx" />

          {/* LIVE STATUS BAR */}
          {hasPortfolio && stage !== "done" && !isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)]"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPublished ? "bg-emerald-500 animate-pulse shadow-[0_0_6px_theme(colors.emerald.500)]" : "bg-amber-400"}`} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black text-text mr-2">{isPublished ? "Live" : "Draft"}</span>
                {portfolio?.slug && (
                  <span className="text-[10px] text-text-muted font-medium">{appUrl}{portfolio.slug}</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href="/dashboard/portfolio?edit=true" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-tertiary hover:bg-border text-text text-[10px] font-black uppercase tracking-wider transition-colors">
                  <Edit3 className="w-3 h-3" /> Edit
                </Link>
                {isPublished && (
                  <button onClick={() => window.open(`/${portfolio?.slug}`, "_blank")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-wider transition-colors">
                    <ExternalLink className="w-3 h-3" /> Visit
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* PORTFOLIO STRENGTH ── Premium redesign */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-[2rem] bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Header */}
            <div className="px-7 pt-6 pb-5 border-b border-[var(--dash-card-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-text">Profile Strength</h2>
                    <p className="text-[10px] text-text-muted mt-0.5">{doneCount} of {checklistItems.length} sections complete</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs font-black ${strengthStatus.color} uppercase tracking-wider`}>{strengthStatus.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${strengthPct}%` }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="text-sm font-black text-text">{strengthPct}<span className="text-emerald-500 text-xs">%</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              {sortedChecklistItems.map((item, i) => {
                const priorityStyles = {
                  Must: "bg-red-500/10 text-red-400 border-red-500/20",
                  Recommended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  Optional: "bg-sky-500/10 text-sky-400 border-sky-500/20",
                }[item.priority];

                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 px-7 py-4 border-b border-[var(--dash-card-border)] last:border-0 group hover:bg-background-tertiary/30 transition-colors"
                  >
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      item.done ? "bg-emerald-500 shadow-sm shadow-emerald-500/30" : "border-2 border-border"
                    }`}>
                      {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>

                    {/* Label + hint — full block fades + strikes when done */}
                    <div className={`flex-1 min-w-0 transition-all duration-300 ${item.done ? "opacity-40" : "opacity-100"}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold transition-all ${item.done ? "line-through decoration-text/60 text-text" : "text-text"}`}>
                          {item.label}
                        </span>
                        {!item.done && (
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${priorityStyles}`}>
                            {item.priority}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] mt-0.5 block transition-all ${item.done ? "line-through decoration-text-muted/50 text-text-muted" : "text-text-muted"}`}>
                        {item.hint}
                      </span>
                    </div>

                    {/* Action */}
                    {item.done ? (
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider flex-shrink-0 mt-0.5">Done</span>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 text-[9px] font-black text-text-muted uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity hover:text-emerald-500 flex-shrink-0 mt-0.5"
                      >
                        Add <ChevronRight className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-5 space-y-5">

          {/* MISSION CONTROL ── Premium bento tiles */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="relative rounded-[2rem] bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="px-6 pt-5 pb-4 border-b border-[var(--dash-card-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-text-muted" />
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.18em]">Mission Control</h3>
              </div>
            </div>

            <div className="p-2.5 space-y-1">
              {navActions.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group hover:bg-emerald-500/8"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all bg-background-tertiary text-text-muted group-hover:bg-emerald-500/15 group-hover:text-emerald-500">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate transition-colors text-text-secondary group-hover:text-text">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">{item.sub}</p>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                      item.badge === "New"
                        ? "bg-violet-500/10 text-violet-400"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted/40 group-hover:text-emerald-500/60 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.section>

          {/* TIMELINE ACTIVITY */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="relative rounded-[2rem] bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="px-6 pt-5 pb-4 border-b border-[var(--dash-card-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Activity className="w-3.5 h-3.5 text-text-muted" />
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.18em]">Latest Activity</h3>
              </div>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">
                Via notification bell
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-background-tertiary/60 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-text-muted opacity-30" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary">No recent activity</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Activity will appear here as your portfolio gains traction.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[2.35rem] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--dash-card-border)] via-[var(--dash-card-border)] to-transparent" />

                {notifications.slice(0, 5).map((n, i) => (
                  <div key={n.id} className="flex items-start gap-4 px-5 py-4 hover:bg-background-tertiary/30 transition-colors">
                    <div className={`relative z-10 w-7 h-7 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.isRead ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-background-tertiary border-border text-text-muted"}`}>
                      {renderNotifIcon(n.icon)}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-xs font-bold text-text truncate">{n.title}</p>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-[9px] text-text-tertiary font-bold tabular-nums flex-shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>

      {/* ── ERROR TOAST ── */}
      <AnimatePresence>
        {stage === "error" && error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-8 right-8 flex items-center gap-4 bg-[var(--dash-card-bg)] border border-red-500/20 rounded-2xl px-5 py-4 shadow-2xl shadow-black/30 z-50 max-w-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
              <X className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-text">Upload Failed</p>
              <p className="text-[10px] text-text-muted truncate">{error}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { setStage("idle"); setError(null); fileInputRef.current?.click(); }}
                className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline"
              >
                Retry
              </button>
              <button onClick={() => { setStage("idle"); setError(null); }} className="text-[9px] font-black text-text-muted uppercase tracking-widest hover:underline">
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
