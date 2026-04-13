"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  UploadCloud, FileText, Sparkles, ArrowRight,
  CheckCircle2, Clock, Globe, Zap, TrendingUp,
  File, X, Loader2, ExternalLink, RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────

interface ResumeItem {
  id: string;
  originalFilename: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

interface PortfolioStatus {
  id: string;
  slug: string;
  publishedVersionId: string | null;
  updatedAt: string;
  _count: { versions: number };
}

type GenerateStage = "idle" | "uploading" | "parsing" | "generating" | "done" | "error";

// ── Helpers ────────────────────────────────────────────

function formatBytes(bytes: number | null) {
  if (!bytes) return "–";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const STAGE_LABELS: Record<GenerateStage, string> = {
  idle: "",
  uploading: "Uploading resume…",
  parsing: "Reading your resume…",
  generating: "AI is building your portfolio…",
  done: "Portfolio generated!",
  error: "Something went wrong.",
};

// ── Main Component ─────────────────────────────────────

export default function DashboardHome() {
  const { user } = useUser();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioStatus | null>(null);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<GenerateStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch dashboard data ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resumeRes, portfolioRes] = await Promise.all([
        fetch("/api/resume/list"),
        fetch("/api/portfolio/status"),
      ]);
      const resumeData = await resumeRes.json();
      const portfolioData = await portfolioRes.json();
      setResumes(resumeData.resumes ?? []);
      setPortfolio(portfolioData.portfolio ?? null);
      setResumeCount(portfolioData.resumeCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Full pipeline: upload → generate ──
  const runFullPipeline = useCallback(async (file: File) => {
    setError(null);
    setStage("uploading");

    // Step 1: Upload resume
    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/resume/upload", { method: "POST", body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error ?? "Upload failed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStage("error");
      return;
    }

    // Step 2: Generate portfolio
    setStage("generating");
    try {
      const genRes = await fetch("/api/portfolio/generate", { method: "POST" });
      const genJson = await genRes.json();
      if (!genRes.ok) throw new Error(genJson.error ?? "Generation failed");
      setGeneratedSlug(genJson.slug);
      setStage("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStage("error");
      return;
    }

    await fetchData();
  }, [fetchData]);

  // ── Generate from existing resume ──
  const generateFromExisting = useCallback(async () => {
    setError(null);
    setStage("generating");
    try {
      const genRes = await fetch("/api/portfolio/generate", { method: "POST" });
      const genJson = await genRes.json();
      if (!genRes.ok) throw new Error(genJson.error ?? "Generation failed");
      setGeneratedSlug(genJson.slug);
      setStage("done");
      await fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStage("error");
    }
  }, [fetchData]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && stage === "idle") runFullPipeline(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) runFullPipeline(file);
    e.target.value = "";
  };

  const isProcessing = stage === "uploading" || stage === "parsing" || stage === "generating";
  const firstName = user?.firstName ?? "there";
  const isPublished = !!portfolio?.publishedVersionId;
  const versionCount = portfolio?._count.versions ?? 0;
  const portfolioSlug = generatedSlug ?? portfolio?.slug;

  return (
    <div className="flex flex-col gap-8 max-w-6xl">

      {/* ── WELCOME BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-8 md:p-10 shadow-xl shadow-emerald-500/20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-[0.2em] mb-2">Welcome back</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Hey, {firstName}! 👋
            </h1>
            <p className="text-emerald-100/80 text-sm font-medium max-w-sm">
              {isPublished
                ? "Your portfolio is live and looking great."
                : "Upload your resume to generate your AI-powered portfolio."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-60"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Resume
            </button>
            {isPublished && portfolioSlug && (
              <Link
                href={`/p/${portfolioSlug}`}
                target="_blank"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                View Portfolio
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── PROGRESS BANNER ── */}
      {isProcessing && (
        <div className="flex items-center gap-4 bg-[var(--dash-card-bg)] border border-emerald-500/30 rounded-2xl px-6 py-4">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-text">{STAGE_LABELS[stage]}</p>
            <p className="text-xs text-text-secondary">This may take 10–30 seconds</p>
          </div>
        </div>
      )}

      {/* ── SUCCESS BANNER ── */}
      {stage === "done" && portfolioSlug && (
        <div className="flex items-center justify-between gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-6 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-text">Portfolio generated successfully!</p>
              <p className="text-xs text-text-secondary">Your portfolio is now live at /p/{portfolioSlug}</p>
            </div>
          </div>
          <Link
            href={`/p/${portfolioSlug}`}
            target="_blank"
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </Link>
        </div>
      )}

      {/* ── ERROR BANNER ── */}
      {stage === "error" && error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl px-6 py-4">
          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
          <button onClick={() => setStage("idle")} className="ml-auto text-xs font-bold text-red-500 hover:underline">Dismiss</button>
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-6 flex items-center gap-4 hover:border-emerald-500/30 hover:shadow-sm transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-[var(--dash-stat-emerald-bg)] flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-text">{loading ? "–" : resumeCount}</p>
            <p className="text-xs font-semibold text-text-secondary mt-0.5">Resumes Uploaded</p>
          </div>
        </div>

        <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-6 flex items-center gap-4 hover:border-emerald-500/30 hover:shadow-sm transition-all group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
            isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
          }`}>
            {isPublished ? <Globe className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <p className={`text-sm font-black ${isPublished ? "text-emerald-500" : "text-amber-500"}`}>
              {loading ? "–" : isPublished ? "Published" : "No Portfolio"}
            </p>
            <p className="text-xs font-semibold text-text-secondary mt-0.5">
              {loading ? "" : isPublished ? `${versionCount} version${versionCount !== 1 ? "s" : ""}` : "Upload to get started"}
            </p>
          </div>
        </div>

        <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-6 flex items-center gap-4 hover:border-emerald-500/30 hover:shadow-sm transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-[var(--dash-stat-emerald-bg)] flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-text truncate">
              {loading ? "–" : portfolioSlug ? `/${portfolioSlug}` : "Not created"}
            </p>
            <p className="text-xs font-semibold text-text-secondary mt-0.5">Portfolio Slug</p>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Upload Zone */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-black text-text" style={{ fontFamily: "var(--font-display)" }}>Upload Resume</h2>
            <p className="text-sm text-text-secondary mt-1">PDF or DOCX • up to 5MB. AI analyzes and builds your portfolio.</p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all group ${
              isProcessing ? "cursor-not-allowed opacity-70" :
              dragOver ? "border-emerald-500 bg-emerald-500/5 scale-[1.01] cursor-copy" :
              "border-[var(--dash-card-border)] bg-[var(--dash-upload-bg)] hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] cursor-pointer"
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-sm font-semibold text-text-secondary">{STAGE_LABELS[stage]}</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-text mb-1">
                  {dragOver ? "Drop it!" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-text-muted">PDF, DOCX up to 5MB</p>
                <p className="text-[10px] text-emerald-500 font-semibold mt-2">AI will auto-generate your portfolio</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={onFileChange}
          />

          {/* Regenerate button — if they already have a resume */}
          {resumes.length > 0 && !isProcessing && (
            <button
              onClick={generateFromExisting}
              className="w-full mt-3 flex items-center justify-center gap-2 border border-[var(--dash-card-border)] hover:border-emerald-500/30 text-text-secondary hover:text-text bg-[var(--dash-card-bg)] rounded-xl py-3 text-sm font-bold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate from latest resume
            </button>
          )}
        </div>

        {/* RIGHT: Resume History */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-black text-text" style={{ fontFamily: "var(--font-display)" }}>Resume History</h2>
              <p className="text-sm text-text-secondary mt-1">Your uploaded resumes.</p>
            </div>
          </div>

          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-44"><Loader2 className="w-6 h-6 animate-spin text-text-muted" /></div>
            ) : resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 gap-2 text-center px-6">
                <div className="w-10 h-10 rounded-2xl bg-[var(--dash-stat-emerald-bg)] flex items-center justify-center text-emerald-500">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-text">No resumes yet</p>
                <p className="text-xs text-text-muted">Upload your first resume above.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--dash-card-border)]">
                {resumes.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-background-secondary/50 transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-[var(--dash-stat-emerald-bg)] flex items-center justify-center text-emerald-500 flex-shrink-0">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text truncate">{r.originalFilename ?? "Untitled resume"}</p>
                      <p className="text-xs text-text-muted">{formatBytes(r.sizeBytes)} • {timeAgo(r.createdAt)}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── PORTFOLIO CTA / STATUS ── */}
      {!loading && !isPublished && (
        <div className="relative overflow-hidden bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-3xl p-8 md:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-text mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Your portfolio isn't live yet
                </h3>
                <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                  Upload your resume and we'll generate a stunning, AI-crafted portfolio in seconds.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => resumes.length > 0 ? generateFromExisting() : fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60"
              >
                <Zap className="w-4 h-4" />
                {resumes.length > 0 ? "Generate Portfolio" : "Upload Resume First"}
              </button>
              <Link href="/dashboard/portfolio" className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text transition-colors">
                Preview <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {!loading && isPublished && portfolioSlug && (
        <div className="relative overflow-hidden bg-[var(--dash-card-bg)] border border-emerald-500/20 rounded-3xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Portfolio Live</p>
                <p className="text-sm font-bold text-text">/p/{portfolioSlug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/p/${portfolioSlug}`}
                target="_blank"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </Link>
              <button
                onClick={generateFromExisting}
                disabled={isProcessing}
                className="flex items-center gap-2 border border-[var(--dash-card-border)] text-text px-5 py-2.5 rounded-xl text-sm font-bold hover:border-emerald-500/30 transition-all disabled:opacity-60"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <Link
                href="/dashboard/portfolio"
                className="flex items-center gap-2 border border-[var(--dash-card-border)] text-text px-5 py-2.5 rounded-xl text-sm font-bold hover:border-emerald-500/30 transition-all"
              >
                Edit Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
