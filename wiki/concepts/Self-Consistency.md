---
type: concept
source: [[raw/papers/推理时扩展.md]]
description: Self-Consistency 多数投票用多数投票替代贪心解码，赌的是复杂问题常有多条路径通向同一答案，在 GSM8K 上带来 17.9 个百分点、SVAMP 上 11.0 个百分点的提升，且不需要外部验证器。
created_at: 2026-10-29 10:00:00
updated_at: 2026-10-29 10:00:00
tags: [self_consistency, majority_voting, parallel_scaling]
---

# Self-Consistency

## 核心结论

Self-Consistency 多数投票用多数投票替代贪心解码，赌的是复杂问题常有多条路径通向同一答案。在 GSM8K 上带来 17.9 个百分点、SVAMP 上 11.0 个百分点的提升，且不需要外部验证器。

## 要点拆解

### 核心机制

Self-Consistency 属于并行扩展方向，对同一问题独立采样 N 条完整路径，再用多数投票聚合答案。实现简单、并行度高，是最容易工程化的一类方法。

### 实证表现

在 GSM8K 上带来 17.9 个百分点提升，SVAMP 上 11.0 个百分点提升。不需要外部验证器，但数百个样本后会趋于饱和。

## 相关页面

- [[推理时扩展]]：Self-Consistency 属于并行扩展方向的推理时扩展方法。
- [[Best-of-N]]：与 Self-Consistency 并列的并行扩展方法，区别在于使用验证器打分而非多数投票。
- [[测试时缩放律]]：Self-Consistency 在数百个样本后饱和，体现了缩放律中的边际递减。

## 参考来源

[[raw/papers/推理时扩展.md]]
