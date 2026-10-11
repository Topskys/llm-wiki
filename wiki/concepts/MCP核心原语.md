---
type: concept
source: [[raw/papers/MCP.md]]
description: "MCP Server 对外提供三类标准化能力原语：Tools（可执行函数）、Resources（只读上下文数据）、Prompts（可复用提示模板）。"
created_at: 2026-10-11 14:52:25
updated_at: 2026-10-11 14:52:25
tags: [mcp, tools, resources, prompts, primitives]
---

# MCP 核心原语

## 核心结论

MCP Server 对外提供三类标准化能力原语，覆盖动作执行、上下文供给、模板复用三大场景。

## 三类原语

### Tools（工具原语）

可执行的函数操作，支持模型通过结构化调用修改外部系统状态。

| 接口 | 作用 |
|------|------|
| `tools/list` | 枚举服务端所有可用工具 |
| `tools/call` | 执行指定工具调用 |

工具定义采用结构化 JSON Schema，包含 `name`、`title`、`description`、`inputSchema`。

### Resources（资源原语）

只读类上下文数据，用于向 Agent 提供任务所需的背景信息。

| 接口 | 作用 |
|------|------|
| `resources/list` | 枚举可用资源 |
| `resources/read` | 读取指定资源 |

资源通过 URI 定位：`file://`（本地文档）、`db://`（数据库表结构）。

### Prompts（提示模板原语）

可复用的交互提示模板，封装特定场景的指令结构与输出规范。

| 接口 | 作用 |
|------|------|
| `prompts/list` | 枚举可用模板 |
| `prompts/get` | 获取指定模板 |

## 客户端原语

| 原语 | 状态 | 作用 |
|------|------|------|
| **Elicitation** | 保留 | 服务端请求用户补充信息或确认操作 |
| **Sampling** | 2026-07-28 弃用 | 服务端反向请求 Host 侧 LLM |
| **Logging** | 2026-07-28 弃用 | 服务端向客户端发送日志 |

## 相关页面

- [[MCP协议总览]]：协议整体架构
- [[MCP三层架构]]：Server 角色职责
- [[MCP无状态交互]]：新版交互机制
- [[Function Calling三阶段模型]]：与 Tools 的关系

## 参考来源

- [[raw/papers/MCP.md]]
