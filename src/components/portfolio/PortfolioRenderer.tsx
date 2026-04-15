"use client";

import React, { useMemo } from "react";
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
          <div style={{ fontFamily: "var(--font-display)" }} className="text-lg font-extrabold tracking-tight">
            Shortlist<span style={styles.primaryStyle}>Me</span>
          </div>
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
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg"
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
               className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-full mb-6"
               style={{ ...styles.borderPrimaryStyle, backgroundColor: `${styles.primaryHex}1a` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={styles.bgPrimaryStyle} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={styles.primaryStyle}>Available for work</span>
            </div>
            <h1 className={`${isMobilePreview ? 'text-3xl' : 'text-4xl md:text-6xl'} font-black tracking-tight leading-[1.05] mb-6`} style={{ fontFamily: "var(--font-display)" }}>
              {data.name}<span style={styles.primaryStyle}>{styles.isCustom ? "" : "."}</span>
            </h1>
            <p className="text-lg mb-6 font-semibold" style={{ color: styles.textSecondary }}>{data.title}</p>
            {data.bio && <p className="text-sm md:text-base leading-relaxed max-w-xl mb-8 whitespace-pre-wrap" style={{ color: styles.textSecondary }}>{data.bio}</p>}

            {/* Contact Grid */}
            <div className="flex flex-wrap gap-4">
              {data.location && (
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: styles.textSecondary }}>
                  <MapPin className="w-4 h-4" style={styles.primaryStyle} />
                  {data.location}
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: styles.textSecondary }}>
                  <Mail className="w-4 h-4" style={styles.primaryStyle} />
                  {data.email}
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: styles.textSecondary }}>
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
              style={styles.shadowStyle}
            >
               <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
            </div>
          ) : null}
        </section>

        {/* ── Experience ── */}
        {visibility.experience && (data.experience || []).length > 0 && (
          <section id="experience" className="animate-fade-in">
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>
              Work Experience
            </h2>
            <div className="flex flex-col gap-6">
              {(data.experience || []).map((exp, i) => (
                <div 
                  key={i} 
                  className={`border rounded-2xl ${isMobilePreview ? 'p-6' : 'p-8'} transition-all hover:shadow-sm`} 
                  style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border }}
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
          <section id="skills" className="animate-fade-in">
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {(data.skills || []).filter(s => s.trim() !== "").map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all hover:opacity-80"
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
          <section id="projects" className="animate-fade-in">
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Projects</h2>
            <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'md:grid-cols-2'} gap-6`}>
              {(data.projects || []).map((proj, i) => (
                 <div 
                   key={i} 
                   className="border rounded-2xl overflow-hidden transition-all hover:shadow-sm group group-hover:border-emerald-500/30 flex flex-col" 
                   style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border }}
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
          <section id="education" className="animate-fade-in">
            <h2 className="text-2xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Education</h2>
            <div className="flex flex-col gap-4">
              {(data.education || []).map((edu, i) => (
                <div 
                  key={i} 
                  className="border rounded-2xl p-6 flex items-start justify-between gap-4" 
                  style={{ backgroundColor: styles.surfaceSecondary, borderColor: styles.border }}
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
            style={{ ...styles.bgPrimaryStyle, ...styles.shadowStyle, color: styles.accentText }}
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
