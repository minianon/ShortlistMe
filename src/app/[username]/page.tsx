import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/server/db";
import { MapPin, Mail, Phone, Globe, FolderGit2, Link2, ArrowRight, Lock, Sparkles, UserPlus, Zap, Palette, ShieldCheck, Check } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";
import HeroBrowserAnimation from "@/components/HeroBrowserAnimation";
import { recordVisit } from "@/lib/analytics";

import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import { PortfolioData, getThemeStyles } from "@/lib/portfolio-utils";
import MadeWithShortlistMe from "@/components/MadeWithShortlistMe";
import VisibilityToggle from "@/components/portfolio/VisibilityToggle";

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
  const icon = data.photoUrl || "/icon.svg";

  return {
    title: `${name} — Portfolio`,
    description: data.bio ?? `Professional portfolio of ${name} — powered by ShortlistMe`,
    icons: {
      icon: icon,
      apple: icon,
    },
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
    include: { 
      publishedVersion: true,
      user: { select: { clerkUserId: true } }
    },
  });

  // 1. Handle Unclaimed or Non-Existent Portfolios
  if (!portfolio || !portfolio.publishedVersion) {
    return <UnclaimedProfileView username={username} isLoggedIn={!!userId} />;
  }

  // 2. Track visit for existing portfolios
  const visit = await recordVisit(portfolio.id);

  // 4. Prepare Portfolio Data
  const d = portfolio.publishedVersion.data as unknown as PortfolioData;
  const themeStyles = getThemeStyles(d);

  // 5. Handle Private Portfolio access
  if (!portfolio.isPublic) {
    // Owner gets the glassmorphic preview
    if (userId === portfolio.user.clerkUserId) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
          {/* Blurred Background Layer (Showing what visitors see) */}
          <div className="absolute inset-0 z-0 blur-[60px] opacity-50 pointer-events-none select-none scale-105">
            <PrivateProfileView username={username} themeStyles={themeStyles} />
          </div>
          
          {/* Dark Backdrop Overlay */}
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-md" />
          
          {/* Center Control Card */}
          <div className="relative z-20 w-full flex justify-center animate-fade-in-up">
            <OwnerPrivateView username={username} themeStyles={themeStyles} />
          </div>
        </div>
      );
    }
    
    // Everyone else sees the standard locked page
    return <PrivateProfileView username={username} themeStyles={themeStyles} />;
  }

  // 6. Render Published Portfolio
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
      <MadeWithShortlistMe username={d.name || username} themeStyles={themeStyles} />
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
              <HeroBrowserAnimation username={username} />
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

