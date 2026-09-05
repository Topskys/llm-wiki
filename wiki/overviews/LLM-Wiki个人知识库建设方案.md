---
type: overview
source: [[llm-wiki知识库方案]]
description: "LLM-Wiki 个人知识库建设方案全貌：痛点与目标、三层架构、三大工作流、治理体系、Git 管控、分阶段落地路径与避坑指南。"
created_at: 2026-09-05 12:37:30
updated_at: 2026-09-05 13:01:56
tags: [llm_wiki, knowledge_base, overview, personal_knowledge_management]
---

# LLM-Wiki 个人知识库建设方案

## 核心结论
- 一套基于 [[karpathy|Karpathy]] 提出的 [[LLM-Wiki框架]]，结合 Obsidian + Git 落地的低门槛、可迭代、可治理的个人编译型知识库方案。
- 直击三大痛点：笔记碎片化、传统 RAG 复用性差、AI 生成内容易沦为 [[结构化垃圾场]]。
- 总体投入极低（工具零成本、每周维护约 30 分钟），预期回报是知识资产的长期复利。

## 要点拆解
- **架构**：[[三层架构]] 权责分离（raw 只读 / wiki 编译 / SCHEMA 约束），配套 `index.md` 与 `shturl.md` 两个 AI 元数据文件，>200 页自动拆分域索引（如 `index-concepts.md`）、shturl >200 条按月归档。
- **三大工作流**：[[ingest工作流]]（摄入编译）／ [[query工作流]]（问答回写）／ [[lint工作流]]（巡检治理），形成自增长闭环。
- **元数据标准**：[[元数据规范]] 强制 Frontmatter，`created_at` 永久固化，支撑溯源与治理。
- **治理体系**：[[防膨胀闸门]] + 周/月/季度周期治理 + 问题页面处置策略，守护知识库健康度。
- **Git 管控**：Conventional Commits 提交规范（垂直领域类型：ingest/query/lint/governance/rule），commit-msg 钩子强制校验单行 ≤50 字符；远程仓库必须私有。
- **落地四阶段**：启动期（1-3 天，完成首次 Ingest）→ 调优期（1-2 周，3 次以上 Ingest + 首轮 Lint）→ 稳定期（1-3 个月，50-100 页，引入 Dataview）→ 深化期（3 个月以上，全自动化）。
- **避坑原则**：Wiki 是复盘工具不是初次学习工具；AI 产出必须人工验收；规则持续迭代；拒绝数量堆砌。

## 相关页面
- [[LLM-Wiki框架]]：方案的载体框架
- [[知识管理方式对比]]：方案相对传统方案的优势论证
- [[编译型知识库]]：方案产物的核心形态
- [[结构化垃圾场]]：方案极力避免的失败模式
- [[LLM-Wiki知识库方案·素材摘要]]：本方案页的原始素材摘要

## 参考来源
- [[llm-wiki知识库方案]]