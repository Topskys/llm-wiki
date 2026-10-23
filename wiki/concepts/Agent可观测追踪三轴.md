---
type: concept
source: [[raw/papers/Agent工程化三层架构.md]]
description: "Agent 可观测性三轴：执行轴（token/step 可直接观测）、成本轴（按账号/会话聚合并实时看板）、审计轴（后续无法重建且受合规约束）；健康信号聚合熔断次数、错误率、重试率供编排反馈。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, observability, tracing, cost, audit]
---

# Agent可观测追踪三轴

## 核心结论

- 运维层可观测性的三轴：**执行轴**（token / step 可直接观测）、**成本轴**（按账号/会话聚合 + 实时看板）、**审计轴**（后续无法重建、受合规约束的数据）。
- 三轴又通过健康信号反馈回编排层：聚合**断路器熔断次数、错误率、重试率**等作为编排反馈。
- 每条 span 采集 `step_id`、`tool_name`、token 计数、成功/失败、执行时间，构成可审计链路。

## 三轴速览

| 轴 | 观测对象 | 手段 |
|---|---|---|
| 执行轴 | token、step 数 | 直接 trace/span 采集 |
| 成本轴 | 按账号/会话聚合的 token 消耗 | 实时成本看板（关联 [[Agent成本四维预算]]） |
| 审计轴 | 不可重建、受合规约束的行为 | 持久 span + 审计记录 |

## 要点拆解

- **健康信号是运维层喂回编排层的反馈**：熔断次数、错误率、重试率等聚合后供 [[Agent终止条件多路熔断]] 和 [[Harness循环五阶段]] 的 Observe 阶段使用。
- 与 [[Agent状态一致性]] 的 cluster state、[[LangGraph与Checkpointer工作流]] 的 LangSmith/MetricsContext/structlog 可观测互补。

## 相关页面

- [[Agent工程化三层架构总览]]：运维层的可观测
- [[Agent成本四维预算]]：成本轴的源头
- [[Agent终止条件多路熔断]]：健康信号驱动的熔断
- [[Agent状态一致性]]：集群状态观察
- [[LangGraph与Checkpointer工作流]]：LangSmith/MetricsContext 实践

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]