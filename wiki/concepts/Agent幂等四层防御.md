---
type: concept
source: [[raw/papers/Agent工程化三层架构.md]]
description: "Agent 幂等设计：调用方是 LLM 而非确定性客户端，幂等键需从稳定结构上下文派生（如 run_id+step_id+tool_name）；L1-L4 多层防御 + 三条铁律，重试时避免重复执行副作用。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, idempotency, retry, reliability]
---

# Agent幂等四层防御

## 核心结论

- Agent 幂等的关键差异：**调用方是 LLM 而非确定性客户端代码**——重试时模型可能生成不同参数，单纯哈希 payload 会导致重试无法命中。
- 幂等键铁律：从稳定结构上下文派生（如 `(run_id, step_id, tool_name)`）、粒度对齐业务动作而非执行实例、参数不匹配时显式报错。
- 工程落地为 **L1-L4 多层防御**：目标端原生、幂等键落库、写后读回验证、本地调用记录。

## 幂等键三条铁律

1. 键从**稳定结构上下文**派生（`(run_id, step_id, tool_name)`），而非从 LLM 输出哈希——同一 prompt 重试可能生成不同参数；
2. **粒度对齐业务动作**而非执行实例——太粗会错误去重、太细会让重试无法命中；
3. 参数不匹配时按 Stripe 模式**显式报错**而非静默二次执行[[6]](#ref-6)。

## L1-L4 四层防御

| 层级 | 防御点 | 典型实现 |
|---|---|---|
| L1 目标端原生幂等 | 优先使用上游提供的幂等能力 | Stripe `Idempotency-Key` header |
| L2 幂等键落库 | 数据库唯一约束 + 状态机 | `(agent_run_id, step_id, tool_name)` 主键，状态机 `processing/success/failed` |
| L3 写后读回验证 | 读回比对声明意图 | 通过确定性 wrapper 读回结果比对，而非信任模型返回的"成功" |
| L4 本地调用记录 | 短事务内提交 calling 状态再外呼 | 重试时本地已 success 直接返回，不再外呼 |

## 相关页面

- [[Agent工程化三层架构总览]]：编排层的幂等防御
- [[重试预算与幂等保护]]：既有重试/幂等体系（网关视角）
- [[Agent终止条件多路熔断]]：无进展检测与幂等的关系
- [[Agent成本四维预算]]：避免重复计费

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]
- [[重试预算与幂等保护]]：网关层重试预算的既有视角