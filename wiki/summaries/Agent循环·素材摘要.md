---
type: source_summary
source: "[[raw/papers/Agent Loop.md]]"
description: "对 raw 论文《Agent Loop》（Anthropic 官方文档 5 篇 + ReAct 融合）的要点摘录：本质定义、三阶段模型、Turn/Message 生命周期、stop_reason 协议、终止双保险与失败护栏、上下文治理、最小实现与六条设计原则索引。"
created_at: 2026-09-23 12:00:00
updated_at: 2026-09-23 12:00:00
tags: [source_summary, agent, agent_loop]
---

# Agent循环·素材摘要

## 素材信息

| 项 | 内容 |
|---|---|
| 素材 | [[raw/papers/Agent Loop.md]] |
| 主题 | Agent Loop 机制研究 |
| 来源 | Anthropic 官方文档 5 篇（Building Effective Agents / Effective context engineering / How Claude Code works / Agent SDK agent-loop / Academy agent loop）+ ReAct（arXiv 2210.03629） |
| 核验 | 官方原文已联网抓取核验；ReAct 为公开文献 |

## 要点索引

- **本质定义**：在循环中基于环境真实反馈（ground truth）自主决策，直到任务完成或触发终止条件；Anthropic 概括「LLMs autonomously using tools in a loop」。
- **三阶段模型**：Gather Context → Take Action → Verify Results，相互融合非线性；驱动主体是 agentic harness。
- **Turn 机制**：一次往返=一个 Turn；五类 Message（System/Assistant/User/Stream/Result）；ResultMessage 五种终止 subtype。
- **终止协议**：stop_reason：tool_use / end_turn / max_tokens / refusal；终止双保险（模型完成判据 + harness 硬护栏）。
- **自主决策四维**：行动选择、路径修正、终止判断、上下文管理，均由逐轮条件生成完成。
- **失败护栏**：死循环/工具幻觉/过早终止/上下文溢出/选错工具/错误不纠偏六类，各配工程对策。
- **上下文治理**：compaction、scratchpad、子代理摘要三招应对 context rot。
- **设计原则**：工具设计决定质量、不为所有任务上 Agent、拒绝复杂框架、上下文是血液、显式终止判据、权限与人在回路。

## 相关页面

- [[Agent循环总览]]：由本文档编译的主总览页
- [[Agent循环]]、[[Turn与消息生命周期]]、[[Agent循环终止与护栏]]、[[Agentic Harness]]：概念的原子化解读