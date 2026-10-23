---
type: source_summary
source: "[[raw/papers/Agent工程化三层架构.md]]"
description: "对 raw 论文《Agent 工程化三层架构》的要点摘录：编排/隔离/运维三层职责、生产化四痛点、Harness 循环五阶段、幂等四层防御、多路终止、成本四维预算、四档沙箱、最小权利与审批门、可观测三轴、Checkpoint 与 Durable Execution 差异。"
created_at: 2026-10-23 19:32:55
updated_at: 2026-10-23 19:32:55
tags: [source_summary, agent, engineering, orchestration]
---

# Agent工程化三层架构·素材摘要

## 素材定位

- **来源**：[[raw/papers/Agent工程化三层架构.md]]（单份论文素材，含 21 篇参考文献）。
- **主题**：Agent 工程化三层架构——围绕非确定性 LLM 构建的编排、隔离、运维三层可靠性约束体系。

## 核心要点

### 1. 三层架构职责划分
- **编排层**：决定循环的形状（推进节奏与终止）——Harness 循环五阶段、重试幂等、终止条件、成本预算。
- **隔离层**：决定单步的爆炸半径（能碰什么、谁来批准）——四档沙箱、最小权利与审批门、用完即收。
- **运维层**：决定长期可信度（能否解释、续跑与审计）——追踪三轴、Checkpoint 与 Durable Execution。

### 2. 生产化四类痛点
- LLM 不可靠（非确定性 / 幻觉幽灵成功 / prompt injection）；
- 脚手架差异实证（SWE-bench Verified、Harness-Bench 5194 条轨迹、Terminal-Bench 差 6 个百分点）；
- 越权与不可逆操作风险（OWASP LLM06:2025 Excessive Agency）；
- 成本失控与循环（HTTP 200 持续烧钱、APM 视角看似成功）。

### 3. 编排层关键机制
- Harness 循环：Perceive → Reason → Plan → Act → Observe；
- 幂等四层防御（目标端原生 / 幂等键落库 / 写后读回 / 本地调用记录）+ 幂等键三铁律；
- 五路终止：目标达成 / 步数 / 时间 / 预算 / 无进展检测；
- 成本四维预算：token / 步数 / 时间 / 金额（金额超阈值熔断）。

### 4. 隔离层关键机制
- 四档沙箱：T1 Wasm → T2 容器 → T3 硬化容器/gVisor → T4 microVM；
- 两维权限模型：可逆性 × 爆炸半径 → 四档授权门槛；审批门四要素；
- 用完即收：一次性凭证用完即撤销。

### 5. 运维层关键机制
- 可观测三轴：执行 / 成本 / 审计；健康信号反馈编排层；
- Checkpoint vs Durable Execution：重放边界差异，durable 边界需不可变事件日志 + 外部幂等键。

## 编译期核对

关键论断均绑定文献：超过效建筑（文1/2/3/5）、OWASP（文4）、幂等（文6）、终止（文7/8/9）、沙箱（文10/11）、权限（文12）、可观测（文13/14/15）、durable（文16/17/18/19）。2 张 Mermaid 图题注遵循 `<p align="center">` 不加粗。正文 6 张表（表1-6）均对应消费。

## 相关页面

- [[Agent工程化三层架构总览]]：主总览页
- [[Harness循环五阶段]] / [[Agent幂等四层防御]] / [[Agent终止条件多路熔断]] / [[Agent成本四维预算]]：编排层
- [[四档沙箱隔离模型]] / [[Agent最小权利与审批门]]：隔离层
- [[Agent可观测追踪三轴]] / [[Checkpoint与DurableExecution差异]]：运维层
- [[Agent生产化四类痛点]]：问题侧
- [[四档沙箱对比]] / [[Checkpoint与DurableExecution对比]]：对比页

## 参考来源

- [[raw/papers/Agent工程化三层架构.md]]