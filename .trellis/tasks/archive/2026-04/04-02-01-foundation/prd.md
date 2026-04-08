# Phase 1: 基座搭建 — Next.js Monorepo + Config 驱动架构

## Goal

搭建 Site Factory 的技术基座：一个 Next.js Monorepo 项目，通过 Config 驱动实现"一份代码造 N 个站"。第一个站从初始化到上线预计 2-3 天，后续每个新站只需 30 分钟 - 2 小时。

## 技术栈约束

### 核心三件套（锁定，不讨论）

| 层 | 技术 | 版本要求 | 说明 |
|----|------|----------|------|
| 前端框架 | **Next.js** | >= 15.x (App Router) | SSG/ISR、动态路由、API Routes |
| CSS | **Tailwind CSS** | >= 4.x | 实用优先，Config 切换品牌色零成本 |
| 语言 | **TypeScript** | >= 5.x | 严格模式，全项目类型覆盖 |

### 数据层

| 组件 | 技术 | 说明 |
|------|------|------|
| CMS | **Sanity v3** | Headless CMS，API 写入，免费额度 100K/月 |
| 内容查询 | **Groq** | Sanity 原生查询语言 |
| 图片 | **@sanity/image-url** | 自动裁剪/优化 |

### 部署层

| 组件 | 技术 | 说明 |
|------|------|------|
| 托管 | **Vercel** | Git push = 上线，全球 CDN，零配置 |
| 域名 | **Cloudflare / Namecheap** | DNS 托管，年费 $1-12 |
| 包管理 | **pnpm** | Monorepo workspace 管理 |

### 不使用的技术（明确排除）

- WordPress / Shopify / Webflow / Framer — 灵活度不足，API 限制多
- CSS-in-JS (styled-components / emotion) — Tailwind 足够
- Redux / MobX — Next.js 场景不需要
- Prisma / Drizzle — B2B 展示站不需要数据库 ORM

## Requirements

### 1. 项目初始化

- [ ] 使用 `pnpm` 初始化 Monorepo 结构（pnpm workspace）
- [ ] Next.js 15 + App Router + TypeScript strict mode + Tailwind CSS 4
- [ ] 集成 Sanity v3 client + image-url + next-sanity + next-sitemap
- [ ] ESLint + Prettier 配置
- [ ] `.env.example` 记录所有环境变量

### 2. Config 驱动架构

- [ ] `site.config.ts` — 单文件定义站点所有差异（品牌/颜色/导航/SEO/CTA/内容配置）
- [ ] Config 类型定义完整，IDE 自动补全
- [ ] 支持业务类型：`b2b-product` | `b2b-service` | `b2c-dtc`
- [ ] 支持多种 CTA 类型：`form` | `email` | `whatsapp`

### 3. 模板页面

- [ ] 首页 — Hero + 价值主张 + CTA，自适应 config.type
- [ ] 关于页 — 公司故事 + 团队
- [ ] 联系页 — 表单 + 地图（按 config.cta.type 切换）
- [ ] 博客列表页 `/blog` — ISR，从 Sanity 拉取
- [ ] 博客详情页 `/blog/[slug]` — ISR，SEO 优化
- [ ] 产品列表页 `/products` — ISR
- [ ] 产品详情页 `/products/[slug]` — ISR + JSON-LD
- [ ] 404 页 — 自定义，符合站点品牌
- [ ] 所有页面响应式（mobile-first）

### 4. SEO 基建

- [ ] `next-sitemap` 自动生成 sitemap.xml + robots.txt
- [ ] JSON-LD 结构化数据：Organization / Product / Article / BreadcrumbList / FAQPage
- [ ] 每页自动生成 title / description / Open Graph / Twitter Card
- [ ] 内链系统基础：博客 ↔ 产品页互相链接的辅助函数
- [ ] Answer-First 博客模板结构（H2 问题 → 直接答案 → 展开内容 → FAQ → CTA）

### 5. Sanity CMS Schema

- [ ] Blog Post schema — title / slug / content (Portable Text) / excerpt / featuredImage / categories / relatedProducts / SEO meta
- [ ] Product schema — name / slug / description / images / specifications / price (optional) / relatedPosts / SEO meta
- [ ] Site Settings schema — 全局站点配置（导航 / Footer / 社交链接）
- [ ] Draft/Published 状态 — 默认草稿，审核后发布

### 6. Monorepo 结构

```
site-factory/
├── apps/
│   ├── site-a/              # 第一个站点
│   │   ├── site.config.ts   # 站点配置
│   │   ├── app/             # Next.js App Router
│   │   └── ...
│   └── site-b/              # 后续站点（Phase 3）
├── packages/
│   ├── ui/                  # 共享组件库
│   ├── sanity/              # Sanity schemas + client 配置
│   ├── seo/                 # SEO 工具（meta / JSON-LD / sitemap）
│   └── content/             # 内容管道工具（Phase 2）
├── pnpm-workspace.yaml
├── turbo.json               # Turborepo 构建缓存
└── .env.example
```

