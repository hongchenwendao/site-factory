# Database Guidelines

> Content storage patterns using Sanity CMS.

---

## Overview

Site Factory uses **Sanity CMS** as its content database. There is no traditional SQL database — all content (blog posts, products, pages, site settings) lives in Sanity datasets. The client library is `@sanity/client` with GROQ query language.

- Each site has its own Sanity **dataset** (data isolation)
- Sites can share a Sanity **project** or use separate projects
- Free tier: 2 datasets + 100K API requests/month per project

---

## Sanity Client Setup

```typescript
// src/lib/sanity/client.ts
import { createClient } from '@sanity/client';
import { siteConfig } from '@/config/site.config';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: siteConfig.content.sanityDataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // CDN in prod, fresh in dev
});

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: siteConfig.content.sanityDataset,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!, // Server-side only
  useCdn: false,
});
```

---

## Schema Patterns

### Blog Post Schema

```typescript
// sanity/schemas/post.ts
defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: (R) => R.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text' },
    { name: 'mainImage', type: 'image', options: { hotspot: true } },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'relatedProducts', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'seo', type: 'object', fields: [
      { name: 'metaTitle', type: 'string' },
      { name: 'metaDescription', type: 'text' },
      { name: 'keywords', type: 'array', of: [{ type: 'string' }] },
    ]},
  ],
});
```

### Product Schema

```typescript
// sanity/schemas/product.ts
defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: (R) => R.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text' },
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    { name: 'specs', type: 'array', of: [{ type: 'object', fields: [
      { name: 'label', type: 'string' },
      { name: 'value', type: 'string' },
    ]}] },
    { name: 'relatedPosts', type: 'array', of: [{ type: 'reference', to: [{ type: 'post' }] }] },
    { name: 'seo', type: 'object', fields: [/* same as post */] },
  ],
});
```

---

## GROQ Query Patterns

All queries centralized in `src/lib/sanity/queries.ts`:

```typescript
// Simple list query with projection
export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    "mainImage": mainImage.asset->url,
    categories[]->{ title, "slug": slug.current }
  }`);
}

// Single item by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    ..., "mainImage": mainImage.asset->url,
    categories[]->{ title, "slug": slug.current },
    relatedProducts[]->{ title, "slug": slug.current, "mainImage": mainImage.asset->url }
  }`, { slug });
}

// Sitemap data (all slugs)
export async function getAllSlugs(): Promise<{ posts: string[], products: string[] }> {
  const [posts, products] = await Promise.all([
    client.fetch(`*[_type == "post" && defined(slug.current)]."slug": slug.current`),
    client.fetch(`*[_type == "product" && defined(slug.current)]."slug": slug.current`),
  ]);
  return { posts, products };
}
```

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Schema types | camelCase, singular | `post`, `product`, `category` |
| Field names | camelCase | `publishedAt`, `mainImage` |
| Slug fields | Always `slug` with `slug.current` pattern | `"slug": slug.current` |
| Reference fields | Plural for arrays | `relatedProducts`, `categories` |
| Dataset names | kebab-case, site-identifiable | `solar-prod`, `rv-parts` |

---

## Write Operations (Content Pipeline)

Content is written via the **write client** (server-side only, requires API token):

```typescript
// Content pipeline: batch create posts
export async function createPost(post: CreatePostInput): Promise<string> {
  const doc = {
    _type: 'post',
    title: post.title,
    slug: { current: slugify(post.title) },
    body: post.body, // Portable Text array
    publishedAt: new Date().toISOString(),
    seo: { metaTitle: post.metaTitle, metaDescription: post.metaDescription },
  };
  const result = await writeClient.create(doc);
  return result._id;
}
```

---

## ISR Integration

When content changes in Sanity, trigger ISR revalidation:

```typescript
// src/app/api/revalidate/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // Sanity webhook sends: { _type, slug, _id }
  if (body._type === 'post') {
    revalidatePath(`/blog/${body.slug}`);
    revalidatePath('/blog');
  }
  if (body._type === 'product') {
    revalidatePath(`/products/${body.slug}`);
    revalidatePath('/products');
  }
  revalidatePath('/'); // Homepage may show latest content
  return Response.json({ revalidated: true });
}
```

---

## Common Mistakes

1. **Forgetting `defined(slug.current)`** — Always filter for documents with valid slugs to avoid 404s
2. **Using `useCdn: true` with write operations** — CDN client has stale data; always use non-CDN client for writes
3. **Exposing API token client-side** — `writeClient` must ONLY be used in Server Components, API Routes, or Server Actions
4. **Not setting `apiVersion`** — Always pin to a specific date version for consistent behavior
5. **Over-fetching in list queries** — Use projections (`{ _id, title, slug }`) instead of `...` for list pages
