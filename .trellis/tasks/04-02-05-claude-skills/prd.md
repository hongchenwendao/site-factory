# Phase 5: Claude Code Skills — 自动化胶水层

## Goal

将 Phase 1-4 的手动流程封装为 Claude Code Skills，实现"一句话触发工作流"。每个 Skill 封装一个可重复的自动化任务，从建站到内容生产到 SEO 优化全覆盖。

## 前置依赖

- Phase 1 基座搭建完成
- Phase 2 内容管道跑通
- Phase 3 矩阵扩展能力就绪（至少 2 个站点）
- Phase 4 SEO 闭环至少完成 1 轮

## Requirements

### Skill 清单

#### P0 — 必须优先实现

**1. `/site-new` — 建新站**
- 触发："建新站 [品类]" 或 "/site-new solar-panel"
- 流程：
  1. 交互收集：品牌名 / 域名 / 品类 / 目标市场 / CTA 类型（5 个问题）
  2. 生成 `site.config.ts`
  3. 运行脚手架创建站点目录
  4. 创建 Sanity dataset
  5. 配置环境变量
  6. 部署到 Vercel + 绑定域名
  7. 输出预览链接
- 依赖：Phase 1 + Phase 3

**2. `/content-batch` — 批量内容生成**
- 触发："灌内容 [站名]" 或 "/content-batch solar-pro"
- 流程：
  1. 关键词研究 → 输出选题列表
  2. 用户审核选题（交互选择/修改）
  3. 批量生成文章（Answer-First 模板）
  4. 用户审核内容（逐篇或批量）
  5. 推送 Sanity（草稿或发布）
  6. 输出发布结果
- 依赖：Phase 2

#### P1 — 稳定后实现

**3. `/product-import` — 产品导入**
- 触发："导入产品 [CSV路径]" 或 "/product-import data/products.csv"
- 流程：读 CSV → 翻译/润色 → 生成 SEO meta → 批量推送 Sanity
- 依赖：Phase 2

**4. `/seo-review` — SEO 审查**
- 触发："查 SEO [站名]" 或 "/seo-review solar-pro"
- 流程：拉 GSC 数据 → 低垂果实分析 → 输出优化建议 + 新选题
- 依赖：Phase 4

#### P2 — 按需实现

**5. `/site-status` — 矩阵状态**
- 触发："矩阵状态" 或 "/site-status"
- 流程：聚合所有站点的流量/文章数/排名 → 一屏输出
- 依赖：Phase 3 + Phase 4

**6. `/site-kill` — 关站**
- 触发："关站 [站名]" 或 "/site-kill test-idea"
- 流程：Vercel 删除项目 + DNS 清理 + Sanity 数据归档 + 代码归档
- 依赖：Phase 3

## Acceptance Criteria

### P0 Skills
- [ ] `/site-new` 能在 30 分钟内完成新站创建到部署
- [ ] `/content-batch` 能在 1 小时内完成从关键词到 10 篇文章发布
- [ ] 两个 Skill 都有清晰的人机交互节点（审核环节）

### P1 Skills
- [ ] `/product-import` 能处理标准 CSV 格式并批量导入
- [ ] `/seo-review` 能输出可执行的优化建议清单

### P2 Skills
- [ ] `/site-status` 一屏显示所有站点关键指标
- [ ] `/site-kill` 安全关闭站点且可回滚

## Definition of Done

- [ ] 所有 P0 Skill 可用并通过手动测试
- [ ] Skill 文档写入 CLAUDE.md 或 `.claude/commands/`
- [ ] 每个 Skill 有明确的触发词和交互流程
- [ ] 错误处理：网络失败 / API 限流 / 数据异常有友好提示

## Out of Scope

- 定时自动执行（Cron）— 后续可通过 n8n / Make 实现
- 多 Agent 并行（Cody Schneider 的 7 Agent 架构）— 后续扩展
- Slack/飞书通知集成
- 自动 A/B 测试

## Technical Notes

- Claude Code Skills 放在 `.claude/commands/` 目录下
- Skill 文件使用 Markdown 格式，包含触发条件、流程步骤、错误处理
- 参考 Olivier Croguy 的 Skill 写法：逐 section 构建，每个环节有人工审核点
- 每个 Skill 应该是幂等的：重复执行不会产生副作用

## Decision (ADR-lite)

**Context**: 自动化程度需要平衡效率和质量
**Decision**: 每个 Skill 至少保留 1 个人工审核节点
**Consequences**:
- (+) 避免全自动导致的批量质量问题
- (+) 保留人对关键决策的控制权（选题/内容/上线）
- (-) 比全自动多花 30-60 分钟/次
- (-) 站点稳定后可考虑开放 autoPublish 模式减少审核
