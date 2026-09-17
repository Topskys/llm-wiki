---
type: concept
source: [[raw/papers/Function-Calling与MCP-Tool设计.md]]
description: "LLM Function Calling 三阶段模型：Pre-call 意图识别与参数生成 → On-call 函数执行与结果回注 → Post-call 结果解析与后续推理；LLM 只做语义路由不做物理执行的受控间接执行机制。"
created_at: 2026-09-17 10:30:00
updated_at: 2026-09-17 10:30:00
tags: [function_calling, llm, tool_call, three_stage]
---

# Function Calling三阶段模型

## 三阶段流程

```mermaid
flowchart LR
    A["Pre-call<br/>意图识别与参数生成"] --> B["On-call<br/>函数执行与结果回注"]
    B --> C["Post-call<br/>结果解析与后续推理"]
    A -.->|"LLM 输出 tool_call JSON"| B
    B -.->|"执行结果注入上下文"| C
```

<p align="center"><b>Function Calling 三阶段模型</b></p>

## 核心结论
- Function Calling 本质是**受控的间接执行**：LLM 只负责"决定调用什么"（输出结构化的 tool_call JSON），外部运行时负责"如何执行" [[raw/papers/Function-Calling与MCP-Tool设计.md]]。
- LLM 是纯文本推理引擎，不直接执行函数；分离执行源于两个根本原因——**安全性**（概率采样输出不可直接执行系统命令）与**确定性**（函数需要确定性输入输出映射）。
- 三阶段：Pre-call（选工具+生成参数）→ On-call（执行+回注）→ Post-call（解析+后续推理，可能触发多步调用）。

## 要点拆解
- **Pre-call 关键挑战**：Missing 参数（未提取全部必填参数）、Function 幻觉（生成不存在函数名）、代词解析（"把它发给张三"的指代消解）。
- **On-call**：tool_call = 函数名 + 参数对象 JSON，宿主运行时解析执行，结果以 JSON 回注上下文。
- **Post-call 最复杂**：多步调用编排是工业实践最大挑战之一，需[[Skill架构模式]]层状态机编排。

## 相关页面
- [[Function Tool设计规范]]：Tool 如何设计以支持好三阶段
- [[结构化输出与Tool抑制]]：结构化约束对 tool_call 的影响
- [[ToolRegistry跨框架互操作]]：跨 Provider 的工具调用抽象
- [[Skill工程化总览]]：流程编排承接多步调用

## 参考来源
- [[raw/papers/Function-Calling与MCP-Tool设计.md]]