function OwnerPrivateView({ username, themeStyles }: { username: string, themeStyles: any }) {
  const primary = themeStyles.primaryHex || "#10b981";

  return (
    <div 
      className="max-w-md w-full text-center p-10 md:p-14 rounded-[3rem] border shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      style={{ backgroundColor: `${themeStyles.surfaceSecondary}cc`, borderColor: `${primary}4d` }}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: `linear-gradient(to bottom right, ${primary}, transparent)` }}
      />
      
      <div className="relative z-10">
        <div 
          className="w-20 h-20 rounded-[2.25rem] flex items-center justify-center mx-auto mb-10 animate-fade-up shadow-sm border-2"
          style={{ backgroundColor: `${primary}26`, borderColor: `${primary}4d` }}
        >
          <Lock className="w-9 h-9" style={{ color: primary }} />
        </div>
        
        <div 
          className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border mb-8 animate-fade-up shadow-sm"
          style={{ backgroundColor: `${primary}1a`, borderColor: `${primary}4d` }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
          <span className="text-[10px] uppercase font-black tracking-[0.3em]" style={{ color: primary }}>Privacy Mode Active</span>
        </div>
        
        <h1 className="text-4xl font-black mb-5 tracking-tight animate-fade-up text-white leading-tight" style={{ fontFamily: "var(--font-display)", animationDelay: "80ms" }}>
          Your Brand is <span style={{ color: primary, textDecorationColor: `${primary}4d` }} className="italic underline underline-offset-8">Private.</span>
        </h1>
        
        <p className="font-medium leading-relaxed mb-12 animate-fade-up opacity-60" style={{ animationDelay: "160ms", color: themeStyles.text }}>
          Visitors currently see a locked screen. Make your portfolio public to start sharing your brand with the world.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <VisibilityToggle 
            username={username} 
            primaryColor={primary} 
            accentText={themeStyles.accentText} 
          />
          <Link
            href="/dashboard/portfolio"
            className="h-14 px-8 rounded-2xl text-sm font-bold transition-all border flex items-center justify-center gap-2 hover:opacity-80 active:scale-95 shadow-sm whitespace-nowrap"
            style={{ 
              backgroundColor: themeStyles.surfaceSecondary, 
              borderColor: themeStyles.border,
              color: themeStyles.text 
            }}
          >
            <FolderGit2 className="w-4 h-4" style={{ color: primary }} />
            Designer
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrivateProfileView({ username, themeStyles }: { username: string, themeStyles?: any }) {
  const styles = themeStyles || { surface: "var(--background)", text: "var(--text)", primaryHex: "#10b981" };
  const primary = styles.primaryHex;

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: styles.surface, color: styles.text }}
    >
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] -z-10 opacity-10" 
          style={{ backgroundColor: primary }}
        />
        <div 
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          style={{ background: `linear-gradient(to right, transparent, ${primary}, transparent)` }}
        />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 animate-fade-up"
              style={{ backgroundColor: `${primary}1a`, borderColor: `${primary}33` }}
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: primary }} />
              <span className="text-[10px] uppercase font-black tracking-[0.2em]" style={{ color: primary }}>Exclusive Territory</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-up leading-[1.1]" style={{ fontFamily: "var(--font-display)", animationDelay: "100ms" }}>
              Locked <span style={{ color: primary }} className="italic">Profile.</span>
            </h1>

            <p className="text-lg md:text-xl opacity-70 mb-10 max-w-xl leading-relaxed font-medium animate-fade-up" style={{ animationDelay: "200ms" }}>
              The profile for <span className="font-bold text-lg underline decoration-white/20" style={{ textDecorationColor: `${primary}4d` }}>@{username}</span> is shielded. Join the top 1% of professionals who use ShortlistMe to automate their elite professional brand.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up w-full sm:w-auto mb-10" style={{ animationDelay: "300ms" }}>
              <Link
                href="/sign-up"
                className="h-14 px-8 text-white rounded-xl text-base font-black transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] group whitespace-nowrap"
                style={{ backgroundColor: primary, boxShadow: `0 10px 30px -10px ${primary}80` }}
              >
                Build Your Elite Portfolio
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/#features"
                className="h-14 px-8 border rounded-xl text-base font-bold transition-all active:scale-[0.98] flex items-center justify-center whitespace-nowrap"
                style={{ 
                  backgroundColor: `${primary}0d`, 
                  borderColor: styles.border,
                  color: styles.text
                }}
              >
                Learn more
              </Link>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold opacity-40 uppercase tracking-widest animate-fade-up" style={{ animationDelay: "400ms" }}>
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
            <div 
              className="absolute -inset-4 rounded-[3rem] blur-2xl -z-10 opacity-10" 
              style={{ backgroundColor: primary }}
            />
            <div className="relative z-10 p-2 bg-background border border-border/50 rounded-[2.5rem] shadow-2xl backdrop-blur-sm shadow-black/50">
              <HeroBrowserAnimation username={username} />
            </div>
            <p className="mt-6 text-center text-[10px] opacity-40 font-bold tracking-widest uppercase">
              Automate your professional storytelling.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter 
        primaryColor={primary} 
        backgroundColor={styles.surface}
        textColor={styles.text}
        borderColor={styles.border}
      />
    </div>
  );
}
