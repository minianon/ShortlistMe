import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/server/db";
import { MapPin, Mail, Phone, Globe, FolderGit2, Link2, ArrowRight, Lock, Sparkles, UserPlus, Zap, Palette, ShieldCheck, Check } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";
import HowItWorksAnimation from "@/components/HowItWorksAnimation";
import { recordVisit } from "@/lib/analytics";

import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import { PortfolioData, getThemeStyles } from "@/lib/portfolio-utils";

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username.toLowerCase() },
    select: { isPublic: true, publishedVersion: { select: { data: true } } },
  });
  const data = (portfolio?.publishedVersion?.data ?? {}) as unknown as PortfolioData;
  const name = data.name ?? username;
  return {
    title: `${name} — Portfolio`,
    description: data.bio ?? `Professional portfolio of ${name} — powered by ShortlistMe`,
  };
}

// ── Page Component ───────────────────────────────────────────────────────────

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId } = await auth();

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username.toLowerCase() },
    include: { publishedVersion: true },
  });

  // 1. Handle Unclaimed or Non-Existent Portfolios
  if (!portfolio || !portfolio.publishedVersion) {
    return <UnclaimedProfileView username={username} isLoggedIn={!!userId} />;
  }

  // 2. Track visit for existing portfolios
  const visit = await recordVisit(portfolio.id);

  // 3. Handle Private Portfolios (Allow owner to see their own draft)
  if (!portfolio.isPublic && userId !== portfolio.userId) {
    return <PrivateProfileView username={username} />;
  }

  // 4. Render Published Portfolio
  const d = portfolio.publishedVersion.data as unknown as PortfolioData;
  const themeStyles = getThemeStyles(d);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: themeStyles.surface, color: themeStyles.text }}
    >
      <PortfolioRenderer data={d} portfolioId={portfolio.id} visitId={visit?.id} />
      <PublicFooter 
        primaryColor={themeStyles.primaryHex} 
        backgroundColor={themeStyles.surface}
        textColor={themeStyles.text}
        borderColor={themeStyles.border}
      />
    </div>
  );
}

// ── Sub-Views ─────────────────────────────────────────────────────────────

function UnclaimedProfileView({ username, isLoggedIn }: { username: string, isLoggedIn: boolean }) {
  const claimUrl = isLoggedIn 
    ? `/dashboard/settings?claim=${username}` 
    : `/sign-up?slug=${username}`;

  return (
    <div className="min-h-screen bg-background text-text selection:bg-emerald-500 selection:text-white flex flex-col font-sans transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Global URL Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-up leading-[1.1]" style={{ fontFamily: "var(--font-display)", animationDelay: "100ms" }}>
              Secure <span className="text-emerald-500 italic">@{username}</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl leading-relaxed font-medium animate-fade-up" style={{ animationDelay: "200ms" }}>
              This premium username is waiting for its owner. Don't let your professional presence remain static—turn it into a <span className="text-text font-bold text-lg underline decoration-emerald-500/30">high-conversion portfolio</span> in under 10 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up w-full sm:w-auto" style={{ animationDelay: "300ms" }}>
              <Link
                href={claimUrl}
                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-base font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.98] group whitespace-nowrap"
              >
                {isLoggedIn ? "Claim This Handle" : "Claim This Username"}
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/#features"
                className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-base font-bold transition-all active:scale-[0.98] flex items-center justify-center whitespace-nowrap"
              >
                Learn more
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest animate-fade-up" style={{ animationDelay: "400ms" }}>
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
              <span>Join 100+ professionals</span>
            </div>
          </div>

          <div className="relative animate-fade-up w-full" style={{ animationDelay: "400ms" }}>
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl -z-10" />
            <div className="relative z-10 p-2 bg-background border border-border/50 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
              <HowItWorksAnimation />
            </div>
            <div>
              <p className="mt-6 text-center text-[10px] text-text-muted font-bold tracking-widest uppercase">
                Automate your professional storytelling.
              </p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function PrivateProfileView({ username }: { username: string }) {
  return (
    <div className="min-h-screen bg-background text-text selection:bg-emerald-500 selection:text-white flex flex-col font-sans transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[140px] -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 animate-fade-up">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-amber-500">Exclusive Territory</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-up leading-[1.1]" style={{ fontFamily: "var(--font-display)", animationDelay: "100ms" }}>
              Locked <span className="text-emerald-500 italic">Profile.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl leading-relaxed font-medium animate-fade-up" style={{ animationDelay: "200ms" }}>
              The profile for <span className="text-text font-bold text-lg underline decoration-emerald-500/30">@{username}</span> is shielded. Join the top 1% of professionals who use ShortlistMe to automate their elite professional brand.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up w-full sm:w-auto mb-10" style={{ animationDelay: "300ms" }}>
              <Link
                href="/sign-up"
                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-base font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.98] group whitespace-nowrap"
              >
                Build Your Elite Portfolio
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/#features"
                className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-base font-bold transition-all active:scale-[0.98] flex items-center justify-center whitespace-nowrap"
              >
                Learn more
              </Link>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest animate-fade-up" style={{ animationDelay: "400ms" }}>
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
              <span>Join 100+ professionals</span>
            </div>
          </div>

          <div className="relative animate-fade-up w-full" style={{ animationDelay: "400ms" }}>
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl -z-10" />
            <div className="relative z-10 p-2 bg-background border border-border/50 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
              <HowItWorksAnimation />
            </div>
            <p className="mt-6 text-center text-[10px] text-text-muted font-bold tracking-widest uppercase">
              Automate your professional storytelling.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
