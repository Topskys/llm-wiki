---
type: concept
source: [[raw/papers/Agent工程化三层架构.md]]
description: "Agent 不应仅靠模型自行判断任务完成：生产级终止需至少五路熔断（目标达成/步数上限/时间上限/预算上限/无进展检测），命中安全停止时返回最佳答案而非悬挂或静默截断。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, termination, circuit_breaker, guardrail]
---

# Agent终止条件多路熔断

## 核心结论

- Agent 不应仅靠模型自行判断"任务完成"——需**多路熔断**兜底，防止 runaway agent。
- 生产级终止条件至少含 **五路**：目标达成、步数上限、时间上限、预算上限、无进展检测。
- 命中安全停止时须返回"最佳答案"或部分结果，而非悬挂或静默截断。

## 五路终止设计

| 终止类型 | 触发条件 | 典型默认值 | 命中后行为 |
|---|---|---|---|
| 目标达成 | 模型显式产出 final answer | — | 优雅退出 |
| 步数上限 | 达到 `max_model_calls` 或 `max_tool_calls` | 由配置项决定 | 返回"达上限"标记 |
| 时间上限 | wall-clock 超时 | Claude Code 默认 10 分钟 | 保存 checkpoint 后终止 |
| 预算上限 | token / 美元 / API 调用超限 | 按任务等级配置 | 熔断 + 告警 |
| 无进展检测 | 重复同 tool call 与参数、观察无变化 | 连续若干次即熔断 | 触发断路器 |

## 要点拆解

- **无进展检测的关键是定义"什么算一样"**——同参数、同观察或状态无变化均可作判据。
- 工程参考：LangChain 的 `ModelCallLimitMiddleware` / `ToolCallLimitMiddleware` 专门防止 runaway agent 产生过多调用，到达上限可优雅 `end` 或抛 `error`。
- 与 [[Agent循环终止与护栏]] 的既有体系互补：那里讲模型侧 stop_reason + harness 硬限制的"双保险"，本页专注生产级多路熔断的完整谱系。

## 相关页面

- [[Agent工程化三层架构总览]]：编排层的终止条件
- [[Agent循环终止与护栏]]：终止协议的既有双保险视角（联动）
- [[Agent成本四维预算]]：预算上限与成本熔断
- [[Agent幂等四层防御]]：无进展重试的幂等兜底
- [[Agent可观测追踪三轴]]：断路器触发次数的健康信号

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]
- [[Agent循环终止与护栏]]：既有终止体系联动