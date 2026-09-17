---
type: comparison
source: [[raw/papers/Function-Calling与MCP-Tool设计.md]]
description: "Function Tool 与 MCP Tool 横向对比：进程内嵌 vs 独立 Server、同框架绑定 vs 跨框架复用、手动注册 vs 自动发现、同进程 vs 可远程部署；选型建议按复用范围、生产化程度与多 Agent 共享需求权衡。"
created_at: 2026-09-17 10:30:00
updated_at: 2026-09-17 10:30:00
tags: [function_tool, mcp_tool, comparison, tool_selection]
---

# Function Tool与MCP Tool对比

## 核心结论
- 两者都是 Tool 的载体，差异在**运行形态、复用范围与发现机制**：Function Tool 轻量内嵌单框架，MCP Tool 独立进程跨框架复用 [[raw/papers/Function-Calling与MCP-Tool设计.md]]。
- 选型建议：单 Agent 框架 + 求快用 Function Tool；跨框架复用 / 多 Agent 共享 / 生产插件化用 MCP Tool。

## 对比表

| 项目 | Function Tool（原生 Function Calling） | MCP Tool |
|------|---------------------------------------|----------|
| 运行形态 | 代码内嵌 Agent 进程内 | 独立进程 MCP Server，进程间通信 JSON-RPC |
| 复用范围 | 绑定当前 Agent 框架（OpenAI/LangGraph） | 一次编写，所有支持 MCP 的 Agent 直接复用 |
| 发现机制 | 手动注册工具描述（代码硬编码） | 自动工具发现 `tools/list` |
| 部署方式 | 同进程，简单直接 | 独立服务，可远程部署（Streamable HTTP） |
| 适合场景 | 自研 Agent、快速原型、单框架 | 多 Agent 共享、生产插件化 |

## 选型决策
- **要开发效率 + 单框架** → Function Tool：Pydantic 校验 + 统一返回结构即可上路
- **要跨框架 + 生产 + 多 Agent** → MCP Tool：一次编写处处调用，自动发现免硬编码
- 二者并非互斥：[[ToolRegistry跨框架互操作]] 可将同一工具同时注册为两种形态

## 相关页面
- [[Function Tool设计规范]]：Function Tool 的写法
- [[MCP协议架构]]：MCP Tool 的协议基础
- [[Skill工程化总览]]：Skill 编排两种 Tool 的协作
- [[MCP网关]]：MCP Tool 在网关中的编排

## 参考来源
- [[raw/papers/Function-Calling与MCP-Tool设计.md]]
- [[raw/articles/技能与工具开发问题.md]]