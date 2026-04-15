"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Copy, CheckCircle, Sparkles } from "lucide-react";

export default function HowItWorksAnimation() {
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setActiveStep((curr) => (curr === 3 ? 1 : curr + 1));
        setProgress(0);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  const steps = [
    {
      id: 1,
      title: "Upload Resume",
      desc: "AI parses your history instantly.",
    },
    {
      id: 2,
      title: "Customize UI",
      desc: "Pick layouts that match your brand.",
    },
    {
      id: 3,
      title: "Share URL",
      desc: "Launch your unique digital link.",
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-background-secondary/40 backdrop-blur-sm rounded-[2rem] p-3 sm:p-4 border border-border/50 flex flex-col lg:row items-center gap-4 overflow-hidden transition-all hover:border-emerald-500/20 lg:flex-row">
        {/* Steps List (Left) */}
        <div className="w-full lg:w-[240px] flex flex-col gap-1.5 shrink-0">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => {
                  setActiveStep(step.id);
                  setProgress(0);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${isActive
                  ? "bg-emerald-500/10 border-emerald-500/20 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-background-secondary/50"
                  } flex gap-3.5`}
              >
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}
                <div
                  className={`w-6 h-6 rounded-full flex shrink-0 items-center justify-center font-bold text-[10px] transition-colors ${isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-background-tertiary text-text-secondary"
                    }`}
                >
                  {step.id}
                </div>
                <div>
                  <h4 className={`text-sm font-bold mb-0 transition-colors ${isActive ? "text-text" : "text-text-secondary"}`}>
                    {step.title}
                  </h4>
                  <p className={`text-[10px] leading-tight transition-colors ${isActive ? "text-text-secondary" : "text-text-muted"}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Canvas (Right) */}
        <div className="flex-1 w-full bg-[#0a0a09] rounded-[2rem] p-2 shadow-2xl border border-white/5 flex flex-col h-[320px] md:h-[420px] relative overflow-hidden group">
          {/* Fake Header */}
          <div className="p-3 flex items-center justify-between relative z-20">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400/80"></div>
            </div>
            <div className="px-2 py-0.5 bg-white/5 backdrop-blur-md rounded-lg text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">
              Preview
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-3">
            {activeStep === 1 && (
              <div className="animate-fade-up flex flex-col items-center w-full transition-all duration-700">
                <div className="relative w-36 h-48 bg-[#111110] rounded-2xl shadow-2xl border border-white/10 p-3 flex flex-col gap-2.5 overflow-hidden mb-5 transform-gpu hover:scale-[1.02] transition-transform">
                  <div className="w-1/2 h-2 bg-white/20 rounded"></div>
                  <div className="w-full h-1 bg-white/10 rounded"></div>
                  <div className="w-5/6 h-1 bg-white/10 rounded mb-3"></div>
                  <div className="w-full flex-1 bg-white/[0.04] border border-white/5 rounded-xl"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_#10b981] animate-ig-scanner z-30"></div>
                </div>
                <div className="w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 transition-all duration-100 shadow-[0_0_10px_#10b981]" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[8px] text-white/40 font-black tracking-[0.2em] uppercase">Intelligence Extracted</p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="animate-fade-up w-full max-w-sm h-full flex flex-col justify-center gap-5 transition-all duration-700">
                <div className="flex gap-3 items-center justify-center">
                  <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold text-white/40">Classic</div>
                  <div className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-[8px] font-black shadow-lg shadow-emerald-500/20">Modern UI</div>
                  <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold text-white/40">Minimal</div>
                </div>
                <div className="flex-1 max-h-[200px] bg-[#0f0f0f] rounded-[1.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden flex flex-col p-6 relative">
                  <div className="w-3/4 h-4 bg-white/10 rounded-full mb-2"></div>
                  <div className="w-1/2 h-2 bg-white/5 rounded-full mb-6"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-24 bg-white/[0.02] border border-white/5 rounded-xl"></div>
                    <div className="flex-1 h-24 bg-white/[0.02] border border-white/5 rounded-xl"></div>
                  </div>
                  <div className="absolute top-[55%] left-[45%] w-7 h-7 text-white/80 filter drop-shadow-xl animate-bounce">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1.2"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42a.5.5 0 0 0 .35-.85L5.5 3.21z" /></svg>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="animate-fade-up w-full max-w-md flex flex-col items-center justify-center gap-6 transition-all duration-700">
                <div className="relative w-full">
                  <div className="absolute inset-x-0 -top-6 -bottom-6 bg-emerald-500/10 blur-[40px] rounded-full" />
                  <div className="bg-[#111110] border border-emerald-500/30 p-6 md:p-7 rounded-[2rem] flex items-center gap-5 w-full shadow-2xl relative z-10">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                      <Globe className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[8px] text-white/40 font-bold tracking-[.3em] uppercase mb-2">Live Portal</div>
                      <div className="text-base md:text-lg text-white font-black break-all md:break-normal">shortlistme.vercel.app/<span className="text-emerald-500 underline decoration-2 underline-offset-4">tushar</span></div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] font-black tracking-[0.2em] uppercase shadow-lg shadow-emerald-500/10 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <CheckCircle className="w-4 h-4" /> Published Successfully
                </div>
              </div>
            )}
          </div>

          <div className="h-0.5 w-full bg-white/5 mt-auto relative">
            <div
              className="h-full bg-emerald-500 absolute left-0 top-0 transition-all duration-100 ease-linear shadow-[0_0_10px_#10b981]"
              style={{ width: `${((activeStep - 1) * 33.33) + (progress / 3)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
