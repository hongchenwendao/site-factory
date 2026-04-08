# Backend Directory Structure

> How backend code is organized in this project.

---

## Overview

Site Factory uses Next.js App Router as both frontend and backend. There is no separate backend service — API Routes, Server Actions, and Sanity GROQ queries serve as the backend layer. The project is a monorepo where multiple sites share the same codebase but differ by config.

---

## Directory Layout

```
site-factory/
├── src/
│   ├── app/                    # Next.js App Router (routes = backend endpoints)
│   │   ├── (site)/             # Site-level route group
│   │   │   ├── page.tsx        # Homepage (SSG)
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx    # Blog list (SSG)
│   │   │   │   └── [slug]/page.tsx  # Blog detail (SSG + ISR)
│   │   │   └── products/
│   │   │       ├── page.tsx    # Product list (SSG)
│   │   │       └── [slug]/page.tsx  # Product detail (SSG + ISR)
│   │   ├── api/                # API Routes (backend logic)
│   │   │   ├── revalidate/route.ts  # Sanity webhook → ISR trigger
│   │   │   ├── contact/route.ts     # Contact form handler
│   │   │   └── health/route.ts      # Health check
│   │   └── layout.tsx
│   ├── config/                 # Config-driven architecture core
│   │   ├── site.config.ts      # Per-site config entry
│   │   └── sites/              # Multi-site configs
│   │       ├── site-a.config.ts
│   │       └── site-b.config.ts
│   ├── lib/                    # Shared business logic
│   │   ├── sanity/             # Sanity client & queries
│   │   │   ├── client.ts       # Sanity client init
│   │   │   ├── queries.ts      # GROQ queries
│   │   │   └── types.ts        # Auto-generated Sanity types
│   │   ├── seo/                # SEO utilities
│   │   │   ├── metadata.ts     # Dynamic metadata generation
│   │   │   ├── jsonld.ts       # JSON-LD structured data
│   │   │   └── sitemap.ts      # Sitemap generation config
│   │   ├── email/              # Email sending (contact form)
│   │   └── utils.ts            # General utilities
│   └── components/             # Shared UI components
├── sanity/                     # Sanity CMS schemas
│   ├── schemas/                # Content type definitions
│   │   ├── post.ts             # Blog post schema
│   │   ├── product.ts          # Product schema
│   │   ├── page.ts             # Static page schema
│   │   └── settings.ts         # Site settings schema
│   └── sanity.config.ts
├── public/                     # Static assets
├── next.config.ts
├── next-sitemap.config.js      # Sitemap auto-generation
└── .env.local                  # Sanity ID + Token + site config
```

---

## Module Organization

### API Routes (`src/app/api/`)

Each API route is a self-contained endpoint:

```
api/
├── revalidate/route.ts   # POST: Sanity webhook → revalidatePath/revalidateTag
├── contact/route.ts      # POST: Form submission → email/notification
└── health/route.ts       # GET: Service health check
```

### Sanity Layer (`src/lib/sanity/`)

- **client.ts** — Configured Sanity client with dataset from site config
- **queries.ts** — All GROQ queries centralized here
- **types.ts** — Auto-generated types from `sanity codegen`

### Config Layer (`src/config/`)

The config layer is the heart of the multi-site architecture. Each site has a `site.config.ts` that defines ALL site-specific values.

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| API route files | `route.ts` (Next.js convention) | `api/contact/route.ts` |
| Sanity schemas | camelCase, singular noun | `post.ts`, `product.ts` |
| GROQ query functions | `get` + PascalCase | `getAllPosts()`, `getProductBySlug()` |
| Config files | kebab-case + `.config.ts` | `solar-panel-pro.config.ts` |
| Environment variables | `NEXT_PUBLIC_` prefix for client-side | `NEXT_PUBLIC_SANITY_PROJECT_ID` |
| Lib files | kebab-case | `json-ld.ts`, `metadata.ts` |

---

## Key Patterns

1. **Config-Driven**: All site differences live in `site.config.ts`. Code reads config, never hardcodes site-specific values.
2. **API Routes as Backend**: No separate Express/Fastify server. Next.js API Routes handle webhooks, form submissions, and internal APIs.
3. **Sanity as Database**: Content (blog posts, products, pages) lives in Sanity CMS. No SQL database for content.
4. **SSG + ISR**: Pages are statically generated at build time. ISR updates individual pages when Sanity content changes.
