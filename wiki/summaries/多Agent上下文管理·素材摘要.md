---
type: source_summary
source: [[raw/articles/multi-agent-context-management.md]]
description: "多Agent模式下上下文管理、状态一致性保障、异常处理与循环检测的26篇论文研究综述，覆盖Google ADK、RCR-Router、DACS、STORM、SagaLLM、SHIELDA等方案。"
created_at: 2026-09-16 20:00:00
updated_at: 2026-09-16 20:00:00
tags: [multi_agent, context_management, state_consistency, failure_handling]
---

# 多Agent上下文管理·素材摘要

> 原始素材：[[raw/articles/multi-agent-context-management.md]]
> 来源：联网搜索 + 论文整理（26篇论文）
> 日期：2026-09-16

## 核心问题

素材围绕三个核心问题展开：

1. **多Agent模式下上下文是怎么做的？** — 九种主流方案
2. **怎么保证多Agent下状态的一致性？** — 四种一致性方案
3. **Agent调用失败/异常/循环怎么处理？** — 五种异常处理方案

## 上下文管理方案索引

| 方案 | 核心机制 | 来源 |
|------|----------|------|
| Google ADK | 四层上下文（Working Context/Session/Memory/Artifacts） | Google Blog |
| RCR-Router | 角色感知动态路由，按token预算分配 | arXiv:2508.04903 |
| DACS | 非对称上下文隔离（Registry+Focus模式） | arXiv:2604.07911 |
| G-Memory | 三层图记忆（Insight/Query/Interaction） | NeurIPS 2025 |
| ACM | Agent自主决定何时压缩，无损+外部存储 | arXiv:2607.23809 |
| KVCOMM | KV-Cache跨Agent复用，7.8x加速 | NeurIPS 2025 |
| DeLM | 去中心化共享验证上下文 | arXiv:2606.10662 |
| Agent-Radar | 注意力引导（空间+时间+语义三层衰减） | arXiv:2605.30136 |
| COMPASS | 三组件分治（Main Agent/Meta-Thinker/Context Manager） | ACL 2026 |

## 状态一致性方案索引

| 方案 | 核心机制 | 一致性级别 |
|------|----------|-----------|
| STORM | 写时冲突检测+版本号 | 局部状态一致性 |
| SagaLLM | Saga事务+补偿操作+检查点 | 最终一致性 |
| PatchBoard | JSON Schema验证+确定性内核 | 强一致性 |
| S-Bus | 自动读集重建+OCC | 可观测读隔离 |

## 异常处理方案索引

| 方案 | 核心机制 | 能力 |
|------|----------|------|
| SHIELDA | 36类异常+阶段感知升级 | 分类→处理→升级→恢复 |
| AgentTether | CTG图诊断+运行时干预 | 诊断→引导→干预 |
| IAL-Scan | 静态分析+ALDG循环图 | 离线循环检测 |
| 自愈编排器 | 信号→分类→恢复→验证 | 有界自愈 |
| Real-Time Detection | 回声状态网络+CUSUM | 实时检测+回滚 |

## 关键洞察

- **上下文管理的核心权衡**：信息量 vs token成本 vs 相关性
- **状态一致性的核心问题**：并发Agent的读写冲突检测时机（写时 vs 事后）
- **异常处理的核心问题**：阶段感知（执行阶段的异常可能根因在推理阶段）
- **循环检测的核心问题**：有效终止条件的缺失（69.1%的IAL源于无界重试）
