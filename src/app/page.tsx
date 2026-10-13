"use client";

import Link from "next/link";
import { Sparkles, Check, Zap, Sliders, Palette, Share, UploadCloud, CheckCircle, ChevronDown, BarChart3, Globe, Search, TrendingUp, Copy, Link2, Bell, User, Download, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import PublicFooter from "@/components/PublicFooter";
import HeroBrowserAnimation from "@/components/HeroBrowserAnimation";
import { FAQS } from "@/lib/site";

/** The FAQ below as FAQPage structured data — same questions and answers as the visible section. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      <header className="fixed top-6 inset-x-0 z-50 px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 h-14 flex items-center gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] ring-1 ring-white/5">
            <Link
              href="/"
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-xl tracking-tight text-text hover:opacity-80 transition-opacity"
            >
              Shortlist<span className="text-emerald-500">Me</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {['Features', 'See it in Action', 'FAQ'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm font-semibold text-text-secondary hover:text-emerald-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl px-3 h-14 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] ring-1 ring-white/5">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              href="/sign-up"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6">
        {/* ── Hero Section ── */}
        <section className="pt-44 pb-16 md:pt-52 md:pb-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left relative z-20 w-full max-w-2xl mx-auto lg:mx-0">


            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-text mb-6 leading-[1.05]"
            >
              Don't manually build a <span className="text-emerald-500 italic font-medium underline underline-offset-[12px] decoration-emerald-500/20">portfolio.</span>
            </h1>

            <p className="text-lg text-text-secondary md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Upload your resume. Our intelligence engine parses your career history, designs a custom UI, and publishes your website. <strong className="text-text font-bold">Takes less than 10 seconds.</strong>
            </p>

            {/* Interactive Hero Input CTA */}
            <div className="w-full max-w-lg mx-auto lg:mx-0 bg-background border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 p-2.5 rounded-[1.5rem] flex items-center transition-all shadow-xl shadow-emerald-500/5 group relative cursor-pointer">
              <Link href="/sign-up" className="absolute inset-0 z-20"></Link>
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0 border border-emerald-100 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left px-4">
                <div className="text-text font-extrabold text-[15px] tracking-tight">Drop your Resume here</div>
                <div className="text-text-secondary text-xs font-semibold tracking-wide">PDF, DOCX, or TXT</div>
              </div>
              <div className="bg-text text-background hover:bg-black px-6 py-4 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:-translate-y-0.5 group-active:translate-y-0 transition-all shrink-0">
                Generate Site
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs tracking-wider font-bold text-text-secondary uppercase">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=48&h=48&fit=crop&crop=faces"
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="User"
                    className="w-6 h-6 rounded-full border-2 border-background object-cover bg-background-tertiary"
                  />
                ))}
              </div>
              <span>Join 100+ early adopters</span>
            </div>
          </div>

          <div className="flex-[1.2] w-full max-w-2xl mx-auto lg:max-w-none relative">
            <HeroBrowserAnimation />
          </div>
        </section>

        <section id="features" className="pt-16 pb-24 scroll-mt-32">
          <div className="mb-14 text-center">

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-4"
            >
              Powerful features for <span className="text-emerald-500 italic font-medium">modern careers.</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
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

            {/* 4. Interaction Alerts (5/12) */}
            <div className="md:col-span-12 lg:col-span-5 bg-background p-10 rounded-[2.5rem] shadow-sm border border-border group overflow-hidden flex flex-col relative min-h-[440px]">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 border border-orange-100 transition-transform group-hover:-rotate-6">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">Interaction Alerts</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Know exactly when opportunity knocks. Get instant notifications when recruiters interact with your portfolio.
                </p>
              </div>

              {/* Stacking Notification Feed */}
              <div className="mt-auto relative h-[280px] w-full bg-background-tertiary/20 rounded-[2.5rem] border border-border p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                <div className="relative h-full">
                  {[
                    { text: "Someone viewed your Portfolio...", icon: User, delay: "0s", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { text: "Resume downloaded by Someone", icon: Download, delay: "2s", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { text: "LinkedIn Profile click detected from your bio", icon: Link2, delay: "4s", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                    { text: "Contact Form submission received", icon: MessageSquare, delay: "6s", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" }
                  ].map((note, i) => (
                    <div 
                      key={i} 
                      className="animate-notification-stack absolute top-0 left-0 right-0 bg-background rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-border flex items-center gap-4 transition-colors duration-500"
                      style={{ 
                        animationDelay: note.delay 
                      }}
                    >
                      <div className={`w-10 h-10 ${note.bg} rounded-xl flex items-center justify-center ${note.color} border ${note.border}`}>
                        <note.icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-[12px] font-extrabold truncate">{note.text}</div>
                        <div className="text-[10px] text-text-muted font-medium">Just now</div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  ))}
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

        {/* ── Full Demo Section ── */}
        <section id="see-it-in-action" className="pt-16 pb-24 scroll-mt-32">
          <div className="text-center mb-16 relative">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-4"
            >
              See <span className="inline-block px-4 py-1 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)] -rotate-1 transform transition-transform hover:rotate-0">Shortlist<span className="text-emerald-500">Me</span></span> <span className="text-emerald-500 italic font-medium">in action.</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Ready in seconds. Experience how our AI transforms your career.
            </p>
          </div>

          <div className="bg-background rounded-[3rem] p-6 md:p-8 shadow-sm border border-border flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-5xl aspect-video rounded-[2rem] bg-black border border-white/5 shadow-2xl overflow-hidden relative group">
              <iframe
                src="https://player.cloudinary.com/embed/?cloud_name=dkdhdiqy0&public_id=short_lu3hor&autoplay=true&muted=true&loop=true&player[show_logo]=false&player[skin]=minimal&player[controls]=false"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                title="ShortlistMe Demo Video"
              ></iframe>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section id="faq" className="pt-16 pb-24 max-w-3xl mx-auto relative px-6 md:px-0 scroll-mt-32">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

          <div className="text-center mb-16 relative">

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-4"
            >
              Have <span className="text-emerald-500 italic font-medium">questions?</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Everything you need to know about the product and how it works.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className={`bg-background rounded-2xl transition-all duration-500 overflow-hidden relative group ${isOpen
                    ? "ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.08)] bg-gradient-to-b from-emerald-500/[0.03] to-transparent scale-[1.02] z-10"
                    : "ring-1 ring-border hover:ring-border-strong hover:bg-background-tertiary"
                    }`}
                >
                  {isOpen && <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80 shadow-[0_0_15px_#10b981]"></div>}
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full text-left px-6 py-6 sm:px-8 flex items-center justify-between font-bold text-text outline-none"
                  >
                    <span className={`${isOpen ? "text-emerald-500" : "text-text-secondary group-hover:text-text"} transition-colors text-[15px] sm:text-[17px] pr-4 tracking-tight`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${isOpen ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-background" : "bg-background-tertiary text-text-muted group-hover:bg-border group-hover:text-text-secondary"}`}>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                        strokeWidth={isOpen ? 3 : 2}
                      />
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-text-secondary leading-relaxed text-[15px] sm:text-base">
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
          <div className="bg-[#0a0a0a] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col items-center">
            {/* Soft Emerald Glow Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.15)_0%,transparent_60%)] pointer-events-none"></div>

            {/* Floating Mockups Background */}
            <div className="absolute top-10 left-10 w-24 h-32 bg-white/5 border border-emerald-500/10 rounded-xl rotate-[-15deg] opacity-40 blur-[2px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-32 h-24 bg-white/5 border border-emerald-500/10 rounded-xl rotate-[10deg] opacity-40 blur-[2px] pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">


              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
              >
                Stop sending <span className="text-white/40 line-through decoration-emerald-500 decoration-4">boring PDFs.</span><br />
                Start sending a <span className="text-emerald-500 italic font-medium">link.</span>
              </h2>

              <p className="text-white/60 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
                Join thousands of modern professionals who let AI curate, design, and host their career portfolio in under 10 seconds.
              </p>

              {/* Actionable Mock Uploader CTA */}
              <div className="w-full max-w-md bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl group relative overflow-hidden ring-1 ring-white/5 hover:ring-emerald-500/30 cursor-pointer">
                <Link href="/sign-up" className="absolute inset-0 z-20"></Link>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/50 group-hover:text-emerald-400 transition-colors shrink-0 shadow-inner border border-white/5">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left px-4">
                  <div className="text-white font-bold text-sm">Upload your Resume</div>
                  <div className="text-white/40 text-xs font-semibold tracking-wide">PDF, DOCX, or TXT</div>
                </div>
                <div className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all shrink-0">
                  Generate
                </div>
              </div>

              <div className="mt-10 text-white/30 text-xs font-bold tracking-wide flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=48&h=48&fit=crop&crop=faces"
                  ].map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Creator"
                      className="w-5 h-5 rounded-full border-2 border-[#0a0a0a] object-cover bg-slate-800"
                    />
                  ))}
                </div>
                <span>TRUSTED BY 100+ CREATORS</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
