"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
   Undo2,
   PenTool,
   Loader2,
   Globe,
   Laptop,
   Smartphone,
   Plus,
   Trash2,
   ExternalLink,
   Eye,
   EyeOff,
   Image as ImageIcon,
   Upload,
   Check,
   Sun,
   Moon,
   MapPin,
   Mail,
   Palette,
   Layers,
   ChevronUp,
   ChevronDown,
   Camera,
   User,
   Briefcase,
   Zap,
   Sparkles,
   GraduationCap,
   Package,
   Link2,
   Lock
} from "lucide-react";
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary';

import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import {
   PortfolioData,
   VisibilityConfig,
   PRESET_THEMES,
   DEFAULT_VISIBILITY,
   getThemeStyles,
   PRO_COLOR_SWATCHES,
   PRO_THEME_PALETTES
} from "@/lib/portfolio-utils";
import PublicFooter from "@/components/PublicFooter";
import { SkillTagInput } from "@/components/portfolio/SkillTagInput";
import DashboardErrorBoundary from "@/components/DashboardErrorBoundary";

// ── Main Page Component ───────────────────────────────

interface PreviewState {
   portfolio: { id: string; slug: string; isPublic: boolean } | null;
   latestVersion: { id: string; data: PortfolioData; createdAt: string } | null;
   isLive: boolean;
}

