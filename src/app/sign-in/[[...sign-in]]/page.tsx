"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ChevronLeft, Sparkles, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background-secondary flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

      <div className="w-full max-w-[1200px] flex flex-col items-center relative z-10">
        {/* Navigation */}
        <div className="w-full max-w-md mb-8 flex items-center justify-between animate-fade-up" style={{ animationDelay: "100ms" }}>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-text-muted hover:text-emerald-500 transition-all font-medium text-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to home
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Secure Access</span>
          </div>
        </div>

        {/* Auth Card Container */}
        <div 
          className="w-full max-w-md bg-[var(--auth-glass-bg)] backdrop-blur-3xl border border-[var(--auth-glass-border)] rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05),0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20">
              <Sparkles className="w-6 h-6 text-emerald-500" strokeWidth={2.5} />
            </div>
            <h1 
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl font-black text-text tracking-tight mb-3"
            >
              Shortlist<span className="text-emerald-500">Me</span>
            </h1>
            <p className="text-text-secondary text-sm font-medium leading-relaxed">
              Welcome back. Sign in to continue to your <br /> AI-powered portfolio.
            </p>
          </div>

          {/* Clerk SignIn (Styling handled globally in globals.css) */}
          <div className="clerk-theme-provider">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              appearance={{
                variables: {
                  colorPrimary: "#10b981",
                  fontFamily: "var(--font-body)",
                }
              }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 ShortlistMe. Protected by AI Encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
