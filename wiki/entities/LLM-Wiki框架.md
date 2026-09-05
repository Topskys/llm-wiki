---
type: entity
source: [[llm-wiki知识库方案]]
description: "基于 Karpathy 思想、以 Obsidian + Git 落地的一套 AI 编译型个人知识库框架，核心是 raw 原始素材层、wiki 编译知识层、SCHEMA 规则契约层的三层架构。"
created_at: 2026-09-05 12:37:30
updated_at: 2026-09-05 13:01:56
tags: [llm_wiki, knowledge_base, personal_knowledge_management]
---

# LLM-Wiki 框架

## 核心结论
- LLM-Wiki 是一套「原始素材 → AI 编译 → 规则约束 → 闭环治理」的个人知识库方法论，由 [[karpathy|卡帕西]] 提出，本库以此为蓝本落地。
- 与普通 RAG 的本质区别：知识在入库时被一次性**预编译**为原子化、关联化的知识网络（[[编译型知识库]]），而非每次提问时临时切割原始文档（详见 [[知识管理方式对比]]）。
- 要避免沦为「静悄悄的结构化垃圾场」——即批量生成精美页面但无人阅读、无人校验（[[结构化垃圾场]]）。

## 要点拆解
- **架构**：[[三层架构]] —— Raw Source（人类写入、AI 只读）／ The Wiki（AI 编译、人类验收）／ The SCHEMA（人类维护、AI 执行）。
- **工作流**：[[ingest工作流]]（摄入）、[[query工作流]]（问答回写）、[[lint工作流]]（巡检治理）三循环自增长。
- **契约**：所有页面强制携带 [[元数据规范|Frontmatter 元数据]]，`created_at` 永久不可改，配合 Git + Conventional Commits 双重校验溯源。
- **治理**：[[防膨胀闸门]] 三道闸门控制知识库膨胀，避免垃圾化。

## 相关页面
- [[karpathy]]：框架提出者的个人页
- [[LLM-Wiki个人知识库建设方案]]：本框架的具体落地蓝图与分阶段路径
- [[知识管理方式对比]]：LLM-Wiki 与传统笔记、普通 RAG 的横向对比

## 参考来源
- [[llm-wiki知识库方案]]