"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ChevronLeft, Sparkles, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

      <div className="w-full max-w-[1200px] flex flex-col items-center relative z-10">
        {/* Navigation */}
        <div className="w-full max-w-md mb-8 flex items-center justify-between animate-fade-up" style={{ animationDelay: "100ms" }}>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all font-medium text-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to home
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500/80 uppercase tracking-widest">Verify Identity</span>
          </div>
        </div>

        {/* Auth Card Container */}
        <div 
          className="w-full max-w-md bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05),0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-500" strokeWidth={2.5} />
            </div>
            <h1 
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3"
            >
              Shortlist<span className="text-emerald-600 dark:text-emerald-500">Me</span>
            </h1>
            <p className="text-slate-500 dark:text-white/40 text-sm font-medium leading-relaxed">
              Start your journey today. Create an account <br /> to build your premium portfolio.
            </p>
          </div>

          {/* Clerk SignUp */}
          <div className="clerk-theme-provider">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none p-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-900 dark:text-white font-semibold transition-all h-12 rounded-xl shadow-sm",
                  socialButtonsBlockButtonText: "text-slate-700 dark:text-white/80 font-bold",
                  dividerLine: "bg-slate-200 dark:bg-white/10",
                  dividerText: "text-slate-400 dark:text-white/30 text-[10px] font-black uppercase tracking-[0.2em]",
                  formFieldLabel: "text-slate-500 dark:text-white/60 text-xs font-bold uppercase tracking-widest mb-2 px-1",
                  formFieldInput: "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl h-12 text-slate-900 dark:text-white px-4 focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] focus:ring-4 focus:ring-emerald-500/10 transition-all",
                  formButtonPrimary: "bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white dark:text-black font-black text-sm h-12 rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] dark:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95",
                  footerActionText: "text-slate-500 dark:text-white/40 font-medium",
                  footerActionLink: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold decoration-none",
                  identityPreviewText: "text-slate-900 dark:text-white",
                  identityPreviewEditButtonIcon: "text-emerald-600 dark:text-emerald-400",
                  formResendCodeLink: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-300",
                  otpCodeFieldInput: "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus:border-emerald-500/50",
                },
                variables: {
                  colorPrimary: "#10b981",
                  colorText: isDark ? "white" : "#0f172a",
                  colorBackground: "transparent",
                  fontFamily: "var(--font-body)",
                }
              }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-slate-400 dark:text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            Free forever. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
