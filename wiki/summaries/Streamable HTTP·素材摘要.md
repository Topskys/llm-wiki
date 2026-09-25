---
type: source_summary
source: "[[raw/papers/Streamable HTTP.md]]"
description: "对 raw 论文《Streamable HTTP》的要点摘录：概念分层与传输方案对比、单端点三条规则与三种响应模式、有状态经典机制（会话/重连/终止）、2026-07-28 无状态重构（server/discover、MRTR、subscriptions/listen、双栈）与实现、性能、部署要点索引。"
created_at: 2026-09-25 15:26:02
updated_at: 2026-09-25 15:26:02
tags: [source_summary, mcp, streamable_http]
---

# Streamable HTTP·素材摘要

## 素材信息

| 项 | 内容 |
|---|---|
| 素材 | [[raw/papers/Streamable HTTP.md]] |
| 主题 | MCP Streamable HTTP 传输协议机制、演进与工程实践 |
| 来源 | MCP 官方规范（2024-11-05 / 2025-03-26 / 2025-11-25 / 2026-07-28）、changelog、versioning、MRTR 模式页、SEP-2575 提案、JSON-RPC 2.0 / WHATWG SSE / RFC 9110 标准、linhx 博客（概念辨析） |
| 核验 | server/discover、`_meta`、`-32022`、MRTR、subscriptions/listen、双栈时代探测等关键协议点经官方原文联网核验；论文经三轮修订，mermaid / 引用锚点 / 禁串校验通过 |

## 要点索引

- **概念辨析**：Streamable HTTP = HTTP 承载 + JSON-RPC 信封 + 可选 SSE 下行 + MCP 规则；与自研 POST+SSE 的差别在整套交互约定，与 WebSocket 的边界是请求驱动 vs 持久全双工，官方选型属基础设施权衡。
- **方案对比**：传统 HTTP+SSE（双端点）/ Streamable HTTP / WebSocket / stdio 七维对比——单端点 + 无状态 + 完全兼容 HTTP 生态是远程部署最优解。
- **三种响应模式**：快速请求 → 一次性 JSON；长任务 → SSE 流式（进度+最终结果）；仅通知 → 202 空响应体。
- **有状态经典机制（2025-11-25）**：三步握手下发 `Mcp-Session-Id`、GET 推送通道（405 降级）、`Last-Event-ID` 断线重放、DELETE/404 双向终止。
- **无状态重构（2026-07-28）**：移除会话/握手/GET 推送/Last-Event-ID；新增 `Mcp-Method`/`Mcp-Name` 路由头、每请求版本头与 `_meta`、`server/discover` 按需发现（`-32022`）；服务端主动消息改 MRTR 重试循环、广播走 `subscriptions/listen`、长任务走 tasks 轮询。
- **工程要点**：收益在部署侧（连接开销↓、水平扩展↑、轮询 LB），代价在 `_meta` 带宽、断线整单重试、长任务轮询；断线恢复移除属静默退化，有副作用工具必须幂等键；同一端点 dual-era 双栈兼容旧客户端。
- **实现示例**：curl 的 JSON/SSE 双例、FastAPI 极简服务端、Python 客户端（一次性 JSON 与 SSE 流两套调用）。

## 相关页面

- [[Streamable HTTP]]：由本文档编译的主概念页
- [[MCP协议架构]]：MCP 协议整体与传输层演进语境
- [[MCP网关]]：Mcp-Method/Mcp-Name 路由头的网关落地
- [[断线续传]] / [[重试预算与幂等保护]]：Last-Event-ID 移除与幂等键的关联解读
