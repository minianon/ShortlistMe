# High-Level Design (HLD) - ShortlistMe

ShortlistMe is an AI-powered portfolio generation platform designed to transform raw resumes into professional, shareable web portfolios instantly.

## System Architecture

ShortlistMe follows a modern serverless architecture built on the Next.js ecosystem.

```mermaid
graph TD
    User((User))
    Store[(PostgreSQL - Prisma)]
    Bucket[(Supabase Storage)]
    
    subgraph "Frontend (Next.js App Router)"
        Dashboard[User Dashboard]
        Editor[Portfolio Editor]
        PublicView[Public Portfolio Renderer]
    end

    subgraph "API Layer (Serverless)"
        Auth[Clerk Auth]
        UploadAPI[/api/resume/upload]
        GenAPI[/api/portfolio/generate]
        PublicAPI[/api/portfolio/publish]
    end

    subgraph "AI & Processing"
        Parser[PDF.js Text & Link Extractor]
        Groq[Groq AI - LLM Extraction]
    end

    User --> Auth
    Auth --> Dashboard
    Dashboard --> UploadAPI
    UploadAPI --> Bucket
    Dashboard --> GenAPI
    GenAPI --> Parser
    Parser --> Groq
    Groq --> Store
    PublicView --> Store
```

## Core Components

### 1. Authentication (Clerk)
- Handles user registration, login, and session management.
- Integrated via middleware to protect dashboard and API routes.

### 2. Data Layer (Prisma & PostgreSQL)
- **Primary Database**: PostgreSQL hosted on Supabase.
- **ORM**: Prisma for type-safe database access.
- **Storage**: Supabase Buckets for hosting original PDF resume files.

### 3. AI Pipeline
- **Orchestration**: Next.js Server Actions and API Routes.
- **Extraction**: `pdfjs-dist` for extracting raw text and embedded metadata (links).
- **Inference**: Groq (Llama-3/Mixtral) for converting raw resume text into structured Portfolio JSON.

### 4. Rendering Engine
- **Dashboard**: A React-based command center for managing resumes and portfolios.
- **Portfolio Renderer**: A high-performance, SEO-optimized page that renders JSON data into beautiful UI themes.

## Data Flow (Resume to Portfolio)
1. **Upload**: User uploads PDF -> API saves to Supabase Storage -> Prisma records Resume metadata.
2. **Parsing**: API pulls PDF -> PDF.js extracts text + anchor links.
3. **Generation**: Text is sent to Groq -> AI returns structured JSON matching our `PortfolioVersion` schema.
4. **Customization**: User edits data in the dashboard -> Prisma updates the JSON draft.
5. **Deployment**: User clicks "Publish" -> Current draft is pinned as the `publishedVersion` and becomes public at `shortlist.me/[slug]`.
