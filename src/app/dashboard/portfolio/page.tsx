"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
   ImageOff,
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
   ChevronRight,
   Camera,
   User,
   Briefcase,
   Zap,
   Sparkles,
   GraduationCap,
   Package,
   Link2,
   Lock,
   Settings2,
   Phone
} from "lucide-react";
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import { motion, AnimatePresence } from "framer-motion";


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

import { useToast } from "@/components/ToastContext";

interface PreviewState {
   portfolio: { id: string; slug: string; isPublic: boolean } | null;
   latestVersion: { id: string; data: PortfolioData; createdAt: string } | null;
   isLive: boolean;
}

// ── Inspector UI Components ──────────────────────────

const InspectorSection = ({ 
   id, 
   title, 
   icon: Icon, 
   isExpanded, 
   onToggle, 
   children, 
   onVisibilityToggle, 
   isVisible,
   badge,
   actions
}: any) => {
   return (
      <div className={`border-b border-border/40 transition-all duration-300 ${isExpanded ? 'bg-emerald-500/[0.01]' : ''}`}>
         <div 
            className="flex items-center justify-between p-5 cursor-pointer group select-none"
            onClick={() => onToggle(id)}
         >
            <div className="flex items-center gap-4">
               <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 rotate-0' : 'bg-background-tertiary/50 text-text-muted group-hover:bg-background-tertiary group-hover:text-text'}`}>
                  <Icon className="w-4.5 h-4.5" />
               </div>
               <div className="flex flex-col">
                  <span className={`text-[11px] font-black uppercase tracking-[0.1em] transition-colors ${isExpanded ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>{title}</span>
                  {badge && <span className="text-[9px] text-emerald-500 font-bold mt-0.5 uppercase tracking-tighter opacity-80">{badge}</span>}
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  {actions}
                  {onVisibilityToggle && (
                     <button 
                        onClick={() => onVisibilityToggle()}
                        className={`p-1.5 rounded-lg transition-all ${isVisible ? 'text-emerald-500 bg-emerald-500/10' : 'text-text-muted hover:bg-background-tertiary'}`}
                        title={isVisible ? "Section is visible" : "Section is hidden"}
                     >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                     </button>
                  )}
               </div>
               <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
               >
                  <ChevronRight className={`w-4 h-4 transition-colors ${isExpanded ? 'text-emerald-500' : 'text-text-muted/50'}`} />
               </motion.div>
            </div>
         </div>

         <AnimatePresence initial={false}>
            {isExpanded && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
               >
                  <div className="px-5 pb-10 flex flex-col gap-8">
                     {children}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};



function PortfolioSkeleton() {
   return (
      <div className="flex-1 flex flex-col pt-12 animate-pulse">
         <div className="max-w-[1700px] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-24">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div className="flex-1 space-y-3">
                  <div className="h-10 w-64 skeleton" />
                  <div className="h-4 w-96 skeleton" />
               </div>
               <div className="flex gap-3">
                  <div className="h-10 w-32 skeleton rounded-xl" />
                  <div className="h-10 w-32 skeleton rounded-xl" />
               </div>
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col xl:flex-row gap-8">
               <div className="xl:w-[450px] shrink-0 space-y-6">
                  <div className="h-[600px] w-full skeleton rounded-[2rem]" />
               </div>
               <div className="flex-1">
                  <div className="h-[800px] w-full bg-background-tertiary/20 border border-border rounded-[3rem] skeleton" />
               </div>
            </div>
         </div>
      </div>
   );
}

function PortfolioManagementContent() {
   const searchParams = useSearchParams();
   const [state, setState] = useState<PreviewState | null>(null);
   const [draftData, setDraftData] = useState<PortfolioData | null>(null);

   const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

   const [loading, setLoading] = useState(true);
   const [publishing, setPublishing] = useState(false);
   const [togglingPublic, setTogglingPublic] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [device, setDevice] = useState<"laptop" | "mobile">("laptop");

   // Check for edit query param
   useEffect(() => {
      const editMode = searchParams.get("edit");
      if (editMode === "true") {
         setIsEditing(true);
      }
   }, [searchParams]);

   // Inspector UI State
   const [expandedSections, setExpandedSections] = useState<string[]>(["identity"]);

   const toggleSection = (id: string) => {
      setExpandedSections(prev => 
         prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
   };

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

   const { showToast } = useToast();

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
         showToast("Portfolio is now live!", "success");
      } catch (err) {
         console.error(err);
         showToast("Failed to update visibility settings.", "error");
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
         showToast("Changes published successfully!", "success");
      } catch (err: any) {
         showToast(err.message || "Failed to publish changes.", "error");
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
      return <PortfolioSkeleton />;
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
                     Portfolio Studio<span className="text-emerald-500">.</span>
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
               <div className="flex flex-col xl:flex-row gap-8 items-start transition-all duration-500">

               {/* LEFT: EDITOR (Only in Edit Mode) */}
               {isEditing && (
                  <div className="w-[420px] flex-shrink-0 border border-border bg-background rounded-[3rem] flex flex-col animate-slide-in-left xl:sticky xl:top-[120px] xl:h-[calc(100vh-180px)] overflow-hidden shadow-2xl shadow-emerald-500/[0.03]">
                     <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
                        <div className="flex-1 flex flex-col bg-background-secondary/10 pb-32">

                        <InspectorSection
                           id="themes"
                           title="Brand Themes"
                           icon={Sparkles}
                           isExpanded={expandedSections.includes("themes")}
                           onToggle={toggleSection}
                           badge={draftData.themeId === "custom" ? "Custom Mode" : `${PRESET_THEMES.find(t => t.id === draftData.themeId)?.name} Active`}
                        >
                           <div className="grid grid-cols-2 gap-3">
                              {PRESET_THEMES.map(t => (
                                 <button
                                    key={t.id}
                                    onClick={() => setDraftData({ ...draftData, themeId: t.id, themeMode: t.mode })}
                                    className={`group relative flex items-center gap-3 p-2 rounded-2xl transition-all border-2 ${draftData.themeId === t.id ? 'bg-background-secondary/10' : 'border-transparent bg-background hover:bg-background-tertiary'}`}
                                    style={{
                                       borderColor: draftData.themeId === t.id ? t.hex : 'transparent',
                                       boxShadow: draftData.themeId === t.id ? `0 0 15px ${t.hex}22` : 'none'
                                    }}
                                 >
                                    {/* Category Badge (Trending, New, etc.) */}
                                    {t.badge && (
                                       <div className="absolute -top-1.5 -right-1 z-10">
                                          <motion.span 
                                             initial={{ scale: 0.8, opacity: 0, y: 5 }}
                                             animate={{ scale: 1, opacity: 1, y: 0 }}
                                             className="px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase tracking-tighter rounded-md shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                                          >
                                             {t.badge}
                                          </motion.span>
                                       </div>
                                    )}

                                    <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${t.gradient} shadow-sm overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105`}>
                                       {draftData.themeId === t.id && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                    </div>
                                    <span
                                       className={`text-[9px] font-bold uppercase tracking-wider text-left transition-colors ${draftData.themeId === t.id ? 'text-text' : 'text-text-muted group-hover:text-text'}`}
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
                                 className={`group relative flex items-center gap-3 p-2 rounded-2xl transition-all border-2 ${draftData.themeId === "custom" ? 'bg-background-secondary/10' : 'border-transparent bg-background hover:bg-background-tertiary'}`}
                                 style={{
                                    borderColor: draftData.themeId === "custom" ? (draftData.customColor || '#10b981') : 'transparent',
                                    boxShadow: draftData.themeId === "custom" ? `0 0 15px ${draftData.customColor || '#10b981'}22` : 'none'
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
                                    className={`text-[9px] font-bold uppercase tracking-wider ${draftData.themeId === "custom" ? 'text-text' : 'text-text-muted'}`}
                                    style={{ color: draftData.themeId === "custom" ? (draftData.customColor || '#10b981') : undefined }}
                                 >
                                    Custom
                                 </span>
                              </button>
                           </div>

                           {draftData.themeId === "custom" && (
                              <div className="mt-2 flex flex-col gap-3 animate-fade-in">
                                 <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Palette Control</label>
                                 <div className="grid grid-cols-1 gap-2">
                                    {[
                                       { label: 'Primary Accent', key: 'customColor', default: '#10b981' },
                                       { label: 'Text on Accent', key: 'customAccentText', default: '#ffffff' },
                                       { label: 'Page Background', key: 'customBg', default: '#ffffff' },
                                       { label: 'General Text', key: 'customText', default: '#0f172a' }
                                    ].map((item) => (
                                       <div key={item.key} className="flex items-center justify-between p-2.5 bg-background/40 border border-border/50 rounded-xl hover:border-border transition-colors">
                                          <span className="text-[10px] font-bold text-text-secondary">{item.label}</span>
                                          <div className="flex items-center gap-3">
                                             <input
                                                type="text"
                                                value={(draftData as any)[item.key] || item.default}
                                                onChange={(e) => setDraftData({ ...draftData, [item.key]: e.target.value, themeId: "custom" })}
                                                className="w-16 bg-transparent text-[9px] font-black outline-none uppercase text-right text-text/70"
                                             />
                                             <input
                                                type="color"
                                                value={(draftData as any)[item.key] || item.default}
                                                onChange={(e) => setDraftData({ ...draftData, [item.key]: e.target.value, themeId: "custom" })}
                                                className="w-7 h-7 rounded-lg overflow-hidden cursor-pointer border-none bg-border p-0 shadow-sm"
                                             />
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </InspectorSection>

                        {/* Photo & Identity Section */}
                        <InspectorSection
                           id="identity"
                           title="Professional Identity"
                           icon={User}
                           isExpanded={expandedSections.includes("identity")}
                           onToggle={toggleSection}
                        >
                           <div className="flex flex-col gap-8">
                              {/* Modern Profile Photo Upload */}
                              <div className="flex flex-col items-center gap-6">
                                 <div className="relative group/profile shrink-0">
                                    {isCloudinaryConfigured ? (
                                       <CldUploadWidget
                                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
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
                                       >
                                          {({ open }) => (
                                             <div 
                                                onClick={() => open?.()}
                                                className="w-48 h-32 rounded-3xl bg-background-tertiary/30 overflow-hidden border border-border/50 transition-all hover:border-emerald-500/50 flex items-center justify-center shadow-inner cursor-pointer hover:bg-background-tertiary/50 group"
                                             >
                                                {draftData.photoUrl ? (
                                                   <img src={draftData.photoUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Profile" />
                                                ) : (
                                                   <div className="flex flex-col items-center gap-2 text-text-muted/40 group-hover:text-emerald-500/50 transition-colors">
                                                      <ImageIcon className="w-8 h-8" />
                                                      <span className="text-[8px] font-black uppercase tracking-tighter">Click to upload</span>
                                                   </div>
                                                )}
                                                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-background group-hover:scale-110 transition-transform">
                                                   <Camera className="w-3.5 h-3.5 text-white" />
                                                </div>
                                             </div>
                                          )}
                                       </CldUploadWidget>
                                    ) : (
                                       <div className="w-48 h-32 rounded-3xl bg-background-tertiary/30 overflow-hidden border border-border/50 flex items-center justify-center shadow-inner">
                                          {draftData.photoUrl ? (
                                             <img src={draftData.photoUrl} className="w-full h-full object-cover" alt="Profile" />
                                          ) : (
                                             <ImageIcon className="w-8 h-8 text-text-muted/40" />
                                          )}
                                       </div>
                                    )}
                                 </div>

                                 <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
                                    {draftData.photoUrl ? (
                                       <div className="flex items-center gap-2 w-full">
                                          {isCloudinaryConfigured ? (
                                             <CldUploadWidget
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
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
                                             >
                                                {({ open }) => (
                                                   <button
                                                      onClick={() => open?.()}
                                                      className="flex-1 py-2 px-3 bg-background border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-text transition-all flex items-center justify-center gap-2 shadow-sm"
                                                   >
                                                      <PenTool className="w-3 h-3" /> Change
                                                   </button>
                                                )}
                                             </CldUploadWidget>
                                          ) : null}
                                          <button
                                             onClick={() => setDraftData({ ...draftData, photoUrl: null })}
                                             className="py-2 px-3 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-all flex items-center justify-center gap-2"
                                          >
                                             <Trash2 className="w-3 h-3" />
                                          </button>
                                       </div>
                                    ) : (
                                       isCloudinaryConfigured ? (
                                          <CldUploadWidget
                                             uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
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
                                          >
                                             {({ open }) => (
                                                <button
                                                   onClick={() => open?.()}
                                                   className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                                >
                                                   <Upload className="w-3.5 h-3.5" /> Upload Photo
                                                </button>
                                             )}
                                          </CldUploadWidget>
                                       ) : (
                                          <div className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/5 border border-red-500/10 p-2 rounded-xl">Cloudinary Missing</div>
                                       )
                                    )}
                                    <p className="text-[9px] text-center text-text-muted font-medium leading-tight">Recommended: High-resolution headshot for better visual impact.</p>
                                 </div>
                              </div>

                              <div className="flex flex-col gap-6">
                                 <div className="group/field">
                                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 mb-1.5 block transition-colors group-focus-within/field:text-emerald-500">Full Name</label>
                                    <input
                                       value={draftData.name}
                                       onChange={(e) => setDraftData({ ...draftData, name: e.target.value })}
                                       className="w-full bg-background border border-border p-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all shadow-sm"
                                    />
                                 </div>
                                 <div className="group/field">
                                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 mb-1.5 block transition-colors group-focus-within/field:text-emerald-500">Professional Title</label>
                                    <input
                                       value={draftData.title}
                                       onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                                       className="w-full bg-background border border-border p-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all shadow-sm"
                                       placeholder="e.g. Senior Software Engineer"
                                    />
                                 </div>
                                 <div className="group/field">
                                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 mb-1.5 block transition-colors group-focus-within/field:text-emerald-500">Bio / Brand Story</label>
                                    <textarea
                                       value={draftData.bio}
                                       onChange={(e) => setDraftData({ ...draftData, bio: e.target.value })}
                                       rows={4}
                                       className="w-full bg-background border border-border p-3 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all resize-none leading-relaxed shadow-sm"
                                       placeholder="Tell your story..."
                                    />
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-3">
                                    <div className="group/field">
                                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 mb-1.5 block transition-colors group-focus-within/field:text-emerald-500">Location</label>
                                       <div className="relative">
                                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within/field:text-emerald-500 transition-colors" />
                                          <input
                                             value={draftData.location || ""}
                                             onChange={(e) => setDraftData({ ...draftData, location: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-10 pr-3 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/50 transition-all shadow-sm"
                                          />
                                       </div>
                                    </div>
                                    <div className="group/field">
                                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 mb-1.5 block transition-colors group-focus-within/field:text-emerald-500">Public Email</label>
                                       <div className="relative">
                                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within/field:text-emerald-500 transition-colors" />
                                          <input
                                             value={draftData.email || ""}
                                             onChange={(e) => setDraftData({ ...draftData, email: e.target.value })}
                                             className="w-full bg-background border border-border py-3 pl-10 pr-3 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/50 transition-all shadow-sm"
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="group/field">
                                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 mb-1.5 block transition-colors group-focus-within/field:text-emerald-500">Phone Number</label>
                                    <div className="relative">
                                       <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within/field:text-emerald-500 transition-colors" />
                                       <input
                                          value={draftData.phone || ""}
                                          onChange={(e) => setDraftData({ ...draftData, phone: e.target.value })}
                                          className="w-full bg-background border border-border py-3 pl-10 pr-3 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/50 transition-all shadow-sm"
                                          placeholder="+1 (555) 000-0000"
                                       />
                                    </div>
                                 </div>

                                 <div className="p-4 bg-background-tertiary/20 rounded-2xl border border-border/40 flex flex-col gap-4">
                                    <label className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em] text-center border-b border-border/20 pb-2">Social Networking</label>
                                    <div className="flex flex-col gap-3">
                                       <div className="relative group/field">
                                          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted/50 group-focus-within/field:text-emerald-500 transition-colors" />
                                          <input
                                             value={draftData.linkedin || ""}
                                             onChange={(e) => setDraftData({ ...draftData, linkedin: e.target.value })}
                                             className="w-full bg-background/60 border border-border/60 py-2.5 pl-10 pr-3 rounded-xl text-[11px] font-bold outline-none focus:bg-background focus:border-emerald-500/50 transition-all shadow-sm"
                                             placeholder="LinkedIn URL"
                                          />
                                       </div>
                                       <div className="relative group/field">
                                          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted/50 group-focus-within/field:text-emerald-500 transition-colors" />
                                          <input
                                             value={draftData.github || ""}
                                             onChange={(e) => setDraftData({ ...draftData, github: e.target.value })}
                                             className="w-full bg-background/60 border border-border/60 py-2.5 pl-10 pr-3 rounded-xl text-[11px] font-bold outline-none focus:bg-background focus:border-emerald-500/50 transition-all shadow-sm"
                                             placeholder="GitHub URL"
                                          />
                                       </div>
                                       <div className="relative group/field">
                                          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted/50 group-focus-within/field:text-emerald-500 transition-colors" />
                                          <input
                                             value={draftData.twitter || ""}
                                             onChange={(e) => setDraftData({ ...draftData, twitter: e.target.value })}
                                             className="w-full bg-background/60 border border-border/60 py-2.5 pl-10 pr-3 rounded-xl text-[11px] font-bold outline-none focus:bg-background focus:border-emerald-500/50 transition-all shadow-sm"
                                             placeholder="X (Twitter) URL"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </InspectorSection>

                        {/* Experience Section */}
                        <InspectorSection
                           id="experience"
                           title="Work History"
                           icon={Briefcase}
                           isExpanded={expandedSections.includes("experience")}
                           onToggle={toggleSection}
                           visibilityControlled
                           isVisible={draftData.visibility?.experience}
                           onVisibilityToggle={() => toggleVisibility('experience')}
                           badge={`${(draftData.experience || []).length} Roles`}
                        >
                           <div className="flex flex-col gap-4">
                              <button
                                 onClick={() => {
                                    const next = [...(draftData.experience || [])];
                                    next.unshift({ title: "New Role", company: "Company Name", period: "2024 - Present", description: "Describe your impact..." });
                                    setDraftData({ ...draftData, experience: next, visibility: { ...(draftData.visibility || DEFAULT_VISIBILITY), experience: true } });
                                 }}
                                 className="w-full py-3 border border-dashed border-emerald-500/30 rounded-2xl text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 mb-2 shadow-sm"
                              >
                                 <Plus className="w-3.5 h-3.5" /> Append Experience
                              </button>

                              <div className="space-y-4">
                                 {(draftData.experience || []).map((exp, idx) => (
                                    <div key={idx} className="group/item relative p-4 bg-background/50 border border-border/60 rounded-2xl flex flex-col gap-3 hover:border-emerald-500/30 transition-all shadow-sm">
                                       <div className="flex items-start justify-between gap-3">
                                          <input
                                             className="flex-1 bg-transparent font-black text-xs outline-none text-text group-focus-within/item:text-emerald-500 transition-colors"
                                             value={exp.title}
                                             onChange={(e) => {
                                                const next = [...(draftData.experience || [])];
                                                next[idx].title = e.target.value;
                                                setDraftData({ ...draftData, experience: next });
                                             }}
                                             placeholder="Job Title"
                                          />
                                          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                             <div className="flex items-center bg-background border border-border rounded-lg p-0.5">
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
                                                className="p-1.5 text-text-muted hover:text-red-500 bg-red-500/5 border border-red-500/10 rounded-lg transition-colors"
                                             >
                                                <Trash2 className="w-3.5 h-3.5" />
                                             </button>
                                          </div>
                                       </div>
                                       
                                       <div className="grid grid-cols-2 gap-2">
                                          <div className="relative">
                                             <input
                                                className="w-full bg-background-tertiary/20 border border-border/40 py-1.5 px-3 rounded-lg text-[10px] text-emerald-500 font-black uppercase tracking-widest outline-none focus:border-emerald-500/50 transition-colors"
                                                value={exp.company}
                                                onChange={(e) => {
                                                   const next = [...(draftData.experience || [])];
                                                   next[idx].company = e.target.value;
                                                   setDraftData({ ...draftData, experience: next });
                                                }}
                                                placeholder="Company"
                                             />
                                          </div>
                                          <div className="relative">
                                             <input
                                                className="w-full bg-background-tertiary/20 border border-border/40 py-1.5 px-3 rounded-lg text-[10px] text-text-muted font-bold outline-none focus:border-emerald-500/50 transition-colors text-right"
                                                value={exp.period}
                                                onChange={(e) => {
                                                   const next = [...(draftData.experience || [])];
                                                   next[idx].period = e.target.value;
                                                   setDraftData({ ...draftData, experience: next });
                                                }}
                                                placeholder="Period"
                                             />
                                          </div>
                                       </div>

                                       <textarea
                                          className="bg-transparent text-[11px] text-text-secondary w-full resize-none outline-none leading-relaxed border-t border-border/20 pt-2 transition-colors focus:text-text"
                                          rows={3}
                                          value={exp.description}
                                          onChange={(e) => {
                                             const next = [...(draftData.experience || [])];
                                             next[idx].description = e.target.value;
                                             setDraftData({ ...draftData, experience: next });
                                          }}
                                          placeholder="Roles and responsibilities..."
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </InspectorSection>


                        {/* Education Section */}
                        <InspectorSection
                           id="education"
                           title="Academic Journey"
                           icon={GraduationCap}
                           isExpanded={expandedSections.includes("education")}
                           onToggle={toggleSection}
                           visibilityControlled
                           isVisible={draftData.visibility?.education}
                           onVisibilityToggle={() => toggleVisibility('education')}
                           badge={`${(draftData.education || []).length} Degrees`}
                        >
                           <div className="flex flex-col gap-4">
                              <button
                                 onClick={() => {
                                    const next = [...(draftData.education || [])];
                                    next.unshift({ degree: "Degree Name", institution: "University Name", period: "2020 - 2024", detail: "Significant achievements..." });
                                    setDraftData({ ...draftData, education: next, visibility: { ...(draftData.visibility || DEFAULT_VISIBILITY), education: true } });
                                 }}
                                 className="w-full py-3 border border-dashed border-emerald-500/30 rounded-2xl text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 mb-2 shadow-sm"
                              >
                                 <Plus className="w-3.5 h-3.5" /> Append Education
                              </button>

                              <div className="space-y-4">
                                 {(draftData.education || []).map((edu, idx) => (
                                    <div key={idx} className="group/item relative p-4 bg-background/50 border border-border/60 rounded-2xl flex flex-col gap-3 hover:border-emerald-500/30 transition-all shadow-sm">
                                       <div className="flex items-start justify-between gap-3">
                                          <input
                                             className="flex-1 bg-transparent font-black text-xs outline-none text-text group-focus-within/item:text-emerald-500 transition-colors"
                                             value={edu.degree}
                                             onChange={(e) => {
                                                const next = [...(draftData.education || [])];
                                                next[idx].degree = e.target.value;
                                                setDraftData({ ...draftData, education: next });
                                             }}
                                             placeholder="Degree / Certificate"
                                          />
                                          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                             <div className="flex items-center bg-background border border-border rounded-lg p-0.5">
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
                                                className="p-1.5 text-text-muted hover:text-red-500 bg-red-500/5 border border-red-500/10 rounded-lg transition-colors"
                                             >
                                                <Trash2 className="w-3.5 h-3.5" />
                                             </button>
                                          </div>
                                       </div>

                                       <div className="grid grid-cols-2 gap-2">
                                          <input
                                             className="w-full bg-background-tertiary/20 border border-border/40 py-1.5 px-3 rounded-lg text-[10px] text-emerald-500 font-black uppercase tracking-widest outline-none focus:border-emerald-500/50 transition-colors"
                                             value={edu.institution}
                                             onChange={(e) => {
                                                const next = [...(draftData.education || [])];
                                                next[idx].institution = e.target.value;
                                                setDraftData({ ...draftData, education: next });
                                             }}
                                             placeholder="Institution"
                                          />
                                          <input
                                             className="w-full bg-background-tertiary/20 border border-border/40 py-1.5 px-3 rounded-lg text-[10px] text-text-muted font-bold outline-none focus:border-emerald-500/50 transition-colors text-right"
                                             value={edu.period}
                                             onChange={(e) => {
                                                const next = [...(draftData.education || [])];
                                                next[idx].period = e.target.value;
                                                setDraftData({ ...draftData, education: next });
                                             }}
                                             placeholder="Period"
                                          />
                                       </div>

                                       <textarea
                                          className="bg-transparent text-[11px] text-text-secondary w-full resize-none outline-none leading-relaxed border-t border-border/20 pt-2 transition-colors focus:text-text"
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
                           </div>
                        </InspectorSection>


                        {/* Projects Section */}
                        <InspectorSection
                           id="projects"
                           title="Project Showcase"
                           icon={Package}
                           isExpanded={expandedSections.includes("projects")}
                           onToggle={toggleSection}
                           visibilityControlled
                           isVisible={draftData.visibility?.projects}
                           onVisibilityToggle={() => toggleVisibility('projects')}
                           badge={`${(draftData.projects || []).length} Items`}
                        >
                           <div className="flex flex-col gap-6">
                              <button
                                 onClick={() => {
                                    const next = [...(draftData.projects || [])];
                                    next.unshift({ title: "New Project", description: "What did you build?", tags: ["React"], imageUrl: undefined });
                                    setDraftData({ ...draftData, projects: next, visibility: { ...(draftData.visibility || DEFAULT_VISIBILITY), projects: true } });
                                 }}
                                 className="w-full py-3 border border-dashed border-emerald-500/30 rounded-2xl text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 mb-2 shadow-sm"
                              >
                                 <Plus className="w-3.5 h-3.5" /> Append Project
                              </button>

                              <div className="space-y-8">
                                 {(draftData.projects || []).map((proj, idx) => (
                                    <div key={idx} className="group/item relative p-5 bg-background/50 border border-border/60 rounded-3xl flex flex-col gap-4 hover:border-emerald-500/30 transition-all shadow-sm">
                                       <div className="flex items-start justify-between gap-3">
                                          <input
                                             className="flex-1 bg-transparent font-black text-sm outline-none text-text group-focus-within/item:text-emerald-500 transition-colors"
                                             value={proj.title}
                                             onChange={(e) => {
                                                const next = [...(draftData.projects || [])];
                                                next[idx].title = e.target.value;
                                                setDraftData({ ...draftData, projects: next });
                                             }}
                                             placeholder="Project Title"
                                          />
                                          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                             <div className="flex items-center bg-background border border-border rounded-lg p-0.5">
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
                                                className="p-1.5 text-text-muted hover:text-red-500 bg-red-500/5 border border-red-500/10 rounded-lg transition-colors"
                                             >
                                                <Trash2 className="w-3.5 h-3.5" />
                                             </button>
                                          </div>
                                       </div>

                                       {/* Image Preview / Upload */}
                                       <div className="flex flex-col gap-3">
                                          <div className="relative group/img aspect-video bg-background-tertiary/30 rounded-2xl overflow-hidden border border-border/40 transition-all hover:border-emerald-500/40 cursor-pointer group">
                                             {isCloudinaryConfigured ? (
                                                <CldUploadWidget 
                                                   uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
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
                                                               nextProjects[targetIdx] = { ...nextProjects[targetIdx], imageUrl: targetUrl };
                                                            }
                                                            return { ...prev, projects: nextProjects };
                                                         });
                                                         lastUploadedUrlRef.current = null;
                                                         pendingProjectIdxRef.current = null;
                                                      }
                                                   }}
                                                >
                                                   {({ open }) => (
                                                      <div onClick={() => open?.()} className="w-full h-full flex flex-col items-center justify-center relative">
                                                         {proj.imageUrl ? (
                                                            <img src={proj.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Project" />
                                                         ) : (
                                                            <div className="flex flex-col items-center gap-2 text-text-muted/40 group-hover:text-emerald-500/50 transition-colors">
                                                               <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:border-emerald-500/50 group-hover:scale-110 transition-all">
                                                                  <Upload className="w-5 h-5" />
                                                               </div>
                                                               <span className="text-[10px] font-black uppercase tracking-widest">Click to upload showcase</span>
                                                            </div>
                                                         )}
                                                      </div>
                                                   )}
                                                </CldUploadWidget>
                                             ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                   {proj.imageUrl ? (
                                                      <img src={proj.imageUrl} className="w-full h-full object-cover" alt="Project" />
                                                   ) : (
                                                      <ImageOff className="w-6 h-6 opacity-20" />
                                                   )}
                                                </div>
                                             )}
                                          </div>

                                          {/* Static Actions Below Image */}
                                          {proj.imageUrl && (
                                             <div className="flex items-center gap-2">
                                                {isCloudinaryConfigured ? (
                                                   <CldUploadWidget 
                                                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shortlistme_v1"}
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
                                                                  nextProjects[targetIdx] = { ...nextProjects[targetIdx], imageUrl: targetUrl };
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
                                                            onClick={() => open?.()} 
                                                            className="flex-1 py-2 px-3 bg-background border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-text transition-all flex items-center justify-center gap-2 shadow-sm"
                                                         >
                                                            <PenTool className="w-3 h-3" /> Change Image
                                                         </button>
                                                      )}
                                                   </CldUploadWidget>
                                                ) : null}
                                                <button 
                                                   onClick={() => {
                                                      const next = [...(draftData.projects || [])];
                                                      next[idx] = { ...next[idx], imageUrl: undefined };
                                                      setDraftData({ ...draftData, projects: next });
                                                   }}
                                                   className="py-2 px-3 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-all flex items-center justify-center gap-2"
                                                >
                                                   <Trash2 className="w-3 h-3" /> Remove
                                                </button>
                                             </div>
                                          )}
                                       </div>

                                       <div className="flex flex-col gap-4">
                                          <div className="group/field">
                                             <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Live Project URL</label>
                                             <div className="relative">
                                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted/50" />
                                                <input
                                                   className="w-full bg-background-tertiary/20 border border-border/40 py-2.5 pl-9 pr-3 rounded-xl text-[11px] font-bold outline-none focus:border-emerald-500/50 transition-colors"
                                                   value={proj.link || ""}
                                                   onChange={(e) => {
                                                      const next = [...(draftData.projects || [])];
                                                      next[idx].link = e.target.value;
                                                      setDraftData({ ...draftData, projects: next });
                                                   }}
                                                   placeholder="e.g. github.com/username/project"
                                                />
                                             </div>
                                          </div>

                                          <div className="group/field">
                                             <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Tech Stack</label>
                                             <SkillTagInput
                                                className="bg-background-tertiary/20 border border-border/40 rounded-xl px-2 py-1"
                                                skills={proj.tags || []}
                                                onChange={(newTags) => {
                                                   const next = [...(draftData.projects || [])];
                                                   next[idx].tags = newTags;
                                                   setDraftData({ ...draftData, projects: next });
                                                }}
                                                placeholder="Add tools used..."
                                             />
                                          </div>

                                          <div className="group/field">
                                             <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Project Narrative</label>
                                             <textarea
                                                className="w-full bg-background-tertiary/20 border border-border/40 p-3 rounded-xl text-[11px] text-text-secondary resize-none outline-none leading-relaxed focus:border-emerald-500/50 transition-colors"
                                                rows={3}
                                                value={proj.description}
                                                onChange={(e) => {
                                                   const next = [...(draftData.projects || [])];
                                                   next[idx].description = e.target.value;
                                                   setDraftData({ ...draftData, projects: next });
                                                }}
                                                placeholder="Share the story behind this build..."
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </InspectorSection>


                        {/* Skills Section */}
                        <InspectorSection
                           id="skills"
                           title="Skills Matrix"
                           icon={Zap}
                           isExpanded={expandedSections.includes("skills")}
                           onToggle={toggleSection}
                           visibilityControlled
                           isVisible={draftData.visibility?.skills}
                           onVisibilityToggle={() => toggleVisibility('skills')}
                           badge={`${(draftData.skills || []).length} Competencies`}
                        >
                           <div className="flex flex-col gap-4">
                              <SkillTagInput
                                 className="bg-background-tertiary/20 border border-border/40 rounded-2xl p-4 min-h-[120px]"
                                 skills={draftData.skills || []}
                                 onChange={(skills) => setDraftData({ ...draftData, skills })}
                                 placeholder="Add a core competency..."
                              />
                              <p className="text-[9px] text-text-muted font-medium px-2 italic">Press Enter or comma to add multiple skills. These will be displayed as professional badges on your portfolio.</p>
                           </div>
                        </InspectorSection>


                        </div>
                     </div>
                  </div>
               )}

               {/* RIGHT: PREVIEW (Always visible) */}
               <div className="flex-1 bg-background-tertiary/5 border border-border/50 rounded-[3rem] flex flex-col relative xl:sticky xl:top-[120px] xl:h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">

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

export default function PortfolioManagement() {
   return (
      <Suspense fallback={<PortfolioSkeleton />}>
         <PortfolioManagementContent />
      </Suspense>
   );
}
