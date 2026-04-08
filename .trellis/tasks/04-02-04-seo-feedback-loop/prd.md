# Phase 4: SEO 闭环 — 数据驱动优化

## Goal

从"盲打"切换到"数据驱动"。通过 Google Search Console 数据回收，找到低垂果实（排名 3-20 的词），形成"分析 → 优化 → 验证"的月度闭环。同时优化 AI Overview 可见性（Answer Engine Optimization）。

## 前置依赖

- Phase 1 基座搭建完成
- Phase 2 内容管道跑通（至少 30+ 篇博客已发布）
- 站点运行 1-3 个月，GSC 有足够数据

## Requirements

### 1. GSC 数据回收

- [ ] 接入 Google Search Console API
- [ ] 定期拉取数据：搜索查询/展示次数/点击率/排名位置
- [ ] 按站点维度聚合数据（矩阵模式下每个站独立分析）
- [ ] 数据存储方案：本地 JSON 文件或轻量数据库

### 2. 低垂果实分析

- [ ] **排名 3-20 识别** — 找出"差临门一脚"的词，优先优化
- [ ] **未覆盖关键词** — 有展示但没对应落地页的词 → 新文章选题
- [ ] **低 CTR 页面** — 排名靠前但点击率低的页面 → 优化 title/description
- [ ] **零流量页面** — 3 个月零流量的页面 → noindex 或删除

### 3. 三种优化行动

- [ ] **A. 新文章** — 发现未覆盖的高意图词 → 喂入 Phase 2 内容管道生成
- [ ] **B. 优化旧文章** — 加内容/加内链/改标题/补充 FAQ
- [ ] **C. 关闭无效页** — noindex 或删除，避免拖累整体质量

### 4. AI Overview 优化 (AEO)

- [ ] Answer-First 结构固化（Phase 1 已搭建基础）
- [ ] 每个博客 FAQ 区域使用 FAQPage schema 标记
- [ ] 答案独立可理解（脱离上下文仍准确）
- [ ] H2 问题形式覆盖更多自然语言查询

### 5. 内链策略

- [ ] Pillar-Cluster 结构 — 核心主题页（产品/服务）为中心，博客文章为卫星
- [ ] 每篇博客自动链接到 1-2 个产品页 + 2-3 篇相关博客
- [ ] 产品页反向链接到相关博客
- [ ] 内链权重传递可视化（可选，后续）

### 6. 月度 SEO 报告

- [ ] 自动生成月度 SEO 报告
- [ ] 包含：流量趋势 / 新关键词 / 排名变化 / 下月建议
- [ ] 输出格式：Markdown 或 PDF
- [ ] 下月内容策略建议（哪些词该重点覆盖）

## Acceptance Criteria

- [ ] 能通过 API 拉取 GSC 数据并结构化存储
- [ ] 能自动识别低垂果实（排名 3-20 的词）
- [ ] 能输出三种优化行动的具体清单（新文章/优化旧文章/关闭页面）
- [ ] 优化后的文章在 2-4 周内排名提升可验证
- [ ] 月度报告包含可执行的内容策略建议

## Definition of Done

- [ ] 月度 SEO 闭环流程文档化
- [ ] 至少完成 1 轮完整的分析 → 优化 → 验证循环
- [ ] 优化效果可量化（排名提升 / 流量增长）

## Out of Scope

- 付费广告（Google Ads / Meta Ads）
- 社交媒体 SEO
- 技术 SEO 深度审计（Core Web Vitals 优化等）
- 竞品监控自动化（手动分析即可）

## Technical Notes

- Google Search Console API：https://developers.google.com/webmaster-tools/search-console-api-original
- GSC 数据延迟约 2-3 天，月度分析建议看上周数据
- 低垂果实策略参考：Brandon Leibowitz 的 SEO 方法论
- Profit Matrix 原则：只关注底部漏斗（购买意图）关键词

## Decision (ADR-lite)

**Context**: 数据存储和报告生成方式选择
**Decision**: 本地 JSON 文件 + Markdown 报告（轻量方案）
**Consequences**:
- (+) 零额外成本，不需要数据库
- (+) Claude 直接读写 JSON，无集成复杂度
- (-) 大量站点后可能需要升级到数据库
- (-) 历史数据查询效率低（但月度分析足够）
