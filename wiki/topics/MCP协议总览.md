---
type: topic
source: [[raw/papers/MCP.md]]
description: "MCP（模型上下文协议）是基于 JSON-RPC 2.0 的开放协议，标准化 LLM 应用与外部数据、工具、业务系统的接入方式。2026-07-28 新版取消有状态会话改为无状态协议，通过 server/discover 替代 initialize 握手。"
created_at: 2026-10-11 14:52:25
updated_at: 2026-10-11 14:52:25
tags: [mcp, json_rpc, agent, tool_integration]
---

# MCP 协议总览

## 核心结论

MCP（Model Context Protocol）是一套基于 JSON-RPC 2.0 的开放标准化协议，通过定义统一的交互规范与能力原语，在大语言模型应用与外部数据、工具、业务系统之间构建标准化接入层。

## 要点拆解

### 协议分层

MCP 采用分层设计，自下而上分为传输层与数据层：
- **传输层**：负责 JSON-RPC 消息的物理传输（Stdio / Streamable HTTP）
- **数据层**：定义消息结构与交互语义（生命周期管理、能力原语、通知）

详见 [[MCP协议分层架构]]。

### 新旧版本对比

| 维度 | 旧版（2025-11-25） | 新版（2026-07-28） |
|------|-------------------|-------------------|
| 协议状态 | 有状态会话 | **无状态**，每请求自包含 `_meta` |
| 初始化 | `initialize` 握手 | **`server/discover`** 发现请求 |
| Sampling | 客户端原语 | **已弃用** |
| 传输 | HTTP+SSE | **Streamable HTTP** |

详见 [[MCP新旧版本对比]]。

### 核心架构

Host-Client-Server 三层架构，三类角色职责解耦：
- **Host**：AI 应用载体，管理会话与权限
- **Client**：协议通信连接器，1:1 对接 Server
- **Server**：外部能力提供者，封装为 MCP 原语

详见 [[MCP三层架构]]。

### 能力原语

Server 对外提供三类标准化原语：
- **Tools**：可执行函数操作
- **Resources**：只读上下文数据
- **Prompts**：可复用提示模板

详见 [[MCP核心原语]]。

### 安全最佳实践

最小权限、高风险确认、凭证隔离、输入校验、全链路审计、沙箱隔离六条原则。详见 [[MCP安全最佳实践]]。

## 相关页面

- [[MCP协议分层架构]]：传输层与数据层详解
- [[MCP无状态交互]]：新版 server/discover 机制
- [[MCP三层架构]]：Host-Client-Server 角色职责
- [[MCP核心原语]]：Tools/Resources/Prompts
- [[MCP新旧版本对比]]：2025-11-25 vs 2026-07-28
- [[MCP安全最佳实践]]：Agent 开发安全六原则
- [[Streamable HTTP]]：新版传输协议
- [[MCP·素材摘要]]：原始素材要点摘录

## 参考来源

- [[raw/papers/MCP.md]]
