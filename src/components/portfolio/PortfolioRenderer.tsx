"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  FolderGit2, 
  Link2, 
  ArrowRight, 
  ShieldCheck,
  Smartphone,
  Laptop,
  ExternalLink
} from "lucide-react";
import { useEffect, useRef } from "react";
import { 
  PortfolioData, 
  getThemeStyles, 
  DEFAULT_VISIBILITY 
} from "@/lib/portfolio-utils";

// Re-export constants for convenience if needed by consumers of the component
export { PRESET_THEMES, DEFAULT_VISIBILITY } from "@/lib/portfolio-utils";
export type { PortfolioData, VisibilityConfig } from "@/lib/portfolio-utils";

interface PortfolioRendererProps {
  data: PortfolioData;
  isMobilePreview?: boolean;
  portfolioId?: string; // Only provided on the live public page
  visitId?: string; // Provided when tracking a visit
}

// ── Custom Brand Icons to avoid versioning issues ──
const LinkedInIcon = ({ className, style }: { className?: string, style?: any }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = ({ className, style }: { className?: string, style?: any }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const XIcon = ({ className, style }: { className?: string, style?: any }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24"
    fill="currentColor" 
    className={className}
    style={style}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function PortfolioRenderer({ 
  data, 
  isMobilePreview = false,
  portfolioId,
  visitId,
}: PortfolioRendererProps) {
  const styles = getThemeStyles(data);
  const visibility = data.visibility || DEFAULT_VISIBILITY;

  // Fire-and-forget click tracker — no-op during editor preview
  const trackClick = (linkType: string, linkUrl?: string, linkName?: string) => {
    if (!portfolioId) return;
    fetch("/api/analytics/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolioId, linkType, linkUrl, linkName }),
    }).catch(() => {}); // silent fail
  };

  // ── Time spent tracking ──
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!visitId) return;

    const sendDuration = () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent <= 0) return;

      const payload = JSON.stringify({ visitId, durationSeconds: timeSpent });
      
      // Preferred method for analytics on page exit
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track-time", payload);
      } else {
        // Fallback for browsers without Beacon support
        fetch("/api/analytics/track-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Listen for tab closure or navigation away
    window.addEventListener("pagehide", sendDuration);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendDuration();
      }
    });

    return () => {
      sendDuration();
      window.removeEventListener("pagehide", sendDuration);
    };
  }, [visitId]);

  const cardStyle = { 
    backgroundColor: styles.surfaceSecondary, 
    borderColor: styles.border 
  };

  return (
    <div 
      className="w-full flex flex-col font-sans text-left selection:bg-emerald-500/30"
      style={{ backgroundColor: styles.surface, color: styles.text }}
    >
      {/* ── Navigation Header (Sandboxed) ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: `${styles.surface}e6`, borderColor: styles.border }}>
        <div className={`w-full ${isMobilePreview ? 'px-4' : 'max-w-6xl mx-auto px-6'} h-16 flex items-center justify-between`}>
          <Link
            href="/"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-lg font-extrabold tracking-tight hover:opacity-80 transition-opacity"
          >
            Shortlist<span style={styles.primaryStyle}>Me</span>
          </Link>
          <nav className={`${isMobilePreview ? 'hidden' : 'hidden md:flex'} items-center gap-6 text-sm font-semibold`} style={{ color: styles.textSecondary }}>
            {visibility.experience && (data.experience || []).length > 0 && <a href="#experience" className="hover:opacity-80 transition-opacity">Experience</a>}
            {visibility.skills && (data.skills || []).length > 0 && <a href="#skills" className="hover:opacity-80 transition-opacity">Skills</a>}
            {visibility.projects && (data.projects || []).length > 0 && <a href="#projects" className="hover:opacity-80 transition-opacity">Projects</a>}
            {visibility.education && (data.education || []).length > 0 && <a href="#education" className="hover:opacity-80 transition-opacity">Education</a>}
          </nav>
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              onClick={() => trackClick("email_header", `mailto:${data.email}`)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
              style={{ ...styles.bgPrimaryStyle, color: styles.accentText, boxShadow: `0 4px 6px -1px ${styles.primaryHex}33` }}
            >
              Get in Touch
            </a>
          )}
        </div>
      </header>

      <main className={`w-full ${isMobilePreview ? 'px-4 pt-10' : 'max-w-6xl mx-auto px-6 pt-16'} pb-24 flex flex-col gap-20`}>
        
        {/* ── Hero Segment ── */}
        <section className={`flex flex-col ${isMobilePreview ? '' : 'md:flex-row md:items-center'} gap-12`}>
          <div className="flex-1">
            <div 
               className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-full mb-6 animate-fade-up"
               style={{ ...styles.borderPrimaryStyle, backgroundColor: `${styles.primaryHex}1a` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={styles.bgPrimaryStyle} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={styles.primaryStyle}>Available for work</span>
            </div>
            <h1 
              className={`${isMobilePreview ? 'text-3xl' : 'text-4xl md:text-6xl'} font-black tracking-tight leading-[1.05] mb-6 animate-fade-up`} 
              style={{ fontFamily: "var(--font-display)", animationDelay: "100ms" }}
            >
              {data.name}<span style={styles.primaryStyle}>{styles.isCustom ? "" : "."}</span>
            </h1>
            <p className="text-lg mb-6 font-semibold" style={{ color: styles.textSecondary, animation: "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>{data.title}</p>
            {data.bio && <p className="text-sm md:text-base leading-relaxed max-w-xl mb-8 whitespace-pre-wrap" style={{ color: styles.textSecondary, animation: "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>{data.bio}</p>}

            {/* Contact Grid */}
            <div className="flex flex-wrap gap-4" style={{ animation: "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              {data.location && (
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: styles.textSecondary }}>
                  <MapPin className="w-4 h-4" style={styles.primaryStyle} />
                  {data.location}
                </div>
              )}
              {data.email && (
                <a 
                  href={`mailto:${data.email}`}
                  onClick={() => trackClick("email_hero", `mailto:${data.email}`)}
                  className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70 group" 
                  style={{ color: styles.textSecondary }}
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" style={styles.primaryStyle} />
                  {data.email}
                </a>
              )}
              {data.linkedin && (
                <a 
                  href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("linkedin_hero", data.linkedin)}
                  className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70 group" 
                  style={{ color: styles.textSecondary }}
                >
                  <LinkedInIcon className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: styles.primaryHex }} />
                  LinkedIn
                </a>
              )}
              {data.github && (
                <a 
                  href={data.github.startsWith('http') ? data.github : `https://${data.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("github_hero", data.github)}
                  className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70 group" 
                  style={{ color: styles.textSecondary }}
                >
                  <GitHubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: styles.primaryHex }} />
                  GitHub
                </a>
              )}
              {data.twitter && (
                <a 
                  href={data.twitter.startsWith('http') ? data.twitter : `https://${data.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("twitter_hero", data.twitter)}
                  className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70 group" 
                  style={{ color: styles.textSecondary }}
                >
                  <XIcon className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: styles.primaryHex }} />
                  X
                </a>
              )}
              {data.phone && (
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: styles.textSecondary }}>
                   <Phone className="w-4 h-4" style={styles.primaryStyle} />
                   {data.phone}
                </div>
              )}
            </div>
          </div>

          {/* Avatar Area */}
          {data.photoUrl ? (
            <div 
              className={`${isMobilePreview ? 'w-40 h-40' : 'w-48 h-48 md:w-64 md:h-64'} rounded-full overflow-hidden flex-shrink-0 mx-auto ${isMobilePreview ? '' : 'md:mx-0'} border-4 border-white dark:border-zinc-800`}
              style={{ ...styles.shadowStyle, animation: "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
               <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
            </div>
          ) : null}
        </section>

        {/* ── Experience ── */}
        {visibility.experience && (data.experience || []).length > 0 && (
          <section id="experience" style={{ animation: "revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>
              Work Experience
            </h2>
            <div className="flex flex-col gap-6">
              {(data.experience || []).map((exp, i) => (
                <div 
                  key={i} 
                  className={`portfolio-card border rounded-2xl ${isMobilePreview ? 'p-6' : 'p-8'}`} 
                  style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border, animation: `revealUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.35 + i * 0.08}s both` }}
                >
                  <div className={`flex flex-col ${isMobilePreview ? '' : 'sm:flex-row sm:items-start sm:justify-between'} gap-2 mb-3`}>
                    <div>
                      <h3 className="text-lg font-black">{exp.title}</h3>
                      <p className="font-bold text-sm" style={styles.primaryStyle}>{exp.company}</p>
                    </div>
                    <span 
                      className="text-xs font-bold border px-3 py-1.5 rounded-full whitespace-nowrap self-start" 
                      style={{ backgroundColor: styles.surface, borderColor: styles.border, color: styles.textMuted }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: styles.textSecondary }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {visibility.skills && (data.skills || []).length > 0 && (
          <section id="skills" style={{ animation: "revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {(data.skills || []).filter(s => s.trim() !== "").map((skill, i) => (
                <span 
                  key={i} 
                  className="skill-tag px-3 py-1.5 border rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ── */}
        {visibility.projects && (data.projects || []).length > 0 && (
          <section id="projects" style={{ animation: "revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}>
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Projects</h2>
            <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'md:grid-cols-2'} gap-6`}>
              {(data.projects || []).map((proj, i) => (
                 <div 
                   key={i} 
                   className={`portfolio-card border rounded-2xl overflow-hidden group flex flex-col`} 
                   style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border, animation: `revealUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.1}s both` }}
                 >
                   {proj.imageUrl && (
                     <div className="aspect-video w-full overflow-hidden border-b" style={{ borderColor: styles.border }}>
                        <img 
                          src={proj.imageUrl} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                          alt={proj.title} 
                        />
                     </div>
                   )}
                   <div className="p-8 flex-1 flex flex-col">
                     <div className="flex items-center justify-between mb-3">
                       <h3 className="text-base font-black transition-colors group-hover:opacity-80" style={styles.primaryStyle}>{proj.title}</h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick("project_link", proj.link, proj.title)}
                            className="text-text-muted hover:text-emerald-500 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                     </div>
                     <p className="text-sm leading-relaxed mb-5 whitespace-pre-wrap flex-1" style={{ color: styles.textSecondary }}>{proj.description}</p>
                     <div className="flex flex-wrap gap-2 mt-auto">
                       {(proj.tags || []).filter(t => t.trim() !== "").map((tag, j) => (
                         <span 
                           key={j} 
                           className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                           style={{ ...styles.primaryStyle, backgroundColor: `${styles.primaryHex}1a` }}
                         >
                           {tag}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {visibility.education && (data.education || []).length > 0 && (
          <section id="education" style={{ animation: "revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Education</h2>
            <div className="flex flex-col gap-4">
              {(data.education || []).map((edu, i) => (
                <div 
                  key={i} 
                  className={`portfolio-card border rounded-2xl p-6 flex items-start justify-between gap-4`} 
                  style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border, animation: `revealUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.45 + i * 0.08}s both` }}
                >
                  <div>
                    <h3 className="text-base font-black">{edu.degree}</h3>
                    <p className="font-bold text-sm mb-1" style={styles.primaryStyle}>{edu.institution}</p>
                    {edu.detail && <p className="text-xs whitespace-pre-wrap" style={{ color: styles.textMuted }}>{edu.detail}</p>}
                  </div>
                  <span 
                    className="text-xs font-bold border px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0" 
                    style={{ backgroundColor: styles.surface, borderColor: styles.border, color: styles.textMuted }}
                  >
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA Finalized ── */}
        {data.email && (
          <section 
            className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-xl"
            style={{ ...styles.bgPrimaryStyle, ...styles.shadowStyle, color: styles.accentText, animation: "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10">
              <h2 className={`${isMobilePreview ? 'text-3xl' : 'text-3xl md:text-5xl'} font-black mb-4`} style={{ fontFamily: "var(--font-display)", color: styles.accentText }}>
                Let's work together.
              </h2>
              <p className="mb-8 max-w-md mx-auto font-medium" style={{ opacity: 0.8 }}>Open for new opportunities and high-impact collaborations.</p>
              <a
                href={`mailto:${data.email}`}
                onClick={() => trackClick("email_cta", `mailto:${data.email}`)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: styles.accentText, color: styles.primaryHex }}
              >
                <Mail className="w-4 h-4" />
                Drop me an email
              </a>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
