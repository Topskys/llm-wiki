---
type: entity
source: [[raw/papers/工业级Agent意图识别分层漏斗.md]]
description: "RouteLLM：LMSYS 2024 年提出的 LLM 路由框架，通过偏好数据训练路由器，在强模型与弱模型之间动态选择，优化成本与质量权衡。"
created_at: 2026-10-03 19:55:15
updated_at: 2026-10-03 19:55:15
tags: [routellm, routing, preference_data, cost_optimization]
---

# RouteLLM

## 核心结论
- RouteLLM 是 LMSYS 2024 年提出的 LLM 路由框架。
- 通过偏好数据训练路由器，在强模型与弱模型之间动态选择。
- 与 FrugalGPT 同属"按请求复杂度分配算力"的研究脉络。

## 要点拆解

### 核心机制
- 使用偏好数据（query, routing_label）训练分类器。
- 路由器预测查询应由强模型还是弱模型处理。
- 在 MT Bench 等基准上验证，显著降低成本同时保持质量。

### 与分层漏斗的关系
- RouteLLM 验证了"路由决策"的有效性。
- 分层漏斗将路由决策扩展为三层级联，并引入规则层与上下文层。

## 相关页面
- [[Agent意图识别]]：主题页
- [[分层漏斗路由]]：核心架构概念
- [[FrugalGPT]]：另一成本优化框架

## 参考来源
- [[raw/papers/工业级Agent意图识别分层漏斗.md]]
