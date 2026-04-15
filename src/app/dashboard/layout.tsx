"use client";

import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@clerk/nextjs";
import { Bell, CheckCircle2, Globe, MousePointer2, TrendingUp, Zap, Trophy, Star, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
}
import PublicFooter from "@/components/PublicFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15 seconds for snappier experience

    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic UI update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      await fetch("/api/notifications", { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setShowNotifications(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
    const diffTime = new Date(dateString).getTime() - new Date().getTime();
    
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (Math.abs(diffDays) > 0) return rtf.format(diffDays, 'day');
    
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    if (Math.abs(diffHours) > 0) return rtf.format(diffHours, 'hour');
    
    const diffMinutes = Math.round(diffTime / (1000 * 60));
    if (Math.abs(diffMinutes) > 0) return rtf.format(diffMinutes, 'minute');
    
    return "Just now";
  };

  const renderIcon = (iconName: string) => {
    if (iconName === 'MousePointer2') return <MousePointer2 className="w-5 h-5" />;
    if (iconName === 'TrendingUp') return <TrendingUp className="w-5 h-5" />;
    if (iconName === 'Globe') return <Globe className="w-5 h-5" />;
    if (iconName === 'Zap') return <Zap className="w-5 h-5" />;
    if (iconName === 'Trophy') return <Trophy className="w-5 h-5" />;
    if (iconName === 'Star') return <Star className="w-5 h-5" />;
    return <CheckCircle2 className="w-5 h-5" />;
  };

  return (
    <div className="flex min-h-[100dvh] bg-background-secondary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Global Dashboard Header ── */}
        <header className="h-[72px] flex-shrink-0 flex items-center justify-between px-6 lg:px-8 bg-background-secondary border-b border-[var(--dash-sidebar-border)] sticky top-0 z-40 backdrop-blur-sm">

          {/* Spacer to push actions to the right */}
          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-4">
            <ThemeToggle />

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-9 h-9 rounded-xl bg-[var(--dash-upload-bg)] border ${showNotifications ? 'border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]' : 'border-[var(--dash-card-border)] text-text-secondary'} flex items-center justify-center hover:text-text hover:border-emerald-500/30 transition-all`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 border-2 border-background-secondary rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-background rounded-2xl border border-[var(--dash-card-border)] shadow-xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-[var(--dash-card-border)] flex items-center justify-between bg-background-secondary/50">
                    <h3 className="font-black text-text">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto p-2">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => !n.isRead && markAsRead(n.id)}
                          className={`p-3 rounded-xl transition-colors group flex gap-4 ${!n.isRead ? 'bg-[var(--dash-upload-bg)] cursor-pointer hover:bg-emerald-500/5' : 'cursor-default opacity-80'}`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-emerald-500/10 text-emerald-500' : 'bg-background-tertiary text-text-muted border border-border'}`}>
                            {renderIcon(n.icon)}
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className={`font-bold transition-colors ${!n.isRead ? 'text-text group-hover:text-emerald-500' : 'text-text-secondary'}`}>
                                {n.title}
                              </span>
                            </p>
                            <p className={`text-xs mt-1 leading-relaxed ${!n.isRead ? 'text-text-secondary' : 'text-text-muted'}`}>{n.message}</p>
                            <p className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-wider">{getRelativeTime(n.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-text-muted text-sm font-medium">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-[var(--dash-card-border)] text-center bg-background-secondary/50">
                    <button 
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className={`text-xs font-bold transition-colors ${unreadCount > 0 ? 'text-text-secondary hover:text-emerald-500 cursor-pointer' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-[var(--dash-card-border)]" />

            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-text leading-tight">
                  {user?.firstName ?? "Loading..."} {user?.lastName ?? ""}
                </p>
                <p className="text-[10px] font-medium text-text-muted">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-emerald-500">
                    {user?.firstName?.[0] ?? "U"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-6 lg:p-8 pt-6 pb-24 md:pb-8">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            }>
              {children}
            </Suspense>
          </main>
          <PublicFooter />
        </div>
      </div>
    </div>
  );
}
