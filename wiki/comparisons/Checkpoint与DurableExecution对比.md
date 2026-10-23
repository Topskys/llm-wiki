---
type: comparison
source: [[raw/papers/Agent工程化三层架构.md]]
description: "Checkpoint 与 Durable Execution 两种运维层状态恢复范式横向对比：机制、重放边界、副作用处理、典型工具与适用场景。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, durable_execution, checkpoint, comparison]
---

# Checkpoint与DurableExecution对比

## 核心结论

- 两种范式都支撑长期运行与故障恢复，核心差异在**重放边界**：Checkpoint 重放快照之后新增步骤；Durable Execution 可任意时间点重建并可跳过副作用。

## 横向对比

| 维度 | Checkpoint | Durable Execution |
|---|---|---|
| 机制 | 记录状态快照 | 记录事件日志 + 时间旅行重放 |
| 恢复 | 从最近快照重放 snapshot 后步骤 | 任意时刻重建状态 |
| 副作用处理 | 恢复后由业务流程保证 | 可跳过副作用重放 |
| 典型工具 | LangGraph Checkpointer | Temporal / AWS Step Functions |
| 适用 | 流程图内节点恢复 | 跨长时段运营流程 |

## 建议

- Agent 长时运行应**显式标记 durable 边界**：组合 [[Agent幂等四层防御|不可变事件日志 + 外部幂等键]]。

## 相关页面

- [[Checkpoint与DurableExecution差异]]：概念主页面
- [[LangGraph与Checkpointer工作流]]：checkpoint 的 LangGraph 实践
- [[Agent工程化三层架构总览]]：运维层

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]