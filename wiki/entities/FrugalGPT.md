---
type: entity
source: [[raw/papers/工业级Agent意图识别分层漏斗.md]]
description: "FrugalGPT：斯坦福大学 2023 年提出的 LLM 成本优化框架，通过路由器+质量估计器+停止判断器三组件混合路由与级联，在保持质量的同时大幅降低成本。"
created_at: 2026-10-03 19:55:15
updated_at: 2026-10-03 19:55:15
tags: [frugalgpt, cost_optimization, routing, cascade]
---

# FrugalGPT

## 核心结论
- FrugalGPT 是斯坦福大学 2023 年提出的 LLM 成本优化框架。
- 核心思想：通过路由器+质量估计器+停止判断器三组件混合路由与级联，在保持质量的同时大幅降低成本。
- 实证观察：40-70% 的生产查询可由廉价模型服务且无质量损失。

## 要点拆解

### 三组件架构
1. **LLM 路由器**：为查询选择初始 LLM。
2. **质量估计器**：基于 DistilBERT 对查询、响应和所选 LLM 评分。
3. **成本感知停止判断器**：根据质量估计和已调用 LLM 服务决定是否停止或重复。

### 与分层漏斗的关系
- FrugalGPT 验证了"按请求复杂度分配算力"的可行性。
- 分层漏斗是 FrugalGPT 思想在工业级 Agent 意图识别中的具体落地。

## 相关页面
- [[Agent意图识别]]：主题页
- [[分层漏斗路由]]：核心架构概念
- [[RouteLLM]]：另一路由优化框架

## 参考来源
- [[raw/papers/工业级Agent意图识别分层漏斗.md]]
