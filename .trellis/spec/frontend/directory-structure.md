# Frontend Directory Structure

> How frontend code is organized in Site Factory.

---

## Overview

Site Factory uses Next.js App Router with a config-driven architecture. All pages are Server Components by default (SSG/ISR). Client Components are used only when interactivity is needed (forms, animations, dynamic UI).

---

## Directory Layout

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout (html, body, fonts)
│   ├── page.tsx                   # Homepage
│   ├── not-found.tsx              # 404 page
│   ├── error.tsx                  # Error boundary (client component)
│   ├── globals.css                # @theme inline + Tailwind imports
│   ├── theme.css                  # Design tokens (:root + .dark) — tweakcn compatible
│   ├── (site)/                    # Site-level route group
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog list
│   │   │   └── [slug]/page.tsx    # Blog detail
│   │   └── products/
│   │       ├── page.tsx           # Product list
│   │       └── [slug]/page.tsx    # Product detail
│   └── api/                       # API routes (backend)
├── components/
│   ├── ui/                        # Shared UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── container.tsx
│   │   └── ...
│   ├── layout/                    # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── breadcrumb.tsx
│   ├── sections/                  # Page sections (config-driven)
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── cta-banner.tsx
│   │   ├── testimonials.tsx
│   │   └── contact-form.tsx
│   ├── seo/                       # SEO-specific components
│   │   ├── json-ld.tsx
│   │   └── meta-tags.tsx
│   └── content/                   # Content rendering
│       ├── portable-text.tsx      # Sanity Portable Text renderer
│       ├── post-card.tsx
│       └── product-card.tsx
├── config/
│   └── site.config.ts             # Per-site config (branding, SEO, CTA)
├── lib/
│   ├── sanity/                    # Sanity client + queries + types
│   ├── seo/                       # SEO utilities
│   └── utils.ts                   # General utilities
└── types/
    ├── sanity.ts                  # Sanity document types
    ├── config.ts                  # Config type definitions
    └── index.ts                   # Shared type exports
```

---

## Module Organization

### Adding a New Page

1. Create directory under `app/(site)/`
2. Add `page.tsx` (Server Component)
3. If dynamic route, add `generateStaticParams` and `generateMetadata`
4. Use sections from `components/sections/`

### Adding a New Section

1. Create component in `components/sections/`
2. Props driven by site config + Sanity data
3. Keep as Server Component unless interactivity needed
4. Follow the "section" pattern: full-width wrapper + constrained content

### Adding a New Site

1. Copy `apps/site-a/` to `apps/new-site/`
2. Replace `theme.css` — export from [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme) (Tailwind v4 + oklch)
3. Update `site.config.ts` — set name, domain, nav, CTA, hero content, company info
4. Set `NEXT_PUBLIC_SITE_URL` and Sanity env vars in Vercel
5. Deploy as separate Vercel project pointing to same repo

> **No component code changes needed** — visual identity is 100% controlled by `theme.css`.

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Page files | `page.tsx` | `app/blog/page.tsx` |
| Layout files | `layout.tsx` | `app/layout.tsx` |
| Route groups | `(groupName)` | `app/(site)/` |
| Dynamic routes | `[param]` | `app/blog/[slug]/page.tsx` |
| Components | kebab-case.tsx | `hero-section.tsx` |
| Component exports | PascalCase | `HeroSection` |
| CSS modules | kebab-case.module.css | `hero-section.module.css` (if used) |
| Images | kebab-case | `hero-bg.webp` |
| Types files | camelCase | `sanity.ts`, `config.ts` |

---

## Config-Driven Rendering

The key architectural pattern: components read from config for content/structure, and from CSS variables for visual design. No hardcoded brand values.

```typescript
// Theme architecture: 3-layer separation
// 1. theme.css → :root { --primary: hsl(42 88% 60%); }  (visual identity)
// 2. globals.css → @theme inline { --color-primary: var(--primary); }  (Tailwind registration)
// 3. Components → bg-primary text-primary-foreground  (semantic classes)

// components/sections/hero.tsx — content from config, colors from theme
import { siteConfig } from '@/config/site.config';

export function Hero() {
  return (
    <section className="bg-background">
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.defaultMeta.description}</p>
      <button className="bg-primary text-primary-foreground">
        {siteConfig.cta.label}
      </button>
    </section>
  );
}
```

---

## Key Principles

1. **Server Components by default** — Only add `'use client'` when you need interactivity
2. **Config is king** — Components read config, never hardcode brand-specific values
3. **Sections are building blocks** — Pages compose sections, sections are reusable across sites
4. **SEO in every page** — Every page.tsx must export `generateMetadata`
