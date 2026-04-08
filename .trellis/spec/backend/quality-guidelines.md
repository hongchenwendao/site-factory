# Backend Quality Guidelines

> Code quality standards for backend development.

---

## Overview

Backend quality in Site Factory means: correct Sanity queries, secure API routes, proper TypeScript types, and SEO-correct data structures. Since there is no traditional backend server, quality focuses on API Routes, Server Actions, and data fetching patterns.

---

## Required Patterns

### 1. Type-Safe Sanity Queries

All query return types must be explicitly typed:

```typescript
// GOOD
export async function getAllPosts(): Promise<Post[]> {
  return client.fetch<Post[]>(groq`*[_type == "post"]{ _id, title }`);
}

// BAD — no return type
export async function getAllPosts() {
  return client.fetch(`*[_type == "post"]{ _id, title }`);
}
```

### 1.1 Normalize CMS Payloads at the Query Boundary

Sanity projections can still return `null`, missing arrays, or incomplete image assets even when the TypeScript return type looks strict. Query helpers must normalize those shapes before the app consumes them.

```typescript
function normalizePostSummary(post: PostSummary): PostSummary {
  return {
    ...post,
    categories: post.categories ?? [],
    relatedProducts: post.relatedProducts ?? [],
  };
}

export async function getPostSummaries(): Promise<PostSummary[]> {
  const posts = await fetchWithFallback(postSummaryQuery, undefined, demoPosts);
  return posts.map(normalizePostSummary);
}
```

### 2. Input Validation at Boundaries

All API routes that accept input must validate with Zod:

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const validated = contactSchema.parse(body); // Throws if invalid
  // ... proceed with validated data
}
```

### 3. Environment Variable Safety

- Client-side vars: `NEXT_PUBLIC_` prefix, never secret
- Server-side vars: No prefix, accessed only in Server Components / API Routes
- Always provide fallbacks for optional vars:

```typescript
const apiVersion = process.env.SANITY_API_VERSION ?? '2024-01-01';
```

### 4. Config Validation

Validate site config at startup (build time):

```typescript
// src/config/site.config.ts
import { z } from 'zod';

const siteConfigSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  locale: z.string().default('en-US'),
  type: z.enum(['b2b-product', 'b2b-service', 'b2c-dtc']),
  // ... more fields
});

export const siteConfig = siteConfigSchema.parse(rawConfig);
```

---

## Forbidden Patterns

1. **No `any` type** — Use unknown + type narrowing or proper types
2. **No inline GROQ strings scattered in components** — Centralize all queries in `src/lib/sanity/queries.ts`
3. **No direct `fetch` to Sanity in client components** — Always use Server Components or API Routes
4. **No storing secrets in `NEXT_PUBLIC_` vars** — These are exposed to the browser
5. **No hardcoded site-specific values** — Everything site-specific goes through config

---

## SEO Quality Checklist

Every page's data fetching must include:

- [ ] `title` and `description` for metadata generation
- [ ] `slug` for canonical URL
- [ ] `ogImage` for social sharing (or fallback from config)
- [ ] JSON-LD structured data where applicable
- [ ] Proper `lastModified` for sitemap

---

## Testing Requirements

### API Routes

Test critical API routes (especially webhook handlers):

```typescript
// __tests__/api/revalidate.test.ts
describe('POST /api/revalidate', () => {
  it('revalidates blog paths when post is updated', async () => {});
  it('returns 400 for invalid payload', async () => {});
  it('returns 401 without valid webhook secret', async () => {});
});
```

### Data Fetching

Test query functions with mocked Sanity client:

```typescript
// __tests__/lib/queries.test.ts
describe('getAllPosts', () => {
  it('returns only published posts with valid slugs', async () => {});
  it('returns empty array on fetch error', async () => {});
});
```

---

## Code Review Checklist

- [ ] No hardcoded site-specific values (use config)
- [ ] API routes validate input with Zod
- [ ] Sanity queries use projections (not `...` for lists)
- [ ] Error handling wraps all async operations
- [ ] No PII in logs
- [ ] Environment variables properly prefixed
- [ ] ISR revalidation works for new/updated content
- [ ] SEO metadata generated from content data
- [ ] Query helpers normalize nullable arrays / partial CMS payloads before returning
