---
type: concept
source: [[raw/papers/MCP.md]]
description: "MCP 协议栈分为传输层与数据层：传输层负责 JSON-RPC 消息物理传输（Stdio/Streamable HTTP），数据层定义消息结构与交互语义。"
created_at: 2026-10-11 14:52:25
updated_at: 2026-10-11 14:52:25
tags: [mcp, protocol, json_rpc, transport]
---

# MCP 协议分层架构

## 核心结论

MCP 采用分层设计，自下而上分为传输层与数据层，各层职责边界清晰，可独立演进。

## 要点拆解

### 传输层

负责 JSON-RPC 消息的物理传输，不解析协议语义。两种实现方式：

| 模式 | 机制 | 适用场景 |
|------|------|----------|
| **Stdio** | 标准输入输出流 | 本地进程间通信，部署简单、安全性高 |
| **Streamable HTTP** | HTTP POST + SSE 流式推送 | 远程服务接入，支持 OAuth 2.0 认证 |

### 数据层

基于 JSON-RPC 2.0 规范定义消息结构与交互语义，包含四大模块：
- 生命周期管理
- 服务端能力原语
- 客户端能力原语
- 通用工具原语

### 消息类型

| 类型 | 特点 |
|------|------|
| **请求（Request）** | 唯一 ID + 方法名 + 参数 |
| **响应（Response）** | 相同 ID + 结果或错误对象 |
| **通知（Notification）** | 无 ID，无需回复 |

## 相关页面

- [[MCP协议总览]]：协议整体架构
- [[MCP无状态交互]]：新版数据层交互机制
- [[Streamable HTTP]]：新版传输协议详解
- [[MCP三层架构]]：Host-Client-Server 角色

## 参考来源

- [[raw/papers/MCP.md]]
