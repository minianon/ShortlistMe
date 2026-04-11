import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Smile, Hexagon, ShoppingBag } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  // Decode url-encoded username and capitalize for display if necessary
  const displayName = decodeURIComponent(username);
  
  return {
    title: `${displayName}'s Portfolio`,
    description: `Professional portfolio of ${displayName} — powered by ShortlistMe`,
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="min-h-screen bg-background-secondary text-text font-sans selection:bg-primary selection:text-white pb-20">
      
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-background-secondary/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl font-extrabold tracking-tight text-text"
          >
            ShortlistMe
          </Link>
          
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary">
               <Link href="#" className="hover:text-text transition-colors">About</Link>
               <Link href="#" className="hover:text-text transition-colors">Projects</Link>
               <Link href="#" className="hover:text-text transition-colors">Experience</Link>
            </nav>
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/20">
              Connect
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 flex flex-col gap-12">
         
         {/* ── Hero Section ── */}
         <section className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 max-w-xl">
               <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-text" style={{ fontFamily: "var(--font-display)" }}>
                  Alex Mercer<span className="text-primary">.</span>
               </h1>
               <p className="text-xl text-text-secondary mb-8 leading-relaxed font-light">
                  Product Designer & Creative Technologist crafting high-fidelity digital ecosystems.
               </p>
               <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-border-strong/60 text-text text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full">Available for work</span>
                  <span className="bg-border-strong/60 text-text text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full">Based in London</span>
               </div>
            </div>
            
            {/* Avatar Image */}
            <div className="w-full md:w-[440px] aspect-[4/5] bg-text rounded-3xl overflow-hidden shadow-2xl relative">
               <img src="https://api.dicebear.com/9.x/notionists/svg?seed=AlexMercer&backgroundColor=transparent" alt="Alex Mercer" className="w-full h-full object-cover scale-150 absolute inset-0 -translate-y-12" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
         </section>

         {/* ── Experience Section ── */}
         <section className="bg-[#f0f2f5] rounded-[2rem] p-10 md:p-16 flex flex-col lg:flex-row gap-16 border border-border-strong/50">
            <div className="lg:w-[35%] flex flex-col justify-between">
               <div>
                  <h2 className="text-3xl font-bold text-text mb-4" style={{ fontFamily: "var(--font-display)" }}>Experience</h2>
                  <p className="text-sm text-text-secondary leading-relaxed mb-12">
                     Working at the intersection of business strategy and pixel-perfect execution.
                  </p>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Core Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                     {["Product Design", "UI Architecture", "User Research", "Prototyping", "Frontend Dev", "Design Strategy"].map(skill => (
                        <span key={skill} className="bg-background border border-border-strong text-text-secondary text-[10px] font-bold px-3 py-1.5 rounded-md hover:border-border-strong transition-colors cursor-default">
                           {skill}
                        </span>
                     ))}
                  </div>
               </div>
            </div>
            
            {/* Timeline */}
            <div className="lg:w-[65%] flex flex-col gap-10">
               {/* Role 1 */}
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 border-b border-border-strong/60 pb-10">
                  <div className="w-24 shrink-0 text-[10px] font-bold text-text-muted uppercase tracking-widest pt-1">Present</div>
                  <div>
                     <h3 className="text-lg font-bold text-text">Senior Product Designer</h3>
                     <p className="text-primary text-sm font-semibold mb-3">Stripe <span className="text-text-muted font-normal"> • Fintech & Payments</span></p>
                     <p className="text-xs text-text-secondary leading-relaxed">Leading the checkout experience team, optimizing conversion for over 1M+ active merchants globally. Spearheading the "Invisible Interface" initiative.</p>
                  </div>
               </div>
               
               {/* Role 2 */}
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 border-b border-border-strong/60 pb-10">
                  <div className="w-24 shrink-0 text-[10px] font-bold text-text-muted uppercase tracking-widest pt-1">2020 — 2022</div>
                  <div>
                     <h3 className="text-lg font-bold text-text">UX Designer</h3>
                     <p className="text-primary text-sm font-semibold mb-3">Airbnb <span className="text-text-muted font-normal"> • Travel & Lifestyle</span></p>
                     <p className="text-xs text-text-secondary leading-relaxed">Collaborated on the "Experiences" platform redesign. Focused on accessibility and localization for emerging markets in SE Asia.</p>
                  </div>
               </div>

               {/* Role 3 */}
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <div className="w-24 shrink-0 text-[10px] font-bold text-text-muted uppercase tracking-widest pt-1">2018 — 2020</div>
                  <div>
                     <h3 className="text-lg font-bold text-text">Digital Art Director</h3>
                     <p className="text-primary text-sm font-semibold mb-3">Pentagram <span className="text-text-muted font-normal"> • Brand Identity</span></p>
                     <p className="text-xs text-text-secondary leading-relaxed">Defined visual languages for startups. Bridged the gap between traditional brand identity and modern digital products.</p>
                  </div>
               </div>

            </div>
         </section>

         {/* ── Selected Works ── */}
         <section>
            <div className="flex items-end justify-between mb-8">
               <h2 className="text-3xl font-bold text-text" style={{ fontFamily: "var(--font-display)" }}>Selected Works</h2>
               <span className="text-[10px] font-bold text-text-muted bg-background-tertiary px-3 py-1 rounded-full uppercase tracking-widest">2022 — 2024</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* Card 1 (Large) */}
               <div className="md:col-span-2 bg-background rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border flex flex-col group block cursor-pointer">
                  <div className="bg-[#121212] rounded-2xl w-full h-80 md:h-[400px] mb-4 overflow-hidden relative">
                     {/* Mock Dark Dashboard Image inside */}
                     <div className="absolute inset-0 opacity-50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                     <div className="absolute top-10 left-10 right-20 bottom-0 bg-[#1c1c1c] rounded-t-xl border-t border-l border-background/10 p-6 flex flex-col gap-4 shadow-2xl">
                        <div className="w-48 h-6 bg-background/5 rounded-md"></div>
                        <div className="w-full h-px bg-background/5"></div>
                        <div className="w-32 h-4 bg-background/5 rounded-md"></div>
                        <div className="w-64 h-4 bg-background/5 rounded-md"></div>
                     </div>
                     {/* Overlay gradients */}
                     <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-60"></div>
                  </div>
                  <div className="px-4 pb-2 flex items-center justify-between">
                     <div>
                        <h3 className="text-lg font-bold text-text mb-1 group-hover:text-primary transition-colors">Nexus Analytics</h3>
                        <p className="text-xs text-text-secondary">Enterprise Data Visualization Platform.</p>
                     </div>
                     <div className="w-10 h-10 rounded-full border border-border-strong flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="w-[18px] h-[18px] -rotate-45" />
                     </div>
                  </div>
               </div>

               {/* Card 2 (Vertical tall) */}
               <div className="bg-background-secondary rounded-3xl p-8 border border-border flex flex-col justify-between group cursor-pointer overflow-hidden">
                  <div>
                     <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">Mobile App</span>
                     <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors leading-tight" style={{ fontFamily: "var(--font-display)" }}>Lumina Health</h3>
                     <p className="text-xs text-text-secondary mb-6 leading-relaxed">A mindful fitness tracker focusing on recovery and mental well-being for high-performers.</p>
                     <div className="flex gap-2">
                        <span className="bg-background border border-border-strong text-text-muted text-[9px] font-bold px-2 py-1 rounded uppercase">iOS</span>
                        <span className="bg-background border border-border-strong text-text-muted text-[9px] font-bold px-2 py-1 rounded uppercase">Wellness</span>
                     </div>
                  </div>
                  {/* Portrait graphic inserted near bottom */}
                  <div className="mt-8 h-48 -mx-8 -mb-8 rounded-t-2xl overflow-hidden bg-text relative">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
                     <Smile className="text-white/5 w-[140px] h-[140px] absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 select-none stroke-[1]" />
                  </div>
               </div>

               {/* Card 3 (Bottom Left) */}
               <div className="md:col-span-1 bg-background-secondary rounded-3xl p-8 border border-border group cursor-pointer transition-colors hover:bg-background hover:shadow-lg">
                  <div className="w-10 h-10 bg-primary-light text-primary rounded-xl flex items-center justify-center mb-6">
                     <Hexagon className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-3 group-hover:text-primary transition-colors">Aura Design System</h3>
                  <p className="text-xs text-text-secondary mb-10 leading-relaxed">
                     Developed a multi-brand design system for a fintech conglomerate, ensuring 100% component reusability.
                  </p>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1 group-hover:text-primary transition-colors">
                     View Case Study 
                  </span>
               </div>

               {/* Card 4 (Bottom Right) */}
               <div className="md:col-span-2 bg-background-secondary rounded-3xl p-8 border border-border group cursor-pointer transition-colors hover:bg-background hover:shadow-lg flex flex-col justify-between">
                  <div>
                     <div className="w-10 h-10 bg-primary-light text-primary rounded-xl flex items-center justify-center mb-6">
                        <ShoppingBag className="w-5 h-5 fill-current" />
                     </div>
                     <h3 className="text-lg font-bold text-text mb-3 group-hover:text-primary transition-colors">Vogue E-Commerce</h3>
                     <p className="text-xs text-text-secondary mb-10 leading-relaxed max-w-lg">
                        Redesigning the high-fashion shopping experience with focus on editorial storytelling and seamless checkout.
                     </p>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1 group-hover:text-primary transition-colors">
                     View Case Study 
                  </span>
               </div>
               
            </div>
         </section>

         {/* ── Call to Action Banner ── */}
         <section className="bg-primary-light rounded-[3rem] p-16 md:p-24 text-center border border-primary-light/50 relative overflow-hidden mt-8 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-background/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] leading-tight tracking-tight mb-10" style={{ fontFamily: "var(--font-display)" }}>
                  Let's build the future <br/> of the web together.
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all">
                     Get in Touch
                  </button>
                  <button className="w-full sm:w-auto bg-background hover:bg-background-secondary text-text border border-border-strong px-8 py-3.5 rounded-xl text-sm font-bold transition-all">
                     Download Resume
                  </button>
               </div>
               {/* ── Public Footer ── */}
               <PublicFooter />
            </div>
         </section>

      </main>
      
    </div>
  );
}
