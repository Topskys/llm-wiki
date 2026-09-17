---
type: concept
source: [[raw/papers/Function-Calling与MCP-Tool设计.md]]
description: "结构化输出与 Tool Suppression：strict JSON Schema / CFG 约束解码保证输出结构合规，但结构化约束与 tool_call 约束在解码空间冲突时压制工具调用（Tool Suppression）；两阶段解耦与约束路由可缓解。"
created_at: 2026-09-17 10:30:00
updated_at: 2026-09-17 10:30:00
tags: [structured_output, tool_suppression, cfg_constraint, json_schema]
---

# 结构化输出与Tool抑制

## 核心结论
- **结构化输出**：通过 strict JSON Schema（OpenAI）/ tool_use 响应类型（Anthropic）/ function calling response（Google）约束 LLM 输出格式，确保 tool_call 参数可被下游直接解析校验 [[raw/papers/Function-Calling与MCP-Tool设计.md]]。
- **Tool Suppression（工具抑制）**：结构化输出约束与 Function Calling 同时启用时，本应生成的 tool_call 被约束"压制"，模型转而生成普通文本响应。
- 本质原因：CFG 约束与 tool_call 的 JSON Schema 约束在解码空间冲突，合法 tool_call 路径被提前剪枝。

## 关键机制
- **CFG 约束解码**：XGrammar / LLGuidance 在 token 生成阶段实时裁剪不符合语法的候选 token，从源头保证结构合规（而非事后校验）。
- **Guided-Structured Templates**：通过模板化推理链在 pre-call 阶段引导 LLM 按预定义模板生成参数，提升复杂场景调用准确率。

## 两阶段缓解方案
1. **阶段一：解耦约束**——先让 LLM 自由决策是否调用工具，再对结果施以结构化约束。
2. **阶段二：约束路由**——将 tool_call 和 text response 的约束空间分离，避免交叉干扰。

## 避坑要点
- 避免同一请求同时设置 strict JSON Schema 约束和 tool_call 约束。
- 使用 CFG 约束解码引擎时，确保 tool_call 的 Schema 不在约束剪枝范围内。

## 相关页面
- [[Function Calling三阶段模型]]：tool_call 生成环节所受约束
- [[Function Tool设计规范]]：Pydantic Schema 与结构化输出的衔接
- [[ToolRegistry跨框架互操作]]：各 Provider 结构化输出差异的适配

## 参考来源
- [[raw/papers/Function-Calling与MCP-Tool设计.md]]