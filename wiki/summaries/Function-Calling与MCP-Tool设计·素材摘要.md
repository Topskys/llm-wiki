---
type: source_summary
source: [[raw/papers/Function-Calling与MCP-Tool设计.md]]
description: "对 raw 论文《LLM Function Calling 与 MCP Tool 设计：原子工具、结构化输出与跨框架互操作》的要点摘录：三阶段调用模型、Function Tool 设计四铁律、MCP Client-Host-Server 架构、Tool Suppression 问题、ToolRegistry 跨框架互操作与六大挑战。"
created_at: 2026-09-17 10:30:00
updated_at: 2026-09-17 10:30:00
tags: [function_calling, mcp, tool_design, source_summary]
---

# Function-Calling与MCP-Tool设计·素材摘要

## 原始素材信息
- 素材：`raw/papers/Function-Calling与MCP-Tool设计.md`
- 来源：ACM Computing Surveys 2026 综述、Martin Fowler 分析、MCP 官方规范与 2026 Roadmap、ToolRegistry 研究、结构化输出研究 + 豆包会话《技能与工具开发问题》
- 关联原始素材：[[raw/articles/技能与工具开发问题.md]]（Function/MCP Tool 完整示例、开发规范）

## 要点摘录
- **三阶段模型**：Pre-call（意图识别+参数生成）→ On-call（函数执行+结果回注）→ Post-call（结果解析+后续推理）。
- **Function Tool 四铁律**：单一职责 / Pydantic 入参校验 / 统一 success+data+msg 返回 / 面向 LLM 的 description 工程。
- **MCP 架构**：Client-Host-Server 三层 + JSON-RPC 2.0；能力协商、tools/list 自动发现、tools/call 执行；传输层 stdio→SSE→Streamable HTTP。
- **Tool Suppression**：结构化约束与 tool_call 约束解码空间冲突导致工具调用被压制；两阶段解耦 + 约束路由缓解。
- **ToolRegistry**：所有 tool call 本质是 RPC；Adapter 模式统一 OpenAI/Anthropic/Google/MCP 协议。
- **六大挑战**：Missing 参数、Function 幻觉、代词解析、延迟精度、多步调用、上下文管理。

## 关联的 Wiki 页面（本素材 Ingest 编译）
- [[Function Calling三阶段模型]] / [[Function Tool设计规范]] / [[MCP协议架构]] / [[结构化输出与Tool抑制]] / [[ToolRegistry跨框架互操作]]（concept）
- [[Function Tool与MCP Tool对比]]（comparison）
- 联动既有 [[MCP网关]]（协议落地面）

## 参考来源
- [[raw/papers/Function-Calling与MCP-Tool设计.md]]
- [[raw/articles/技能与工具开发问题.md]]