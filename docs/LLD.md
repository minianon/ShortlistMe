# Low-Level Design (LLD) - ShortlistMe

This document provides a technical drill-down into the specific modules and implementation patterns used in ShortlistMe.

## Resume Data Pipeline

### 1. Extraction Module (`extractTextAndLinksFromPDF`)
Located within `/api/portfolio/generate/route.ts`, this utility uses `pdfjs-dist` to perform low-level PDF parsing.
- **Capabilities**: Extracts raw text page-by-page and scans the annotation layer for hidden anchor URLs (`Link` subtype).
- **Hyperlink Mapping**: Extracted links are appended to the text context with metadata, allowing the LLM to associate text labels (like "GitHub") with their underlying targets.

### 2. LLM Intelligence (Groq)
- **Model Selection**: Uses `llama-3.3-70b-versatile` for primary extraction due to its high reasoning capabilities.
- **Fallback Logic**: If the primary model fails or times out, the system automatically retries with `llama-3.1-8b-instant`.
- **System Prompt**: Enforces strict JSON-only output with a predefined schema. Hyperlinks extracted by the PDF parser are injected at the end of the prompt for context-aware mapping.

### 3. Identity Derivation Module
Located in `src/app/api/portfolio/generate/route.ts` as `deriveInfoFromEmail`.
- **Trigger**: Activated when a user signs up via email/password and Clerk does not providing first/last names.
- **Heuristics**: Strips numbers and splits the email prefix by delimiters (`.`, `_`, `-`).
- **AI Synthesis**: If simple heuristics fail, a lightweight call to `llama-3.1-8b-instant` is made to intelligently split the prefix into professional First and Last names.

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

## Onboarding Intelligence
Implemented in `src/components/OnboardingGuide.tsx`.
- **Engine**: powered by `intro.js`.
- **State Management**: Tracks progress via `localStorage` keys:
  - `shortlistme_onboarding_done`: Boolean flag to disable the tour for returning users.
  - `shortlistme_tour_phase`: Tracks the current step (overview, portfolio, insights, settings) to resume the tour across page navigations.
- **Interaction Lock**: Cascading CSS is used to disable pointer events on the main dashboard elements while the tour is active, ensuring focus on the highlighted components.

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
- **Click Tracking**: Uses `/api/analytics/track-click` to record interaction with external project and social links.
- **Session Analysis**: A client-side "ping" system sends stay-duration data to `/api/analytics/track-time` on page exit or visibility change.
- **Metric Aggregation**: Data is grouped by day/week/month for visualization in the Dashboard Analytics graph.
