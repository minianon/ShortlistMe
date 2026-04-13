"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Globe, CheckCircle2, Loader2, X } from "lucide-react";

type Tab = "Profile" | "General" | "Billing" | "Notifications";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [slugLoading, setSlugLoading] = useState(true);

  // Toggle states
  const [publicVisibility, setPublicVisibility] = useState(true);
  const [notifPortfolio, setNotifPortfolio] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      if (user.unsafeMetadata?.publicVisibility !== undefined) setPublicVisibility(user.unsafeMetadata.publicVisibility as boolean);
      if (user.unsafeMetadata?.notifPortfolio !== undefined) setNotifPortfolio(user.unsafeMetadata.notifPortfolio as boolean);
      if (user.unsafeMetadata?.notifMarketing !== undefined) setNotifMarketing(user.unsafeMetadata.notifMarketing as boolean);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    fetch("/api/portfolio/status")
      .then((r) => r.json())
      .then((d) => setPortfolioSlug(d.portfolio?.slug ?? null))
      .finally(() => setSlugLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) throw new Error("Save failed");
      // Update Clerk user locally
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
      setFn(currentValue); // Revert on failure
    }
  };

  const TABS: Tab[] = ["Profile", "General", "Billing", "Notifications"];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-24">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-black text-text tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-text-secondary text-sm">Manage your profile, portfolio, and account preferences.</p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 bg-[var(--dash-upload-bg)] border border-[var(--dash-card-border)] rounded-2xl p-1.5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-[var(--dash-card-bg)] text-text shadow-sm border border-[var(--dash-card-border)]"
                : "text-text-secondary hover:text-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === "Profile" && (
        <div className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-8">
            <h3 className="text-base font-black text-text mb-6">Profile Photo</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-emerald-500">
                    {firstName.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-text mb-1">
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-text-muted mb-3">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                  Photo managed by your sign-in provider (Google/GitHub)
                </p>
              </div>
            </div>
          </div>

          {/* Name fields */}
          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-8">
            <h3 className="text-base font-black text-text mb-6">Personal Details</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[var(--dash-upload-bg)] border border-[var(--dash-card-border)] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-sm font-semibold text-text outline-none transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[var(--dash-upload-bg)] border border-[var(--dash-card-border)] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-sm font-semibold text-text outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.primaryEmailAddress?.emailAddress ?? ""}
                disabled
                className="w-full bg-background-tertiary border border-[var(--dash-card-border)] rounded-xl px-4 py-3 text-sm font-semibold text-text-muted outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-text-muted mt-1.5">Email is managed by your auth provider.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? "Saving…" : "Save Changes"}
              </button>
              {saveStatus === "success" && (
                <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center gap-1.5 text-red-500 text-sm font-semibold">
                  <X className="w-4 h-4" /> Failed to save.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── GENERAL TAB ── */}
      {activeTab === "General" && (
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-8">
            <h3 className="text-base font-black text-text mb-2">Portfolio Slug</h3>
            <p className="text-sm text-text-secondary mb-6">Your public portfolio URL.</p>
            <div className="flex items-center rounded-xl overflow-hidden border border-[var(--dash-card-border)]">
              <span className="bg-[var(--dash-upload-bg)] text-text-secondary px-4 py-3 text-sm font-semibold border-r border-[var(--dash-card-border)] whitespace-nowrap">
                /p/
              </span>
              <input
                type="text"
                value={slugLoading ? "Loading…" : (portfolioSlug ?? "not-created-yet")}
                disabled
                className="flex-1 bg-[var(--dash-card-bg)] px-4 py-3 text-sm font-semibold text-text outline-none cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              Slug is automatically generated from your name when you create your portfolio.
            </p>
          </div>

          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-8 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-text mb-1">Public Profile Visibility</h4>
              <p className="text-xs text-text-secondary">Anyone with your link can view your portfolio.</p>
            </div>
            <button
              onClick={() => handleToggle("publicVisibility", publicVisibility, setPublicVisibility)}
              className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors ${publicVisibility ? "bg-emerald-500" : "bg-border-strong"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${publicVisibility ? "right-1" : "left-1"}`} />
            </button>
          </div>
        </div>
      )}

      {/* ── BILLING TAB ── */}
      {activeTab === "Billing" && (
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-100/80 mb-2">Current Plan</p>
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "var(--font-display)" }}>Free Tier</h2>
              <p className="text-sm text-emerald-100/70 mb-6">
                You're on the free plan. Upgrade to unlock custom domains, advanced analytics, and more.
              </p>
              <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>

          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-8">
            <h3 className="text-base font-black text-text mb-4">Pro Features</h3>
            <ul className="flex flex-col gap-3">
              {[
                "Custom domain (e.g. alex.com)",
                "Remove ShortlistMe branding",
                "Portfolio analytics & view tracking",
                "Unlimited portfolio versions",
                "Priority AI generation",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === "Notifications" && (
        <div className="flex flex-col gap-4">
          {[
            {
              label: "Portfolio activity",
              desc: "Get notified when someone views your portfolio.",
              value: notifPortfolio,
              key: "notifPortfolio",
              set: setNotifPortfolio,
            },
            {
              label: "Marketing updates",
              desc: "Receive tips, new features, and product announcements.",
              value: notifMarketing,
              key: "notifMarketing",
              set: setNotifMarketing,
            },
          ].map(({ label, desc, value, key, set }) => (
            <div key={label} className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-text mb-1">{label}</h4>
                <p className="text-xs text-text-secondary">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle(key, value, set)}
                className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors ${value ? "bg-emerald-500" : "bg-border-strong"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${value ? "right-1" : "left-1"}`} />
              </button>
            </div>
          ))}

          <div className="bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl p-6">
            <h3 className="text-sm font-black text-text mb-2">Email Notifications</h3>
            <p className="text-xs text-text-secondary mb-4">
              Notifications are sent to: <span className="font-bold text-text">{user?.primaryEmailAddress?.emailAddress}</span>
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg w-fit">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Email verified</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
