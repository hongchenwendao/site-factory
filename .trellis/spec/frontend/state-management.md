# State Management

> How state is managed in Site Factory.

---

## Overview

Site Factory is an SSG/ISR site with minimal client-side state. The architecture favors **server-side data resolution** over client-side state management. There is no Redux, Zustand, or global state library.

**Principle: If data can be resolved at build time, it should be.**

---

## State Categories

| Category | Where | Mechanism | Example |
|----------|-------|-----------|---------|
| Content data | Server | Sanity fetch in Server Components | Blog posts, products |
| Site config | Server | `site.config.ts` import | Brand name, colors, nav |
| URL state | Server | Next.js params + searchParams | `?page=2`, `/blog/[slug]` |
| Form state | Client | `useState` in Client Component | Contact form inputs |
| UI state | Client | `useState` in Client Component | Mobile menu open/close |

---

## Server State (Content Data)

All content comes from Sanity and is resolved at build/request time:

```typescript
// Server Component — no client state needed
export default async function BlogPage() {
  const posts = await getAllPosts();
  // posts is resolved server-side, sent as static HTML
  return <PostList posts={posts} />;
}
```

For ISR (Incremental Static Regeneration), Next.js handles revalidation:

```typescript
// Blog detail page with ISR
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return <BlogPost post={post} />;
}
```

### No SWR/React Query Needed

Because:
1. Content updates via Sanity webhook → ISR revalidation (not client polling)
2. Pages are statically generated (instant load)
3. User-specific data is not needed (no dashboard, no auth)

---

## URL State

URL is the primary state mechanism for navigation:

```typescript
// Search params as state (pagination, filters)
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const products = await getProducts({ page, category: searchParams.category });
  return <ProductList products={products} currentPage={page} />;
}
```

Dynamic route params:

```typescript
// [slug] as state
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return <ProductDetail product={product} />;
}
```

---

## Client State (When Needed)

Client state is minimal. Use `useState` only for:

### Form State

```tsx
'use client';
export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
    setStatus('sent');
  }
}
```

### UI Toggle State

```tsx
'use client';
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && <nav>{children}</nav>}
    </>
  );
}
```

---

## When to Use Global State

**Answer: Almost never in this project.**

Global state (context, Redux, Zustand) would be appropriate if we had:
- User authentication
- Shopping cart
- Theme toggle (dark/light mode)
- Real-time notifications

None of these exist in the current MVP. If B2C e-commerce is added later (Stripe/Shopify), only then consider:
- **Cart**: `useState` + context, or Stripe session-based
- **Auth**: NextAuth.js with session context

---

## Common Mistakes

1. **Adding React Query for content fetching** — Use Server Components + Sanity client instead
2. **Using `useState` for data that comes from the server** — Fetch in Server Component, pass as props
3. **Creating a global context for site config** — Import `site.config.ts` directly; it's a static module
4. **Client-side pagination with state** — Use URL params (`?page=2`) + Server Component
5. **Over-engineering state for a static site** — This is SSG, not SPA
