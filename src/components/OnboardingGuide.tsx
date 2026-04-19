"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import introJs from "intro.js";

import "intro.js/introjs.css";

function GuideContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

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

    const startTour = (steps: any[], onCompletePhase: () => void, timeoutMs: number = 500) => {
      const intro = introJs();
      let isCompleting = false;

      intro.setOptions({
        showProgress: true, showBullets: false, exitOnOverlayClick: false,
        steps: steps,
      });

      const handleScroll = () => {
         if(document.querySelector('.introjs-helperLayer')) {
              intro.refresh(); 
         }
      };
      
      // capture phase allows us to catch all nested scrolling
      window.addEventListener('scroll', handleScroll, true); 

      intro.oncomplete(() => {
        isCompleting = true;
        window.removeEventListener('scroll', handleScroll, true);
        onCompletePhase();
      });

      intro.onexit(() => {
        window.removeEventListener('scroll', handleScroll, true);
        if (!isCompleting) localStorage.setItem("shortlistme_onboarding_done", "true");
      });

      setTimeout(() => intro.start(), timeoutMs);
    };

    if (currentPhase === "overview" && pathname === "/dashboard") {
      waitForElements(["#tour-sync-resume", "#tour-mission-control", "#tour-profile-strength", "#tour-notifications", ".tour-portfolio-studio"], () => {
        startTour([
            { title: "Welcome to ShortlistMe", intro: "<b>Welcome aboard!</b><br/><br/>Your AI-powered portfolio is just moments away. Let's take a quick tour to show you around your new command center." },
            { element: "#tour-sync-resume", intro: "<b>Sync with Resume</b><br/><br/>Got a new job or updated skills? Drop your latest resume here to instantly rebuild your entire portfolio.", position: "bottom" },
            { element: "#tour-mission-control", intro: "<b>Mission Control</b><br/><br/>This is your fast-track to everything important. Jump straight into editing, analytics, or settings from here.", position: "bottom" },
            { element: "#tour-profile-strength", intro: "<b>Profile Strength</b><br/><br/>Make sure your profile stands out. We'll guide you step-by-step to achieve a perfect 100% completion.", position: "bottom" },
            { element: "#tour-notifications", intro: "<b>Stay in the Loop</b><br/><br/>Any time a recruiter views your portfolio or you hit a milestone, we'll drop a little alert right here.", position: "bottom" },
            getTourStep(".tour-portfolio-studio", { intro: "<b>Next Stop: Portfolio Studio</b><br/><br/>Ready to make it yours? Let's dive into the Studio to customize your theme and design.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "portfolio");
          router.push("/dashboard/portfolio?edit=true");
        });
      });
    }

    if (currentPhase === "portfolio" && pathname === "/dashboard/portfolio" && searchParams.get("edit") === "true") {
      waitForElements(["#tour-editor-sidebar", "#tour-preview-frame", ".tour-insights"], () => {
        startTour([
            { title: "Portfolio Studio", intro: "<b>Welcome to the Studio</b><br/><br/>This is where your professional brand comes to life. Customize every detail until it matches your brand." },
            { element: "#tour-editor-sidebar", intro: "<b>The Editor</b><br/><br/>Tweak your experiences, configure layouts, and shape your identity using these core tools.", position: "right" },
            { element: "#tour-preview-frame", intro: "<b>Real-time Preview</b><br/><br/>What you see is exactly what recruiters will get. Watch your changes compile in real-time right here.", position: "left" },
            getTourStep(".tour-insights", { intro: "<b>Ready for Insights?</b><br/><br/>Once you publish, you'll want to see who's visiting. Let's check out the Analytics engine next.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "insights");
          router.push("/dashboard/analytics");
        });
      });
    }

    if (currentPhase === "insights" && pathname === "/dashboard/analytics") {
      waitForElements(["#tour-insights-metrics", "#tour-insights-graph", ".tour-settings"], () => {
        startTour([
            { title: "Performance Insights", intro: "<b>Your Command Center</b><br/><br/>Traffic is useless if you can't measure it. This is where you track your profile's organic reach." },
            { element: "#tour-insights-metrics", intro: "<b>Key Metrics</b><br/><br/>Monitor unique visitors and track exactly how many people interacted with your custom links today.", position: "bottom" },
            { element: "#tour-insights-graph", intro: "<b>Live Trends</b><br/><br/>Watch your growth curve by switching between different historical time ranges right here.", position: "bottom" },
            getTourStep(".tour-settings", { intro: "<b>One last thing...</b><br/><br/>Let's wrap this up by taking a quick look at your custom portfolio settings.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "settings");
          router.push("/dashboard/settings?tab=General");
        });
      });
    }

    if (currentPhase === "settings" && pathname === "/dashboard/settings" && searchParams.get("tab") === "General") {
      waitForElements(["#tour-settings-brand", "#tour-settings-visibility"], () => {
        startTour([
            { title: "General Settings", intro: "<b>Under the Hood</b><br/><br/>Welcome to your settings tab. You hold all the keys to your profile's engine right here." },
            { element: "#tour-settings-brand", intro: "<b>Claim Your Brand</b><br/><br/>Want a professional link? Reserve your custom URL here before someone else takes it.", position: "bottom" },
            { element: "#tour-settings-visibility", intro: "<b>Public Visibility</b><br/><br/>Not ready for the world to see your profile yet? Toggle this off anytime.<br/><br/><b>You're all set! Enjoy ShortlistMe.</b>", position: "bottom" }
        ], () => {
          localStorage.setItem("shortlistme_onboarding_done", "true");
          router.push("/dashboard");
        });
      });
    }

  }, [pathname, mounted, router, searchParams]);

  return null;
}

export default function OnboardingGuide() {
  return (
    <Suspense fallback={null}>
      <GuideContent />
    </Suspense>
  );
}
