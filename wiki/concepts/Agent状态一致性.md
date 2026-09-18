---
type: concept
source: [[raw/articles/multi-agent-context-management.md]]
description: "多Agent并发操作共享状态时的一致性保障机制，涵盖写时冲突检测（STORM）、事务补偿（SagaLLM）、Schema验证（PatchBoard）和自动读集重建（S-Bus）四种方案。"
created_at: 2026-09-16 20:00:00
updated_at: 2026-09-16 20:00:00
tags: [multi_agent, state_consistency, concurrency_control]
---

# Agent状态一致性

## 核心结论

多Agent并发操作共享状态时，一致性保障的核心问题是**读写冲突的检测时机**：事后合并（GitWorktree）代价高，写时检测（STORM）更有效。方案从写时版本验证演进到事务补偿、Schema级验证和自动读集重建。

## 要点拆解

### 问题定义

Agent推理期间（秒到分钟级），其读集既未锁定也未验证。其他Agent可能已修改其依赖文件，导致写入基于过期信息。

### 四种方案对比

| 方案 | 检测时机 | 一致性级别 | 核心机制 |
|------|----------|-----------|----------|
| **STORM** | 写时 | 局部状态一致性 | 版本号验证+写拒绝+diff返回 |
| **SagaLLM** | 操作后 | 最终一致性 | 补偿事务+依赖图+检查点 |
| **PatchBoard** | 提交前 | 强Schema一致性 | JSON Patch验证+确定性内核 |
| **S-Bus** | 提交时 | 可观测读隔离 | DeliveryLog自动重建读集 |

### STORM：写时冲突检测

**核心洞察**：Agent不需要全局快照，只需保证其读取的文件在推理期间未被修改（局部状态一致性）。

**机制**：
- 每个文件维护单调递增版本号 $v_f$
- 读取返回内容 + 版本号
- 写入声明期望版本，验证通过才提交
- 拒绝时返回：当前内容、差异diff、过期依赖列表

**效果**：在Commit0-Lite上达到82.5%通过率，比GitWorktree隔离（63.8%）高18.7个百分点。

### SagaLLM：事务补偿

**核心思想**：将多Agent工作流建模为Saga事务——操作序列 $O = \{o_1, ..., o_n\}$ 作用于状态 $S$，要么完全提交 $S'$，要么通过补偿恢复到 $S$。

**两级恢复**：
- 操作级：单个操作失败时执行补偿事务
- 工作流级：遍历依赖图编排多个补偿操作

### PatchBoard：Schema验证

用结构化JSON Patch替代自然语言对话，确定性内核验证每次状态变更。84.6%成功率 vs LangGraph 30.8%。

### 并发异常的形式化

四种并发异常（类比数据库隔离级别）：

| 异常 | 类比 | 说明 |
|------|------|------|
| stale-generation | 脏读 | 基于过期读集生成 |
| phantom-tool | 幻读 | 工具注册表变化 |
| causal-cascade | 级联中止 | 已提交外部效应无法撤销 |
| tool-effect reordering | 写写冲突 | 工具调用效果乱序 |

## 相关页面

- [[多Agent上下文管理总览]]：全景总览
- [[上下文污染]]：上下文路由问题
- [[Agent异常处理与循环检测]]：失败处理

## 参考来源

- [[raw/articles/multi-agent-context-management.md]]
