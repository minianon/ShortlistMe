# Low-Level Design (LLD) - ShortlistMe

This document provides a technical drill-down into the specific modules and implementation patterns used in ShortlistMe.

## Resume Data Pipeline

### 1. Extraction Module (`extractTextAndLinksFromPDF`)
Located within `/api/portfolio/generate/route.ts`, this utility uses `pdfjs-dist` to perform low-level PDF parsing.
- **Capabilities**: Extracts raw text page-by-page and scans the annotation layer for hidden anchor URLs (`Link` subtype).
- **Hyperlink Mapping**: Extracted links are appended to the text context with metadata, allowing the LLM to associate text labels (like "GitHub") with their underlying targets.

### 2. LLM Intelligence (Groq)
- **Model Selection**: Defaults to `Llama-3-70b-versatile` for high-quality extraction, with fallback to `Mixtral-8x7b` for speed.
- **Context Management**: Resumes are capped at ~4.5MB to ensure processing fits within serverless time and memory limits.
- **System Prompt**: Forces JSON-only output with a strict schema including `personalInfo`, `summary`, `experience`, `projects`, `skills`, and `education`.

## Database Schema & Object Model

### 1. Portfolio Versioning
We use an **Immutable Versioning Strategy**. 
- `Portfolio` table acts as the parent entry.
- `PortfolioVersion` stores a `data` field of type `JsonB`.
- Every time a generation occurs or a user saves a major edit, a new `PortfolioVersion` is created.
- The `publishedVersionId` on the `Portfolio` table points to the currently live version.

### 2. Notification System
A bento-grid notification feed displays system events:
- `engagement`: High portfolio view count milestones.
- `system`: Important account or feature updates.
- `milestone`: First portfolio published.

## Public Rendering System

### Dynamic Routing
Next.js dynamic routes (`/[username]/page.tsx`) are used to serve portfolios.

1. **Resolution**: The `username` is looked up against the `Portfolio.slug` index.
2. **Data Fetching**: The `publishedVersion` is fetched using an optimized Prisma query (`include: { publishedVersion: true }`).
3. **Component Mapping**:
   - `HeroSection`: Renders personal info and social links.
   - `ProjectGrid`: Dynamically sizes project cards based on description length.
   - `SkillCloud`: Categorizes and displays technical proficiencies.

## Analytics Tracking
- **Click Tracking**: Uses a light-weight API endpoint (`/api/analytics/track-click`) to record engagement with outbound project links and social icons.
- **Session Duration**: A client-side "ping" system sends the time spent on the portfolio back to `/api/analytics/track-time` on page exit/visibility change.
