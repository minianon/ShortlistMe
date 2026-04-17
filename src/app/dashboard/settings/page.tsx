"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Globe, 
  CheckCircle2, 
  Loader2, 
  X, 
  User, 
  Settings2, 
  BellRing, 
  ChevronRight, 
  ShieldCheck, 
  Copy, 
  ExternalLink, 
  Zap, 
  Check,
  ShieldAlert,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

type Tab = "Profile" | "General" | "Notifications" | "Advanced";

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-20 animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab handling with persistence
  const activeTab = useMemo(() => {
    const t = searchParams.get("tab") as Tab;
    const validTabs: Tab[] = ["Profile", "General", "Notifications", "Advanced"];
    return (validTabs.includes(t) ? t : "Profile") as Tab;
  }, [searchParams]);

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  // State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [initialSlug, setInitialSlug] = useState<string | null>(null);
  const [slugLoading, setSlugLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState(false);
  const [saveSlugStatus, setSaveSlugStatus] = useState<"idle" | "success" | "error">("idle");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [copied, setCopied] = useState(false);

  // App URL prefix
  const [appUrl, setAppUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppUrl(window.location.host + "/");
    }
  }, []);

  // Settings State
  const [publicVisibility, setPublicVisibility] = useState(true);
  const [notifPortfolio, setNotifPortfolio] = useState(true);
  
  // Destructive Action States
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      
      const meta = user.unsafeMetadata;
      if (meta?.publicVisibility !== undefined) setPublicVisibility(meta.publicVisibility as boolean);
      if (meta?.notifPortfolio !== undefined) setNotifPortfolio(meta.notifPortfolio as boolean);
    }
  }, [isLoaded, user]);

  const fetchPortfolio = async () => {
    const r = await fetch("/api/portfolio/status");
    const d = await r.json();
    setPortfolioSlug(d.portfolio?.slug ?? null);
    setInitialSlug(d.portfolio?.slug ?? null);
    if (d.portfolio?.isPublic !== undefined) setPublicVisibility(d.portfolio.isPublic);
  };

  useEffect(() => {
    fetchPortfolio().finally(() => setSlugLoading(false));
  }, [searchParams]);

  useEffect(() => {
    if (!portfolioSlug || portfolioSlug === initialSlug) {
      setSlugAvailable(null);
      setCheckingSlug(false);
      return;
    }
    setCheckingSlug(true);
    setSlugAvailable(null);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/portfolio/slug?slug=${portfolioSlug}`);
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch {
        setSlugAvailable(false);
      } finally {
        setCheckingSlug(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [portfolioSlug, initialSlug]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName, 
          lastName
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      await user?.reload();
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleToggle = async (key: string, currentValue: boolean, setFn: (val: boolean) => void) => {
    const newValue = !currentValue;
    setFn(newValue);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newValue }),
      });
      if (!res.ok) throw new Error("Toggle sync failed");
      await user?.reload();
    } catch (e) {
      console.error(e);
      setFn(currentValue);
    }
  };

  const handleSaveSlug = async () => {
    if (!portfolioSlug) return;
    setSavingSlug(true);
    setSaveSlugStatus("idle");
    setSlugError(null);
    try {
      const res = await fetch("/api/portfolio/slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: portfolioSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update slug");
      setSaveSlugStatus("success");
      setInitialSlug(portfolioSlug);
    } catch (e: any) {
      setSlugError(e.message);
      setSaveSlugStatus("error");
    } finally {
      setSavingSlug(false);
      setTimeout(() => setSaveSlugStatus("idle"), 3000);
    }
  };

  const handleResetPortfolio = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/portfolio/reset", { method: "POST" });
      if (!res.ok) throw new Error("Reset failed");
      await fetchPortfolio();
      showToast("Portfolio reset successfully.", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to reset portfolio.", "error");
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      showToast("Account deleted successfully.", "success");
      await signOut();
      router.push("/");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete account.", "error");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const NAV_ITEMS = [
    { id: "Profile", label: "Profile", Icon: User },
    { id: "General", label: "Brand URL", Icon: Globe },
    { id: "Notifications", label: "Alerts", Icon: BellRing },
    { id: "Advanced", label: "Advanced", Icon: ShieldAlert },
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 pb-24">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-black text-text tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Settings<span className="text-emerald-500">.</span>
        </h1>
        <p className="text-text-secondary font-medium">Configure your professional engine and personal preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <nav className="flex flex-row lg:flex-col gap-1 w-full lg:w-64 bg-background/40 backdrop-blur-md border border-border p-2 rounded-2xl overflow-x-auto no-scrollbar lg:sticky lg:top-24 z-10">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group whitespace-nowrap lg:whitespace-normal outline-none border ${isActive ? "bg-emerald-500/10 text-emerald-500 shadow-sm border-emerald-500/20" : "border-transparent text-text-secondary hover:bg-background-tertiary hover:text-text"}`}
              >
                <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-emerald-500 text-white" : "bg-background-tertiary text-text-muted group-hover:text-text"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold leading-tight">{label}</p>
                {isActive && <ChevronRight className="ml-auto w-4 h-4 hidden lg:block" />}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 w-full animate-fade-in-up" key={activeTab}>
          
          {activeTab === "Profile" && (
            <div className="flex flex-col gap-8 max-w-2xl">
              <section className="bg-background/40 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5">
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 overflow-hidden flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
                      {user?.imageUrl ? <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-4xl font-black text-emerald-500">{user?.firstName?.charAt(0) || "U"}</span>}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center shadow-lg text-emerald-500">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-text mb-1" style={{ fontFamily: "var(--font-display)" }}>Account Profile</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">Your professional identity across ShortlistMe.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Input label="First Name" value={firstName} onChange={setFirstName} placeholder="Enter first name" />
                  <Input label="Last Name" value={lastName} onChange={setLastName} placeholder="Enter last name" />
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Registered Email</label>
                    <div className="relative">
                      <input type="email" value={user?.primaryEmailAddress?.emailAddress ?? ""} disabled className="w-full bg-background-tertiary border border-border rounded-xl px-5 py-3.5 text-sm font-semibold text-text-muted outline-none cursor-not-allowed italic" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handleSaveProfile} disabled={saving} className="h-12 px-8 bg-text text-background hover:bg-text-secondary rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />}
                    Save Identity
                  </button>
                  {saveStatus === "success" && <StatusMsg type="success" text="Profile synced" />}
                  {saveStatus === "error" && <StatusMsg type="error" text="Sync failed" />}
                </div>
              </section>
            </div>
          )}

          {activeTab === "General" && (
            <div className="flex flex-col gap-8 max-w-2xl">
              <section className="bg-background/40 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-text mb-2" style={{ fontFamily: "var(--font-display)" }}>Brand URL</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Personalize your unique digital gateway.</p>
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Handle / Slug</label>
                    <div className="flex items-stretch rounded-xl overflow-hidden border border-border bg-background focus-within:border-emerald-500/40 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                      <div className="bg-background-secondary border-r border-border px-5 flex items-center">
                        <Globe className="w-4 h-4 text-text-muted" />
                        <span className="ml-2.5 text-xs font-bold text-text-secondary">{appUrl}</span>
                      </div>
                      <input 
                        type="text" 
                        value={slugLoading ? "Loading..." : (portfolioSlug ?? "")} 
                        disabled={slugLoading} 
                        onChange={(e) => setPortfolioSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} 
                        className="flex-1 bg-transparent px-5 py-4 text-sm font-black text-text outline-none placeholder:font-normal" 
                        placeholder="your-name" 
                      />
                      <div className="flex items-center pr-4 bg-background">
                        {checkingSlug && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/5 rounded-full animate-pulse border border-emerald-500/10">
                            <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Checking</span>
                          </div>
                        )}
                        {!checkingSlug && portfolioSlug !== initialSlug && portfolioSlug && (
                          slugAvailable ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Available</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                              <X className="w-3 h-3 text-red-500" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Taken</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    {slugError && <p className="text-[10px] font-bold text-red-500 mt-2 ml-1">⚠️ {slugError}</p>}
                  </div>

                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3"><Zap className="w-4 h-4 text-emerald-500 opacity-20" /></div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Current Live URL</p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-text truncate">{appUrl}<span className="text-emerald-500">{initialSlug || "..."}</span></p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { if (!initialSlug) return; navigator.clipboard.writeText(`https://${appUrl}${initialSlug}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 hover:bg-emerald-500/10 rounded-lg text-text-secondary hover:text-emerald-500 transition-colors" title="Copy Link">{copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}</button>
                        <a href={`/${initialSlug}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-emerald-500/10 rounded-lg text-text-secondary hover:text-emerald-500 transition-colors" title="Visit Profile"><ExternalLink className="w-4 h-4" /></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-border pt-8 mt-8">
                  <button 
                    onClick={handleSaveSlug} 
                    disabled={savingSlug || portfolioSlug === initialSlug || !slugAvailable || !portfolioSlug} 
                    className="h-12 px-8 bg-text text-background hover:bg-text-secondary rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {savingSlug && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Handle
                  </button>
                  {saveSlugStatus === "success" && <StatusMsg type="success" text="URL updated" />}
                </div>
              </section>

              <section className="bg-background/40 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-text mb-1" style={{ fontFamily: "var(--font-display)" }}>Public Visibility</h4>
                  <p className="text-sm text-text-secondary max-w-xs">Make your portfolio indexable and public to recruiters.</p>
                </div>
                <Toggle enabled={publicVisibility} onChange={() => handleToggle("publicVisibility", publicVisibility, setPublicVisibility)} />
              </section>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="flex flex-col gap-6 max-w-2xl">
              <section className="bg-background/40 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5">
                <div className="mb-10">
                  <h3 className="text-xl font-black text-text mb-2" style={{ fontFamily: "var(--font-display)" }}>Engagement Alerts</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Control how and when you hear from ShortlistMe.</p>
                </div>
                <div className="space-y-4">
                  {[{ label: "Portfolio Activity", desc: "Instant alerts when someone visits your link.", value: notifPortfolio, key: "notifPortfolio", set: setNotifPortfolio }].map(({ label, desc, value, key, set }) => (
                    <div key={label} className="p-6 bg-background rounded-2xl border border-border flex items-center justify-between transition-colors hover:border-emerald-500/30">
                      <div><h4 className="text-sm font-bold text-text mb-1">{label}</h4><p className="text-xs text-text-secondary">{desc}</p></div>
                      <Toggle enabled={value} onChange={() => handleToggle(key, value, set)} />
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-6 border border-emerald-500/10 bg-emerald-500/5 rounded-[1.5rem] flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0"><CheckCircle2 className="w-6 h-6" /></div>
                  <div><h4 className="text-sm font-bold text-text mb-1">Email Verified</h4><p className="text-xs text-emerald-600/70 font-medium">All notifications will be sent to your primary address.</p></div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "Advanced" && (
            <div className="flex flex-col gap-8 max-w-2xl">
              <section className="bg-background/40 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5">
                <div className="mb-10">
                  <h3 className="text-xl font-black text-text mb-2" style={{ fontFamily: "var(--font-display)" }}>Data & Privacy</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Manage destructive actions and account permanent settings.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-8 rounded-[1.5rem] border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-3 text-red-500 mb-6">
                      <AlertTriangle className="w-5 h-5" />
                      <h4 className="text-base font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>Danger Zone</h4>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-xs">
                          <p className="text-sm font-bold text-text mb-1">Reset Portfolio</p>
                          <p className="text-xs text-text-secondary leading-relaxed">Purge all drafts and versions. Your brand URL remains reserved.</p>
                        </div>
                        {confirmReset ? (
                          <div className="flex items-center gap-2">
                            <button onClick={handleResetPortfolio} disabled={resetting} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
                              {resetting ? "Resetting..." : "Confirm Reset"}
                            </button>
                            <button onClick={() => setConfirmReset(false)} className="px-4 py-2 bg-background border border-border text-text text-xs font-bold rounded-lg">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmReset(true)} className="px-4 py-2 border border-red-500/30 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors">Reset Data</button>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-xs">
                          <p className="text-sm font-bold text-text mb-1">Delete Account</p>
                          <p className="text-xs text-text-secondary leading-relaxed">Permanently erase your account and all associated metrics.</p>
                        </div>
                        {confirmDelete ? (
                          <div className="flex items-center gap-2">
                            <button onClick={handleDeleteAccount} disabled={deleting} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">
                              {deleting ? "Deleting..." : "Erase Forever"}
                            </button>
                            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 bg-background border border-border text-text text-xs font-bold rounded-lg">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Account
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="flex-1">
      <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-text outline-none transition-all placeholder:text-text-muted/50" />
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean, onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-14 h-7 rounded-full relative flex-shrink-0 transition-all duration-300 ${enabled ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-border-strong"}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all duration-300 ${enabled ? "translate-x-8" : "translate-x-1"}`} />
    </button>
  );
}

function StatusMsg({ type, text }: { type: "success" | "error", text: string }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest animate-fade-in ${type === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10" : "bg-red-500/10 text-red-500 border-red-500/10"}`}>
      {type === "success" ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {text}
    </div>
  );
}
