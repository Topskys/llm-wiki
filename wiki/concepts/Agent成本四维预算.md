---
type: concept
source: [[raw/papers/Agent工程化三层架构.md]]
description: "Agent 成本管理的四维预算：token、步数、时间、金额，统一为 middleware 挂在 Act 层之前；Langfuse 指出最大的成本错误通常是测量错误而非用量错误，金额超阈值走熔断而非仅告警。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, cost, budget, token, middleware]
---

# Agent成本四维预算

## 核心结论

- 四维预算统一为 **middleware**、挂在 Act 层之前：**token、步数、时间、金额**。
- 核心认知（Langfuse）：**最大的成本错误通常是测量错误而非用量错误**——同一调用被 gateway 与 SDK 重复记录、缓存 token 重复计数、模型名匹配不上价格表、阶梯定价按平价算。
- 金额超阈值走**熔断**而非仅告警——告警滞后于成本累计，熔断才能止损[[9]](#ref-9)。

## 四维预算

| 维度 | 机制 | 要点 |
|---|---|---|
| token 预算 | 按 run 级 hard cap，middleware 每轮 LLM 调用前检查剩余额度 | 硬上限 |
| 步数预算 | 与终止条件的 `max_calls` 共用计数器 | 避免重复实现 |
| 时间预算 | wall-clock watchdog 独立于单次 LLM 调用超时 | Claude Code 默认 10 分钟、`API_TIMEOUT_MS` 可调 |
| 金额预算 | 按模型单价表实时累加，超阈值熔断 | 熔断止损 |

## 要点拆解

- 逐 token 精确追踪 → 再归因到用户/会话/特性 → 再设阈值告警 → 最后优化，是 Langfuse 的四层递进。
- 与 [[Agent终止条件多路熔断]] 的"预算上限"共享计数器，避免重复实现。
- 成本是 [[Agent可观测追踪三轴]] 里成本轴的落地。

## 相关页面

- [[Agent工程化三层架构总览]]：编排层的预算
- [[Agent终止条件多路熔断]]：预算上限路
- [[Agent可观测追踪三轴]]：成本轴的 token 聚合
- [[重试预算与幂等保护]]：既有开销框架

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]