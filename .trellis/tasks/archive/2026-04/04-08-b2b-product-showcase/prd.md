# B2B Product Showcase Enhancement

## Goal

Enhance the existing Sanity-managed product system into a B2B product showcase site: category browsing + per-product inquiry (RFQ via CTA → contact page) + key B2B fields. No online transactions, no price display.

## What I already know

- Product schema exists with: name, slug, description, images, specifications, price(string), relatedPosts, faq, seo
- Product listing page (`/products`) and detail page (`/products/[slug]`) exist
- Generic contact form exists at `/contact`
- Site is config-driven (site.config.ts), designed for multi-site reuse
- Sanity Studio embedded at `/studio`

## Decisions Made

- **No price display** — B2B 展示型，价格都是线下沟通
- **RFQ 方式** — 产品页 CTA 按钮跳转 `/contact?product=<slug>`，URL 带产品参数自动填入联系表单
- **No PDF download** — 暂不需要，后续可加

## Requirements

### 1. Product Category

- Add `category` field to product schema (reference to new `productCategory` document)
- Create `productCategory` schema: name, slug, description, (optional) image
- Product listing page: add category filter/tabs
- Category filter via URL query param: `/products?category=xxx`

### 2. B2B-specific Fields

- Remove `price` field (B2B 不展示价格)
- Add `moq` (Minimum Order Quantity) — string, e.g. "100 units"
- Add `leadTime` — string, e.g. "15-20 days"
- Add `certifications` — array of strings, e.g. ["CE", "ISO 9001", "RoHS"]

### 3. Inquiry (RFQ) via CTA

- Product detail page: add "Request a Quote" CTA button
- CTA links to `/contact?product=<slug>`
- Contact page reads `product` query param, pre-fills product name into message
- No new API endpoint needed — reuse existing `/api/contact`

### 4. Product Listing Enhancement

- Category filter tabs on `/products` page
- Product card: show category tag + MOQ info
- Remove any price display from product cards

## Acceptance Criteria

- [ ] Products can be categorized via Sanity Studio
- [ ] Product listing page supports filtering by category
- [ ] Product detail page has "Request a Quote" CTA linking to contact page with product context
- [ ] Contact page reads `?product=` param and pre-fills form
- [ ] B2B fields (MOQ, lead time, certifications) display on product detail page
- [ ] No price displayed anywhere on the site
- [ ] All new fields have corresponding GROQ queries updated
- [ ] Demo data updated to showcase B2B scenario (e.g. solar panels)
- [ ] TypeScript types updated for all new fields

## Definition of Done

- Lint / typecheck pass
- Demo data renders correctly
- Sanity Studio can manage all new fields
- Mobile responsive

## Out of Scope

- Online ordering / payment / cart
- Multi-level category hierarchy
- PDF datasheet download
- Inventory management
- Customer account system
- Multi-currency / multi-language

## Technical Notes

- Files to modify:
  - `packages/sanity/src/schema-types/product.ts` — add B2B fields, remove price
  - `packages/sanity/src/schema-types/productCategory.ts` — NEW: category schema
  - `packages/sanity/src/schema.ts` — register new schema
  - `packages/sanity/src/queries.ts` — update GROQ queries to include category + new fields
  - `packages/sanity/src/types.ts` — update TypeScript types
  - `packages/sanity/src/demo/data.ts` — update demo data
  - `packages/sanity/src/index.ts` — export new functions
  - `apps/site-a/src/app/(site)/products/page.tsx` — category filter
  - `apps/site-a/src/app/(site)/products/[slug]/page.tsx` — CTA button + B2B fields display
  - `apps/site-a/src/app/(site)/contact/page.tsx` — read ?product= param, pre-fill
  - `apps/site-a/src/components/content/product-card.tsx` — B2B info, remove price
  - `packages/sanity/src/content.ts` — update content mapping if needed
