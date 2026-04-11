"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="hover:text-text transition-colors w-5 h-5 opacity-0 text-text-secondary">
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="hover:text-text transition-colors text-text-secondary w-5 h-5 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 fill-current" strokeWidth={2} />
      ) : (
        <Moon className="w-5 h-5 fill-current" strokeWidth={2} />
      )}
    </button>
  );
}
