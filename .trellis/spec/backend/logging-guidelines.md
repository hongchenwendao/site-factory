# Logging Guidelines

> How logging is done in Site Factory.

---

## Overview

Site Factory runs on Vercel, which provides built-in log streaming. We use `console` methods with structured prefixes for easy filtering in Vercel Logs. No additional logging library needed.

Key principle: **Log for debugging, not for surveillance.**

---

## Log Levels

| Level | Method | When to Use | Example |
|-------|--------|-------------|---------|
| `error` | `console.error()` | Unrecoverable failures | Sanity fetch failed, email send failed |
| `warn` | `console.warn()` | Recoverable issues | Missing optional config, fallback used |
| `info` | `console.info()` | Important business events | Contact form submitted, webhook received |
| `log` | `console.log()` | Development debugging | Query results, config values |

---

## Structured Logging Format

All logs use a `[context]` prefix pattern for easy filtering:

```typescript
// Pattern: console.level('[context] Message:', data)

// API Routes
console.error('[contact] Failed to send email:', { to, error: error.message });
console.info('[revalidate] Content updated:', { type: body._type, slug: body.slug });

// Data Fetching
console.error('[sanity] Failed to fetch posts:', { query: 'getAllPosts', error: error.message });
console.warn('[sanity] Empty result for slug:', { slug: params.slug });

// Config
console.warn('[config] Missing optional field:', { key: 'cta.whatsapp', site: siteConfig.name });
```

---

## What to Log

### Always Log

1. **API Route entry/exit** — Request received, response sent (with status)
2. **Webhook events** — Sanity webhook received and processed
3. **Contact form submissions** — Success/failure (without PII in logs)
4. **Config validation warnings** — Missing optional config fields
5. **ISR revalidation** — Which paths were revalidated

### Example: API Route Logging

```typescript
// src/app/api/revalidate/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.info('[revalidate] Webhook received:', { type: body._type, id: body._id });

    if (body._type === 'post' && body.slug) {
      revalidatePath(`/blog/${body.slug}`);
      revalidatePath('/blog');
      console.info('[revalidate] Post revalidated:', { slug: body.slug });
    }

    return Response.json({ revalidated: true });
  } catch (error) {
    console.error('[revalidate] Failed:', { error: (error as Error).message });
    return Response.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

---

## What NOT to Log

1. **PII** — Never log email addresses, phone numbers, names from contact forms
2. **API tokens / secrets** — Never log `SANITY_API_TOKEN` or any env vars
3. **Full Sanity query results** — Log only metadata (count, slugs), not full content
4. **Request headers** — May contain auth tokens
5. **User IP addresses** — Not needed for this use case

### Safe vs Unsafe Logging

```typescript
// BAD — Logging PII
console.info('[contact] New message:', { name, email, message });

// GOOD — Logging without PII
console.info('[contact] Form submitted:', { company: body.company || 'N/A' });

// BAD — Logging full content
console.log('[sanity] Fetched posts:', posts);

// GOOD — Logging metadata
console.log('[sanity] Fetched posts:', { count: posts.length, first: posts[0]?.slug });
```

---

## Vercel Logs Usage

In Vercel Dashboard → Logs:
- Filter by `[contact]` to see form submissions
- Filter by `[revalidate]` to see content updates
- Filter by `[sanity]` to see CMS fetch issues
- Filter by `[config]` to see configuration warnings

---

## Common Mistakes

1. **Logging PII in contact form** — Log only that a submission occurred, not the content
2. **Using `console.log` in production Server Components** — These appear in Vercel runtime logs but not in build logs; use `console.info` for intentional logs
3. **Not logging webhook failures** — If Sanity webhook fails, you need to know why
4. **Over-logging in SSG pages** — `generateStaticParams` runs at build time; excessive logging clutters build output
