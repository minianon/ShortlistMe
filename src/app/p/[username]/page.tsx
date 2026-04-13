import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { MapPin, Mail, Phone, Globe, FolderGit2, Link2, ArrowRight } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";

// ── Types matching the Groq extraction schema ────────────────────────────────

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  detail?: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
}

interface PortfolioData {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  certifications?: string[];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { publishedVersion: true },
  });
  const data = (portfolio?.publishedVersion?.data ?? {}) as PortfolioData;
  const name = data.name ?? username;
  return {
    title: `${name} — Portfolio`,
    description: data.bio ?? `Professional portfolio of ${name} — powered by ShortlistMe`,
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { publishedVersion: true },
  });

  if (!portfolio || !portfolio.publishedVersion) {
    notFound();
  }

  const d = portfolio.publishedVersion.data as PortfolioData;
  const name = d.name ?? username;
  const title = d.title ?? "Professional";
  const bio = d.bio ?? "";
  const skills = d.skills ?? [];
  const experience = d.experience ?? [];
  const education = d.education ?? [];
  const projects = d.projects ?? [];
  const certifications = d.certifications ?? [];

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-emerald-500 selection:text-white">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" style={{ fontFamily: "var(--font-display)" }} className="text-lg font-extrabold tracking-tight">
            Shortlist<span className="text-emerald-500">Me</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-text-secondary">
            {experience.length > 0 && <a href="#experience" className="hover:text-text transition-colors">Experience</a>}
            {skills.length > 0 && <a href="#skills" className="hover:text-text transition-colors">Skills</a>}
            {projects.length > 0 && <a href="#projects" className="hover:text-text transition-colors">Projects</a>}
            {education.length > 0 && <a href="#education" className="hover:text-text transition-colors">Education</a>}
          </nav>
          {d.email && (
            <a
              href={`mailto:${d.email}`}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              Get in Touch
            </a>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col gap-20">

        {/* ── Hero ── */}
        <section className="flex flex-col md:flex-row md:items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Available for work</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              {name}<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-xl text-text-secondary mb-6 font-semibold">{title}</p>
            {bio && <p className="text-base text-text-secondary leading-relaxed max-w-xl mb-8">{bio}</p>}

            {/* Contact links */}
            <div className="flex flex-wrap gap-4">
              {d.location && (
                <div className="flex items-center gap-2 text-sm text-text-secondary font-semibold">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {d.location}
                </div>
              )}
              {d.email && (
                <a href={`mailto:${d.email}`} className="flex items-center gap-2 text-sm text-text-secondary hover:text-emerald-500 font-semibold transition-colors">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  {d.email}
                </a>
              )}
              {d.phone && (
                <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-sm text-text-secondary hover:text-emerald-500 font-semibold transition-colors">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {d.phone}
                </a>
              )}
              {d.linkedin && (
                <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-emerald-500 font-semibold transition-colors">
                  <Link2 className="w-4 h-4 text-emerald-500" />
                  LinkedIn
                </a>
              )}
              {d.github && (
                <a href={d.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-emerald-500 font-semibold transition-colors">
                  <FolderGit2 className="w-4 h-4 text-emerald-500" />
                  GitHub
                </a>
              )}
              {d.website && (
                <a href={d.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-emerald-500 font-semibold transition-colors">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Avatar Orb */}
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 flex-shrink-0 mx-auto md:mx-0">
            <span className="text-7xl md:text-8xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        </section>

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <section id="experience">
            <h2 className="text-3xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>
              Work Experience
            </h2>
            <div className="flex flex-col gap-6">
              {experience.map((exp, i) => (
                <div key={i} className="bg-background-secondary border border-border rounded-2xl p-8 hover:border-emerald-500/30 hover:shadow-sm transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-black text-text">{exp.title}</h3>
                      <p className="text-emerald-500 font-bold text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs font-bold text-text-muted bg-background border border-border px-3 py-1.5 rounded-full whitespace-nowrap self-start">
                      {exp.period}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm text-text-secondary leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <section id="skills">
            <h2 className="text-3xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-background-secondary border border-border rounded-xl text-sm font-semibold text-text-secondary hover:border-emerald-500/40 hover:text-text transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <section id="projects">
            <h2 className="text-3xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="bg-background-secondary border border-border rounded-2xl p-8 hover:border-emerald-500/30 hover:shadow-sm transition-all group cursor-default">
                  <h3 className="text-base font-black text-text mb-3 group-hover:text-emerald-500 transition-colors">{proj.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">{proj.description}</p>
                  {proj.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <section id="education">
            <h2 className="text-3xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Education</h2>
            <div className="flex flex-col gap-4">
              {education.map((edu, i) => (
                <div key={i} className="bg-background-secondary border border-border rounded-2xl p-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-text">{edu.degree}</h3>
                    <p className="text-emerald-500 font-bold text-sm mb-1">{edu.institution}</p>
                    {edu.detail && <p className="text-xs text-text-muted">{edu.detail}</p>}
                  </div>
                  <span className="text-xs font-bold text-text-muted bg-background border border-border px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-10" style={{ fontFamily: "var(--font-display)" }}>Certifications</h2>
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert, i) => (
                <span key={i} className="flex items-center gap-2 px-4 py-2.5 bg-background-secondary border border-border rounded-xl text-sm font-semibold text-text">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  {cert}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        {d.email && (
          <section className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-xl shadow-emerald-500/20">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Let's work together.
              </h2>
              <p className="text-emerald-100/80 mb-8 max-w-md mx-auto">Open for new opportunities and collaborations.</p>
              <a
                href={`mailto:${d.email}`}
                className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all"
              >
                <Mail className="w-4 h-4" />
                Drop me an email
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        )}

      </main>

      <PublicFooter />
    </div>
  );
}
