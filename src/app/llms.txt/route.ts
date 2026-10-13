import { FAQS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** /llms.txt — a plain-markdown summary for AI assistants and answer engines (https://llmstxt.org). */
export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `- Website: ${SITE_URL}`,
    "- Built by: Tushar Bhardwaj (https://minianon.in)",
    "- Source code: https://github.com/minianon/ShortlistMe",
    "",
    "## How it works",
    "",
    "1. Sign up and upload your resume as a PDF.",
    "2. AI reads it and extracts your experience, education, projects, skills and links.",
    "3. Your portfolio goes live at a personal link (shortlistme.site/yourname) that you can share with recruiters or add to LinkedIn.",
    "4. Pick a theme, edit any detail in the live editor, and track visits and link clicks in the analytics dashboard.",
    "",
    "## Who it is for",
    "",
    "Students, freshers and job seekers who want a professional portfolio website without writing code or designing one.",
    "",
    "## Features",
    "",
    "- AI resume extraction from PDF",
    "- Instant publishing to a personal URL",
    "- Library of themes with light and dark modes",
    "- Live editor with real-time preview",
    "- Visitor and link-click analytics",
    "- Public or private portfolio visibility",
    "",
    "## FAQ",
    "",
    ...FAQS.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
