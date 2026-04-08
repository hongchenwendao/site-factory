# Site Factory — AI 自动化建站与内容系统

## 项目概述

Site Factory 是一台"造站机器"：输入一份 config，输出一个完整的、带 SEO 内容引擎的网站。
技术架构：Next.js Monorepo + Sanity CMS + Vercel，Config 驱动实现一份代码造 N 个站。

## 技术栈（锁定）

### 核心框架

| 层 | 技术 | 版本 | 说明 |
|----|------|------|------|
| 前端 | **Next.js** | >= 15.x (App Router) | SSG/ISR、动态路由、API Routes |
| CSS | **Tailwind CSS** | >= 4.x | 实用优先，Config 切换品牌色零成本 |
| 语言 | **TypeScript** | >= 5.x | 严格模式，全项目类型覆盖 |
| 包管理 | **pnpm** | >= 9.x | Monorepo workspace 管理 |
| 构建 | **Turborepo** | >= 2.x | Monorepo 构建缓存 |

### 数据层

| 组件 | 技术 | 说明 |
|------|------|------|
| CMS | **Sanity v3** | Headless CMS，API 写入，免费额度 100K/月 |
| 查询 | **Groq** | Sanity 原生查询语言 |
| 图片 | **@sanity/image-url** | 自动裁剪/优化 |

### 部署层

| 组件 | 技术 | 说明 |
|------|------|------|
| 托管 | **Vercel** | Git push = 上线，全球 CDN |
| SEO | **next-sitemap** | 自动 sitemap.xml + robots.txt |

### 禁止使用

- WordPress / Shopify / Webflow / Framer
- CSS-in-JS (styled-components / emotion)
- Redux / MobX / Zustand
- Prisma / Drizzle / 任何 SQL ORM
- Express / Fastify（用 Next.js API Routes）

## 项目结构（目标）

```
site-factory/
├── apps/
│   ├── site-a/              # 第一个站点
│   │   ├── site.config.ts   # 站点配置（品牌/颜色/导航/SEO/CTA）
│   │   ├── app/             # Next.js App Router
│   │   └── ...
│   └── site-b/              # 后续站点
├── packages/
│   ├── ui/                  # 共享组件库
│   ├── sanity/              # Sanity schemas + client
│   ├── seo/                 # SEO 工具（meta / JSON-LD / sitemap）
│   └── content/             # 内容管道工具
├── pnpm-workspace.yaml
├── turbo.json
└── .env.example
```

## 开发规范

- **Server Components 优先** — 只有需要交互时才用 Client Component
- **Config 驱动** — 所有站点差异集中在 `site.config.ts`，组件从 config 读取，不硬编码
- **SEO 每页必做** — 每个页面必须 export `generateMetadata`，必须有 JSON-LD
- **Answer-First 结构** — 博客模板：H2 问题 → 直接答案 → 展开内容 → FAQ → CTA
- **ISR 而非 SSR** — 页面静态生成，内容更新通过 ISR 增量刷新
- **Mobile-first** — 所有页面响应式，断点 sm/md/lg/xl

## 任务阶段

| Phase | 任务目录 | 优先级 | 状态 |
|-------|---------|--------|------|
| 1 | `04-02-01-foundation` | P0 | pending |
| 2 | `04-02-02-content-pipeline` | P0 | pending |
| 3 | `04-02-03-matrix-scale` | P1 | pending |
| 4 | `04-02-04-seo-feedback-loop` | P1 | pending |
| 5 | `04-02-05-claude-skills` | P1 | pending |

## Trellis 工作流

详见 `AGENTS.md` 和 `.trellis/workflow.md`。
