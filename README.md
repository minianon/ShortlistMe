<p align="center">
  <img src="src/app/icon.svg" width="120" alt="ShortlistMe Logo" />
</p>

<h1 align="center">ShortlistMe</h1>

<p align="center">
  <strong>Transform your resume into a stunning, professional portfolio in seconds.</strong>
</p>

<p align="center">
  <a href="#shortlistme-in-plain-english">About</a> •
  <a href="#key-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="./docs/HLD.md">Documentation</a>
</p>

---

## ShortlistMe in Plain English
**Imagine having a personal website that builds itself.**

Most people find it hard to create a professional portfolio. You have to worry about design, hosting, and writing the same information over and over again.

**ShortlistMe** solves this by using AI. You simply upload your existing resume (PDF), and within seconds, the system "reads" it and builds a beautiful, live website for you. You get a unique link (like `shortlist.me/yourname`) that you can send to recruiters or put on your LinkedIn profile.

**No coding. No design skills. Just your skills, beautifully presented.**

---

## Key Features

### The Experience
- **AI-Powered Extraction**: Upload a PDF, and our AI (Groq + Llama-3) extracts every detail, from your job history to hidden links in your resume.
- **Instant Deployment**: Your portfolio is live the moment you click generate.
- **Interactive Analytics**: See exactly how many people are viewing your portfolio and which of your project links they are clicking.
- **Smart Notifications**: Get notified when you reach a new milestone or high engagement.

### Customization
- **Theme Selection**: Choose from a library of premium, high-contrast themes optimized for readability.
- **Live Editor**: Fine-tune your details, add new projects, or update your skills with a real-time preview.
- **Brand Consistency**: Automatically ensures your LinkedIn, GitHub, and Portfolio links are synced and active.

---

## Tech Stack

Built with a high-performance modern stack for speed and reliability:

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **AI Intelligence**: [Groq Cloud](https://groq.com/) (Ultra-fast inference)
- **PDF Engine**: [PDF.js](https://mozilla.github.io/pdf.js/)
- **Infrastructure**: [Vercel](https://vercel.com/) & [Supabase](https://supabase.com/)

---

## Project Structure
```text
src/
├── app/          # Next.js pages & API routes
├── components/   # UI components & Design System
├── server/       # Database & Logic layer
└── lib/          # Utilities & Shared Types
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase URL)
- Clerk API Keys
- Groq API Key

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/TuShArBhArDwA/ShortlistMe.git
   cd ShortlistMe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file based on the provided configuration for Clerk, Supabase, and Groq.

4. **Initialize Database**
   ```bash
   npm run prisma:generate
   ```

5. **Run locally**
   ```bash
   npm run dev
   ```

---

## Technical Documentation
For developers looking to contribute or understand the internals:
- [**High-Level Design (HLD)**](./docs/HLD.md)
- [**Low-Level Design (LLD)**](./docs/LLD.md)

---

## Team Workflow
- **Agile Process**: Tasks are tracked in a shared board.
- **Code Standards**: Each feature requires a thorough review before merging.
- **Focus**: Delivering a premium, "wow-factor" experience for the end-user.

---

<p align="center">
  Built with ❤️ for professionals everywhere.
</p>
