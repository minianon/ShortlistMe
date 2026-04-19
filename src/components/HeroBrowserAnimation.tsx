"use client";

import { Check, Globe, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface HeroBrowserAnimationProps {
  username?: string;
}

export default function HeroBrowserAnimation({ username = "tushar" }: HeroBrowserAnimationProps) {
  const [activeStep, setActiveStep] = useState(1);
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

  return (
    <div className="aspect-square md:aspect-video rounded-[1.5rem] md:rounded-[2rem] bg-[#0c0c0c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-0 flex flex-col relative overflow-hidden w-full mx-auto transform-gpu transition-all">
      {/* Integrated Step Timeline Header */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/[0.02] relative z-20 overflow-hidden">
        <div className="flex gap-1.5 w-16 invisible sm:visible">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2">
          {[
            { id: 1, label: "Upload" },
            { id: 2, label: "Design" },
            { id: 3, label: "Launch" }
          ].map((step, idx) => {
            const isCompleted = activeStep > step.id;
            const isActive = activeStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300 ${isActive || isCompleted ? "bg-emerald-500 text-background scale-110 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/5 text-white/20"}`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${isActive ? "text-white" : "text-white/20"}`}>
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className="mx-2 sm:mx-4 w-6 sm:w-12 h-[1px] bg-white/5 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-emerald-500/50 transition-all duration-100 ease-linear"
                      style={{
                        width: activeStep > idx + 1 ? '100%' : (activeStep === idx + 1 ? `${progress}%` : '0%')
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-16 hidden sm:block"></div>
      </div>

      {/* Main Visual Content (3-Step Animation) */}
      <div className="flex-1 relative flex items-center justify-center bg-[#060606] overflow-hidden">
        {activeStep === 1 && (
          <div className="animate-fade-up flex flex-col items-center w-full max-w-sm">
            <div className="relative w-40 h-52 bg-[#0c0c0c] rounded-xl shadow-2xl border border-white/10 p-4 flex flex-col gap-3 overflow-hidden mb-8 transform hover:scale-105 transition-transform duration-500">
              <div className="w-1/2 h-2.5 bg-white/20 rounded mb-2"></div>
              <div className="w-full h-1.5 bg-white/10 rounded"></div>
              <div className="w-full h-1.5 bg-white/10 rounded"></div>
              <div className="w-5/6 h-1.5 bg-white/10 rounded"></div>
              <div className="w-3/4 h-1.5 bg-white/10 rounded mb-4"></div>
              <div className="w-full flex-1 bg-white/5 border border-white/5 rounded"></div>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500 shadow-[0_0_20px_#10b981] animate-[igScanner_3s_infinite_linear]"></div>
            </div>
            <div className="w-full max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-500 transition-all duration-100 shadow-[0_0_10px_#10b981]" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Extracting career data...</p>
          </div>
        )}

        {activeStep === 2 && (
          <div className="animate-fade-up w-full h-full flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h4 className="text-white font-bold text-sm">Pick your aesthetic</h4>
                <p className="text-white/30 text-[10px]">10+ premium themes available</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">AI Suggested</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 grow overflow-hidden relative">
              {[
                { name: "Minimal", color: "bg-slate-200" },
                { name: "Modern Dark", color: "bg-emerald-500" },
                { name: "Aura", color: "bg-purple-500" },
                { name: "Noir", color: "bg-zinc-800" },
                { name: "Prism", color: "bg-indigo-500" },
                { name: "Vantage", color: "bg-blue-600" },
                { name: "Lumina", color: "bg-amber-400" },
                { name: "Horizon", color: "bg-rose-500" },
                { name: "Slate", color: "bg-slate-700" },
                { name: "Ember", color: "bg-orange-600" }
              ].map((theme, i) => {
                const isSelected = theme.name === "Modern Dark";
                const selectionTriggered = progress > 50;

                return (
                  <div
                    key={theme.name}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className={`animate-fade-up group p-2 rounded-xl bg-white/[0.04] border transition-all duration-500 flex flex-col gap-2 ${isSelected && selectionTriggered
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.05]"
                        : "border-white/10 hover:border-white/20"
                      }`}
                  >
                    <div className="aspect-[4/3] rounded-lg bg-white/5 relative overflow-hidden flex items-center justify-center p-1">
                      {/* Skeleton Preview Content with Vibrant Theme Color */}
                      <div className="w-full h-full p-2 flex flex-col gap-1.5 bg-[#0a0a0a] rounded-md border border-white/5 relative overflow-hidden">
                        {/* Theme Tint Background */}
                        <div className={`absolute inset-0 ${theme.color} opacity-5`}></div>

                        <div className={`h-1 w-1/2 ${theme.color} opacity-60 rounded relative z-10`}></div>
                        <div className="grow flex gap-1 relative z-10">
                          <div className={`w-1/3 bg-white/10 rounded-sm`}></div>
                          <div className="grow flex flex-col gap-1">
                            <div className={`h-1 w-full ${theme.color} opacity-40 rounded-full`}></div>
                            <div className={`h-1 w-2/3 ${theme.color} opacity-40 rounded-full`}></div>
                            <div className={`h-1 w-full ${theme.color} opacity-40 rounded-full`}></div>
                          </div>
                        </div>
                        <div className={`h-2 w-full ${theme.color} opacity-50 rounded-sm relative z-10`}></div>
                      </div>
                      {isSelected && selectionTriggered && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[1px] z-20">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-background shadow-lg">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-bold ${isSelected && selectionTriggered ? "text-emerald-500" : "text-white/40"}`}>{theme.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${theme.color} ${isSelected && selectionTriggered ? "shadow-[0_0_8px_#10b981]" : "opacity-50"}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="animate-fade-up w-full max-w-md flex flex-col items-center justify-center gap-8 p-6">
            <div className="relative w-full">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] blur-xl"></div>
              <div className="bg-[#0a0a0a] border border-emerald-500/30 p-5 rounded-[2rem] flex items-center gap-5 relative z-10 shadow-2xl">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">Live Domain</div>
                  <div className="text-white font-medium truncate text-lg">shortlistme.site/<span className="text-emerald-500 font-bold">{username}</span></div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[11px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CheckCircle className="w-4 h-4" /> Portfolio Deployed
            </div>
          </div>
        )}
      </div>

      {/* Timeline Progress Tracker */}
      <div className="h-1 w-full bg-white/5 mt-auto relative">
        <div
          className="h-full bg-emerald-500 absolute left-0 top-0 transition-all duration-100 ease-linear shadow-[0_0_10px_#10b981]"
          style={{
            width: `${((activeStep - 1) * 33.33) + (progress / 3)}%`
          }}
        ></div>
      </div>
    </div>
  );
}