export default function PortfolioManagement() {
   const [state, setState] = useState<PreviewState | null>(null);
   const [draftData, setDraftData] = useState<PortfolioData | null>(null);

   const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

   const [loading, setLoading] = useState(true);
   const [publishing, setPublishing] = useState(false);
   const [togglingPublic, setTogglingPublic] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [device, setDevice] = useState<"laptop" | "mobile">("laptop");

   // Temporary Refs for Cloudinary Uploads (Prevents stale closures in onClose)
   const lastUploadedUrlRef = useRef<string | null>(null);
   const pendingProjectIdxRef = useRef<number | null>(null);

   const fetchPreview = useCallback(async () => {
      try {
         const res = await fetch("/api/portfolio/preview");
         const data = await res.json();
         if (!res.ok) throw new Error(data.error || "Failed to fetch preview");
         setState(data);
         if (data.latestVersion) {
            const d = data.latestVersion.data as PortfolioData;
            // Ensure default values exist
            if (!d.visibility) d.visibility = DEFAULT_VISIBILITY;
            if (!d.themeId) d.themeId = "emerald";
            if (!d.themeMode) d.themeMode = "light";
            setDraftData(JSON.parse(JSON.stringify(d)));
         }
      } catch (err: any) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { fetchPreview(); }, [fetchPreview]);

   const handleMakePublic = async () => {
      setTogglingPublic(true);
      try {
         const res = await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicVisibility: true })
         });
         if (!res.ok) throw new Error("Failed to update visibility");
         await fetchPreview(); // Refresh the state to hide the banner
      } catch (err) {
         console.error(err);
         alert("Failed to make portfolio public");
      } finally {
         setTogglingPublic(false);
      }
   };

   const handlePublish = async () => {
      if (!draftData) return;
      setPublishing(true);
      try {
         const res = await fetch("/api/portfolio/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: draftData })
         });
         if (!res.ok) throw new Error("Publish failed");
         await fetchPreview();
         setIsEditing(false); // Close editor after success
      } catch (err: any) {
         alert(err.message);
      } finally {
         setPublishing(false);
      }
   };

   const toggleVisibility = (key: keyof VisibilityConfig) => {
      if (!draftData) return;
      setDraftData({
         ...draftData,
         visibility: {
            ...(draftData.visibility || DEFAULT_VISIBILITY),
            [key]: !(draftData.visibility?.[key] ?? true)
         }
      });
   };

   const moveItem = (key: 'experience' | 'education' | 'projects', index: number, direction: 'up' | 'down') => {
      if (!draftData) return;
      const items = [...(draftData[key] || [])];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= items.length) return;

      // Swap
      const temp = items[index];
      items[index] = items[newIndex];
      items[newIndex] = temp;

      setDraftData({ ...draftData, [key]: items });
   };

   if (loading) {
      return (
         <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
               <p className="text-xs font-black uppercase tracking-widest text-text-muted">Loading Workspace...</p>
            </div>
         </div>
      );
   }

   if (!draftData) return null;

   return (
      <div className="flex-1 flex flex-col bg-background/50 pb-20">
         <div className="max-w-[1700px] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12">

            {/* ── PRIVATE MODE ALERT ── */}
            {state?.portfolio && !state.portfolio.isPublic && (
               <div className="mb-8 p-6 bg-zinc-900/5 dark:bg-white/5 border border-emerald-500/20 rounded-[2.25rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                        <Lock className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-text uppercase tracking-widest mb-1">Portfolio is Private</h4>
                        <p className="text-xs text-text-secondary font-medium">Your work is currently hidden from the world. Only you can access this designer.</p>
                     </div>
                  </div>
                  <button 
                     onClick={handleMakePublic}
                     disabled={togglingPublic}
                     className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/40 active:scale-95"
                  >
                     {togglingPublic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                     Make it Public
                  </button>
               </div>
            )}

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
               <div className="flex-1">
                  <h1 className="text-4xl font-black text-text tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
                     Portfolio Designer<span className="text-emerald-500">.</span>
                  </h1>
                  <p className="text-text-secondary font-medium">
                     Real-time Brand Customization & Visual Showcase
                  </p>
               </div>

               <div className="flex items-center gap-4">
                  {/* Device Toggle */}
                  {/* Device Toggle moved to Preview Block */}

                  {!isEditing && state?.portfolio && (
                     <Link
                        href={`/${state.portfolio.slug}`}
                        target="_blank"
                        className="bg-background border border-border hover:bg-background-tertiary text-text px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                     >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                     </Link>
                  )}

                  <button
                     onClick={() => setIsEditing(!isEditing)}
                     className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center gap-2 ${isEditing ? 'bg-background border border-border text-text' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600'}`}
                  >
                     {isEditing ? <Undo2 className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                     {isEditing ? "Close Editor" : "Edit Design"}
                  </button>

                  {isEditing && (
                     <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 animate-fade-in shadow-xl shadow-emerald-500/20"
                     >
                        {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                        Publish Changes
                     </button>
                  )}
               </div>
            </div>

            {/* ── Main View Container ── */}
            <DashboardErrorBoundary>
               <div className="flex flex-col xl:flex-row gap-8 transition-all duration-500">

               {/* LEFT: EDITOR (Only in Edit Mode) */}
               {isEditing && (
                  <div className="w-[420px] flex-shrink-0 border-r border-border bg-background flex flex-col animate-slide-in-left">

                     <div className="flex-1 p-10 flex flex-col gap-10 bg-background-secondary/10 pb-32">

                        {/* Theme Selector Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 mb-10 animate-fade-in group/card">
                           <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                           <div className="flex items-center gap-3 mb-8 relative">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                 <Sparkles className="w-4 h-4" />
                              </div>
                              <h3 className="text-base font-black text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                 Brand Themes
                              </h3>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              {PRESET_THEMES.map(t => (
                                 <button
                                    key={t.id}
                                    onClick={() => setDraftData({ ...draftData, themeId: t.id, themeMode: t.mode })}
                                    className={`group relative flex items-center gap-3 p-2 rounded-2xl transition-all border-2 ${draftData.themeId === t.id ? 'bg-background-secondary/5' : 'border-transparent bg-background hover:border-border'}`}
                                    style={{
                                       borderColor: draftData.themeId === t.id ? t.hex : 'transparent',
                                       boxShadow: draftData.themeId === t.id ? `0 0 15px ${t.hex}33` : 'none'
                                    }}
                                 >
                                    <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${t.gradient} shadow-sm overflow-hidden flex items-center justify-center`}>
                                       {draftData.themeId === t.id && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                    </div>
                                    <span
                                       className={`text-[9px] font-bold uppercase tracking-wider ${draftData.themeId === t.id ? '' : 'text-text-muted'}`}
                                       style={{ color: draftData.themeId === t.id ? t.hex : undefined }}
                                    >
                                       {t.name}
                                    </span>
                                 </button>
                              ))}

                              {/* Custom Theme Button */}
                              <button
                                 onClick={() => {
                                    if (!draftData) return;
                                    const currentStyles = getThemeStyles(draftData);
                                    setDraftData({
                                       ...draftData,
                                       themeId: "custom",
                                       customColor: currentStyles.primaryHex,
                                       customBg: currentStyles.surface,
                                       customText: currentStyles.text,
                                       customCard: currentStyles.surfaceSecondary,
                                       customAccentText: currentStyles.accentText
                                    });
                                 }}
                                 className={`group relative flex items-center gap-3 p-2 rounded-2xl transition-all border-2 ${draftData.themeId === "custom" ? 'bg-background-secondary/5' : 'border-transparent bg-background hover:border-border'}`}
                                 style={{
                                    borderColor: draftData.themeId === "custom" ? (draftData.customColor || '#10b981') : 'transparent',
                                    boxShadow: draftData.themeId === "custom" ? `0 0 15px ${draftData.customColor || '#10b981'}33` : 'none'
                                 }}
                              >
                                 <div className="w-10 h-10 shrink-0 rounded-xl bg-background border border-dashed border-border flex items-center justify-center group-hover:bg-background-secondary transition-colors">
                                    {draftData.themeId === "custom" ? (
                                       <div className="w-5 h-5 rounded-full border border-border shadow-sm animate-pulse" style={{ backgroundColor: draftData.customColor || '#10b981' }} />
                                    ) : (
                                       <Plus className="w-4 h-4 text-text-muted" />
                                     )}
                                 </div>
                                 <span
                                    className={`text-[9px] font-bold uppercase tracking-wider ${draftData.themeId === "custom" ? '' : 'text-text-muted'}`}
                                    style={{ color: draftData.themeId === "custom" ? (draftData.customColor || '#10b981') : undefined }}
                                 >
                                    Custom
                                 </span>
                              </button>
                           </div>

                           {draftData.themeId === "custom" && (
                              <div className="mt-6 flex flex-col gap-4 animate-fade-in border-t border-border pt-6">

                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Theme Customization</label>

                                 <div className="grid grid-cols-1 gap-3">
                                    {[
                                       { label: 'Primary Accent', key: 'customColor', default: '#10b981' },
                                       { label: 'Text on Accent', key: 'customAccentText', default: '#ffffff' },
                                       { label: 'Page Background', key: 'customBg', default: '#ffffff' },
                                       { label: 'General Text', key: 'customText', default: '#0f172a' }
                                    ].map((item) => (
                                       <div key={item.key} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
                                          <span className="text-xs font-bold text-text-secondary">{item.label}</span>
                                          <div className="flex items-center gap-3">
                                             <input
                                                type="text"
                                                value={(draftData as any)[item.key] || item.default}
                                                onChange={(e) => setDraftData({ ...draftData, [item.key]: e.target.value, themeId: "custom" })}
                                                className="w-16 bg-transparent text-[10px] font-bold outline-none uppercase text-right"
                                             />
                                             <input
                                                type="color"
                                                value={(draftData as any)[item.key] || item.default}
                                                onChange={(e) => setDraftData({ ...draftData, [item.key]: e.target.value, themeId: "custom" })}
                                                className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border-none bg-border p-0"
                                             />
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </section>

                        {/* Photo & Identity Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 mb-10 animate-fade-in group/card">
                           <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                           <div className="flex items-center gap-3 mb-8 relative">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                 <User className="w-4 h-4" />
                              </div>
                              <h3 className="text-lg font-black text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                 Professional Identity
                              </h3>
                           </div>

                           <div className="flex flex-col gap-8 items-center relative">
                              {/* Modern Profile Photo Upload */}
                              <div className="relative group/profile shrink-0">
                                 <div className="w-48 h-32 rounded-3xl bg-background-tertiary overflow-hidden border border-dashed border-border transition-all hover:border-emerald-500/50 flex items-center justify-center shadow-inner">
                                    {draftData.photoUrl ? (
                                       <>
                                          <img src={draftData.photoUrl} className="w-full h-full object-cover" alt="Profile" />
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/profile:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-[2px] rounded-3xl">
                                             {isCloudinaryConfigured ? (
                                                <CldUploadWidget
                                                   uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
                                                   options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "shortlistme" }}
                                                   onSuccess={(result: any) => {
                                                      const url = result.info?.derived?.[0]?.secure_url || result.info?.secure_url;
                                                      if (url) lastUploadedUrlRef.current = url;
                                                   }}
                                                   onClose={() => {
                                                      if (lastUploadedUrlRef.current) {
                                                         setDraftData(prev => prev ? { ...prev, photoUrl: lastUploadedUrlRef.current! } : null);
                                                         lastUploadedUrlRef.current = null;
                                                      }
                                                   }}
                                                   onError={(error: any) => console.error('Profile Upload Error:', error)}
                                                >
                                                   {({ open }) => (
                                                      <button
                                                         onClick={() => {

                                                            if (typeof open === "function") {

                                                               open();

                                                            } else {

                                                               console.error("Cloudinary open function is undefined");

                                                            }

                                                         }}
                                                         className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
                                                         title="Change Photo"
                                                      >
                                                         <PenTool className="w-4 h-4" />
                                                      </button>
                                              )}
                                                </CldUploadWidget>
                                             ) : (
                                                <button
                                                   onClick={() => alert("Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment.")}
                                                   className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
                                                   title="Cloudinary Not Configured"
                                                >
                                                   <Upload className="w-4 h-4" />
                                                </button>
                                           )}
                                             <button
                                                onClick={() => setDraftData({ ...draftData, photoUrl: null })}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-100 backdrop-blur-md transition-all border border-red-500/20 shadow-xl"
                                                title="Remove Photo"
                                             >
                                                <Trash2 className="w-4 h-4" />
                                             </button>
                                          </div>
                                       </>
                                    ) : (
                                       isCloudinaryConfigured ? (
                                          <CldUploadWidget
                                             uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
                                             options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "shortlistme" }}
                                             onSuccess={(result: any) => {
                                                const url = result.info?.derived?.[0]?.secure_url || result.info?.secure_url;
                                                if (url) lastUploadedUrlRef.current = url;
                                             }}
                                             onClose={() => {
                                                if (lastUploadedUrlRef.current) {
                                                   setDraftData(prev => prev ? { ...prev, photoUrl: lastUploadedUrlRef.current! } : null);
                                                   lastUploadedUrlRef.current = null;
                                                }
                                             }}
                                             onError={(error: any) => console.error('Profile Upload Error:', error)}
                                          >
                                             {({ open }) => (
                                                <button
                                                   onClick={() => {

                                                      if (typeof open === "function") {

                                                         open();

                                                      } else {

                                                         console.error("Cloudinary open function is undefined");

                                                      }

                                                   }}
                                                   className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted hover:text-emerald-500 transition-colors"
                                                >
                                                   <div className="p-3 bg-background-secondary rounded-xl group-hover:scale-110 transition-transform">
                                                      <ImageIcon className="w-6 h-6" />
                                                   </div>
                                                   <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                                                </button>
                                              )}
                                          </CldUploadWidget>
                                       ) : (
                                          <div className="flex flex-col items-center gap-2 p-4 text-center">
                                             <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                                <ImageIcon className="w-6 h-6" />
                                             </div>
                                             <p className="text-[9px] font-black uppercase tracking-widest text-red-500">Cloudinary Missing</p>
                                          </div>
                                        )
                                     )}
                                 </div>
                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-background">
                                    <Camera className="w-3 h-3 text-white" />
                                 </div>
                              </div>

                              <div className="flex-1 w-full flex flex-col gap-4">
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">Full Name</label>
                                    <input
                                       value={draftData.name}
                                       onChange={(e) => setDraftData({ ...draftData, name: e.target.value })}
                                       className="w-full bg-background border border-border p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                 </div>
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">Professional Title</label>
                                    <input
                                       value={draftData.title}
                                       onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                                       className="w-full bg-background border border-border p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                 </div>
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">Bio/Objective</label>
                                    <textarea
                                       value={draftData.bio}
                                       onChange={(e) => setDraftData({ ...draftData, bio: e.target.value })}
                                       rows={4}
                                       className="w-full bg-background border border-border p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none leading-relaxed"
                                    />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">Location</label>
                                       <div className="relative">
                                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                          <input
                                             value={draftData.location || ""}
                                             onChange={(e) => setDraftData({ ...draftData, location: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-9 pr-3 rounded-xl text-sm font-bold outline-none"
                                          />
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">Email</label>
                                       <div className="relative">
                                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                          <input
                                             value={draftData.email || ""}
                                             onChange={(e) => setDraftData({ ...draftData, email: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-9 pr-3 rounded-xl text-sm font-bold outline-none"
                                          />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">LinkedIn URL</label>
                                       <div className="relative">
                                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                          <input
                                             value={draftData.linkedin || ""}
                                             onChange={(e) => setDraftData({ ...draftData, linkedin: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-9 pr-3 rounded-xl text-sm font-bold outline-none"
                                             placeholder="linkedin.com/in/..."
                                          />
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">GitHub URL</label>
                                       <div className="relative">
                                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                          <input
                                             value={draftData.github || ""}
                                             onChange={(e) => setDraftData({ ...draftData, github: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-9 pr-3 rounded-xl text-sm font-bold outline-none"
                                             placeholder="github.com/..."
                                          />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">X (Twitter) URL</label>
                                       <div className="relative">
                                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                          <input
                                             value={draftData.twitter || ""}
                                             onChange={(e) => setDraftData({ ...draftData, twitter: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-9 pr-3 rounded-xl text-sm font-bold outline-none"
                                             placeholder="x.com/..."
                                          />
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 opacity-0 pointer-events-none">
                                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] ml-1">Empty</label>
                                       <input className="w-full bg-background border border-border py-3 rounded-xl text-sm font-bold outline-none" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </section>

                        {/* Experience Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 mb-10 animate-fade-in group/card">
                           <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                           <div className="flex items-center justify-between mb-8 relative">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Briefcase className="w-4 h-4" />
                                 </div>
                                 <h3 className="text-base font-black text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                    Work History
                                 </h3>
                                 <button
                                    onClick={() => toggleVisibility('experience')}
                                    className={`p-1.5 rounded-lg transition-all ${draftData.visibility?.experience ? 'bg-emerald-500/10 text-emerald-500' : 'bg-background-tertiary text-text-muted hover:bg-background-secondary'}`}
                                 >
                                    {draftData.visibility?.experience ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                 </button>
                              </div>
                              <button
                                 onClick={() => {
                                    const next = [...(draftData.experience || [])];
                                    next.unshift({ title: "New Role", company: "Company Name", period: "2024 - Present", description: "Describe your impact..." });
                                    setDraftData({ ...draftData, experience: next, visibility: { ...(draftData.visibility || DEFAULT_VISIBILITY), experience: true } });
                                 }}
                                 className="text-[10px] font-black text-emerald-500 flex items-center gap-1 hover:underline"
                              >
                                 <Plus className="w-3 h-3" /> ADD EXPERIENCE
                              </button>
                           </div>

                           <div className={`flex flex-col gap-4 transition-opacity duration-300 ${draftData.visibility?.experience ? 'opacity-100' : 'opacity-40'}`}>
                              {(draftData.experience || []).map((exp, idx) => (
                                 <div key={idx} className="p-4 bg-background border border-border rounded-xl flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                       <input
                                          className="bg-transparent font-bold text-sm outline-none w-full"
                                          value={exp.title}
                                          onChange={(e) => {
                                             const next = [...(draftData.experience || [])];
                                             next[idx].title = e.target.value;
                                             setDraftData({ ...draftData, experience: next });
                                          }}
                                       />
                                       <div className="flex items-center gap-1">
                                          <div className="flex flex-col">
                                             <button
                                                disabled={idx === 0}
                                                onClick={() => moveItem('experience', idx, 'up')}
                                                className="p-1 text-text-muted hover:text-emerald-500 disabled:opacity-20 transition-all"
                                             >
                                                <ChevronUp className="w-3.5 h-3.5" />
                                             </button>
                                             <button
                                                disabled={idx === (draftData.experience || []).length - 1}
                                                onClick={() => moveItem('experience', idx, 'down')}
                                                className="p-1 text-text-muted hover:text-emerald-500 disabled:opacity-20 transition-all"
                                             >
                                                <ChevronDown className="w-3.5 h-3.5" />
                                             </button>
                                          </div>
                                          <button
                                             onClick={() => {
                                                const next = (draftData.experience || []).filter((_, i) => i !== idx);
                                                setDraftData({ ...draftData, experience: next });
                                             }}
                                             className="text-text-muted hover:text-red-500 transition-colors ml-1"
                                          >
                                             <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                    </div>
                                    <input
                                       className="bg-transparent text-[10px] text-emerald-500 font-black uppercase tracking-widest outline-none w-full border-b border-border/50 pb-1 focus:border-emerald-500/50 transition-colors"
                                       value={exp.company}
                                       onChange={(e) => {
                                          const next = [...(draftData.experience || [])];
                                          next[idx].company = e.target.value;
                                          setDraftData({ ...draftData, experience: next });
                                       }}
                                       placeholder="Company"
                                    />
                                    <input
                                       className="bg-transparent text-[10px] text-text-muted font-bold outline-none w-full border-b border-border/50 pb-1 focus:border-emerald-500/50 transition-colors"
                                       value={exp.period}
                                       onChange={(e) => {
                                          const next = [...(draftData.experience || [])];
                                          next[idx].period = e.target.value;
                                          setDraftData({ ...draftData, experience: next });
                                       }}
                                       placeholder="Period (e.g. 2024 - Present)"
                                    />
                                    <textarea
                                       className="bg-transparent text-xs text-text-secondary w-full resize-none outline-none leading-relaxed"
                                       rows={3}
                                       value={exp.description}
                                       onChange={(e) => {
                                          const next = [...(draftData.experience || [])];
                                          next[idx].description = e.target.value;
                                          setDraftData({ ...draftData, experience: next });
                                       }}
                                    />
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* Education Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 mb-10 animate-fade-in group/card">
                           <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                           <div className="flex items-center justify-between mb-8 relative">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <GraduationCap className="w-4 h-4" />
                                 </div>
                                 <h3 className="text-base font-black text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                    Academic Journey
                                 </h3>
                                 <button
                                    onClick={() => toggleVisibility('education')}
                                    className={`p-1.5 rounded-lg transition-all ${draftData.visibility?.education ? 'bg-emerald-500/10 text-emerald-500' : 'bg-background-tertiary text-text-muted hover:bg-background-secondary'}`}
                                 >
                                    {draftData.visibility?.education ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                 </button>
                              </div>
                              <button
                                 onClick={() => {
                                    const next = [...(draftData.education || [])];
                                    next.unshift({ degree: "Degree Name", institution: "University Name", period: "2020 - 2024", detail: "Significant achievements..." });
                                    setDraftData({ ...draftData, education: next, visibility: { ...(draftData.visibility || DEFAULT_VISIBILITY), education: true } });
                                 }}
                                 className="text-[10px] font-black text-emerald-500 flex items-center gap-1 hover:underline"
                              >
                                 <Plus className="w-3 h-3" /> ADD EDUCATION
                              </button>
                           </div>

                           <div className={`flex flex-col gap-4 transition-opacity duration-300 ${draftData.visibility?.education ? 'opacity-100' : 'opacity-40'}`}>
                              {(draftData.education || []).map((edu, idx) => (
                                 <div key={idx} className="p-4 bg-background border border-border rounded-xl flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                       <input
                                          className="bg-transparent font-bold text-sm outline-none w-full"
                                          value={edu.degree}
                                          onChange={(e) => {
                                             const next = [...(draftData.education || [])];
                                             next[idx].degree = e.target.value;
                                             setDraftData({ ...draftData, education: next });
                                          }}
                                          placeholder="Degree / Certificate"
                                       />
                                       <div className="flex items-center gap-1">
                                          <div className="flex flex-col">
                                             <button
                                                disabled={idx === 0}
                                                onClick={() => moveItem('education', idx, 'up')}
                                                className="p-1 text-text-muted hover:text-emerald-500 disabled:opacity-20 transition-all"
                                             >
                                                <ChevronUp className="w-3.5 h-3.5" />
                                             </button>
                                             <button
                                                disabled={idx === (draftData.education || []).length - 1}
                                                onClick={() => moveItem('education', idx, 'down')}
                                                className="p-1 text-text-muted hover:text-emerald-500 disabled:opacity-20 transition-all"
                                             >
                                                <ChevronDown className="w-3.5 h-3.5" />
                                             </button>
                                          </div>
                                          <button
                                             onClick={() => {
                                                const next = (draftData.education || []).filter((_, i) => i !== idx);
                                                setDraftData({ ...draftData, education: next });
                                             }}
                                             className="text-text-muted hover:text-red-500 transition-colors ml-1"
                                          >
                                             <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                    </div>
                                    <input
                                       className="bg-transparent text-[10px] text-emerald-500 font-black uppercase tracking-widest outline-none w-full border-b border-border/50 pb-1 focus:border-emerald-500/50 transition-colors"
                                       value={edu.institution}
                                       onChange={(e) => {
                                          const next = [...(draftData.education || [])];
                                          next[idx].institution = e.target.value;
                                          setDraftData({ ...draftData, education: next });
                                       }}
                                       placeholder="Institution"
                                    />
                                    <input
                                       className="bg-transparent text-[10px] text-text-muted font-bold outline-none w-full border-b border-border/50 pb-1 focus:border-emerald-500/50 transition-colors"
                                       value={edu.period}
                                       onChange={(e) => {
                                          const next = [...(draftData.education || [])];
                                          next[idx].period = e.target.value;
                                          setDraftData({ ...draftData, education: next });
                                       }}
                                       placeholder="Period"
                                    />
                                    <textarea
                                       className="bg-transparent text-xs text-text-secondary w-full resize-none outline-none leading-relaxed"
                                       rows={2}
                                       value={edu.detail || ""}
                                       onChange={(e) => {
                                          const next = [...(draftData.education || [])];
                                          next[idx].detail = e.target.value;
                                          setDraftData({ ...draftData, education: next });
                                       }}
                                       placeholder="Additional details..."
                                    />
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* Projects Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 mb-10 animate-fade-in group/card">
                           <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                           <div className="flex items-center justify-between mb-8 relative">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Package className="w-4 h-4" />
                                 </div>
                                 <h3 className="text-base font-black text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                    Projects
                                 </h3>
                                 <button
                                    onClick={() => toggleVisibility('projects')}
                                    className={`p-1.5 rounded-lg transition-all ${draftData.visibility?.projects ? 'bg-emerald-500/10 text-emerald-500' : 'bg-background-tertiary text-text-muted hover:bg-background-secondary'}`}
                                 >
                                    {draftData.visibility?.projects ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                 </button>
                              </div>
                              <button
                                 onClick={() => {
                                    const next = [...(draftData.projects || [])];
                                    next.unshift({ title: "New Project", description: "What did you build?", tags: ["React"], imageUrl: undefined });
                                    setDraftData({ ...draftData, projects: next, visibility: { ...(draftData.visibility || DEFAULT_VISIBILITY), projects: true } });
                                 }}
                                 className="text-[10px] font-black text-emerald-500 flex items-center gap-1 hover:underline"
                              >
                                 <Plus className="w-3 h-3" /> ADD PROJECT
                              </button>
                           </div>
                           <div className={`flex flex-col gap-4 transition-opacity duration-300 ${draftData.visibility?.projects ? 'opacity-100' : 'opacity-40'}`}>
                              {(draftData.projects || []).map((proj, idx) => (
                                 <div key={idx} className="p-4 bg-background border border-border rounded-xl flex flex-col gap-3">

                                    {/* Project Image Upload Area */}
                                    <div className="relative group/img h-32 bg-background-tertiary rounded-xl overflow-hidden border border-dashed border-border transition-all hover:border-emerald-500/50">
                                       {proj.imageUrl ? (
                                          <>
                                             <img src={proj.imageUrl} className="w-full h-full object-cover" alt="Project Preview" />
                                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                                 {isCloudinaryConfigured ? (
                                                <CldUploadWidget 
                                                   uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
                                                   options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "shortlistme" }}
                                                   onSuccess={(result: any) => {
                                                      const url = (result.info as any)?.secure_url || (result.info as any)?.url;
                                                      if (url) {
                                                         lastUploadedUrlRef.current = url;
                                                         pendingProjectIdxRef.current = idx;
                                                      }
                                                   }}
                                                   onClose={() => {
                                                      if (lastUploadedUrlRef.current && pendingProjectIdxRef.current !== null) {
                                                         const targetIdx = pendingProjectIdxRef.current;
                                                         const targetUrl = lastUploadedUrlRef.current;
                                                         setDraftData(prev => {
                                                            if (!prev) return null;
                                                            const nextProjects = [...(prev.projects || [])];
                                                            if (nextProjects[targetIdx]) {
                                                               nextProjects[targetIdx] = { 
                                                                  ...nextProjects[targetIdx], 
                                                                  imageUrl: targetUrl 
                                                               };
                                                            }
                                                            return { ...prev, projects: nextProjects };
                                                         });
                                                         lastUploadedUrlRef.current = null;
                                                         pendingProjectIdxRef.current = null;
                                                      }
                                                   }}
                                                >
                                                   {({ open }) => (
                                                      <button 
                                                         onClick={() => {
 
                                                            if (typeof open === "function") {
 
                                                               open();
 
                                                            } else {
 
                                                               console.error("Cloudinary open function is undefined");
 
                                                            }
 
                                                         }}
                                                         className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
                                                      >
                                                         <PenTool className="w-4 h-4" />
                                                      </button>
                                              )}
                                                </CldUploadWidget>
                                             ) : (
                                                <button 
                                                   onClick={() => alert("Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment.")}
                                                   className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
                                                >
                                                   <Upload className="w-4 h-4" />
                                                </button>
                                           )}
                                             <button 
                                                onClick={() => {
                                                   const next = [...(draftData.projects || [])];
                                                   next[idx] = { ...next[idx], imageUrl: undefined };
                                                   setDraftData(prev => prev ? { ...prev, projects: next } : null);
                                                }}
                                                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-100 backdrop-blur-md transition-all border border-red-500/20 shadow-xl"
                                             >
                                                <Trash2 className="w-4 h-4" />
                                             </button>
                                          </div>
                                       </>
                                    ) : (
                                        isCloudinaryConfigured ? (
                                          <CldUploadWidget
                                             uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"} 
                                             options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "shortlistme", cropping: false }}
                                             onSuccess={(result: any) => {
                                                const url = (result.info as any)?.secure_url || (result.info as any)?.url;
                                                if (url) {
                                                   lastUploadedUrlRef.current = url;
                                                   pendingProjectIdxRef.current = idx;
                                                }
                                             }}
                                             onClose={() => {
                                                if (lastUploadedUrlRef.current && pendingProjectIdxRef.current !== null) {
                                                   const targetIdx = pendingProjectIdxRef.current;
                                                   const targetUrl = lastUploadedUrlRef.current;
                                                   setDraftData(prev => {
                                                      if (!prev) return null;
                                                      const nextProjects = [...(prev.projects || [])];
                                                      if (nextProjects[targetIdx]) {
                                                         nextProjects[targetIdx] = { 
                                                            ...nextProjects[targetIdx], 
                                                            imageUrl: targetUrl 
                                                         };
                                                      }
                                                      return { ...prev, projects: nextProjects };
                                                   });
                                                   lastUploadedUrlRef.current = null;
                                                   pendingProjectIdxRef.current = null;
                                                }
                                             }}
                                             onError={(error: any) => console.error('Project Upload Error:', error)}
                                          >
                                             {({ open }) => (
                                                <button
                                                   onClick={() => {
                                                      if (typeof open === 'function') {
                                                         open();
                                                      } else {
                                                         console.error('Cloudinary open function is undefined (Project New)');
                                                      }
                                                   }}
                                                   className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted hover:text-emerald-500 transition-colors group/btn"
                                                >
                                                   <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border group-hover/btn:scale-110 group-hover/btn:border-emerald-500/50 transition-all shadow-sm">
                                                      <ImageIcon className="w-5 h-5" />
                                                   </div>
                                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Project Showcase</span>
                                                </button>
                                             )}
                                          </CldUploadWidget>
                                       ) : (
                                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-red-500/50">
                                             <ImageIcon className="w-5 h-5" />
                                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cloudinary Missing</span>
                                          </div>
                                       )
                                     )}
                                    </div>

                                    <div className="flex items-start justify-between">
                                       <input
                                          className="bg-transparent font-bold text-sm outline-none w-full"
                                          value={proj.title}
                                          onChange={(e) => {
                                             const next = [...(draftData.projects || [])];
                                             next[idx].title = e.target.value;
                                             setDraftData({ ...draftData, projects: next });
                                          }}
                                       />
                                       <div className="flex items-center gap-1">
                                          <div className="flex flex-col">
                                             <button
                                                disabled={idx === 0}
                                                onClick={() => moveItem('projects', idx, 'up')}
                                                className="p-1 text-text-muted hover:text-emerald-500 disabled:opacity-20 transition-all"
                                             >
                                                <ChevronUp className="w-3.5 h-3.5" />
                                             </button>
                                             <button
                                                disabled={idx === (draftData.projects || []).length - 1}
                                                onClick={() => moveItem('projects', idx, 'down')}
                                                className="p-1 text-text-muted hover:text-emerald-500 disabled:opacity-20 transition-all"
                                             >
                                                <ChevronDown className="w-3.5 h-3.5" />
                                             </button>
                                          </div>
                                          <button
                                             onClick={() => {
                                                const next = (draftData.projects || []).filter((_, i) => i !== idx);
                                                setDraftData({ ...draftData, projects: next });
                                             }}
                                             className="text-text-muted hover:text-red-500 transition-colors ml-1"
                                          >
                                             <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                    </div>
                                    <input
                                       className="bg-transparent text-[10px] text-emerald-500 font-black uppercase tracking-widest outline-none w-full border-b border-border/50 pb-1 focus:border-emerald-500/50 transition-colors"
                                       value={proj.link || ""}
                                       onChange={(e) => {
                                          const next = [...(draftData.projects || [])];
                                          next[idx].link = e.target.value;
                                          setDraftData({ ...draftData, projects: next });
                                       }}
                                       placeholder="Live Link (e.g. github.com)"
                                    />
                                    <SkillTagInput
                                       className="border-b border-border/50 pb-3"
                                       skills={proj.tags || []}
                                       onChange={(newTags) => {
                                          const next = [...(draftData.projects || [])];
                                          next[idx].tags = newTags;
                                          setDraftData({ ...draftData, projects: next });
                                       }}
                                       placeholder="Add project skill..."
                                    />
                                    <textarea
                                       className="bg-transparent text-xs text-text-secondary w-full resize-none outline-none leading-relaxed"
                                       rows={2}
                                       value={proj.description}
                                       onChange={(e) => {
                                          const next = [...(draftData.projects || [])];
                                          next[idx].description = e.target.value;
                                          setDraftData({ ...draftData, projects: next });
                                       }}
                                    />
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* Skills Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 mb-10 animate-fade-in group/card">
                           <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                           <div className="flex justify-between items-center mb-8 relative">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Zap className="w-4 h-4" />
                                 </div>
                                 <h3 className="text-base font-black text-text tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                    Skills Matrix
                                 </h3>
                                 <button
                                    onClick={() => toggleVisibility('skills')}
                                    className={`p-1.5 rounded-lg transition-all ${draftData.visibility?.skills ? 'bg-emerald-500/10 text-emerald-500' : 'bg-background-tertiary text-text-muted hover:bg-background-secondary'}`}
                                 >
                                    {draftData.visibility?.skills ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                 </button>
                              </div>
                           </div>
                           <div className="relative">
                              <SkillTagInput
                                 skills={draftData.skills || []}
                                 onChange={(skills) => setDraftData({ ...draftData, skills })}
                                 placeholder="Add a core skill..."
                              />
                           </div>
                        </section>

                     </div>

                  </div>
               )}

               {/* RIGHT: PREVIEW (Always visible) */}
               <div className="flex-1 bg-background-tertiary/20 flex flex-col relative">

                  {/* Device Toggle - Floating Top Center */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center bg-background/80 backdrop-blur-md border border-border p-1 rounded-xl shadow-xl transition-all duration-300">
                     <button
                        onClick={() => setDevice("laptop")}
                        className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${device === "laptop" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-text-muted hover:text-text"}`}
                     >
                        <Laptop className="w-4 h-4" />
                        {device === "laptop" && <span className="pr-1">Desktop</span>}
                     </button>
                     <button
                        onClick={() => setDevice("mobile")}
                        className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${device === "mobile" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-text-muted hover:text-text"}`}
                     >
                        <Smartphone className="w-4 h-4" />
                        {device === "mobile" && <span className="pr-1">Mobile</span>}
                     </button>
                  </div>


                  {/* The Actual Display Plane */}
                  <div className={`flex-1 flex justify-center items-start pt-32 pb-16 ${isEditing ? 'scale-[0.85] 2xl:scale-100 origin-top' : ''} transition-transform duration-500`}>

                     {device === "laptop" ? (() => {
                        const styles = getThemeStyles(draftData);
                        return (
                           <div
                              className={`shadow-2xl rounded-3xl border overflow-hidden transition-all duration-700 flex flex-col ${isEditing ? 'max-w-[1200px] w-full' : 'w-full'}`}
                              style={{ backgroundColor: styles.surface, color: styles.text, borderColor: styles.border }}
                           >
                              <PortfolioRenderer data={draftData} isMobilePreview={false} />
                              <PublicFooter
                                 primaryColor={styles.primaryHex}
                                 backgroundColor={styles.surface}
                                 textColor={styles.text}
                                 accentTextColor={styles.accentText}
                                 borderColor={styles.border}
                              />
                           </div>
                        );
                     })() : (() => {
                        const styles = getThemeStyles(draftData);
                        return (
                           /* Mobile Frame - Increased width to ~360px for better realism and space */
                           <div className="relative mx-auto border-[10px] border-[#111] rounded-[3rem] h-[750px] w-[360px] shadow-2xl overflow-hidden animate-fade-up ring-1 ring-white/10 flex flex-col">
                              <div className="absolute top-0 inset-x-0 h-7 bg-[#111] z-20 flex items-center justify-center shrink-0">
                                 <div className="w-24 h-4.5 bg-black rounded-full" />
                              </div>
                              <div
                                 className="flex-1 overflow-y-auto no-scrollbar pt-6"
                                 style={{ backgroundColor: styles.surface, color: styles.text }}
                              >
                                 <PortfolioRenderer data={draftData} isMobilePreview={true} />
                                 <PublicFooter
                                    primaryColor={styles.primaryHex}
                                    backgroundColor={styles.surface}
                                    textColor={styles.text}
                                    accentTextColor={styles.accentText}
                                    borderColor={styles.border}
                                 />
                              </div>
                           </div>
                        );
                     })()}

                  </div>

               </div>

            </div>
            </DashboardErrorBoundary>
         </div>
      </div>
   );
}
