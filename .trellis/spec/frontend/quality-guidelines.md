# Frontend Quality Guidelines

> Code quality standards for frontend development.

---

## Overview

Frontend quality in Site Factory means: correct SEO on every page, fast static rendering, accessible markup, and consistent design across all sites via config. Since pages are SSG/ISR, quality checks focus on build-time correctness.

---

## Required Patterns

### 1. Every Page Exports Metadata

```typescript
// Every page.tsx MUST have this
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title | Site Name',
    description: 'Page description for search engines',
    openGraph: { /* ... */ },
  };
}
```

### 2. Structured Data on Key Pages

| Page | JSON-LD Type |
|------|-------------|
| Homepage | `Organization`, `WebSite` |
| Blog post | `Article`, `BreadcrumbList` |
| Product | `Product`, `BreadcrumbList` |
| FAQ section | `FAQPage` |

### 3. Internal Linking

Every blog post must:
- Link to 1-2 related product pages
- Link to 2-3 related blog posts
- Have a CTA pointing to a money page

Every product page must:
- Link to related blog posts
- Have clear CTA

### 4. Image Optimization

Use Next.js `<Image>` component for all images:

```tsx
import Image from 'next/image';

<Image
  src={post.mainImage.asset.url}
  alt={post.mainImage.alt || post.title}
  width={1200}
  height={630}
  priority // Above the fold
/>
```

Do not pass raw CMS image objects directly to `<Image>` unless they have been validated. `src`, `width`, and `height` must all be present and valid, otherwise render a placeholder or skip the image entirely.

```tsx
const image = getRenderableImage(post.featuredImage);

return image ? (
  <Image
    src={image.asset.url}
    alt={image.alt}
    width={image.asset.width}
    height={image.asset.height}
  />
) : (
  <div>No image</div>
);
```

### 5. Answer-First Blog Structure

Blog articles follow the Answer-First pattern:
- H2 written as a question
- First sentence after H2 = direct answer
- Then expand with details
- FAQ section at bottom

---

## Forbidden Patterns

1. **No `<img>` tags** — Always use `next/image` for optimization
2. **No hardcoded strings in components** — Use config or content data
3. **No `fetch` in Client Components** — Fetch in Server Components
4. **No `useEffect` for initial data load** — Use Server Components
5. **No inline styles for layout** — Use Tailwind utilities
6. **No `dangerouslySetInnerHTML` except JSON-LD** — One approved exception
7. **No `next/link` missing from internal links** — All internal links use `<Link>`
8. **No hardcoded color values** — No hex (`bg-blue-500`), no raw CSS var refs (`bg-(--color-accent)`), no `style` for colors. Use semantic classes (`bg-primary`, `text-muted-foreground`, `border-border`)
9. **No `style={getThemeStyle()}`** — Colors are defined in `theme.css` CSS variables, not injected via inline styles
10. **No unvalidated CMS image props in `<Image>`** — Never pass empty string, `undefined`, or `NaN` dimensions from content data

---

## Performance Standards

### Core Web Vitals Targets

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 2.5s | SSG + CDN, optimize hero images |
| FID | < 100ms | Minimal JS, Server Components |
| CLS | < 0.1 | Image dimensions, font `display: swap` |

### Build Performance

- Use `next/image` with `sizes` prop for responsive images
- Preload hero images with `priority` prop
- Use `next/font` for font loading (no layout shift)
- Minimize Client Components (reduces JS bundle)

---

## Testing Requirements

### Visual Testing (Manual)

Before release, verify:
- [ ] Homepage renders correctly on mobile + desktop
- [ ] Blog list and detail pages render with real content
- [ ] Product pages render with images and specs
- [ ] Contact form submits successfully
- [ ] 404 page shows for invalid routes
- [ ] All internal links work (no broken links)

### SEO Testing

- [ ] View page source: meta tags present
- [ ] Google Rich Results Test: structured data passes
- [ ] Sitemap.xml generated and accessible
- [ ] Robots.txt present and correct
- [ ] Canonical URLs set on all pages
- [ ] Open Graph images render in social previews

---

## Code Review Checklist

### SEO Review
- [ ] `generateMetadata` exported from every page
- [ ] JSON-LD structured data present on homepage, blog, product pages
- [ ] `<Image>` used with `alt` text
- [ ] `<Image>` never receives empty `src` or invalid dimensions from CMS data
- [ ] Internal links use `<Link>` not `<a>`
- [ ] Canonical URL set

### Accessibility Review
- [ ] Semantic HTML used (`<article>`, `<nav>`, `<main>`)
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Focus states visible
- [ ] Skip-to-content link present

### Config Review
- [ ] No hardcoded brand values (colors, names, domains)
- [ ] Component works with different config values
- [ ] CTA type matches config (`form` | `email` | `whatsapp`)

### Performance Review
- [ ] Server Components used where possible
- [ ] Hero images have `priority` prop
- [ ] No unnecessary `'use client'` directives
- [ ] Fonts loaded with `next/font`
