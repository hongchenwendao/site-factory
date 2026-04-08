# Phase 2: 内容管道 — AI 自动化内容生产

## Goal

构建核心内容管道：关键词研究 → 内容生成 → 审核 → 发布的全自动化流程。让 Claude 每周产出 5-10 篇 SEO 优化博客，人工只需 2-3 分钟/篇审核。这是 Site Factory 的核心护城河。

## 前置依赖

- Phase 1 基座搭建完成（Next.js Monorepo + Sanity CMS + 部署上线）
- Sanity Schema 已定义（Blog Post / Product）
- ISR 发布管道已跑通

## Requirements

### 1. 关键词研究管道

- [ ] **竞品分析模块** — 抓取竞品博客目录，识别内容 gap
- [ ] **GSC 低垂果实识别** — 排名 3-20 位的词，差临门一脚可优化
- [ ] **行业长尾词挖掘** — 底部漏斗意图词（Profit Matrix 原则）
- [ ] **关键词优先级排序** — 搜索量 × 买家意图 × 竞争度 → 输出选题列表
- [ ] 输出格式：结构化 JSON/Markdown，包含关键词、搜索量、意图分类、建议选题

### 2. 博客内容生成管道

- [ ] **Answer-First 模板引擎** — H2 问题 → 直接答案 → 展开内容 → FAQ → CTA
- [ ] **自动 SEO 元素补全** — meta title / description / Open Graph / alt text / 内链建议
- [ ] **结构化数据生成** — FAQPage JSON-LD + Article JSON-LD
- [ ] **内链自动匹配** — 查询现有内容，自动链接到 1-2 个产品页 + 2-3 篇相关博客
- [ ] **批量生成** — 支持一次生成 5-10 篇文章
- [ ] **去 AI 味处理** — 可选 humanizer 过滤步骤

### 3. 产品页更新管道

- [ ] **CSV 数据导入** — 读 CSV/Excel → 解析产品数据
- [ ] **自动翻译/润色** — 产品描述的翻译和 SEO 优化
- [ ] **SEO meta 生成** — 产品名称/描述的 meta 信息
- [ ] **图片 alt text 生成** — 基于产品信息自动生成
- [ ] **批量推送 Sanity** — 通过 API 批量创建/更新产品

### 4. 发布管道

- [ ] **Sanity API 写入** — 将生成的内容推送到 Sanity（草稿状态）
- [ ] **Webhook 触发** — Sanity 文档发布时触发 Vercel ISR 重建
- [ ] **状态管理** — `draft` → `in_review` → `published` 的完整状态机
- [ ] **审核界面** — 在 Sanity Studio 中标记待审核内容

### 5. 质量控制

- [ ] **事实准确性检查清单** — 模板化审核指引
- [ ] **底部漏斗检查** — 验证文章是否针对购买意图
- [ ] **内链检查** — 确认是否链到 Money Page
- [ ] **批量发布** — 审核通过后一键批量发布

## Acceptance Criteria

- [ ] 给 Claude 一个品类关键词，能自动输出 5-10 个 SEO 选题
- [ ] 给 Claude 一个选题，能生成符合 Answer-First 模板的完整博客文章
- [ ] 生成的文章包含：完整 meta 信息、JSON-LD、内链建议、FAQ
- [ ] 文章推送到 Sanity 后处于草稿状态，不自动发布
- [ ] 在 Sanity Studio 审核后发布，Vercel 自动更新（< 60 秒）
- [ ] CSV 产品数据能批量导入并生成产品页
- [ ] 整个流程从关键词到文章上线，人工参与 < 30 分钟（审核环节）

## Definition of Done

- [ ] 端到端管道跑通：关键词 → 选题 → 生成 → 审核 → 发布 → 上线
- [ ] 第一批 10 篇 SEO 博客成功发布
- [ ] 第一批产品数据成功导入并上线
- [ ] ISR 验证：发布新文章后 < 60 秒线上可见
- [ ] 内容质量审核标准文档化

## Out of Scope

- GSC API 自动数据拉取（Phase 4）
- 社交媒体自动分发（未来扩展）
- AI Overview 优化策略（Phase 4）
- 自动发布模式（`autoPublish: true`），初期一律人工审核

## Technical Notes

- Sanity API 文档：https://www.sanity.io/docs/http-api
- 内容生成通过 Claude Code 直接执行（手动或 Skill 触发）
- ISR revalidate 时间：博客 3600s
- 答案优先模板结构参考：Brandon Leibowitz 的 Answer-First Method
- Profit Matrix 原则：只做底部漏斗关键词，追交易不追流量

## Decision (ADR-lite)

**Context**: 内容管道需要选择自动化程度
**Decision**: 半自动化 — AI 生成 + 人工审核 + 确认后发布
**Consequences**:
- (+) 保证内容质量，避免 AI 幻觉影响 E-E-A-T 信号
- (+) 人工每篇只需 2-3 分钟，效率依然远高于传统模式
- (-) 初期无法做到全自动，需要人工参与
- (-) 站点稳定 3 个月后可切换 autoPublish 模式
