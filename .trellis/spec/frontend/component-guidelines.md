# Component Guidelines

> How components are built in Site Factory.

---

## Overview

Components in Site Factory follow a strict hierarchy: **Server Components by default, Client Components only when necessary**. The component tree is designed for SSG/ISR — most components render at build time and serve as static HTML.

---

## Component Categories

| Category | Location | Rendering | Purpose |
|----------|----------|-----------|---------|
| Sections | `components/sections/` | Server | Page-level building blocks (hero, features, CTA) |
| Layout | `components/layout/` | Server | Header, footer, navigation, breadcrumb |
| Content | `components/content/` | Server | Post cards, product cards, Portable Text renderer |
| SEO | `components/seo/` | Server | JSON-LD, meta tags |
| UI Primitives | `components/ui/` | Server/Client | Button, Card, Container |

---

## Server vs Client Components

### Use Server Component (default, no directive)

- Data display (blog posts, products, testimonials)
- SEO components (metadata, structured data)
- Static layout (header, footer, navigation links)
- Content rendering (Portable Text)

### Use Client Component (`'use client'`)

- Interactive forms (contact form, newsletter signup)
- Animation / scroll effects (intersection observer)
- Browser-only APIs (clipboard, geolocation)
- State-dependent UI (tabs, toggles, modals)

```typescript
// GOOD — Server Component (default)
export function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </article>
  );
}

// GOOD — Client Component (needs interactivity)
'use client';
export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  // form logic...
}
```

---

## Component Structure

Standard component file order:

```typescript
// 1. 'use client' directive (if needed)
'use client';

// 2. Imports
import { type Post } from '@/types/sanity';

// 3. Types
interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured';
}

// 4. Component
export function PostCard({ post, variant = 'default' }: PostCardProps) {
  // ...render
}

// 5. Sub-components (if any, or extract to separate file)
```

---

## Props Conventions

1. **Use interface, not type** for props
2. **Destructure in function signature**, not inside body
3. **Objects over primitives** for complex data (pass `post` not `title, excerpt, date, image`)
4. **Optional props have defaults** via destructuring

```typescript
// GOOD
interface HeroProps {
  heading: string;
  subheading?: string;
  cta: CTAConfig;
  variant?: 'full' | 'split';
}

export function Hero({ heading, subheading, cta, variant = 'full' }: HeroProps) {}

// BAD — too many primitives
export function Hero({ title, subtitle, btnText, btnUrl, bgColor, textColor }: any) {}
```

---

## Styling Patterns

### Tailwind CSS (Primary)

All styling uses Tailwind CSS utility classes:

```tsx
<section className="relative py-20 px-4 md:px-8">
  <div className="mx-auto max-w-7xl">
    <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
      {heading}
    </h1>
  </div>
</section>
```

### shadcn/ui Semantic Colors (Mandatory)

All colors use semantic Tailwind classes backed by CSS variables in `theme.css`. Components NEVER reference specific hex values, raw CSS variable names, or inline styles.

```tsx
// GOOD — semantic classes only
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  {label}
</button>
<footer className="bg-accent text-accent-foreground">
  {/* ... */}
</footer>

// BAD — hardcoded CSS variable references
<button className="bg-(--color-accent) text-(--color-accent-ink)">

// BAD — hardcoded hex colors
<button className="bg-blue-500 text-white">

// BAD — inline styles for colors
<section style={{ background: siteConfig.colors.primary }}>
```

**Token mapping (project convention)**:

| Token | Semantic role | Usage |
|-------|--------------|-------|
| `primary` | Gold — CTA buttons, eyebrow text, badges | `bg-primary`, `text-primary` |
| `accent` | Dark green — brand sections, links, tags | `bg-accent`, `text-accent` |
| `secondary` | Warm surface — muted backgrounds, card sections | `bg-secondary`, `text-secondary-foreground` |
| `muted` | Subtle backgrounds & text | `bg-muted`, `text-muted-foreground` |
| `card` | Card surfaces | `bg-card`, `text-card-foreground` |
| `destructive` | Error states | `text-destructive` |
| `border` | All borders | `border-border` |
| `input` | Form input borders | `border-input` |
| `ring` | Focus rings | `ring-ring` |

**Theme swapping**: Replace `theme.css` `:root` and `.dark` blocks with tweakcn export. Zero component changes needed.

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Every section must look good on mobile (verified)

---

## SEO Component Patterns

### JSON-LD Component

```tsx
// components/seo/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Metadata in Pages

Every page MUST export `generateMetadata`:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    openGraph: { images: [post.mainImage] },
  };
}
```

---

## Accessibility

1. **Semantic HTML** — Use `<article>`, `<nav>`, `<main>`, `<section>`, `<aside>`
2. **Alt text** — All images must have descriptive `alt` (from Sanity or fallback)
3. **Form labels** — Every input has an associated `<label>`
4. **Focus management** — Interactive elements are keyboard-accessible
5. **Color contrast** — Ensure WCAG AA minimum contrast ratios

---

## Common Mistakes

1. **Adding `'use client'` unnecessarily** — If the component doesn't use hooks or event handlers, it's a Server Component
2. **Hardcoding brand colors** — Use config values or CSS variables
3. **Missing `generateMetadata`** — Every page needs metadata for SEO
4. **Large client bundles** — Keep Client Components small; push logic to Server Components
5. **Not using `<article>` for blog/product cards** — Semantic HTML matters for SEO
