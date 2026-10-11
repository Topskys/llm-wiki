---
type: source_summary
source: [[raw/papers/MCP.md]]
description: "对 raw 素材《模型上下文协议（MCP）》的要点摘录：协议分层、无状态交互、三层架构、核心原语、新旧版本对比、安全最佳实践。"
created_at: 2026-10-11 14:52:25
updated_at: 2026-10-11 14:52:25
tags: [mcp, summary, protocol]
---

# MCP·素材摘要

## 核心要点

MCP 是基于 JSON-RPC 2.0 的开放协议，标准化 LLM 应用与外部数据、工具、业务系统的接入方式。2026-07-28 新版取消有状态会话，改为无状态协议。

## 知识点速查

| 模块 | 核心内容 |
|------|----------|
| **协议分层** | 传输层（Stdio/Streamable HTTP）+ 数据层（JSON-RPC 2.0） |
| **无状态交互** | server/discover + 每请求自包含 _meta |
| **三层架构** | Host（AI 应用）→ Client（连接器）→ Server（能力提供者） |
| **核心原语** | Tools（执行）/ Resources（只读）/ Prompts（模板） |
| **客户端原语** | Elicitation（保留）/ Sampling（弃用）/ Logging（弃用） |
| **通知机制** | subscriptions/listen 长连接推送变更 |
| **授权框架** | OAuth 2.0（HTTP）/ 环境变量（Stdio） |
| **安全实践** | 最小权限/高风险确认/凭证隔离/输入校验/审计/沙箱 |

## 新旧版本关键变化

- 有状态 → 无状态
- initialize → server/discover
- HTTP+SSE → Streamable HTTP
- Sampling/Logging 弃用

## 相关页面

- [[MCP协议总览]]：协议整体架构
- [[MCP协议分层架构]]：传输层与数据层
- [[MCP无状态交互]]：新版交互机制
- [[MCP三层架构]]：Host-Client-Server 角色
- [[MCP核心原语]]：Tools/Resources/Prompts
- [[MCP新旧版本对比]]：完整对比表
- [[MCP安全最佳实践]]：安全六原则

## 参考来源

- [[raw/papers/MCP.md]]
