"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import introJs from "intro.js";

import "intro.js/introjs.css";

function GuideContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const activePhaseRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isDone = localStorage.getItem("shortlistme_onboarding_done") === "true";
    if (isDone) return;

    let currentPhase = localStorage.getItem("shortlistme_tour_phase");

    // Auto-start on dashboard overview
    if (!currentPhase && pathname === "/dashboard") {
      localStorage.setItem("shortlistme_tour_phase", "overview");
      currentPhase = "overview";
    }

    const waitForElements = (selectors: string[], callback: () => void) => {
      const interval = setInterval(() => {
        const allExist = selectors.every(s => document.querySelector(s));
        if (allExist) {
          clearInterval(interval);
          callback();
        }
      }, 250);
      setTimeout(() => clearInterval(interval), 15000);
    };

    const getTourStep = (selector: string, stepConfig: any) => {
      if (selector.startsWith('.')) {
        const els = document.querySelectorAll(selector);
        for (let i = 0; i < els.length; i++) {
          const el = els[i] as HTMLElement;
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return {
              ...stepConfig,
              element: el,
              position: el.getAttribute('data-tour-pos') || stepConfig.position || "bottom"
            };
          }
        }
      }
      return { element: selector, ...stepConfig };
    };

    const BRANDING = 'Shortlist<span class="text-emerald-500 font-bold">Me</span>';

    const startTour = (steps: any[], onCompletePhase: () => void, timeoutMs: number = 500, nextLabel: string = "Done") => {
      if (document.querySelector('.introjs-helperLayer')) return; // Already active

      const intro = introJs();
      let isCompleting = false;

      document.body.classList.add('tour-active');

      intro.setOptions({
        showProgress: true, 
        showBullets: false, 
        exitOnOverlayClick: false,
        steps: steps,
        nextLabel: "Next",
        prevLabel: "Back",
        doneLabel: nextLabel,
      });

      const handleScroll = () => {
        if (document.querySelector('.introjs-helperLayer')) {
          intro.refresh();
        }
      };

      // capture phase allows us to catch all nested scrolling
      window.addEventListener('scroll', handleScroll, true);

      const cleanUp = () => {
        window.removeEventListener('scroll', handleScroll, true);
        document.body.classList.remove('tour-active');
      };

      intro.oncomplete(() => {
        isCompleting = true;
        cleanUp();
        onCompletePhase();
      });

      intro.onexit(() => {
        cleanUp();
        if (!isCompleting) localStorage.setItem("shortlistme_onboarding_done", "true");
      });

      setTimeout(() => intro.start(), timeoutMs);
    };

    if (currentPhase === "overview" && pathname === "/dashboard" && activePhaseRef.current !== "overview") {
      activePhaseRef.current = "overview";
      waitForElements(["#tour-sync-resume", "#tour-mission-control", "#tour-profile-strength", "#tour-notifications", ".tour-portfolio-studio"], () => {
        startTour([
          { intro: `<div class="text-center py-4">
              <h2 class="text-2xl font-black mb-2">Welcome to ${BRANDING}</h2>
              <p class="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-6">Onboarding Tour</p>
              <div class="text-sm text-text-secondary leading-relaxed font-medium italic">
                Your journey to a standout professional brand starts here.<br/>
                Ready to dominate the job market?
              </div>
            </div>` },
          { element: "#tour-sync-resume", intro: "<b>Sync with Resume</b><br/><br/>Got a new job or updated skills? Drop your latest resume here to instantly rebuild your entire portfolio in seconds.", position: "bottom" },
          { element: "#tour-mission-control", intro: "<b>Mission Control</b><br/><br/>This is your fast-track to everything important. Jump straight into editing, analytics, or settings from here.", position: "bottom" },
          { element: "#tour-profile-strength", intro: "<b>Profile Strength</b><br/><br/>Make sure your profile stands out. We'll guide you step-by-step to achieve a perfect 100% completion.", position: "bottom" },
          { element: "#tour-notifications", intro: "<b>Stay in the Loop</b><br/><br/>Never miss a beat. Get instant notifications whenever someone visits your portfolio or interacts with your content.", position: "bottom" },
          getTourStep(".tour-portfolio-studio", { intro: "<b>Next Stop: Portfolio Studio</b><br/><br/>Ready to make it yours? Let's dive into the Studio to customize your theme and design.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "portfolio");
          router.push("/dashboard/portfolio?edit=true");
        }, 500, "Go to Studio");
      });
    }

    if (currentPhase === "portfolio" && pathname === "/dashboard/portfolio" && searchParams.get("edit") === "true" && activePhaseRef.current !== "portfolio") {
      activePhaseRef.current = "portfolio";
      waitForElements(["#tour-editor-sidebar", "#tour-preview-frame", ".tour-insights"], () => {
        startTour([
          { intro: `<div class="text-center py-4">
              <h2 class="text-2xl font-black mb-2">Portfolio Studio</h2>
              <p class="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-6">Editor Guide</p>
              <div class="text-sm text-text-secondary leading-relaxed font-medium italic">
                Where AI meets art. Shape your identity and craft a<br/>
                design that leaves a lasting impression.
              </div>
            </div>` },
          { element: "#tour-editor-sidebar", intro: "<b>The Editor</b><br/><br/>Tweak your experiences, configure layouts, and shape your identity using these core tools.", position: "right" },
          { element: "#tour-preview-frame", intro: "<b>Real-time Preview</b><br/><br/>What you see is exactly what recruiters will get. Watch your changes compile in real-time right here.", position: "left" },
          getTourStep(".tour-insights", { intro: "<b>Ready for Insights?</b><br/><br/>Once you publish, you'll want to see who's visiting. Let's check out the Analytics engine next.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "insights");
          router.push("/dashboard/analytics");
        }, 500, "Check Insights");
      });
    }

    if (currentPhase === "insights" && pathname === "/dashboard/analytics" && activePhaseRef.current !== "insights") {
      activePhaseRef.current = "insights";
      waitForElements(["#tour-insights-metrics", "#tour-insights-graph", ".tour-settings"], () => {
        startTour([
          { intro: `<div class="text-center py-4">
              <h2 class="text-2xl font-black mb-2">Performance Insights</h2>
              <p class="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-6">Analytics Guide</p>
              <div class="text-sm text-text-secondary leading-relaxed font-medium italic">
                Stop guessing. Start growing. Track every view,<br/>
                click, and interaction in real-time.
              </div>
            </div>` },
          { element: "#tour-insights-metrics", intro: "<b>Key Metrics</b><br/><br/>Monitor unique visitors and track exactly how many people interacted with your custom links today.", position: "bottom" },
          { element: "#tour-insights-graph", intro: "<b>Live Trends</b><br/><br/>Watch your growth curve by switching between different historical time ranges right here.", position: "bottom" },
          getTourStep(".tour-settings", { intro: "<b>One last thing...</b><br/><br/>Let's wrap this up by taking a quick look at your custom portfolio settings.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "settings");
          router.push("/dashboard/settings?tab=General");
        }, 500, "View Settings");
      });
    }

    if (currentPhase === "settings" && pathname === "/dashboard/settings" && searchParams.get("tab") === "General" && activePhaseRef.current !== "settings") {
      activePhaseRef.current = "settings";
      waitForElements(["#tour-settings-brand", "#tour-settings-visibility"], () => {
        startTour([
          { intro: `<div class="text-center py-4">
              <h2 class="text-2xl font-black mb-2">General Settings</h2>
              <p class="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-6">System Config</p>
              <div class="text-sm text-text-secondary leading-relaxed font-medium italic">
                The cockpit of your profile. Fine-tune your brand<br/>
                and take full control of your digital presence.
              </div>
            </div>` },
          { element: "#tour-settings-brand", intro: "<b>Claim Your Brand</b><br/><br/>Want a professional link? Reserve your custom URL here before someone else takes it.", position: "bottom" },
          { element: "#tour-settings-visibility", intro: `<b>Public Visibility</b><br/><br/>Not ready for the world to see your profile yet? Toggle this off anytime.`, position: "bottom" },
          { intro: `<div class="text-center py-6">
              <div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl font-black tracking-tighter">S<span class="text-emerald-500">M</span></span>
              </div>
              <h2 class="text-2xl font-black mb-2">You're all set!</h2>
              <p class="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-6">Ready for Lift-off</p>
              <div class="text-sm text-text-secondary leading-relaxed">
                Your professional journey has just leveled up.<br/>
                Go forth and enjoy <b>${BRANDING}</b>.
              </div>
            </div>` }
        ], () => {
          localStorage.setItem("shortlistme_onboarding_done", "true");
          router.push("/dashboard");
        }, 500, "Finish Tour");
      });
    }

  }, [pathname, mounted, router, searchParams]);

  return (
    <style jsx global>{`
      /* Interaction Lock: Target only the app content containers */
      body.tour-active main,
      body.tour-active aside,
      body.tour-active header,
      body.tour-active .cl-rootBox {
        pointer-events: none !important;
        opacity: 0.8;
      }

      /* Ensure Intro.js elements are always interactive and properly layered */
      .introjs-tooltip, 
      .introjs-overlay, 
      .introjs-helperLayer, 
      .introjs-tooltipReferenceLayer {
        pointer-events: auto !important;
      }
      
      /* --- Premium UI Card Look (Unified) --- */
      .introjs-tooltip {
        background: var(--bg) !important;
        border-radius: 24px !important;
        border: 1px solid var(--border) !important;
        padding: 24px 24px 84px 24px !important; 
        width: calc(100vw - 40px) !important; /* Mobile fallback */
        min-width: 280px !important;
        max-width: 480px !important;
        overflow: visible !important;
      }
      
      @media (min-width: 480px) {
        .introjs-tooltip {
          min-width: 400px !important;
          width: auto !important;
        }
      }
      
      .introjs-tooltip-title {
        display: none !important;
      }
      
      .introjs-tooltiptext {
        font-family: var(--font-body) !important;
        font-size: 15px !important;
        line-height: 1.6 !important;
        color: var(--text-secondary) !important;
        margin: 0 !important;
        padding: 0 0 24px 0 !important; /* Added 24px bottom padding */
      }

      /* Headline Styling */
      .introjs-tooltiptext b:first-child {
        display: block !important;
        font-family: var(--font-display) !important;
        font-size: 20px !important;
        font-weight: 800 !important;
        color: var(--text) !important;
        margin-bottom: 0px !important; /* Reduced from 8px */
        padding-right: 0px !important; /* Removed space for the skip button */
        letter-spacing: -0.02em !important;
      }
      
      .introjs-tooltipbuttons {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        padding: 0 24px !important;
        height: 72px !important;
        border-top: 1px solid var(--border) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 12px !important;
        background: var(--bg-secondary) !important;
        border-radius: 0 0 24px 24px !important;
      }
      
      .introjs-button {
        text-shadow: none !important;
        border: none !important;
        background: var(--primary) !important;
        color: white !important;
        font-family: var(--font-body) !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        border-radius: 12px !important;
        padding: 10px 24px !important;
        min-width: 80px !important; /* Consistent button width */
        text-align: center !important;
        transition: all 0.2s ease !important;
        box-shadow: var(--shadow-sm) !important;
        cursor: pointer !important;
      }

      .introjs-button:hover {
        background: var(--primary-dark) !important;
        transform: translateY(-1px) !important;
        box-shadow: var(--shadow-md) !important;
      }

      .introjs-prevbutton {
        background: var(--bg-tertiary) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        margin-right: auto !important; /* Pushes the next button to the right end */
      }
      
      /* Skip button: Moved to footer, left of Next */
      .introjs-skipbutton {
        display: inline-block !important;
        background: var(--bg-tertiary) !important;
        color: var(--text) !important;
        font-family: var(--font-body) !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        border-radius: 12px !important;
        padding: 10px 24px !important;
        text-align: center !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        border: none !important;
        margin-left: auto !important; /* This + margin-right: auto on prevbutton centers this or pushes it next to next */
      }

      .introjs-skipbutton:hover {
        background: var(--border) !important;
        transform: translateY(-1px) !important;
      }

      /* Fix button order: Prev ... Skip, Next */
      .introjs-tooltipbuttons {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }
      
      .introjs-prevbutton { order: 1 !important; margin-right: auto !important; }
      .introjs-skipbutton { order: 2 !important; margin-left: auto !important; }
      .introjs-nextbutton { order: 3 !important; }
      .introjs-disabled { display: none !important; }
      
      .introjs-arrow.left { border-right-color: var(--bg) !important; }
      .introjs-arrow.right { border-left-color: var(--bg) !important; }
      .introjs-arrow.top { border-bottom-color: var(--bg) !important; }
      .introjs-arrow.bottom { border-top-color: var(--bg-secondary) !important; }
      
      .introjs-overlay {
        opacity: 0.8 !important;
      }

      .introjs-bullets {
        display: none !important;
      }

      /* --- Progress Bar (Sleek Emerald Line at Top) --- */
      .introjs-progress {
        background-color: var(--border) !important;
        height: 4px !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 24px 24px 0 0 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        overflow: hidden !important;
        z-index: 100 !important;
      }
      .introjs-progressbar {
        background: linear-gradient(to right, #10b981, #34d399, #10b981) !important;
        background-size: 200% auto !important;
        animation: progress-glow 2s linear infinite !important;
        height: 100% !important;
      }
      @keyframes progress-glow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      .introjs-tooltip {
        /* Ensure the progress bar doesn't get cut off weirdly */
        overflow: hidden !important; 
        padding-top: 36px !important; /* Make room for the top progress bar */
      }
    `}</style>
  );
}

export default function OnboardingGuide() {
  return (
    <Suspense fallback={null}>
      <GuideContent />
    </Suspense>
  );
}
