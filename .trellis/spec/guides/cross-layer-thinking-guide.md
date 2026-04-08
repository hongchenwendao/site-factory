# Cross-Layer Thinking Guide

> **Purpose**: Think through data flow across layers before implementing.

---

## The Problem

**Most bugs happen at layer boundaries**, not within layers.

Common cross-layer bugs:
- API returns format A, frontend expects format B
- Database stores X, service transforms to Y, but loses data
- Multiple layers implement the same logic differently

---

## Before Implementing Cross-Layer Features

### Step 1: Map the Data Flow

Draw out how data moves:

```
Source → Transform → Store → Retrieve → Transform → Display
```

For each arrow, ask:
- What format is the data in?
- What could go wrong?
- Who is responsible for validation?

### Step 2: Identify Boundaries

| Boundary | Common Issues |
|----------|---------------|
| API ↔ Service | Type mismatches, missing fields |
| Service ↔ Database | Format conversions, null handling |
| Backend ↔ Frontend | Serialization, date formats |
| Component ↔ Component | Props shape changes |

### Step 3: Define Contracts

For each boundary:
- What is the exact input format?
- What is the exact output format?
- What errors can occur?

---

## Common Cross-Layer Mistakes

### Mistake 1: Implicit Format Assumptions

**Bad**: Assuming date format without checking

**Good**: Explicit format conversion at boundaries

### Mistake 2: Scattered Validation

**Bad**: Validating the same thing in multiple layers

**Good**: Validate once at the entry point

### Mistake 3: Leaky Abstractions

**Bad**: Component knows about database schema

**Good**: Each layer only knows its neighbors

### Mistake 4: Trusting CMS Types More Than CMS Data

**Bad**: GROQ projection is typed as `PostSummary`, so the UI assumes `featuredImage.asset.url`, `width`, `height`, and relation arrays always exist.

**Good**: Normalize query output and validate render-critical fields at the boundary.

```typescript
const image = getRenderableImage(post.featuredImage);
const relatedProducts = post.relatedProducts ?? [];
```

This prevents two common failures:
- `next/image` receiving `""`, `undefined`, or `NaN`
- Relation helpers crashing on `null.map(...)`

---

## Checklist for Cross-Layer Features

Before implementation:
- [ ] Mapped the complete data flow
- [ ] Identified all layer boundaries
- [ ] Defined format at each boundary
- [ ] Decided where validation happens

After implementation:
- [ ] Tested with edge cases (null, empty, invalid)
- [ ] Verified error handling at each boundary
- [ ] Checked data survives round-trip
- [ ] Confirmed CMS image fields are renderable before passing them to `<Image>`
- [ ] Confirmed relation arrays are normalized before calling `.map`

---

## When to Create Flow Documentation

Create detailed flow docs when:
- Feature spans 3+ layers
- Multiple teams are involved
- Data format is complex
- Feature has caused bugs before

---

## Executable Contract: Sanity Image + Relation Boundary

**Purpose**: Prevent CMS payload drift from crashing Next.js rendering.

**Owning files**:
- `packages/sanity/src/queries.ts`
- `packages/sanity/src/content.ts`
- `apps/site-a/src/components/content/post-card.tsx`
- `apps/site-a/src/components/content/product-card.tsx`
- `apps/site-a/src/app/(site)/blog/[slug]/page.tsx`
- `apps/site-a/src/app/(site)/products/[slug]/page.tsx`
- `apps/site-a/src/lib/related-content.ts`

### Contract Surface

**Query-layer functions**:
- `getPostSummaries(): Promise<PostSummary[]>`
- `getPostDetail(slug: string): Promise<PostDetail | null>`
- `getProductSummaries(): Promise<ProductSummary[]>`
- `getProductDetail(slug: string): Promise<ProductDetail | null>`

**Normalization rules in `queries.ts`**:
- `categories`, `relatedProducts`, `images`, `relatedPosts`, `faq`, `body`, `specifications`:
  must leave the query layer as arrays, never `null` or `undefined`

**Image validation rule in `content.ts`**:
- `getRenderableImage(image)` returns `null` unless all fields below are valid:
  - `asset.url`: non-empty trimmed string
  - `asset.width`: finite number greater than `0`
  - `asset.height`: finite number greater than `0`

**Rendering rule in page/component layer**:
- `<Image>` may only consume the result of `getRenderableImage(...)`
- JSON-LD `image` field must be omitted when no renderable image exists
- relation helpers may call `.map()` only on normalized arrays

### Validation / Error Matrix

| Input shape | Query layer output | Render layer behavior |
|-------------|--------------------|-----------------------|
| Full image + valid arrays | Preserve values | Render `<Image>` normally |
| Empty image URL | Keep object, image helper returns `null` | Render placeholder or skip image |
| Missing width/height | Keep object, image helper returns `null` | Render placeholder or skip image |
| `relatedProducts` / `relatedPosts` = `null` | Normalize to `[]` | Related section renders empty state / nothing |
| `faq`, `body`, `specifications` = `null` | Normalize to `[]` | Section omitted safely |

### Good / Base / Bad Cases

**Good**
```ts
{
  featuredImage: { asset: { url: "https://cdn/image.jpg", width: 1200, height: 630 }, alt: "Panel array" },
  relatedProducts: [{ slug: "gridguard-battery-hub", name: "GridGuard Battery Hub" }]
}
```

**Base**
```ts
{
  featuredImage: null,
  relatedProducts: []
}
```

**Bad**
```ts
{
  featuredImage: { asset: { url: "", width: null, height: null }, alt: "Broken image" },
  relatedProducts: null
}
```

Expected result for the bad case:
- no `next/image` call
- no `null.map(...)`
- page still renders

### Required Tests / Assertion Points

Manual assertions:
- Visit `/blog` with a post missing image URL and confirm no console error
- Visit `/blog/[slug]` with `relatedProducts = null` and confirm page renders
- Refresh both pages and confirm behavior is stable after SSR/RSC reload

Automated assertions to add when tests exist:
- `queries.ts` normalization test: nullable arrays become `[]`
- `content.ts` validation test: empty URL / missing dimensions return `null`
- page render test: invalid image data does not reach `<Image>`
