# P0: Sanity Studio + Dynamic Sitemap

## Goal
Complete two critical missing features: embed Sanity Studio for content management, and make sitemap dynamic.

## P0-1: Sanity Studio Integration
- Create Sanity schema definitions matching existing GROQ queries (post, product, site-settings, shared types)
- Embed Studio as `/studio` route inside Next.js app using `next-sanity/studio`
- Wire up environment config (project ID, dataset)

## P0-2: Dynamic Sitemap
- Replace hardcoded routes in `next-sitemap.config.mjs` with dynamic generation
- Fetch posts and products from Sanity/demo data to build sitemap entries
- Keep static pages (/, /about, /contact, /blog, /products) as base

## Acceptance Criteria
- [ ] `/studio` route loads Sanity Studio with correct schemas
- [ ] Schemas match existing GROQ query fields (post, product, site-settings)
- [ ] `next-sitemap` generates URLs from data source, not hardcoded list
- [ ] Build passes without errors
