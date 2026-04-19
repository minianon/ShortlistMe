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
            { title: "Welcome to ShortlistMe", intro: "Let's take a quick tour!" },
            { element: "#tour-sync-resume", intro: "Upload a fresh resume anytime to instantly sync and rebuild your portfolio.", position: "bottom" },
            { element: "#tour-mission-control", intro: "Your Mission Control panel provides quick access to high-impact actions.", position: "bottom" },
            { element: "#tour-profile-strength", intro: "Check your profile strength and complete recommended checklist items.", position: "bottom" },
            { element: "#tour-notifications", intro: "Key updates and profile views appear here.", position: "bottom" },
            getTourStep(".tour-portfolio-studio", { intro: "Let's move to Portfolio Studio to edit your design and view real-time previews.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "portfolio");
          router.push("/dashboard/portfolio?edit=true");
        });
      });
    }

    if (currentPhase === "portfolio" && pathname === "/dashboard/portfolio" && searchParams.get("edit") === "true") {
      waitForElements(["#tour-editor-sidebar", "#tour-preview-frame", ".tour-insights"], () => {
        startTour([
            { title: "Portfolio Studio", intro: "Here you can customize every detail of your brand." },
            { element: "#tour-editor-sidebar", intro: "Use the editor on the left to tweak content, themes, and identity.", position: "right" },
            { element: "#tour-preview-frame", intro: "See real-time previews of your changes perfectly crafted.", position: "left" },
            getTourStep(".tour-insights", { intro: "Next, let's explore Insights on how well your portfolio performs.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "insights");
          router.push("/dashboard/analytics");
        });
      });
    }

    if (currentPhase === "insights" && pathname === "/dashboard/analytics") {
      waitForElements(["#tour-insights-metrics", "#tour-insights-graph", ".tour-settings"], () => {
        startTour([
            { title: "Performance Insights", intro: "Analyze your reach and incoming traffic." },
            { element: "#tour-insights-metrics", intro: "Monitor total unique visitors, views, and specific link clicks.", position: "bottom" },
            { element: "#tour-insights-graph", intro: "Track dynamic trends over the selected time ranges.", position: "bottom" },
            getTourStep(".tour-settings", { intro: "Finally, let's check your Settings.", position: "right" })
        ], () => {
          localStorage.setItem("shortlistme_tour_phase", "settings");
          router.push("/dashboard/settings?tab=General");
        });
      });
    }

    if (currentPhase === "settings" && pathname === "/dashboard/settings" && searchParams.get("tab") === "General") {
      waitForElements(["#tour-settings-brand", "#tour-settings-visibility"], () => {
        startTour([
            { title: "General Settings", intro: "Your personalization hub." },
            { element: "#tour-settings-brand", intro: "Reserve or modify your custom Brand URL handling here.", position: "bottom" },
            { element: "#tour-settings-visibility", intro: "Quickly toggle your portfolio's public visibility. And that's all!", position: "bottom" }
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
