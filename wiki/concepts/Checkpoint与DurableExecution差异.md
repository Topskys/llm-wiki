---
type: concept
source: [[raw/papers/Agent工程化三层架构.md]]
description: "运维层状态恢复两种范式对比：Checkpoint（记录快照、恢复重放）vs Durable Execution（时间旅行重放、重新提交动作）；Agent 长时运行应显式标记 durable 边界并组合不可变事件日志与外部幂等键。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, durable_execution, checkpoint, recovery]
---

# Checkpoint与DurableExecution差异

## 核心结论

- 运维层支持长期运行与故障恢复，两种范式：**Checkpoint**（记录快照）与 **Durable Execution**（重放时间旅行）。
- 核心差异在**重放边界**：[checkpoint 恢复时重放 snapshot 之后新增的步骤；Durable Execution 可在任意时间点重建，并可选择不重放工具的副作用。
- Agent 长时运行应显式标记 **durable 边界**：组合不可变事件日志与外部幂等键。

## 范式对比

| 维度 | Checkpoint | Durable Execution |
|---|---|---|
| 机制 | 记录状态快照 | 记录事件日志 + 重放时间旅行 |
| 恢复 | 从最近快照重放 | 任意时刻重建状态 |
| 副作用处理 | 恢复后由业务流程保证 | 可跳过副作用重放 |
| 典型工具 | LangGraph Checkpointer | Temporal / AWS Step Functions |
| 适用 | 流程图内节点恢复 | 跨长时间段的运营流程 |

## 要点拆解

- Agent 长时运行（如持续数日审批、长时间数据流水线）不能只靠单进程内存状态——需 durable 支撑。
- durable 边界实现：**不可变事件日志**（重放依据）+ **外部幂等键**（避免副作用重复，见 [[Agent幂等四层防御]]）。
- 与 [[LangGraph与Checkpointer工作流]] 的 LangGraph 节点级 checkpoint 呼应（相应 ├ 补丁级恢复）。

## 相关页面

- [[Agent工程化三层架构总览]]：运维层的续跑
- [[Checkpoint与DurableExecution对比]]：横向对比页
- [[LangGraph与Checkpointer工作流]]：LangGraph checkpoint 实践
- [[Agent幂等四层防御]]：durable 边界的外部幂等键
- [[Agent状态一致性]]：状态恢复的并发视角

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]