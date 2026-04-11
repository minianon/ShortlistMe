"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Download } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-24 relative">
      
      {/* ── Header ── */}
      <div>
         <h1 className="text-3xl font-extrabold text-text tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Account Settings
         </h1>
         <p className="text-text-secondary">Manage your profile, domains, and subscription preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 text-text">
         
         {/* ── Left Navigation ── */}
         <div className="w-full md:w-56 shrink-0">
            <nav className="flex flex-col gap-1 sticky top-32">
               {["General", "Profile", "Domains", "Billing", "Notifications"].map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        activeTab === tab 
                           ? "bg-border-strong/60 text-text" 
                           : "text-text-secondary hover:bg-background-tertiary hover:text-text"
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </nav>
         </div>

         {/* ── Right Content ── */}
         <div className="flex-1 flex flex-col gap-12">
            
            {/* Profile Section */}
            <section className="flex flex-col lg:flex-row gap-8 items-start">
               <div className="w-full lg:w-1/3">
                  <h3 className="text-lg font-bold text-text mb-2">Profile</h3>
                  <p className="text-sm text-text-secondary">Update your photo and personal details for your public shortlist.</p>
               </div>
               
               <div className="w-full lg:w-2/3 bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col gap-8">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                     <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&backgroundColor=eaeaea" className="w-20 h-20 rounded-full border border-border-strong" />
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Upload New</button>
                           <button className="text-text-secondary hover:text-text px-4 py-2 text-xs font-bold transition-colors">Remove</button>
                        </div>
                        <p className="text-[10px] text-text-muted font-semibold tracking-wide uppercase">JPG, GIF or PNG. Max size of 800K</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-2">Full Name</label>
                        <input type="text" defaultValue="Sarah Jenkins" className="w-full bg-background-secondary border border-transparent focus:border-indigo-500 focus:bg-background rounded-xl px-4 py-3 text-sm font-semibold transition-colors outline-none" />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-2">Email Address</label>
                        <input type="email" defaultValue="sarah@design.co" className="w-full bg-background-secondary border border-transparent focus:border-indigo-500 focus:bg-background rounded-xl px-4 py-3 text-sm font-semibold transition-colors outline-none" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-2">Bio</label>
                     <textarea rows={3} defaultValue="Brand designer and digital curator helping startups build meaningful visual identities. Focused on minimalist aesthetics." className="w-full bg-background-secondary border border-transparent focus:border-indigo-500 focus:bg-background rounded-xl px-4 py-3 text-sm font-semibold transition-colors outline-none resize-none"></textarea>
                  </div>
               </div>
            </section>

            {/* General Section */}
            <section className="flex flex-col lg:flex-row gap-8 items-start">
               <div className="w-full lg:w-1/3">
                  <h3 className="text-lg font-bold text-text mb-2">General</h3>
                  <p className="text-sm text-text-secondary">Manage your unique URL and account visibility.</p>
               </div>
               
               <div className="w-full lg:w-2/3 flex flex-col gap-4">
                  <div className="bg-background rounded-3xl p-8 shadow-sm border border-border">
                     <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-2">Username / Custom URL</label>
                     <div className="flex items-center">
                        <span className="bg-background-tertiary text-text-secondary px-4 py-3 rounded-l-xl text-sm font-semibold border border-transparent border-r-0">shortlist.me/</span>
                        <input type="text" defaultValue="sjenkins" className="w-full bg-background-secondary border border-transparent focus:border-indigo-500 focus:bg-background rounded-r-xl px-4 py-3 text-sm font-semibold transition-colors outline-none" />
                     </div>
                  </div>

                  <div className="bg-background rounded-3xl p-8 shadow-sm border border-border flex items-center justify-between">
                     <div>
                        <h4 className="text-sm font-bold text-text mb-1">Public Profile Visibility</h4>
                        <p className="text-xs text-text-secondary">Allow anyone with the link to view your shortlist.</p>
                     </div>
                     {/* Custom Toggle Switch */}
                     <button className="w-12 h-6 bg-primary rounded-full relative transition-colors shadow-inner">
                        <div className="w-4 h-4 bg-background rounded-full absolute right-1 top-1 shadow-sm"></div>
                     </button>
                  </div>
               </div>
            </section>

            {/* Domains Section */}
            <section className="flex flex-col lg:flex-row gap-8 items-start">
               <div className="w-full lg:w-1/3">
                  <h3 className="text-lg font-bold text-text mb-2">Domains</h3>
                  <p className="text-sm text-text-secondary">Connect your own brand to ShortlistMe.</p>
               </div>
               
               <div className="w-full lg:w-2/3 bg-background rounded-3xl p-8 shadow-sm border border-border">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary">
                           <Globe className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-text">Connect Custom Domain</h4>
                           <p className="text-xs text-text-secondary mb-0.5">Remove ShortlistMe branding and use your own domain.</p>
                        </div>
                     </div>
                     <span className="bg-primary-light text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Premium</span>
                  </div>

                  <div className="border-2 border-dashed border-border-strong rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                     <p className="text-sm font-bold text-text mb-4">No custom domains connected yet.</p>
                     <button className="bg-[#191c1e] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-colors hover:bg-text">
                        Add Domain
                     </button>
                  </div>
               </div>
            </section>

            {/* Billing Section */}
            <section className="flex flex-col lg:flex-row gap-8 items-start">
               <div className="w-full lg:w-1/3">
                  <h3 className="text-lg font-bold text-text mb-2">Billing</h3>
                  <p className="text-sm text-text-secondary">Manage your subscription and payment methods.</p>
               </div>
               
               <div className="w-full lg:w-2/3 flex flex-col gap-4">
                  {/* Plan Card */}
                  <div className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-primary/20">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-background/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                     <div className="flex items-center justify-between mb-6 relative z-10">
                        <span className="text-[10px] uppercase tracking-widest font-bold">Current Plan</span>
                        <span className="bg-background/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
                     </div>
                     <h2 className="text-3xl font-extrabold mb-8" style={{ fontFamily: "var(--font-display)" }}>Pro Curator</h2>
                     <div className="flex items-end justify-between relative z-10">
                        <div>
                           <div className="text-2xl font-bold mb-1">$12.00<span className="text-sm font-medium text-primary-light">/month</span></div>
                           <div className="text-xs text-primary-light">Next billing date: Oct 12, 2024</div>
                        </div>
                        <button className="bg-background text-primary px-4 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-background-secondary">
                           Manage Plan
                        </button>
                     </div>
                  </div>

                  {/* Payment & Invoice block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-background rounded-3xl p-6 shadow-sm border border-border">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Payment Method</div>
                        <div className="flex items-center gap-3 mb-6">
                           <div className="bg-background-tertiary text-text text-[10px] font-bold px-2 py-1 rounded">VISA</div>
                           <div className="text-sm font-bold text-text">•••• 4242</div>
                        </div>
                        <button className="text-primary text-xs font-bold hover:underline">Update Card</button>
                     </div>
                     <div className="bg-background rounded-3xl p-6 shadow-sm border border-border">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Latest Invoice</div>
                        <div className="flex items-center justify-between mb-6">
                           <div className="text-sm font-semibold text-text">Aug 12, 2024</div>
                           <div className="text-sm font-bold text-text">$12.00</div>
                        </div>
                        <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                           <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                     </div>
                  </div>

                  {/* Billing History */}
                  <div className="bg-background-secondary rounded-3xl p-6 border border-border mt-2">
                     <div className="text-xs font-bold text-text mb-6">Recent Billing History</div>
                     
                     <div className="flex items-center justify-between pb-4 border-b border-border-strong/60 mb-4">
                        <div>
                           <div className="text-sm font-semibold text-text mb-1">ShortlistMe Pro - Monthly</div>
                           <div className="text-[10px] text-text-secondary">Inv-2024-082</div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-bold text-text">$12.00</span>
                           <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Paid</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div>
                           <div className="text-sm font-semibold text-text mb-1">ShortlistMe Pro - Monthly</div>
                           <div className="text-[10px] text-text-secondary">Inv-2024-071</div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-bold text-text">$12.00</span>
                           <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Paid</span>
                        </div>
                     </div>
                  </div>

               </div>
            </section>
         </div>
      </div>

      {/* Floating Save Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-64 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none flex justify-end">
         <div className="pointer-events-auto flex items-center gap-4 bg-background p-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border">
            <button className="text-text-secondary hover:text-text px-4 py-2 text-sm font-bold transition-colors">Discard Changes</button>
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md shadow-primary/20">Save Changes</button>
         </div>
      </div>

    </div>
  );
}
