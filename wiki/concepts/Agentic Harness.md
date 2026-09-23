---
type: concept
source: "[[raw/papers/Agent Loop.md]]"
description: "Agentic Harness：包裹在 LLM 外的运行时外壳，提供工具、管理模型所见上下文、驱动 while 循环；模型负责推理、harness 负责行动与信息递送，是『模型+工具+上下文』协同成 Agent 的载体。"
created_at: 2026-09-23 12:00:00
updated_at: 2026-09-23 12:00:00
tags: [agent, harness, orchestration, runtime]
---

# Agentic Harness

## 核心结论

Harness 是 Agent Loop 的"运行时外壳"：它把一次次的工具执行结果追加回 messages 上下文并再次调用模型，从而让模型在完整历史上做条件生成。**模型负责推理（想下一步怎么做），harness 负责行动（执行工具）与递送（回喂结果）**——没有 harness，模型只是一次性问答器。

## 架构示意

```mermaid
flowchart LR
    LLM["LLM<br/>推理与决策"] <--> H["Agentic Harness<br/>上下文管理·工具执行·循环驱动"]
    H --> T["工具集<br/>读文件/跑命令/调用API"]
    T -->|"tool_result 回喂"| H
    H --> C["上下文<br/>系统提示+历史+工具结果"]
    C -->|"条件生成输入"| LLM
```

## 职责分解

| 角色 | 负责 |
|---|---|
| 模型（LLM） | 行动选择、路径修正、终止判断、上下文取舍（四类自主决策） |
| Harness | 工具执行、结果回喂、max_turns/预算/超时护栏、hooks 触发、自动 compaction |
| 上下文 | 每轮追加历史，让下一轮决策视野更宽 |

## 相关页面

- [[Agent循环]]：循环本身如何转
- [[Turn与消息生命周期]]：harness 与模型间的往返协议
- [[Agent循环终止与护栏]]：harness 侧的护栏与 hooks
- [[AI-Agent上下文管理总览]]：harness 上下文管理能力的全景

## 参考来源

- [[raw/papers/Agent Loop.md]]