---
type: source_summary
source: [[The AI-Native SDLC playbook]]
description: "对 raw 素材《The AI-Native SDLC playbook》（Anthropic Applied AI，2026-08-21）的要点摘录：六阶段 plays、承交付物链、CLAUDE.md/Skills/Hooks 控制原语、AI 评审、CI evals、监控闭环与治理原则索引。"
created_at: 2026-09-12 23:03:13
updated_at: 2026-09-12 23:03:13
tags: [source_summary, ai_native_sdlc, claude, governance]
---

# AI-native-SDLC·素材摘要

## 核心结论
- 素材是 Anthropic 官方博客长文（2026-08-21，作者 Louis Claxton，Applied AI 团队），讲如何用 Claude 系列把软件开发生命周期逐阶段 AI 化，并给出落地 plays。
- 权威来源：官方发布但属**方法论 + 厂商最佳实践**，可复用度高的部分（承交付物、控制分层、评审策略、评估闸门）已提炼为独立概念页；含产品名（Claude Code/Design/Tag/Security/MCP）的部分按厂商语境理解。
- 全篇主线是「**代码不再是瓶颈 → 人类注意力移到 gate → 承交付物驱动循环**」三句话；治理上反复强调职责分离、branch protection、审计日志。

## Wiki 衍生页面索引
| 类型 | 页面 | 来源章节 |
|------|------|----------|
| overview | [[AI-native-SDLC]] | What is an AI-native SDLC？六阶段重构总览 |
| concept | [[committed-artifact]] | 承交付物贯穿全篇 |
| concept | [[CLAUDE记忆文件]] | The CLAUDE.md |
| concept | [[Skills技能]] | Skills as institutional knowledge |
| concept | [[Hooks护栏与审批门]] | Hooks as build-time guardrails / approval gates |
| concept | [[plan模式]] | Claude Code plan mode as the default starting point |
| concept | [[并行会话与子代理]] | Parallel sessions and subagents |
| concept | [[Agent反馈闭环]] | Give Claude a feedback loop |
| concept | [[持续评估]] | Continuous evals in CI |
| concept | [[AI代码评审]] | AI in the PR review loop |
| concept | [[监控闭环]] | Maintenance and closing the loop |
| comparison | [[传统SDLC与AI-native-SDLC对比]] | The shifts across the six stages |

## 参考来源
- [[The AI-Native SDLC playbook]]