"use client";

import { useState } from "react";
import Link from "next/link";

export default function PublicFooter() {
  const [isTeamCanvasOpen, setIsTeamCanvasOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border-strong/50 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-text-muted font-semibold">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-base tracking-tight text-text"
            >
              ShortlistMe
            </span>
            <span>© 2026 ShortlistMe. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsTeamCanvasOpen(true)}
              className="hover:text-text transition-colors flex items-center gap-1 font-semibold"
            >
              Meet our Team <span className="text-primary transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ── Team Canvas Overlay ── */}
      {isTeamCanvasOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsTeamCanvasOpen(false)}
          ></div>
          <div className="relative w-full max-w-md h-full bg-background shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-text">Our Team</h2>
              <button
                onClick={() => setIsTeamCanvasOpen(false)}
                className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-text-muted hover:text-text transition-colors"
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
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background-secondary/50 hover:bg-background-secondary transition-colors text-sm">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${member.bgColor} ${member.textColor} overflow-hidden flex-shrink-0`}>
                    <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${member.avatar}&backgroundColor=transparent`} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-base">{member.name}</h3>
                    <p className="text-xs font-medium text-text-secondary">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
