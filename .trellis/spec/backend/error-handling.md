# Error Handling

> How errors are handled in Site Factory.

---

## Overview

Error handling follows Next.js App Router conventions. Since this is primarily an SSG/ISR site with API Routes, error patterns are simpler than a traditional server app.

Key principles:
- **Graceful degradation**: Content fetch failure should show fallback, not crash
- **Never leak internals**: API errors return generic messages to clients
- **Log everything**: Server-side errors logged with context for debugging
- **SEO-first**: Error pages should still have proper meta tags

---

## Error Types

### Site-Specific Error Types

```typescript
// src/lib/errors.ts
export class SanityFetchError extends Error {
  constructor(
    message: string,
    public readonly query: string,
    public readonly params?: Record<string, string>,
  ) {
    super(message);
    this.name = 'SanityFetchError';
  }
}

export class ConfigError extends Error {
  constructor(
    message: string,
    public readonly configKey: string,
  ) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ContactFormError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'ContactFormError';
  }
}
```

---

## API Route Error Responses

All API routes return errors in a consistent format:

```typescript
// src/lib/api-response.ts
type ApiError = {
  error: string;        // Human-readable message (safe for client)
  code: string;         // Machine-readable error code
  details?: unknown;    // Only in development
};

// Success helper
export function apiSuccess<T>(data: T, status = 200): Response {
  return Response.json({ data }, { status });
}

// Error helper
export function apiError(
  message: string,
  code: string,
  status = 500,
  details?: unknown,
): Response {
  const body: ApiError = {
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && { details }),
  };
  return Response.json(body, { status });
}
```

### Usage in API Routes

```typescript
// src/app/api/contact/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body); // Zod validation
    await sendEmail(validated);
    return apiSuccess({ sent: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid form data', 'VALIDATION_ERROR', 400, error.issues);
    }
    console.error('[contact] Failed to send email:', error);
    return apiError('Failed to send message', 'EMAIL_ERROR', 500);
  }
}
```

---

## Error Handling Patterns

### Server Components (Data Fetching)

Server Components that fetch from Sanity should handle errors gracefully:

```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error('[blog] Failed to fetch posts:', error);
    // Show empty state instead of crashing
  }

  if (posts.length === 0) {
    return <EmptyBlogState />;
  }

  return <PostList posts={posts} />;
}
```

### Dynamic Routes (Slug-based)

Use `notFound()` for missing content:

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound(); // Renders not-found.tsx
  }

  return <BlogPost post={post} />;
}
```

### Error Boundary

```typescript
// app/error.tsx
'use client';
export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1>Something went wrong</h1>
      <p>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Validation Errors

Use Zod for input validation at system boundaries:

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
  company: z.string().optional(),
});

export const revalidateSchema = z.object({
  _type: z.enum(['post', 'product', 'page']),
  slug: z.string().optional(),
  _id: z.string(),
});
```

---

## Common Mistakes

1. **Crashing on Sanity fetch failure** — Always wrap `client.fetch()` in try-catch; show fallback UI
2. **Returning raw error messages** — Never expose stack traces or query details to the client
3. **Using `throw` in Server Components without error.tsx** — Always provide an `error.tsx` boundary
4. **Missing `notFound()` for empty slug results** — Return `notFound()` instead of rendering empty page
5. **Not validating webhook payloads** — The revalidate endpoint should verify the request comes from Sanity
