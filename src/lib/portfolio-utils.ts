
export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  imageUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  detail?: string;
}

export interface VisibilityConfig {
  experience: boolean;
  projects: boolean;
  skills: boolean;
  education: boolean;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
  photoUrl?: string | null;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  visibility?: VisibilityConfig;
  themeId?: string;
  themeMode?: 'light' | 'dark';
  customColor?: string; // Primary Accent
  customBg?: string;    // Main Background
  customText?: string;  // Main Text
  customCard?: string;  // Card Background
  customAccentText?: string; // Text color on top of primary accent background
  customBorder?: string; // Border Color
}

export const PRESET_THEMES = [
  { id: "emerald", name: "Corporate Emerald", hex: "#10b981", primary: "emerald", mode: 'light' as const, gradient: "from-emerald-400 to-teal-600", badge: "Classic" },
  { id: "midnight", name: "Executive Indigo", hex: "#6366f1", primary: "indigo", mode: 'dark' as const, gradient: "from-indigo-500 to-blue-700", badge: "Trending" },
  { id: "cyber", name: "Cyberpunk Neo", hex: "#d946ef", primary: "fuchsia", mode: 'dark' as const, gradient: "from-fuchsia-500 to-purple-800", badge: "New" },
  { id: "nordic", name: "Nordic Frost", hex: "#94a3b8", primary: "slate", mode: 'light' as const, gradient: "from-slate-300 to-slate-500", badge: "Minimal" },
  { id: "royal", name: "Majestic Purple", hex: "#8b5cf6", primary: "violet", mode: 'dark' as const, gradient: "from-violet-500 to-purple-800" },
  { id: "rose", name: "Artistic Crimson", hex: "#f43f5e", primary: "rose", mode: 'light' as const, gradient: "from-rose-400 to-pink-600" },
  { id: "amber", name: "Sunset Horizon", hex: "#f59e0b", primary: "amber", mode: 'light' as const, gradient: "from-amber-400 to-orange-600" },
  { id: "gold", name: "Luxury Gold", hex: "#eab308", primary: "yellow", mode: 'dark' as const, gradient: "from-yellow-400 to-orange-700", badge: "Premium" },
  { id: "ocean", name: "Oceanic Depth", hex: "#0d9488", primary: "teal", mode: 'dark' as const, gradient: "from-teal-500 to-cyan-800" },
  { id: "autumn", name: "Autumn Earth", hex: "#c2410c", primary: "orange", mode: 'light' as const, gradient: "from-orange-500 to-amber-800" },
  { id: "mint", name: "Spring Mint", hex: "#10b981", primary: "emerald", mode: 'light' as const, gradient: "from-emerald-300 to-teal-500", badge: "New" },
  { id: "volcano", name: "Volcanic Ash", hex: "#ef4444", primary: "red", mode: 'dark' as const, gradient: "from-red-500 to-orange-800" },
  { id: "lavender", name: "Soft Lavender", hex: "#a855f7", primary: "purple", mode: 'light' as const, gradient: "from-purple-300 to-indigo-400", badge: "Pastel" },
  { id: "slate", name: "Graphite Studio", hex: "#475569", primary: "slate", mode: 'dark' as const, gradient: "from-slate-600 to-zinc-900" },
];

export const PRO_COLOR_SWATCHES = [
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Forest", hex: "#14532d" },
  { name: "Berry", hex: "#831843" },
  { name: "Charcoal", hex: "#171717" },
  { name: "Slate", hex: "#334155" },
  { name: "Gold", hex: "#854d0e" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Azure", hex: "#0284c7" },
];

export const PRO_THEME_PALETTES = [
  { name: "Modern Dark", primary: "#10b981", bg: "#0a0a0a", card: "#121212", text: "#ffffff" },
  { name: "Soft Paper", primary: "#475569", bg: "#f8fafc", card: "#ffffff", text: "#0f172a" },
  { name: "Deep Ocean", primary: "#38bdf8", bg: "#020617", card: "#0f172a", text: "#f1f5f9" },
  { name: "Midnight Rose", primary: "#fb7185", bg: "#09090b", card: "#18181b", text: "#fafafa" },
  { name: "Luxury Gold", primary: "#eab308", bg: "#0c0a09", card: "#1c1917", text: "#f5f5f4" },
];

export const DEFAULT_VISIBILITY: VisibilityConfig = {
  experience: true,
  projects: true,
  skills: true,
  education: true
};

export function getContrastColor(hexcolor: string) {
  // If no hex, default to safe white
  if (!hexcolor || hexcolor.length < 6) return "#ffffff";
  
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

export function getThemeStyles(data: PortfolioData) {
  const theme = PRESET_THEMES.find(t => t.id === data.themeId) || PRESET_THEMES[0];
  const mode = data.themeMode || theme.mode;
  const isDark = mode === 'dark';
  const isCustom = data.themeId === "custom";

  // Primary Accent
  const primaryHex = isCustom ? data.customColor || theme.hex : theme.hex;

  // Background & Surface
  const surface = isCustom ? (data.customBg || (isDark ? "#0a0a0a" : "#ffffff")) : (isDark ? "#0a0a0a" : "#ffffff");
  const surfaceSecondary = isCustom ? (data.customCard || (isDark ? "#121212" : "#f8fafc")) : (isDark ? "#121212" : "#f8fafc");
  
  // Contrast Safeguard for Accent Text
  const defaultContrast = getContrastColor(primaryHex);
  const accentText = isCustom ? (data.customAccentText || defaultContrast) : defaultContrast;
  
  // Text Colors
  const text = isCustom ? (data.customText || (isDark ? "#ffffff" : "#0f172a")) : (isDark ? "#ffffff" : "#0f172a");
  
  // Derive secondary/muted from main text color if custom, otherwise use defaults
  const textSecondary = isCustom ? `${text}cc` : (isDark ? "#a1a1aa" : "#475569");
  const textMuted = isCustom ? `${text}99` : (isDark ? "#71717a" : "#94a3b8");

  // Border (Dynamic or Override)
  const baseBorder = isDark ? "#1f1f1f" : "#e2e8f0";
  const border = isCustom && data.customBorder ? data.customBorder : baseBorder;

  return {
    primaryHex,
    isDark,
    isCustom,
    surface,
    surfaceSecondary,
    border,
    accentText,
    text,
    textSecondary,
    textMuted,
    primaryStyle: { color: primaryHex },
    bgPrimaryStyle: { backgroundColor: primaryHex },
    borderPrimaryStyle: { borderColor: `${primaryHex}66` }, // More pronounced border as requested
    shadowStyle: { boxShadow: `0 25px 50px -12px ${primaryHex}33` },
    textPrimaryClass: isCustom ? "" : `text-${theme.primary}-500`,
    bgSoftClass: isCustom ? "" : `bg-${theme.primary}-500/10`,
  };
}
