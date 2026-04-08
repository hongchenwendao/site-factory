# Hook Guidelines

> How hooks are used in Site Factory.

---

## Overview

Since Site Factory is primarily an SSG/ISR site using Server Components, **custom hooks are minimal**. Most data fetching happens in Server Components (no hooks needed). Hooks are used only in Client Components for interactivity.

---

## Custom Hook Patterns

### When to Create a Hook

Create a custom hook when:
- Multiple Client Components share the same stateful logic
- A Client Component's logic is complex enough to extract
- You need reusable form handling, scroll tracking, etc.

### Pattern: Form Hook

```typescript
// hooks/use-form-action.ts
'use client';
import { useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useFormAction<T>() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(url: string, data: T) {
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  return { status, error, submit };
}
```

---

## Data Fetching

### Server Components (No Hooks)

In Server Components, fetch data directly — no hooks needed:

```typescript
// app/blog/page.tsx — Server Component, no hook
export default async function BlogPage() {
  const posts = await getAllPosts(); // Direct async call
  return <PostList posts={posts} />;
}
```

### Client Components (When Needed)

For client-side data fetching (rare), use `use()` or SWR:

```typescript
// Only if you MUST fetch client-side (e.g., real-time preview)
'use client';
import useSWR from 'swr';

export function usePost(slug: string) {
  const { data, error, isLoading } = useSWR(
    `/api/posts/${slug}`,
    (url) => fetch(url).then(r => r.json()),
  );
  return { post: data, error, isLoading };
}
```

**Rule**: If you're adding `useSWR` or `useQuery`, ask yourself if a Server Component could do the job instead. 95% of the time, it can.

---

## Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| Custom hooks | `use` + PascalCase noun/verb | `useFormAction`, `useScrollPosition` |
| Hook files | `use-` + kebab-case + `.ts` | `use-form-action.ts` |
| Location | `src/hooks/` directory | `src/hooks/use-form-action.ts` |

---

## Existing Hooks (Planned)

| Hook | Purpose | Used By |
|------|---------|---------|
| `useFormAction` | Contact/newsletter form submission | `ContactForm`, `NewsletterForm` |
| `useScrollPosition` | Track scroll for sticky nav effects | `Header` |

**Keep the hook list small.** Server Components eliminate most use cases for custom hooks.

---

## Common Mistakes

1. **Creating data-fetching hooks when Server Components work** — Server Components can be async; no hook needed
2. **Using `useEffect` for data fetching** — In Next.js App Router, fetch in Server Components
3. **Making hooks that are only used once** — Extract to a hook only when logic is reused
4. **Forgetting `'use client'`** — Hooks only work in Client Components
5. **Over-abstracting** — A simple form handler doesn't need a 100-line hook abstraction
