---
type: concept
source: [[raw/papers/Function-Calling与MCP-Tool设计.md]]
description: "Function Tool 设计规范：单一职责原子操作、Pydantic 入参校验（自动 JSON Schema + 运行时类型检查）、统一 success+data+msg 返回结构、面向 LLM 的 description 工程，工具调用不暴露原始堆栈、异常隔离。"
created_at: 2026-09-17 10:30:00
updated_at: 2026-09-18 23:55:00
tags: [function_tool, tool_design, pydantic, llm_agent]
---

# Function Tool设计规范

## 核心结论
- Function Tool 是代码内嵌 Agent 进程、手动注册接入的最基础工具形态；**只做一件原子操作**，流程编排交给 Skill 层 [[raw/papers/Function-Calling与MCP-Tool设计.md]]。
- 四条设计铁律：**单一职责 + Pydantic 入参校验 + 统一返回结构 + 面向 LLM 的 description**。

## 要点拆解

### 单一职责原则
- 一个 Tool 只做一件事，禁止在 Tool 内部写多步骤业务逻辑；口诀：Tool 做"事"，Skill 做"决策"，MCP 做"连接"。

### Pydantic 入参校验
- `BaseModel` 自动生成 JSON Schema 供 LLM 在 pre-call 阶段理解参数结构：
  - `model_json_schema()` 直接产出 LLM 需要的 parameters JSON Schema
  - Handler 层 `Model(**raw_args)` 完成类型检查与默认值填充
  - 非法参数入口即捕获，异常隔离、不向 LLM 暴露原始堆栈

### 统一返回结构
- 标准返回 `{success, data, msg}`，让上层 Skill 用统一分支 `if result["success"]` 处理所有 Tool 返回，无需逐工具写错误逻辑。

### Description 工程（面向 LLM）
- **功能定义**：工具做什么（"获取指定城市实时天气信息"）
- **参数约束**：取值范围与默认行为（"支持摄氏度/华氏度"）
- **触发场景**：什么时候应调用（与用户意图映射）
- LLM 完全靠 description 理解工具，写作需考虑 LLM 理解模式而非人类开发者。

## 相关页面
- [[Function Calling三阶段模型]]：Tool 设计服务的调用流程
- [[Function Tool与MCP Tool对比]]：与 MCP Tool 的形态差异
- [[Skill工程化总览]]：Tool 与 Skill 的职责边界
- [[Skills技能]]：组织内 Tool 与 Skill 的组织机制
- [[工具调用零信任管控]]：工具层安全管控视角（参数校验、Fail Closed）

## 参考来源
- [[raw/papers/Function-Calling与MCP-Tool设计.md]]
- [[raw/articles/技能与工具开发问题.md]]