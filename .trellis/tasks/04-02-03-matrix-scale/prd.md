# Phase 3: 矩阵扩展 — 多站点规模化

## Goal

从 1 个站扩展到 N 个站。通过 Monorepo + Config 驱动实现：新站上线 SOP 从"决定品类"到"正式上线"控制在 30 分钟 - 2 小时。支持两种矩阵模式：同品牌子站和多品牌独立站。

## 前置依赖

- Phase 1 基座搭建完成（Monorepo 结构 + Config 驱动 + 部署管道）
- Phase 2 内容管道至少跑通博客流程

## Requirements

### 1. Monorepo 多站点架构

- [ ] `apps/` 下每个站点独立 Next.js 应用，共享 `packages/`
- [ ] 新站脚手架工具 — 一条命令 clone 模板站点并初始化
- [ ] `pnpm --filter` 支持单站点构建/开发/部署
- [ ] Turborepo 并行构建多站点，构建缓存复用

### 2. 新站上线 SOP（自动化）

- [ ] **Step 1**: 运行脚手架命令创建新站点目录
- [ ] **Step 2**: 填写 `site.config.ts`（品牌名/域名/品类/颜色/CTA）
- [ ] **Step 3**: 创建 Sanity dataset（CLI 或 API）
- [ ] **Step 4**: 配置环境变量（Sanity dataset ID / API token）
- [ ] **Step 5**: 部署到 Vercel（独立项目）+ 绑定域名
- [ ] 整个流程可封装为 `/site-new` Skill

### 3. 两种矩阵模式

**模式 A · 同品牌子站**（如 solar.chending.net）
- [ ] 同一个 Git 仓库，不同 Vercel 项目
- [ ] 共享设计系统，config 换颜色/logo/导航
- [ ] Sanity 同一个 project，不同 dataset
- [ ] 主站权重集中，子站长尾覆盖

**模式 B · 多品牌独立站**（如 solarpanelpro.com + rvparts.com）
- [ ] 同一个 Monorepo，各自独立品牌/域名
- [ ] Sanity 独立 dataset，数据完全隔离
- [ ] 共享底层组件和 SEO 逻辑

### 4. 矩阵管理仪表板

- [ ] 站点列表视图 — 名称/状态/文章数/最后更新时间
- [ ] 状态标签：运行中 / 建设中 / 已关闭
- [ ] 通过 Vercel API + Sanity API 聚合数据
- [ ] CLI 命令或简单 Web 界面

## Acceptance Criteria

- [ ] 在已有基座的情况下，30 分钟内创建并部署一个新站点
- [ ] 新站点有独立的品牌/颜色/域名，与第一个站完全不同
- [ ] 新站点有独立的 Sanity dataset，数据隔离
- [ ] 新站点 Vercel 部署成功，HTTPS 自动配置
- [ ] 两个站点共享的组件修改后，所有站点同步更新
- [ ] 矩阵仪表板能一览所有站点状态

## Definition of Done

- [ ] 至少 2 个站点成功运行
- [ ] 新站上线 SOP 文档化
- [ ] Monorepo 构建缓存有效（二次构建时间减少 50%+）
- [ ] `.trellis/spec/` 更新矩阵管理规范

## Out of Scope

- GSC 数据回收和 SEO 闭环（Phase 4）
- 自动关闭无效站点（Phase 5 Skill）
- 社交媒体分发
- 用户认证/权限管理

## Technical Notes

- Vercel 每个项目独立免费额度（100GB/月）
- Sanity 每个站点独立 dataset，各自 100K API 请求
- Turborepo 缓存基于内容哈希，共享包修改后只重建受影响站点
- DNS 配置：Cloudflare CNAME 指向 Vercel，自动 HTTPS

## Decision (ADR-lite)

**Context**: 多站点管理需要在 Monorepo vs Multi-repo 间选择
**Decision**: pnpm Monorepo + Turborepo
**Consequences**:
- (+) 共享组件修改一次，所有站点受益
- (+) 一条命令构建所有站点
- (+) 代码审查集中，质量统一
- (-) 仓库体积会随站点数增长
- (-) CI/CD 需要按站点过滤变更（只构建变更的站点）
