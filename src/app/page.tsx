"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#f7f9fb] text-[#191c1e] font-sans selection:bg-[#4f46e5] selection:text-white">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-xl tracking-tight text-[#191c1e]"
            >
              ShortlistMe
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
              <Link href="#" className="hover:text-[#191c1e] transition-colors">Features</Link>
              <Link href="#" className="hover:text-[#191c1e] transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-[#191c1e] transition-colors">Showcase</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-gray-400 hover:text-[#191c1e] transition-colors">
              <span className="material-symbols-rounded text-xl">dark_mode</span>
            </button>
            <Link
              href="/sign-up"
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6">
        {/* ── Hero Section ── */}
        <section className="py-20 md:py-28 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eef2ff] text-[#4f46e5] rounded-full text-xs font-bold uppercase tracking-wide mb-6">
              AI-Powered Portfolios in a Snap
            </div>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-[#191c1e]"
            >
              Turn Your Resume Into a <span className="text-[#4f46e5]">Portfolio</span> in Seconds
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Upload your resume or enter your details manually, and we'll generate a professional, high-fidelity portfolio instantly. Share your best work with recruiters and clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/sign-up"
                className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-3.5 rounded-xl text-[15px] font-semibold transition-all shadow-lg shadow-indigo-500/25 w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="bg-gray-100 hover:bg-gray-200 text-[#191c1e] px-8 py-3.5 rounded-xl text-[15px] font-semibold transition-all w-full sm:w-auto text-center"
              >
                View Demo
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none relative">
            <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl shadow-indigo-100 border border-white/50 p-6 flex flex-col relative overflow-hidden">
              {/* Graphic Mockup inside Hero */}
              <div className="w-full h-4 bg-gray-100 rounded-full mb-8 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-indigo-100 w-1/3 rounded-full"></div>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-fixed)_0%,transparent_70%)] opacity-20 blur-3xl"></div>
                {/* Concentric rings */}
                <div className="w-64 h-64 border border-indigo-100 rounded-full absolute"></div>
                <div className="w-48 h-48 border border-indigo-200 rounded-full absolute"></div>
                <div className="w-32 h-32 border border-indigo-300 rounded-full absolute"></div>
                <div className="w-16 h-16 bg-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center relative z-10">
                  <span className="material-symbols-rounded text-indigo-500">auto_awesome</span>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-rounded text-sm font-bold">check</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Portfolio Ready</p>
                  <p className="text-xs text-gray-500">Generated in 4.2s</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section className="py-24">
          <div className="mb-14">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e] mb-4"
            >
              Powerful features for modern careers
            </h2>
            <p className="text-gray-500 max-w-2xl text-lg">
              Everything you need to stand out in a crowded market, powered by our custom curation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1 - Spans 7 */}
            <div className="md:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 items-center overflow-hidden group">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <span className="material-symbols-rounded">bolt</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Generation</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Our AI parses your resume and maps it to a high-fidelity design system in under 10 seconds. No manual formatting required.
                </p>
              </div>
              <div className="flex-1 w-full sm:w-auto h-40 bg-gray-50 rounded-xl border border-gray-100 relative group-hover:scale-105 transition-transform duration-500 p-4">
                 <div className="w-3/4 h-3 bg-gray-200 rounded-full mb-3"></div>
                 <div className="w-1/2 h-3 bg-gray-200 rounded-full mb-6"></div>
                 <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
                 <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
                 <div className="w-4/5 h-2 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            {/* Feature 2 - Spans 5 */}
            <div className="md:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <span className="material-symbols-rounded">tune</span>
              </div>
              <h3 className="text-xl font-bold mb-3">High Customization</h3>
              <p className="text-gray-500 leading-relaxed text-sm mb-6">
                Tweak layouts, colors, and typography to match your personal brand perfectly.
              </p>
            </div>

            {/* Feature 3 - Spans 4 */}
            <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 mb-6">
                <span className="material-symbols-rounded">contrast</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Dark/Light Support</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Every portfolio comes with native dark and light mode support built in.
              </p>
            </div>

            {/* Feature 4 - Spans 8 */}
            <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-6 group">
               <div>
                  <div className="w-10 h-10 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 mb-6">
                    <span className="material-symbols-rounded">ios_share</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Export to Figma & PDF</h3>
                  <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
                    Take your portfolio anywhere. Export high-quality PDFs for emails or Figma files for further professional design work.
                  </p>
               </div>
               <div className="flex gap-3 items-end opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-400">PDF</div>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-400">FIG</div>
               </div>
            </div>
          </div>
        </section>

        {/* ── How it Works Section ── */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e] mb-4"
            >
              How it Works
            </h2>
            <p className="text-gray-500 text-lg">
              Go from zero to a professional portfolio in three simple steps.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-4 sm:p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
            {/* Steps List */}
            <div className="flex-1 flex flex-col gap-4">
              {[
                {
                  id: 1,
                  title: "Upload",
                  desc: "Securely upload your resume or paste a link. Our AI parses every detail to build your base profile.",
                },
                {
                  id: 2,
                  title: "Customize",
                  desc: "Fine-tune the design. Select layouts, add project artifacts, and customize your personal brand colors.",
                },
                {
                  id: 3,
                  title: "Share",
                  desc: "Launch your unique URL, export to a high-quality PDF, or grab a Figma file for total control.",
                },
              ].map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                      isActive
                        ? "bg-[#f8f9fe] border-[#c7d2fe] shadow-sm"
                        : "bg-transparent border-transparent hover:bg-gray-50"
                    } flex gap-5`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-sm ${
                        isActive
                          ? "bg-[#4f46e5] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 ${isActive ? "text-[#191c1e]" : "text-gray-500"}`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Visual Window */}
            <div className="flex-1 w-full bg-[#1e2336] rounded-2xl p-4 shadow-xl border border-gray-800 flex flex-col aspect-[4/3] md:aspect-auto md:h-[400px]">
              {/* Window Header */}
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              {/* Window Body - Changes based on step */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-700 rounded-xl bg-[#2a3047] relative">
                {activeStep === 1 && (
                  <div className="animate-fade-up">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-rounded text-blue-400 text-3xl">cloud_upload</span>
                    </div>
                    <div className="w-48 h-2 bg-[#4f46e5] rounded-full mx-auto mb-4 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                    <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">PROCESSING RESUME.PDF...</p>
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="animate-fade-up w-full text-left">
                     <div className="flex gap-4 mb-6">
                        <div className="w-1/3 h-24 bg-indigo-500/20 rounded-lg border border-indigo-500/50"></div>
                        <div className="w-1/3 h-24 bg-white/5 rounded-lg border border-white/10"></div>
                        <div className="w-1/3 h-24 bg-white/5 rounded-lg border border-white/10"></div>
                     </div>
                     <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 cursor-pointer border-2 border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-emerald-500 cursor-pointer"></div>
                        <div className="w-6 h-6 rounded-full bg-rose-500 cursor-pointer"></div>
                     </div>
                  </div>
                )}
                {activeStep === 3 && (
                  <div className="animate-fade-up text-center w-full">
                     <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-emerald-500/30">
                        <span className="material-symbols-rounded text-sm">check_circle</span>
                        Published successfully
                     </div>
                     <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                        <span className="text-gray-300 text-sm truncate mr-4">shortlistme.com/p/alex-rivera</span>
                        <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-white text-xs font-semibold">Copy</button>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-24 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e] mb-4"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "How does the AI generate my portfolio?",
                a: "Our proprietary AI engine analyzes your resume's structure, keywords, and work history. It then maps this data to a curated collection of high-fidelity design templates, automatically selecting layouts that best highlight your specific career strengths.",
                open: true,
              },
              {
                q: "Is my resume data kept private?",
                a: "Yes. Your data is encrypted and stored securely. We do not sell your personal information or use it to train public models.",
              },
              {
                q: "Can I customize the design after generation?",
                a: "Absolutely! The AI gives you a huge head start, but you have full control over colors, fonts, layouts, and individual project descriptions.",
              },
              {
                q: "What formats can I export my portfolio in?",
                a: "You can share the live web URL, export it as a clean PDF for email attachments, or pull it directly into Figma for expert-level pixel pushing.",
              },
              {
                q: "Do I need design skills to use ShortlistMe?",
                a: "Not at all. The platform is built specifically for non-designers to have top-tier, designer-quality portfolios instantly.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer [&_summary::-webkit-details-marker]:hidden"
                open={faq.open}
              >
                <summary className="flex items-center justify-between font-bold text-gray-900 outline-none">
                  {faq.q}
                  <span className="material-symbols-rounded text-gray-400 group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-gray-500 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-24">
          <div className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
              >
                Ready to transform your career?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Join 5,000+ designers, developers, and creators who have leveled up their professional presence.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-white text-[#4f46e5] hover:bg-indigo-50 px-8 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl"
              >
                Start Building for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="font-extrabold text-xl tracking-tight text-[#191c1e]"
            >
              ShortlistMe
            </span>
            <span className="text-sm text-gray-400">© 2026 ShortlistMe. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <Link href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Contact Us</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
