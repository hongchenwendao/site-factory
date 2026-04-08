# Type Safety

> Type safety patterns in Site Factory.

---

## Overview

Site Factory uses **TypeScript strict mode** throughout. Types are the primary form of documentation — if the types are correct, the code works. Sanity types are auto-generated where possible; config types use Zod for runtime validation.

---

## Type Organization

```
src/types/
├── sanity.ts        # Sanity document types (auto-generated or manual)
├── config.ts        # Site config type definitions
└── index.ts         # Re-exports + shared utility types
```

### Sanity Types

Define types matching Sanity schemas:

```typescript
// src/types/sanity.ts
export interface SanityImage {
  asset: { url: string; alt?: string };
  alt?: string;
}

export interface SEOMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: SanityImage;
}

export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  publishedAt: string;
  categories?: Category[];
  relatedProducts?: Product[];
  seo?: SEOMeta;
}

export interface Product {
  _id: string;
  _type: 'product';
  title: string;
  slug: { current: string };
  description?: string;
  images?: SanityImage[];
  specs?: { label: string; value: string }[];
  relatedPosts?: Post[];
  seo?: SEOMeta;
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}
```

### Config Types

```typescript
// src/types/config.ts
export type BusinessType = 'b2b-product' | 'b2b-service' | 'b2c-dtc';
export type CTAType = 'form' | 'email' | 'whatsapp';

export interface SiteConfig {
  name: string;
  domain: string;
  locale: string;
  logo: string;
  colors: { primary: string; accent: string };
  type: BusinessType;
  defaultMeta: {
    titleTemplate: string;
    description: string;
  };
  cta: { text: string; type: CTAType };
  content: {
    sanityDataset: string;
    blogEnabled: boolean;
    productsEnabled: boolean;
    autoPublish: boolean;
  };
  nav: { label: string; href: string }[];
}
```

---

## Validation (Zod)

### Config Validation

```typescript
// src/config/site.config.ts
import { z } from 'zod';

const siteConfigSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  locale: z.string().default('en-US'),
  type: z.enum(['b2b-product', 'b2b-service', 'b2c-dtc']),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be hex color'),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be hex color'),
  }),
  cta: z.object({
    text: z.string().min(1),
    type: z.enum(['form', 'email', 'whatsapp']),
  }),
  // ... all other fields
});

// Parse at module load time — errors caught at build time
export const siteConfig = siteConfigSchema.parse(rawConfig);
```

### API Input Validation

```typescript
// src/lib/validation.ts
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  company: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
});
```

---

## Common Patterns

### Type Narrowing

```typescript
// Discriminated union for different page types
type PageData = Post | Product;

function isPost(data: PageData): data is Post {
  return data._type === 'post';
}

// Usage
if (isPost(data)) {
  // TypeScript knows data is Post here
}
```

### Generic API Response

```typescript
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: string };
```

### Extract Component Props

```typescript
type ComponentProps<T extends (...args: any) => any> = Parameters<T>[0];

// Usage
type PostCardProps = ComponentProps<typeof PostCard>;
```

---

## Forbidden Patterns

1. **No `any`** — Use `unknown` + type narrowing, or define proper types
2. **No `@ts-ignore` / `@ts-expect-error`** — Fix the type error, don't suppress it
3. **No type assertions (`as`) without safety check** — Use type guards instead
4. **No `// @ts-nocheck` in any file** — Ever
5. **No non-null assertions (`!`) without certainty** — Use optional chaining instead
6. **No `baseUrl` in tsconfig** — Deprecated since TS 5.x, will break in TS 7.0

### Exceptions

The only acceptable use of type assertions:

```typescript
// JSON-LD injection (controlled internal content)
dangerouslySetInnerHTML={{ __html: JSON.stringify(data) } as { __html: string }}

// CSS custom properties from config
style={{ '--primary': siteConfig.colors.primary } as React.CSSProperties }
```

---

## Common Mistakes

### Using `baseUrl` in tsconfig

**Symptom**: VSCode shows deprecation warning: `The option "baseUrl" is deprecated and will stop working in TypeScript 7.0`.

**Cause**: `baseUrl` was previously required alongside `paths` for path aliases. Since `moduleResolution: "Bundler"` is used in this project, `paths` resolve relative to the tsconfig file location automatically.

**Fix**: Remove `baseUrl` from all tsconfig files. Keep `paths` unchanged.

```jsonc
// Wrong — triggers deprecation warning
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}

// Correct — paths work without baseUrl under moduleResolution: "Bundler"
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Affected files**: `tsconfig.base.json` and all `apps/*/tsconfig.json`.

**Prevention**: When creating a new app tsconfig, never add `baseUrl`. Only use `paths` with relative paths (e.g., `"./src/*"`).

---

## Type Generation from Sanity

For larger schemas, use `sanity codegen` to auto-generate types:

```bash
# Install
npm install -D @sanity/codegen

# Generate
npx sanity codegen
```

For small/medium schemas (current MVP), manual types in `src/types/sanity.ts` are sufficient and more maintainable.
