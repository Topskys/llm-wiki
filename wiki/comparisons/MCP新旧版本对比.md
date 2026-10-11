---
type: comparison
source: [[raw/papers/MCP.md]]
description: "MCP 新旧版本对比：2025-11-25 有状态会话 vs 2026-07-28 无状态协议，涵盖协议状态、初始化、传输、客户端原语等维度。"
created_at: 2026-10-11 14:52:25
updated_at: 2026-10-11 14:52:25
tags: [mcp, version_comparison, protocol]
---

# MCP 新旧版本对比

## 核心结论

MCP 2026-07-28 新版取消有状态会话、改为无状态协议，进一步简化了集成复杂度。

## 对比表

| 维度 | 旧版（2025-11-25） | 新版（2026-07-28） |
|------|-------------------|-------------------|
| 协议状态 | 有状态会话 | **无状态**，每请求自包含 `_meta` |
| 初始化 | `initialize` 握手 + 能力协商 | **`server/discover`** 发现请求（可缓存） |
| 会话生命周期 | 初始化→运行→关闭 三阶段 | **取消**，无会话概念 |
| Sampling | 客户端原语 | **已弃用**，直接对接 LLM API |
| Logging | 客户端原语 | **已弃用**，改用 stderr/OpenTelemetry |
| 传输 | Stdio + HTTP+SSE | Stdio + **Streamable HTTP** |
| 客户端原语 | Sampling/Roots/Elicitation | **仅 Elicitation** |
| 新增 | — | **Tasks 扩展**（长轮询+延迟结果） |

## 关键变化

1. **无状态化**：每请求独立携带版本+能力+身份，服务端无需维护会话状态
2. **发现机制**：`server/discover` 替代 `initialize`，响应可缓存
3. **原语精简**：Sampling/Logging 弃用，仅保留 Elicitation
4. **传输升级**：HTTP+SSE 升级为 Streamable HTTP

## 相关页面

- [[MCP协议总览]]：协议整体架构
- [[MCP无状态交互]]：新版交互机制详解
- [[Streamable HTTP]]：新版传输协议
- [[MCP核心原语]]：客户端原语变化

## 参考来源

- [[raw/papers/MCP.md]]
