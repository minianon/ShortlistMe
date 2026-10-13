/**
 * Canonical site details, shared by metadata, the sitemap, structured data and llms.txt.
 *
 * A constant, not NEXT_PUBLIC_APP_URL: that variable is set to http://localhost:3000
 * in Vercel, which put localhost into every canonical, sitemap entry and share card.
 */
export const SITE_URL = "https://shortlistme.site";
export const SITE_NAME = "ShortlistMe";
export const SITE_TAGLINE = "AI Portfolio Generator";
export const SITE_DESCRIPTION =
  "ShortlistMe turns your resume into a live portfolio website in seconds. Upload a PDF resume, AI extracts your experience, projects and skills, and you get a shareable link with themes, a live editor and visitor analytics. No coding or design skills needed.";

/** The FAQ shown on the home page, also published as FAQPage structured data. */
export const FAQS = [
  {
    q: "How does the AI generate my portfolio?",
    a: "Our proprietary AI engine analyzes your resume's structure, keywords, and work history. It then maps this data to a curated collection of high-fidelity design templates, automatically selecting layouts that best highlight your specific career strengths.",
  },
  {
    q: "Is my resume data kept private?",
    a: "Yes. Your data is encrypted and stored securely. We do not sell your personal information or use it to train public models.",
  },
  {
    q: "Can I customize the design after generation?",
    a: "Absolutely! The AI gives you a huge head start, but you have full control over colors, fonts, layouts, and individual project descriptions.",
  },
  {
    q: "What formats can I export my portfolio in?",
    a: "You can share the live web URL, export it as a clean PDF for email attachments, or pull it directly into Figma for expert-level pixel pushing.",
  },
  {
    q: "Do I need design skills to use ShortlistMe?",
    a: "Not at all. The platform is built specifically for non-designers to have top-tier, designer-quality portfolios instantly.",
  },
];
