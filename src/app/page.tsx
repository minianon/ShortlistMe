"use client";

import Link from "next/link";
import { Sparkles, Check, Zap, Sliders, Palette, Share, UploadCloud, CheckCircle, ChevronDown, BarChart3, Globe, Search, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [isTeamCanvasOpen, setIsTeamCanvasOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Timer: Handles the 0-100% steady count
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 2. Step Logic: Handles transitioning when progress hits 100%
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setActiveStep((curr) => (curr === 3 ? 1 : curr + 1));
        setProgress(0);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  const handleStepClick = (id: number) => {
    setActiveStep(id);
    setProgress(0);
  };

  const VideoCard = ({ src, className = "" }: { src: string; className?: string }) => (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl border border-border-strong/10 bg-black/5 ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:opacity-100 transition-opacity duration-700"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/10 via-transparent to-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background-secondary text-text font-sans selection:bg-primary selection:text-white">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-md border-b border-border-strong/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-xl tracking-tight text-text"
            >
              ShortlistMe
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex text-text-muted hover:text-text transition-colors">
              <ThemeToggle />
            </div>
            <Link
              href="/sign-up"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6">
        {/* ── Hero Section ── */}
        <section className="py-20 md:py-28 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wide mb-6">
              AI-Powered Portfolios in a Snap
            </div>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-text"
            >
              Turn Your Resume Into a <span className="text-primary">Portfolio</span> in Seconds
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Upload your resume or enter your details manually, and we'll generate a professional, high-fidelity portfolio instantly. Share your best work with recruiters and clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/sign-up"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl text-[15px] font-semibold transition-all shadow-lg shadow-primary/25 w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="bg-background-tertiary hover:bg-border-strong text-text px-8 py-3.5 rounded-xl text-[15px] font-semibold transition-all w-full sm:w-auto text-center"
              >
                See Features &gt;
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none relative">
            {/* The SaaS Browser Window */}
            <div className="aspect-square md:aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] bg-[#0c0c0c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-0 flex flex-col relative overflow-hidden animate-[heroBrowserGlow_6s_infinite_cubic-bezier(0.25,1,0.5,1)] w-full max-w-[540px] mx-auto transform-gpu transition-all">
              
              {/* Browser Header */}
              <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02] relative z-20">
                <div className="flex gap-1.5 w-16">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                </div>
                {/* Search / Progress Bar */}
                <div className="flex-1 max-w-[160px] md:max-w-[200px] h-4 bg-white/5 rounded-full relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-emerald-500/30 rounded-full animate-[heroLoadBar_6s_infinite_linear]"></div>
                </div>
                <div className="w-16"></div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#111111] to-[#0a0a0a]">
                
                {/* Scene 1: Resume Upload & AI Parsing */}
                <div className="absolute w-24 h-32 bg-white/[0.03] border border-white/10 rounded-lg top-1/2 left-1/2 flex flex-col gap-2.5 p-3 opacity-0 animate-[heroResumePulse_6s_infinite_cubic-bezier(0.25,1,0.5,1)] z-10 pointer-events-none shadow-2xl backdrop-blur-sm">
                   {/* Resume Lines */}
                   <div className="w-1/2 h-2 bg-emerald-500/50 rounded-full mb-1"></div>
                   <div className="w-full h-1.5 bg-white/20 rounded-full"></div>
                   <div className="w-full h-1.5 bg-white/20 rounded-full"></div>
                   <div className="w-4/5 h-1.5 bg-white/20 rounded-full"></div>
                   <div className="mt-auto w-full h-8 bg-white/5 rounded block border border-white/10"></div>
                   
                   {/* Scanning Rings Overlay */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-emerald-500/40 animate-[heroAiPulse_6s_infinite_cubic-bezier(0.25,1,0.5,1)]"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_25px_#10b981] animate-[heroPulseCenter_6s_infinite_cubic-bezier(0.25,1,0.5,1)]"></div>
                </div>

                {/* Scene 2: Portfolio UI Build - Fades In */}
                <div className="w-full h-full flex flex-col gap-4 animate-[heroUiFadeIn_6s_infinite_cubic-bezier(0.25,1,0.5,1)] relative z-20 opacity-0">
                  {/* Portfolio Hero Skeleton */}
                  <div className="w-full h-24 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-3 p-4">
                     <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20"></div>
                     <div className="w-1/3 h-2.5 bg-white/20 rounded-full"></div>
                     <div className="w-1/2 h-2 bg-white/10 rounded-full"></div>
                  </div>
                  
                  {/* Portfolio Body Grid */}
                  <div className="flex flex-1 gap-4">
                     {/* Sidebar Skeleton */}
                     <div className="w-1/3 h-full bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col gap-2">
                        <div className="w-full h-2 bg-white/10 rounded-full mb-2"></div>
                        <div className="w-3/4 h-1.5 bg-white/5 rounded-full"></div>
                        <div className="w-5/6 h-1.5 bg-white/5 rounded-full"></div>
                        <div className="w-2/3 h-1.5 bg-white/5 rounded-full"></div>
                     </div>
                     {/* Projects Grid Skeleton */}
                     <div className="flex-1 h-full flex flex-col gap-3">
                        <div className="flex gap-3 h-1/2">
                           <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                              <div className="absolute top-2 left-2 w-1/2 h-1.5 bg-white/10 rounded-full"></div>
                           </div>
                           <div className="flex-1 bg-emerald-500/5 border border-emerald-500/10 rounded-xl relative overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                              <div className="absolute top-2 left-2 w-1/2 h-1.5 bg-emerald-500/30 rounded-full"></div>
                           </div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                           <div className="absolute right-0 bottom-0 w-16 h-16 bg-emerald-500/10 rounded-tl-full blur-md"></div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Scene 3: Success Toast Popup */}
                <div className="absolute bottom-6 left-1/2 backdrop-blur-md bg-[#132a21]/90 border border-emerald-500/30 rounded-full px-4 py-2 flex items-center gap-2 z-30 animate-[heroToastPop_6s_infinite_cubic-bezier(0.25,1,0.5,1)] shadow-[0_10px_30px_rgba(16,185,129,0.15)] opacity-0">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center">
                     <Check className="w-2 h-2 text-[#0c0c0c]" strokeWidth={4} />
                   </div>
                   <span className="text-emerald-400 text-[11px] font-bold tracking-wide uppercase">Portfolio Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-24 scroll-mt-24">
          <div className="mb-14">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4"
            >
              Powerful features for modern careers
            </h2>
            <p className="text-text-secondary max-w-2xl text-lg">
              Everything you need to stand out in a crowded market, powered by our custom curation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 1. Instant Generation (8/12) */}
            <div className="md:col-span-8 bg-background p-10 rounded-[2.5rem] shadow-sm border border-border flex flex-col lg:flex-row gap-10 items-center overflow-hidden group">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">Instant Generation</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                   Turn a static resume into a high-fidelity professional site in under 10 seconds.
                </p>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-background-tertiary rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider">Neural Engine v2</div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Fast-Sync</div>
                </div>
              </div>
              <div className="flex-1 w-full lg:w-auto h-72 relative bg-background-secondary rounded-[2rem] border border-border-strong/10 p-0 overflow-hidden shadow-inner flex items-center justify-center">
                 {/* Radial Glow Background */}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50"></div>
                 
                 {/* Scene 1 & 3: The Resume & Scanner */}
                 <div className="absolute w-32 h-44 bg-white rounded-xl shadow-md border border-slate-200 p-3 flex flex-col gap-2 z-10 animate-[igResume_3s_infinite_cubic-bezier(0.25,1,0.5,1)] overflow-hidden">
                    {/* Skeleton lines */}
                    <div className="w-1/2 h-2.5 bg-slate-200 rounded mb-2"></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                    <div className="w-5/6 h-1.5 bg-slate-100 rounded"></div>
                    <div className="w-4/5 h-1.5 bg-slate-100 rounded mb-2"></div>
                    <div className="w-full h-10 bg-slate-50 rounded mt-auto border border-slate-100"></div>
                    
                    {/* Scene 3: Scanning Line Overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[igScanner_3s_infinite_linear]"></div>
                 </div>

                 {/* Scene 2: Generate Button */}
                 <div className="absolute top-[65%] w-28 h-9 bg-emerald-600 rounded-full shadow-lg border border-emerald-500 text-white flex items-center justify-center gap-1.5 z-20 animate-[igButton_3s_infinite_cubic-bezier(0.25,1,0.5,1)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Generate</span>
                 </div>

                 {/* Scene 4 & 5: Polished Portfolio UI */}
                 <div className="absolute w-56 h-40 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 flex flex-col gap-3 z-30 animate-[igPortfolio_3s_infinite_cubic-bezier(0.25,1,0.5,1)]">
                    {/* Glowing effect wrapper */}
                    <div className="absolute inset-0 rounded-2xl animate-[igGlow_3s_infinite_cubic-bezier(0.25,1,0.5,1)] pointer-events-none border border-emerald-500/20"></div>
                    
                    {/* Portfolio Header */}
                    <div className="w-full h-6 flex justify-between items-center border-b border-slate-100 pb-2">
                       <div className="w-5 h-5 rounded-md bg-emerald-100"></div>
                       <div className="flex gap-2">
                          <div className="w-8 h-1.5 bg-slate-100 rounded"></div>
                          <div className="w-8 h-1.5 bg-slate-100 rounded"></div>
                       </div>
                    </div>
                    {/* Portfolio Body Grid */}
                    <div className="flex-1 flex gap-3">
                       {/* Sidebar */}
                       <div className="w-12 h-full flex flex-col gap-2 pt-1 border-r border-slate-50 pr-2">
                          <div className="w-full h-1.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                          <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                       </div>
                       {/* Main Content */}
                       <div className="flex-1 h-full flex flex-col gap-2">
                          <div className="w-full h-12 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col gap-2 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-bl-full"></div>
                             <div className="w-1/2 h-2 bg-emerald-200 rounded"></div>
                             <div className="w-3/4 h-1.5 bg-slate-200 rounded"></div>
                          </div>
                          <div className="w-full flex-1 bg-slate-50 border border-slate-100 rounded-lg p-2">
                             <div className="w-2/3 h-1.5 bg-slate-200 rounded"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* 2. Real-time Analytics (4/12) */}
            <div className="md:col-span-4 bg-background p-10 rounded-[2.5rem] shadow-sm border border-border flex flex-col group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 transition-transform group-hover:scale-110">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">Live Analytics</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Track all visitor engagement and reach in real-time.
                </p>
              </div>
              <div className="mt-auto relative z-10 flex flex-col gap-4">
                <div className="text-4xl font-black text-emerald-600 tabular-nums flex items-baseline gap-1">
                  <span className="animate-count"></span>
                  <span className="text-lg opacity-50">+</span>
                </div>
                
                {/* SVG Area Chart - Synced Growth */}
                <div className="relative h-24 w-full">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(16,185,129,0.15)]">
                    <defs>
                      <linearGradient id="syncGraphGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g className="analytics-graph-sync">
                      {/* Fill Area */}
                      <path
                        d="M0 40 Q 15 35, 25 20 T 45 15 T 65 25 T 85 5 T 100 10 L 100 40 L 0 40 Z"
                        fill="url(#syncGraphGradient)"
                      />
                      {/* Stroke Line */}
                      <path
                        d="M0 40 Q 15 35, 25 20 T 45 15 T 65 25 T 85 5 T 100 10"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  {/* Glowing Point at the end of the reveal - Synced */}
                  <div className="absolute top-[8px] right-0 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981] analytics-graph-sync"></div>
                </div>
              </div>
            </div>

            {/* 3. High Customization (7/12) */}
            <div className="md:col-span-12 lg:col-span-7 bg-background p-10 rounded-[2.5rem] shadow-sm border border-border group overflow-hidden relative flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 border border-indigo-100 transition-transform group-hover:rotate-6 shadow-sm">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">Pixel Perfection</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Tweak every detail of your website theme, color, and layout in real-time.
                </p>
                {/* Simulated Color Slider - Synced */}
                <div className="w-full h-8 rounded-full bg-gradient-to-r from-primary via-indigo-500 to-rose-500 relative flex items-center cursor-default group/slider mb-6">
                  <div className="w-6 h-6 bg-white rounded-full shadow-lg border-2 border-border theme-dot-sync"></div>
                </div>
              </div>
              <div className="flex-1 w-full h-64 relative bg-background-tertiary/20 rounded-3xl border border-border p-4 overflow-hidden">
                {/* Website Theme Mockup - Synced */}
                {/* The theme-mockup-sync class animates the 'color' property, which children inherit via text-current, bg-current, etc. */}
                <div className="w-full h-full rounded-2xl bg-background border border-border shadow-2xl p-5 flex flex-col gap-4 theme-mockup-sync relative z-10">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    {/* Logo Color Sync */}
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-md bg-current shadow-sm"></div>
                       <div className="w-12 h-2 bg-text opacity-10 rounded-full"></div>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-10 h-4 bg-current opacity-20 rounded-md"></div>
                    </div>
                  </div>
                  {/* Theme Content */}
                  <div className="space-y-3 mt-2">
                    {/* Changed color inheritance: removed text-text so it uses the animated color from parent */}
                    <div className="text-[14px] font-black leading-tight text-current">
                       Build a <span className="underline decoration-current/30 underline-offset-4">career</span> that inspires everyone.
                    </div>
                    <div className="space-y-1.5 opacity-40">
                      <div className="w-full h-1.5 bg-current opacity-20 rounded-full"></div>
                      <div className="w-3/4 h-1.5 bg-current opacity-20 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="px-3 py-1.5 bg-current opacity-10 rounded-md text-[8px] font-bold">SEND MESSAGE</div>
                    <div className="flex gap-1.5">
                       {[1, 2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-current opacity-20"></div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Expert Exports (5/12) */}
            <div className="md:col-span-12 lg:col-span-5 bg-background p-10 rounded-[2.5rem] shadow-sm border border-border group overflow-hidden flex flex-col relative min-h-[400px]">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 border border-orange-100 transition-transform group-hover:-rotate-6">
                  <Share className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">Expert Exports</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  One-click export to high-fidelity PDF, Figma, or professional resumes.
                </p>
              </div>

              {/* Simulation: Transformation Chamber */}
              <div className="mt-auto relative h-52 w-full bg-background-tertiary/20 rounded-[2.5rem] border border-border flex flex-col items-center justify-center overflow-hidden">
                 {/* Transformation Zone */}
                 <div className="relative w-48 h-32 flex items-center justify-center">
                    {/* The "File" moving through */}
                    <div className="absolute w-24 h-32 bg-white rounded-lg shadow-2xl border border-orange-100/50 flex flex-col p-4 gap-2 animate-file-slide">
                       <div className="w-full h-2 bg-orange-100 rounded"></div>
                       <div className="w-3/4 h-2 bg-orange-50 rounded"></div>
                       <div className="mt-auto flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-orange-500"></div>
                          <div className="w-8 h-1.5 bg-orange-100 rounded"></div>
                       </div>
                    </div>

                    {/* Scanning Beam */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent w-full h-[200%] animate-scan-beam pointer-events-none">
                       <div className="w-full h-[2px] bg-orange-500 shadow-[0_0_15px_#f97316]"></div>
                    </div>
                 </div>

                 {/* Export Formats (Bottom) */}
                 <div className="absolute bottom-4 flex gap-4">
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm border border-border text-[10px] font-bold text-rose-500">.PDF</div>
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm border border-border text-[10px] font-bold text-indigo-500">.FIG</div>
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm border border-border text-[10px] font-bold text-emerald-500">.DOCX</div>
                 </div>
              </div>
            </div>

            {/* 5. Global Research (Full Width) */}
            <div className="md:col-span-12 bg-background p-10 rounded-[2.5rem] shadow-sm border border-border group overflow-hidden relative min-h-[500px] flex flex-col lg:flex-row gap-12 items-center">
              <div className="max-w-xl relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 transition-transform group-hover:scale-110">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4">Global Intelligence</h3>
                <p className="text-text-secondary leading-relaxed text-lg mb-8">
                  Our agents actively research global job markets and position your portfolio where the highest-intent recruiters are looking.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['SEO Optimized', 'Global Reach', 'Contextual Matching'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-tight">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Simulation: SaaS Pipeline Transformation */}
              <div className="flex-1 w-full bg-slate-50/50 rounded-[3rem] border border-border p-8 relative flex items-center justify-center overflow-hidden min-h-[400px]">
                 {/* Radial Glow Background */}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
                 
                 {/* Scene 1: The Initial Resume */}
                 <div className="absolute w-28 h-36 bg-white rounded-lg shadow-md border border-slate-200 p-3 flex flex-col gap-2 z-10 animate-[saasResumeFade_6s_infinite_cubic-bezier(0.25,1,0.5,1)]">
                    <div className="w-1/2 h-2.5 bg-slate-300 rounded mb-2"></div>
                    <div className="w-full h-1 bg-slate-200 rounded"></div>
                    <div className="w-5/6 h-1 bg-slate-200 rounded"></div>
                    <div className="w-4/5 h-1 bg-slate-200 rounded mb-2"></div>
                    <div className="w-full h-8 bg-slate-100 rounded mt-auto"></div>
                 </div>

                 {/* Scene 2 & 3: Floating Elements into Portfolio Grid */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {/* Header Card */}
                    <div className="absolute w-36 h-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 p-2 flex items-center gap-2"
                         style={{ '--bx': '0px', '--by': '-60px', '--px': '0px', '--py': '-52px', animation: 'saasCardsBreak 6s infinite cubic-bezier(0.25,1,0.5,1)' } as React.CSSProperties}>
                       <div className="w-6 h-6 rounded-full bg-indigo-100"></div>
                       <div className="w-16 h-2 bg-slate-200 rounded"></div>
                    </div>

                    {/* Sidebar / Skills Card */}
                    <div className="absolute w-12 h-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 p-2 flex flex-col gap-1.5"
                         style={{ '--bx': '-60px', '--by': '20px', '--px': '-48px', '--py': '4px', animation: 'saasCardsBreak 6s infinite cubic-bezier(0.25,1,0.5,1)' } as React.CSSProperties}>
                       <div className="w-full h-2 bg-purple-100 rounded mb-1"></div>
                       <div className="w-full h-1 bg-slate-100 rounded"></div>
                       <div className="w-full h-1 bg-slate-100 rounded"></div>
                       <div className="w-full h-1 bg-slate-100 rounded"></div>
                    </div>

                    {/* Main Content / Experience Card */}
                    <div className="absolute w-20 h-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 p-2 flex flex-col gap-1.5"
                         style={{ '--bx': '50px', '--by': '30px', '--px': '8px', '--py': '4px', animation: 'saasCardsBreak 6s infinite cubic-bezier(0.25,1,0.5,1)' } as React.CSSProperties}>
                       <div className="w-2/3 h-2 bg-blue-100 rounded mb-1"></div>
                       <div className="w-full h-6 bg-slate-50 border border-slate-100 rounded"></div>
                       <div className="w-full h-3 bg-slate-50 border border-slate-100 rounded"></div>
                    </div>
                 </div>

                 {/* Scene 4: Portfolio Container & Distribution Radiance */}
                 <div className="absolute w-[160px] h-[130px] bg-white/10 border border-indigo-200/50 rounded-2xl z-10 flex items-center justify-center animate-[saasPortfolioBox_6s_infinite_cubic-bezier(0.25,1,0.5,1)]">
                    <div className="absolute inset-0 rounded-2xl border border-indigo-400 animate-[saasRadiate_6s_infinite_cubic-bezier(0.25,1,0.5,1)]"></div>
                    <div className="absolute inset-0 rounded-2xl border border-purple-400 animate-[saasRadiate_6s_infinite_cubic-bezier(0.25,1,0.5,1)] [animation-delay:0.2s]"></div>
                 </div>

                 {/* Scene 5: Recruiter Dashboard Overlay */}
                 <div className="absolute inset-x-6 inset-y-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 animate-[saasDashboard_6s_infinite_cubic-bezier(0.25,1,0.5,1)] flex flex-col">
                    {/* Dashboard Topbar */}
                    <div className="h-8 border-b border-slate-100 flex items-center px-4 justify-between bg-slate-50/50">
                       <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                       </div>
                       <div className="w-16 h-2 bg-slate-200 rounded"></div>
                    </div>
                    {/* Dashboard Content */}
                    <div className="flex-1 flex p-2 gap-2">
                       {/* Sidebar */}
                       <div className="w-12 border-r border-slate-100 py-2 flex flex-col gap-2">
                          <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                          <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                          <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                       </div>
                       {/* Main Area: Candidate Spotlight */}
                       <div className="flex-1 rounded-xl bg-indigo-50/50 border border-indigo-100 p-3 relative flex items-start gap-3">
                          <div className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white rounded-full p-0.5 shadow-sm">
                             <Check className="w-3 h-3" />
                          </div>
                          <div className="w-10 h-10 rounded-full bg-indigo-200 shrink-0"></div>
                          <div className="flex-1 space-y-2 mt-1">
                             <div className="flex justify-between items-center">
                                <div className="w-1/2 h-2 bg-indigo-300 rounded"></div>
                                <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[6px] font-bold uppercase tracking-wider">Top Match</div>
                             </div>
                             <div className="w-full h-1 bg-slate-200 rounded"></div>
                             <div className="w-3/4 h-1 bg-slate-200 rounded"></div>
                             <div className="w-full h-6 bg-white border border-slate-100 rounded mt-2 px-2 py-1">
                                <div className="h-1 bg-indigo-100 rounded w-1/2 mb-1"></div>
                                <div className="h-1 bg-indigo-100 rounded w-1/3"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it Works Section ── */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4"
            >
              How it Works
            </h2>
            <p className="text-text-secondary text-lg">
              Go from zero to a professional portfolio in three simple steps.
            </p>
          </div>

          <div className="bg-background rounded-[2rem] p-4 sm:p-8 md:p-12 shadow-sm border border-border flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
            {/* Steps List (Left) */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4">
              {[
                {
                  id: 1,
                  title: "Upload Resume",
                  desc: "Our AI parses your experience to create a baseline profile instantly.",
                },
                {
                  id: 2,
                  title: "Customize Design",
                  desc: "Pick layouts and colors that match your professional brand.",
                },
                {
                  id: 3,
                  title: "Share URL",
                  desc: "Launch your portfolio and share your unique link with the world.",
                },
              ].map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all border relative overflow-hidden ${isActive
                      ? "bg-primary-light/30 border-primary/20 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-background-secondary"
                      } flex gap-5`}
                  >
                    {/* Progress Bar (Only active) */}
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      ></div>
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-sm transition-colors ${isActive
                        ? "bg-primary text-white"
                        : "bg-background-tertiary text-text-secondary"
                        }`}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 transition-colors ${isActive ? "text-text" : "text-text-secondary"}`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm leading-relaxed transition-colors ${isActive ? "text-text-secondary" : "text-text-muted"}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Canvas (Right) - Video Simulation */}
            <div className="flex-1 w-full bg-text rounded-[2rem] p-4 shadow-2xl border border-border-strong/10 flex flex-col h-[400px] md:h-[500px] relative overflow-hidden group">
              {/* Fake Player UI */}
              <div className="absolute top-6 left-6 flex gap-2 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>

              <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold text-white/50 z-20 uppercase tracking-widest">
                Real-time Preview
              </div>

              {/* Main Visual Content */}
              <div className="flex-1 rounded-xl bg-background-tertiary/5 relative mt-8 overflow-hidden flex items-center justify-center p-8">
                {activeStep === 1 && (
                  <div className="animate-fade-up flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
                      <UploadCloud className="text-primary w-10 h-10" />
                    </div>
                    <div className="w-56 h-3 bg-background-tertiary/20 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-primary transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] uppercase">Analyzing Resume Structure...</p>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="animate-fade-up w-full max-w-md h-full flex flex-col">
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1 aspect-video bg-background/5 rounded-lg border border-border-strong/20 p-3 space-y-2">
                        <div className="w-1/2 h-2 bg-border-strong/20 rounded"></div>
                        <div className="w-full h-1 bg-border-strong/10 rounded"></div>
                        <div className="w-full h-1 bg-border-strong/10 rounded"></div>
                      </div>
                      <div className="w-24 h-full flex flex-col gap-2">
                        <div className="h-6 w-full bg-primary rounded shadow-lg shadow-primary/20"></div>
                        <div className="h-6 w-full bg-border-strong/10 rounded"></div>
                        <div className="h-6 w-full bg-border-strong/10 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-background/5 rounded-lg border border-border-strong/20 p-6 flex flex-col gap-3">
                      <div className="w-1/4 h-4 bg-primary/20 rounded"></div>
                      <div className="w-full h-24 border-2 border-dashed border-border-strong/20 rounded-xl flex items-center justify-center">
                        <Palette className="w-8 h-8 text-text-muted opacity-20" />
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="animate-fade-up text-center w-full max-w-sm">
                    <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                      <CheckCircle className="w-5 h-5" />
                      Portfolio Live at yourlink.me
                    </div>
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col gap-6">
                      <div className="flex items-center justify-between gap-4 bg-black/40 px-4 py-3 rounded-xl border border-white/5">
                        <span className="text-white/40 text-xs truncate">shortlistme.com/p/alex-r</span>
                        <button className="bg-primary text-white px-3 py-1 rounded-lg text-[10px] font-bold">Copy</button>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 h-10 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="flex-1 h-10 bg-white/5 rounded-xl border border-white/5"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fake Video Timeline */}
              <div className="h-1 w-full bg-white/5 mt-auto relative">
                <div
                  className="h-full bg-primary absolute left-0 top-0 transition-all duration-100 ease-linear"
                  style={{
                    width: `${((activeStep - 1) * 33.33) + (progress / 3)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-24 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "How does the AI generate my portfolio?",
                a: "Our proprietary AI engine analyzes your resume's structure, keywords, and work history. It then maps this data to a curated collection of high-fidelity design templates, automatically selecting layouts that best highlight your specific career strengths.",
              },
              {
                q: "Is my resume data kept private?",
                a: "Yes. Your data is encrypted and stored securely. We do not sell your personal information or use it to train public models.",
              },
              {
                q: "Can I customize the design after generation?",
                a: "Absolutely! The AI gives you a huge head start, but you have full control over colors, fonts, layouts, and individual project descriptions.",
              },
              {
                q: "What formats can I export my portfolio in?",
                a: "You can share the live web URL, export it as a clean PDF for email attachments, or pull it directly into Figma for expert-level pixel pushing.",
              },
              {
                q: "Do I need design skills to use ShortlistMe?",
                a: "Not at all. The platform is built specifically for non-designers to have top-tier, designer-quality portfolios instantly.",
              },
            ].map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className={`bg-background rounded-2xl shadow-sm border ${isOpen ? "border-primary" : "border-border"
                    } transition-all duration-300 overflow-hidden`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between font-bold text-text outline-none hover:bg-background-secondary/50 transition-colors"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`text-text-muted w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
                        }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-text-secondary leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-24">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/5">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
              >
                Ready to transform your career?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Join 5,000+ designers, developers, and creators who have leveled up their professional presence.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-background text-primary hover:bg-background-secondary px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/10"
              >
                Start Building for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border-strong/60 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-xl tracking-tight text-text"
            >
              ShortlistMe
            </span>
            <span className="text-sm text-text-muted">© 2026 ShortlistMe. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-text-muted">
            <button
              onClick={() => setIsTeamCanvasOpen(true)}
              className="hover:text-text transition-colors flex items-center gap-1 font-semibold"
            >
              Meet our Team <span className="text-primary group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ── Team Canvas Overlay ── */}
      {isTeamCanvasOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsTeamCanvasOpen(false)}
          ></div>

          {/* Sliding Canvas */}
          <div className="relative w-full max-w-md h-full bg-background shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-text">Our Team</h2>
              <button
                onClick={() => setIsTeamCanvasOpen(false)}
                className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-text-muted hover:text-text transition-colors"
                aria-label="Close canvas"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {[
                { name: "Sarah Jenkins", role: "Founder & CEO", avatar: "Sarah", bgColor: "bg-blue-100", textColor: "text-blue-700" },
                { name: "David Chen", role: "Lead Engineer", avatar: "David", bgColor: "bg-green-100", textColor: "text-green-700" },
                { name: "Elena Rodriguez", role: "Product Designer", avatar: "Elena", bgColor: "bg-purple-100", textColor: "text-purple-700" },
                { name: "Marcus Johnson", role: "Head of Operations", avatar: "Marcus", bgColor: "bg-orange-100", textColor: "text-orange-700" }
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background-secondary/50 hover:bg-background-secondary transition-colors">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${member.bgColor} ${member.textColor} overflow-hidden`}>
                    <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${member.avatar}&backgroundColor=transparent`} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-base">{member.name}</h3>
                    <p className="text-sm font-medium text-text-secondary">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-background-secondary mt-auto">
              <p className="text-sm text-text-muted text-center">
                We're a small, passionate team dedicated to empowering creators.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
