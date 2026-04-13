"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";

export default function PublicFooter() {
  const [isTeamCanvasOpen, setIsTeamCanvasOpen] = useState(false);

  return (
    <>
      {/* ── Footer ── */}
      <footer className="border-t border-border bg-background-secondary py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link
              href="/"
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-2xl tracking-tighter text-text"
            >
              Shortlist<span className="text-emerald-500">Me</span>
            </Link>
            <p className="text-text-secondary max-w-xs text-sm leading-relaxed font-medium text-center md:text-left">
              The world's most advanced AI-powered portfolio engine. Turn years of experience into a masterpiece in seconds.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <button
              onClick={() => setIsTeamCanvasOpen(true)}
              className="px-6 py-3 bg-background border border-border hover:bg-background-tertiary rounded-2xl text-text font-bold text-sm transition-all active:scale-95 shadow-md"
            >
              Meet the Team
            </button>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              © 2026 ShortlistMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Team Modal Overlay ── */}
      {isTeamCanvasOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-700 animate-in fade-in"
            onClick={() => setIsTeamCanvasOpen(false)}
          ></div>

          <div className="relative w-full max-w-6xl h-[85vh] sm:h-auto bg-background/95 backdrop-blur-3xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 fade-in duration-500 flex flex-col border border-border rounded-t-[2.5rem] sm:rounded-3xl md:rounded-[5rem] rounded-b-none sm:rounded-b-3xl md:rounded-b-[5rem] overflow-hidden">
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-border-strong rounded-full mx-auto mt-4 mb-2 md:hidden"></div>

            <div className="px-6 py-4 md:p-14 md:pb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-5xl font-black font-display text-text tracking-tighter">
                  Our <span className="text-emerald-500 italic">Makers</span>
                </h2>
                <p className="text-text-muted text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] mt-1 md:mt-3">Merging creativity with silicon</p>
              </div>
              <button
                onClick={() => setIsTeamCanvasOpen(false)}
                className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-background-tertiary border border-border flex items-center justify-center text-text-muted hover:text-white hover:bg-emerald-500 transition-all active:scale-90"
                aria-label="Close"
              >
                <span className="text-xs md:text-base">✕</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-4 md:py-8 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {[
                { name: "Tushar Bhardwaj", avatar: "Tushar", link: "https://minianonlink.vercel.app/tusharbhardwaj" },
                { name: "Sweta Shukla", avatar: "Sweta", link: "https://minianonlink.vercel.app/swetashukla4" },
                { name: "Ruvaid Ahmad", avatar: "Ruvaid", link: "https://minianonlink.vercel.app/ruvaidahmad" },
                { name: "Kwinsi Thakkar", avatar: "Kwinsi", link: "https://minianonlink.vercel.app/kwinsithakkar" }
              ].map((member, i) => (
                <a
                  key={i}
                  href={member.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-row md:flex-col items-center md:items-stretch rounded-2xl md:rounded-[3rem] overflow-hidden border border-border bg-background bg-opacity-50 p-2 md:p-3 transition-all hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] active:scale-[0.98]"
                >
                  {/* Portrait Area / Avatar */}
                  <div className="w-16 h-16 md:w-full md:aspect-[3/4] md:min-h-[280px] relative overflow-hidden rounded-xl md:rounded-2xl flex-shrink-0 bg-background-tertiary md:p-2">
                    <img
                      src={`/team/${member.name.toLowerCase().replace(/ /g, '-')}.jpeg`}
                      alt={member.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/notionists/svg?seed=${member.avatar}&backgroundColor=transparent`;
                      }}
                      className="w-full h-full object-cover md:object-contain object-top transition-transform duration-700 group-hover:scale-110 shadow-sm rounded-lg md:rounded-xl"
                    />

                    {/* Status Badge - Dot Only */}
                    <div className="absolute top-1 left-1 md:top-4 md:left-4 flex items-center justify-center p-1 md:p-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-sm">
                      <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Name Info Section */}
                  <div className="flex-1 md:flex-none p-3 md:p-5 text-left md:text-center">
                    <h3 className="font-bold text-text text-sm md:text-xl tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {member.name.split(' ')[0]} <span className="md:hidden"> </span> <span className="text-text-secondary md:block text-xs md:text-lg">{member.name.split(' ')[1]}</span>
                    </h3>
                  </div>

                  {/* External Link Icon Hover Layer (Desktop only for visibility) */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border hidden md:flex items-center justify-center text-text-muted opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300 shadow-sm">
                    <Link2 className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>

            <div className="p-4 md:p-14 pt-0 mt-auto">
              <div className="flex flex-col items-center justify-center gap-3 text-center border-t border-border pt-6 md:pt-10">
                <p className="text-xs md:text-sm text-text font-bold uppercase tracking-[0.2em]">
                  Our Mission
                </p>
                <p className="text-xs md:text-sm text-text-secondary font-medium leading-relaxed max-w-lg">
                  Engineering the next generation of professional representation through advanced generative AI and purpose-driven interaction design.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