## Acceptance Criteria

- [ ] `pnpm install && pnpm dev` 能正常启动第一个站点
- [ ] 修改 `site.config.ts` 中的品牌色/名称后，所有页面反映变化
- [ ] Sanity Studio 可访问，能创建/编辑博客和产品内容
- [ ] 博客列表页和详情页从 Sanity 正确渲染内容
- [ ] 产品列表页和详情页从 Sanity 正确渲染内容
- [ ] 所有页面 Lighthouse SEO 分数 >= 90
- [ ] 所有页面响应式，mobile / tablet / desktop 布局正确
- [ ] JSON-LD 结构化数据验证通过（Google Rich Results Test）
- [ ] sitemap.xml 和 robots.txt 自动生成

## Definition of Done

- [ ] 所有页面功能完整，可通过手动测试
- [ ] TypeScript 严格模式编译通过，无 any
- [ ] ESLint / Prettier 检查通过
- [ ] `.trellis/spec/` 规范文档更新（目录结构/组件规范/类型规范）
- [ ] `.env.example` 记录所有必要环境变量
- [ ] Vercel 部署成功，线上可访问（可选，最后做）

## Out of Scope

- 内容生成管道（Phase 2）
- 多站点矩阵管理（Phase 3）
- GSC 数据回收（Phase 4）
- Claude Code Skills（Phase 5）
- 在线支付/电商功能
- 社交媒体分发
- 用户认证系统

## Technical Notes

- 参考文档：`项目参考文档/guide-site-factory-content-pipeline-workflow-2026-04-01.html`
- Sanity 免费额度：2 dataset + 100K API 请求/月，够初期使用
- Vercel 免费额度：100GB 带宽/月/项目
- ISR revalidate 时间建议：博客 3600s（1 小时），产品 86400s（24 小时）
- Turborepo 用于 Monorepo 构建缓存，加速多站点并行构建

## Cross-Layer Contracts

### Config Contract

- `apps/site-a/site.config.ts` is the single source of truth for brand, navigation, contact CTA, default SEO, social links, business type, and enabled content areas.
- All UI, metadata, robots/sitemap config, and API route responses read site identity from config. No hardcoded brand strings in route files or components.
- Config must be parsed with Zod at module load so invalid values fail at build/startup time.

### Environment Contract

- `NEXT_PUBLIC_SITE_URL` defines canonical URL and sitemap host.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are public runtime values used by frontend fetchers.
- `SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET` are server-only secrets used by preview/revalidation flows.
- If Sanity env is missing, the app must still boot with fallback demo content and disabled studio fetches where applicable.

### Content Contract

- Sanity document types are `post`, `product`, and `siteSettings`.
- Query layer returns typed `PostSummary`, `PostDetail`, `ProductSummary`, `ProductDetail`, and `SiteSettings` objects to pages.
- Pages never consume raw GROQ responses directly; data normalization happens inside the shared Sanity package.

### API Contract

- `POST /api/contact` accepts `{ name, email, company?, phone?, message }` and returns `{ ok: true, submittedAt }` on success.
- `POST /api/revalidate` accepts `{ secret, type, slug? }` and returns `{ revalidated: true, paths }` when the secret is valid.
- `GET /api/health` returns `{ ok: true, site, cms }`.
- Boundary validation happens with Zod in each route before any side effect or revalidation call.

### Validation And Error Matrix

| Boundary | Good | Base | Bad |
|----------|------|------|-----|
| Site config parse | Valid brand/SEO/CTA config loads | Optional fields fallback to defaults | Invalid enum/color/url throws build-time config error |
| Sanity query layer | Returns normalized typed content | Missing CMS env falls back to seeded demo content | Invalid fetch or missing slug returns empty/null and page handles with fallback or `notFound()` |
| Contact API | Valid payload returns 200 JSON | Optional company/phone omitted | Invalid email/message returns 400 with validation code |
| Revalidate API | Valid secret + content type revalidates paths | Missing slug only revalidates collection paths | Wrong secret or invalid type returns 401/400 safe JSON error |

## Decision (ADR-lite)

**Context**: 需要在多种前端框架/CMS/部署方案中选择技术栈
**Decision**: Next.js + Sanity + Vercel 三件套 + pnpm Monorepo
**Consequences**:
- (+) 全部免费起步，矩阵扩展成本低（$5-20/月/站）
- (+) SSG/ISR 是 SEO 最优解，内容更新不需要全量重建
- (+) Sanity API 友好，Claude 可直接通过 API 写入内容
- (-) 依赖 Vercel 生态，大规模后可能需要付费
- (-) Tailwind 跨站点品牌切换需要良好的 Design Token 设计
