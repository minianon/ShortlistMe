"use client";

import Link from "next/link";
import { Moon, MapPin, Mail, AlignLeft, LayoutGrid, Share, ArrowRight, PenTool } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

export default function PortfolioPreview() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* ── Top Action Bar ── */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-text">Portfolio Preview</h2>
            <span className="bg-background-tertiary text-text-secondary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Draft</span>
         </div>
         <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-colors">
               Edit Design
            </button>
            <div className="w-10 h-10 rounded-full bg-background shadow-sm border border-border flex items-center justify-center hover:bg-background-secondary transition-colors">
               <ThemeToggle />
            </div>
         </div>
      </div>

      {/* ── Portfolio Container (The mock preview) ── */}
      <div className="bg-background rounded-[2rem] shadow-sm border border-border overflow-hidden flex flex-col">
         
         {/* Hero */}
         <div className="p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <div className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Available For Hire</div>
               <h1 className="text-5xl md:text-6xl font-extrabold text-text leading-[1.1] tracking-tight mb-8" style={{ fontFamily: "var(--font-display)" }}>
                  Alex Rivera. <br/>
                  <span className="text-text-secondary">Product Designer & Creative Technologist.</span>
               </h1>
               <p className="text-lg text-text-secondary leading-relaxed max-w-lg mb-10">
                  I craft high-performance digital interfaces that bridge the gap between human emotion and technical precision. Currently building future-facing tools at ShortlistMe.
               </p>
               <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-text">
                     <MapPin className="text-primary w-5 h-5" />
                     San Francisco, CA
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-text">
                     <Mail className="text-primary w-5 h-5" />
                     hello@alexrivera.com
                  </div>
               </div>
            </div>
            {/* Avatar block */}
            <div className="w-64 h-72 rounded-[2rem] bg-gradient-to-tr from-indigo-100 to-purple-50 overflow-hidden relative rotate-3 shadow-xl">
               <img src="https://api.dicebear.com/9.x/notionists/svg?seed=AlexRiveraBig&backgroundColor=transparent" alt="Alex" className="w-full h-full object-cover scale-110" />
            </div>
         </div>

         {/* Work Experience */}
         <div className="px-12 md:px-20 py-16 bg-[#fafbfc] border-y border-border relative">
            
            {/* Floating Editor Action Bar */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background rounded-full shadow-lg border border-border p-1.5 flex items-center gap-1">
               <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold mr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Auto-Save Active
               </div>
               <div className="w-px h-4 bg-border-strong mx-2"></div>
               <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-tertiary text-text-secondary"><AlignLeft className="w-[18px] h-[18px]" /></button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-light text-primary"><LayoutGrid className="w-[18px] h-[18px]" /></button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-tertiary text-text-secondary"><Share className="w-[18px] h-[18px]" /></button>
            </div>

            <h3 className="text-2xl font-bold text-text mb-10" style={{ fontFamily: "var(--font-display)" }}>Work Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-background p-8 rounded-[1.5rem] shadow-sm border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                     <h4 className="text-lg font-bold text-text leading-tight">Lead Product Designer</h4>
                     <span className="bg-background-tertiary text-text-secondary text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">2021 — PRESENT</span>
                  </div>
                  <p className="text-primary font-semibold text-sm mb-6">Design Systems Inc.</p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                     Spearheading the visual direction of the core SaaS platform, increasing user retention by 24% through empathetic UX research and iterative prototyping.
                  </p>
               </div>
               <div className="bg-background p-8 rounded-[1.5rem] shadow-sm border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                     <h4 className="text-lg font-bold text-text leading-tight">Senior UI/UX Designer</h4>
                     <span className="bg-background-tertiary text-text-secondary text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">2018 — 2021</span>
                  </div>
                  <p className="text-primary font-semibold text-sm mb-6">Streamline Studios</p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                     Developed a unified design language system used across 5 distinct product lines, reducing design-to-dev handoff time by 40%.
                  </p>
               </div>
            </div>
         </div>

         {/* Featured Projects */}
         <div className="p-12 md:p-20">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-bold text-text" style={{ fontFamily: "var(--font-display)" }}>Featured Projects</h3>
               <Link href="#" className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Quantum Dashboard", tags: "Fintech • UI/UX Design", img: "bg-teal-900" },
                  { title: "Vibe Mobile App", tags: "Social Media • Product Strategy", img: "bg-text", lock: true },
                  { title: "Nebula Visual Identity", tags: "Branding • Creative Direction", img: "bg-emerald-900" },
               ].map((p, i) => (
                  <div key={i} className="group cursor-pointer">
                     <div className={`aspect-[4/5] rounded-[1.5rem] ${p.img} mb-4 overflow-hidden relative shadow-lg`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        {p.lock && (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 font-bold backdrop-blur-md bg-black/40">
                              <span className="text-6xl mb-2">2</span>
                              <span className="text-[10px] tracking-widest">NDA WORK</span>
                           </div>
                        )}
                        {/* Placeholder graphic if not NDA */}
                        {!p.lock && (
                           <div className="w-full h-full flex items-center justify-center mix-blend-overlay opacity-50">
                              <PenTool className="text-white w-16 h-16" />
                           </div>
                        )}
                     </div>
                     <h4 className="text-base font-bold text-text mb-1">{p.title}</h4>
                     <p className="text-xs font-medium text-text-secondary">{p.tags}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Dark Footer Area */}
         <div className="bg-[#191c1e] text-white p-12 md:p-20 flex flex-col md:flex-row justify-between gap-12">
            <div className="flex-1">
               <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>Technical Expertise</h3>
               <div className="flex flex-wrap gap-3 max-w-sm">
                  {["Figma", "React & Tailwind", "Principle", "3D Design", "UX Research", "Design Systems", "Creative Coding"].map(tag => (
                     <div key={tag} className="px-5 py-2.5 rounded-full border border-background/20 text-sm font-semibold text-text-muted hover:bg-background/10 hover:text-white transition-colors cursor-default">
                        {tag}
                     </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 md:text-right flex flex-col md:items-end justify-center">
               <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Let's build something <br/> exceptional.</h3>
               <p className="text-text-muted mb-8 max-w-sm ml-auto text-sm leading-relaxed">Open for new opportunities and collaborations starting Q3 2024.</p>
               <button className="bg-background text-text px-8 py-3.5 rounded-xl font-bold hover:bg-background-tertiary transition-colors">
                  Drop a Message
               </button>
            </div>
         </div>

      </div>
    </div>
  );
}
