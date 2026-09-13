---
type: comparison
source: [[The AI-Native SDLC playbook]]
description: "传统 SDLC 与 AI-native SDLC 横向对比：阶段形态（线性 vs 循环）、瓶颈位置、阶段产物（文档/门票 vs committed artifact）、控制主体（人类逐项 vs agent 产出+人类 gate）、治理与审计方式差异。"
created_at: 2026-09-12 23:03:13
updated_at: 2026-09-12 23:03:13
tags: [comparison, sdlc, ai_native_sdlc]
---

# 传统SDLC与AI-native-SDLC对比

## 对比总览

| 维度 | 传统 SDLC | AI-native SDLC |
|------|-----------|----------------|
| 阶段形态 | 线性流水线，阶段按角色交接（PM 写需求→架构设计→工程师实现→QA 验证→发布→运维） | **循环 + 自动触发**，AI 嵌入每个点，accepted artifact 触发下一阶段 |
| 瓶颈 | 写/实现代码（耗时最长） | build 压缩到小时级后，瓶颈移到 **plan / review+test / deploy**，仍按人类步速 |
| 最慢环节再设计 | 不需要，设计假设人写代码 | 必须重设计，否则安全/评审排队：要么人跟不上，要么欠审上线 |
| 阶段产物 | 文档、ticket、审批签字，各阶段独立 | **[[committed-artifact]]**：intent.md→spec.md→plan.md→diff+tests→PR+findings→incident，commit 链即审计痕迹 |
| 人类职责 | 逐阶段执行 + 逐行评审 | 验收 gate：审 agent 标记的 concern、Important findings、批准 release；对需判断的决策负责 |
| 控制实现 | 人肉 review、会签、周会月会 | 分层：[[Skills技能]]（建议）→ [[Hooks护栏与审批门]]（强制）→ [[持续评估]]（回归）→ 人类 branch protection |
| 审批者 | 各阶段对应角色 | 写代码的 agent 无权批准自己产出，approval 仅来自人（code owner via branch protection） |
| 并行 | 单人单任务为主 | 一个工程师驱动多个 [[并行会话与子代理]]（worktree 隔离），会话日志归属到人 |
| 审计 | 分散在各系统 | commitment 链 + review 记录 + 监控 triage 记录 + hook allow/block 时间戳，全部版本化可回溯 |

<p align="center"><b>表1 传统 SDLC 与 AI-native SDLC 六阶段对照</b></p>

## 核心结论
- 变换的轴心不是"用 AI 改代码"而是**流程主体重构**：控制目标保留，执行与验证交给 agent，人类精力收敛到决策点（gate）。
- 每条右列举行的底层是 committed artifact：每阶段写一个 artifact 到版本库（早期为 .md，Build 起为代码及记录），下阶段读它开始，审批即 merge/收尾记录。
- 多数组织真实状态介于两列之间：不必全量改造，按 plays 依赖逐阶段采用 [[The AI-Native SDLC playbook]]。

## 相关页面
- [[AI-native-SDLC]]：AI-native SDLC 总览
- [[committed-artifact]]：右列的贯穿机制
- [[AI代码评审]] / [[Hooks护栏与审批门]]：评审与审批控制的具体形态

## 参考来源
- [[The AI-Native SDLC playbook]]