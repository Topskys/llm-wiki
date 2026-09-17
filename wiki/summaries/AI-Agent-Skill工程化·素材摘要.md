---
type: source_summary
source: [[raw/papers/AI-Agent-Skill工程化.md]]
description: "对 raw 论文《AI Agent Skill 工程化：规范、架构模式与质量治理》的要点摘录：渐进式披露规范、四类获取方式、P1-P7 七层 + 十架构模式、六维评审与治理闭环、Skill-MCP 互补关系及五项铁律；引豆包《技能与工具开发问题》会话模板。"
created_at: 2026-09-17 10:30:00
updated_at: 2026-09-17 10:30:00
tags: [skill, skill_engineering, source_summary, mcp]
---

# AI-Agent-Skill工程化·素材摘要

## 原始素材信息
- 素材：`raw/papers/AI-Agent-Skill工程化.md`
- 来源：SKILL.md 规范 + 2025-26 年 Skill 生态研究（Agent Skills for LLMs / SoK: Agentic Skills / Harnessing Agent Skills / skills.sh 实证 / Smells / 可复用性研究）+ 豆包会话《技能与工具开发问题》
- 关联原始素材：[[raw/articles/技能与工具开发问题.md]]（SKILL.md 标准模板、评审检查清单、Tool/MCP 示例）

## 要点摘录
- **三层抽象**：Tool 做"事"、Skill 做"决策"（流程编排）、MCP 做"连接"。
- **渐进式披露**：启动只加载 frontmatter 元数据（~100 tokens），命中触发才读 body；N=50 时 token 节省率 98%；生命周期 = Discovery → Activation → Execution。
- **获取方式四类**：人工编写 / 强化学习 / 自主探索 / 组合合成。
- **架构模式**：P1-P7 七层（手动触发→元技能，生产集中在 P1-P3）+ 5 核心 5 支撑十架构模式。
- **质量治理**：六维 100 分评审（SOP 25/意图 20/输出 20/安全 15/性能 10/可维护 10）；Smells 三级；7 类 31 项可复用性检查；定义-评审-度量-改进闭环。
- **五项铁律**：触发精确、SOP 全分支、Tool 依赖显式、输出结构化、安全前置。

## 关联的 Wiki 页面（本素材 Ingest 编译）
- [[Skill工程化总览]]（overview）
- [[SKILL.md规范]] / [[Skill架构模式]] / [[Skill质量治理]]（concept）
- 联动既有 [[Skills技能]]（组织制度知识视角）、[[MCP协议架构]]、[[Function Tool设计规范]]（互补定位）

## 参考来源
- [[raw/papers/AI-Agent-Skill工程化.md]]
- [[raw/articles/技能与工具开发问题.md]]