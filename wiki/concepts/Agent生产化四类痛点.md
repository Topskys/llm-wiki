---
type: concept
source: [[raw/papers/Agent工程化三层架构.md]]
description: "Agent 生产化的四类核心痛点：LLM 本身不可靠（非确定性/幻觉/提示注入）、脚手架差异导致同一模型表现不同、越权与不可逆操作风险（OWASP Excessive Agency）、成本失控与无界循环；它们共同指向『需要外部可靠性约束体系』。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [agent, production, pain_points, reliability]
---

# Agent生产化四类痛点

## 核心结论

- Agent 生产化四类痛点共同指向一个结论：**需要围绕非确定性模型的外部可靠性约束体系**（即 [[Agent工程化三层架构总览]] 的三层约束）。
- 四类痛点：① LLM 本身不可靠、② 脚手架差异、③ 越权与不可逆风险、④ 成本失控与循环。

## 要点拆解

### LLM 本身的不可靠性
- 三种使传统工程手段失效的特性：
  - **非确定性**——同一 prompt 重试可能生成不同参数；
  - **幻觉与『幽灵成功』**——报告任务完成却实际失败；
  - **对 prompt injection 敏感**——外部输入可改写决策。
- 这要求重构传统 CRUD 的"重试 + Idempotency-Key"模式：单纯哈希 payload 会导致重试无法命中（见 [[Agent幂等四层防御]]）。

### 脚手架差异的实证
- Harness 对性能影响有实证支撑：
  - Anthropic SWE-bench Verified：同一底层模型在不同脚手架下表现差异显著；
  - Harness-Bench 5194 条轨迹：性能在"模型-Harness 配置"层面存在实质差异，**应在配置层报告而非归因于基础模型**；
  - Terminal-Bench 2.0 基础设施配置差异即可相差 6 个百分点（p<0.01）。

### 越权与不可逆操作风险
- OWASP LLM06:2025 Excessive Agency 系统梳理越权典型模式：
  - LLM 获超必要权限（如 `UPDATE/INSERT/DELETE` 一并授权）；
  - 以高权限通用身份连接下游；
  - 未经确认即执行高影响操作。
- 缓解原则：仅授予最低必要扩展与函数，对高影响操作做独立验证与人工批准（见 [[Agent最小权利与审批门]]）。

### 成本失控与循环
- 一次任务可能跨多个 provider、产生用户不可见的推理 token、spawn 子 Agent 重复计费。
- 缺显式终止条件与预算熔断时，Agent 会陷入 HTTP 200 持续烧钱的循环——这种失败在传统 APM 视角下"看似成功"（见 [[Agent成本四维预算]]、[[Agent终止条件多路熔断]]）。

## 相关页面

- [[Agent工程化三层架构总览]]：针对四类痛点的三层解法
- [[Agent幂等四层防御]]：应对非确定性导致的重复执行
- [[Agent最小权利与审批门]]：应对越权风险
- [[Agent成本四维预算]] / [[Agent终止条件多路熔断]]：应对成本失控与循环

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]