"use client";

import Link from "next/link";

export default function PortfolioPreview() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* ── Top Action Bar ── */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Portfolio Preview</h2>
            <span className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Draft</span>
         </div>
         <div className="flex items-center gap-4">
            <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition-colors">
               Edit Design
            </button>
            <button className="w-10 h-10 rounded-full bg-white text-gray-600 shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
               <span className="material-symbols-rounded text-lg">dark_mode</span>
            </button>
         </div>
      </div>

      {/* ── Portfolio Container (The mock preview) ── */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
         
         {/* Hero */}
         <div className="p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <div className="text-[#4f46e5] text-xs font-bold uppercase tracking-widest mb-6">Available For Hire</div>
               <h1 className="text-5xl md:text-6xl font-extrabold text-[#191c1e] leading-[1.1] tracking-tight mb-8" style={{ fontFamily: "var(--font-display)" }}>
                  Alex Rivera. <br/>
                  <span className="text-gray-500">Product Designer & Creative Technologist.</span>
               </h1>
               <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-10">
                  I craft high-performance digital interfaces that bridge the gap between human emotion and technical precision. Currently building future-facing tools at ShortlistMe.
               </p>
               <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                     <span className="material-symbols-rounded text-[#4f46e5] text-lg">location_on</span>
                     San Francisco, CA
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                     <span className="material-symbols-rounded text-[#4f46e5] text-lg">mail</span>
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
         <div className="px-12 md:px-20 py-16 bg-[#fafbfc] border-y border-gray-100 relative">
            
            {/* Floating Editor Action Bar */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-100 p-1.5 flex items-center gap-1">
               <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold mr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Auto-Save Active
               </div>
               <div className="w-px h-4 bg-gray-200 mx-2"></div>
               <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"><span className="material-symbols-rounded text-[18px]">format_align_left</span></button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#eef2ff] text-[#4f46e5]"><span className="material-symbols-rounded text-[18px]">grid_view</span></button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"><span className="material-symbols-rounded text-[18px]">share</span></button>
            </div>

            <h3 className="text-2xl font-bold text-[#191c1e] mb-10" style={{ fontFamily: "var(--font-display)" }}>Work Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-[#4f46e5]/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                     <h4 className="text-lg font-bold text-gray-900 leading-tight">Lead Product Designer</h4>
                     <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">2021 — PRESENT</span>
                  </div>
                  <p className="text-[#4f46e5] font-semibold text-sm mb-6">Design Systems Inc.</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     Spearheading the visual direction of the core SaaS platform, increasing user retention by 24% through empathetic UX research and iterative prototyping.
                  </p>
               </div>
               <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-[#4f46e5]/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                     <h4 className="text-lg font-bold text-gray-900 leading-tight">Senior UI/UX Designer</h4>
                     <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">2018 — 2021</span>
                  </div>
                  <p className="text-[#4f46e5] font-semibold text-sm mb-6">Streamline Studios</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     Developed a unified design language system used across 5 distinct product lines, reducing design-to-dev handoff time by 40%.
                  </p>
               </div>
            </div>
         </div>

         {/* Featured Projects */}
         <div className="p-12 md:p-20">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-bold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>Featured Projects</h3>
               <Link href="#" className="flex items-center gap-1 text-[#4f46e5] text-sm font-bold hover:underline">
                  View All <span className="material-symbols-rounded text-sm">arrow_forward</span>
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Quantum Dashboard", tags: "Fintech • UI/UX Design", img: "bg-teal-900" },
                  { title: "Vibe Mobile App", tags: "Social Media • Product Strategy", img: "bg-gray-900", lock: true },
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
                              <span className="material-symbols-rounded text-white text-6xl">design_services</span>
                           </div>
                        )}
                     </div>
                     <h4 className="text-base font-bold text-gray-900 mb-1">{p.title}</h4>
                     <p className="text-xs font-medium text-gray-500">{p.tags}</p>
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
                     <div key={tag} className="px-5 py-2.5 rounded-full border border-white/20 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                        {tag}
                     </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 md:text-right flex flex-col md:items-end justify-center">
               <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Let's build something <br/> exceptional.</h3>
               <p className="text-gray-400 mb-8 max-w-sm ml-auto text-sm leading-relaxed">Open for new opportunities and collaborations starting Q3 2024.</p>
               <button className="bg-white text-[#191c1e] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  Drop a Message
               </button>
            </div>
         </div>

      </div>
    </div>
  );
}
