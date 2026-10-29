---
type: concept
source: [[raw/papers/推理时扩展.md]]
description: Best-of-N 加验证器为 N 个候选分别打分选最优，依赖奖励模型充当代理评估器，是并行扩展方向的代表方法之一。
created_at: 2026-10-29 10:00:00
updated_at: 2026-10-29 10:00:00
tags: [best_of_n, reward_model, parallel_scaling]
---

# Best-of-N

## 核心结论

Best-of-N 加验证器为 N 个候选分别打分选最优，依赖奖励模型充当代理评估器。重复采样的覆盖率在四个数量级上保持近似对数线性增长，在 SWE-bench Lite 上用 DeepSeek-Coder-V2-Instruct 采样 250 次，把解决率从 15.9% 拉到 56%，超过当时单次尝试的 43%。

## 要点拆解

### 核心机制

Best-of-N 属于并行扩展方向，对同一问题独立采样 N 条完整路径，再用外部信号（奖励模型）聚合答案。实现简单、并行度高，是最容易工程化的一类方法。

### 实证表现

在 SWE-bench Lite 上，用 DeepSeek-Coder-V2-Instruct 采样 250 次，把解决率从 15.9% 拉到 56%，超过当时单次尝试的 43%。

## 相关页面

- [[推理时扩展]]：Best-of-N 属于并行扩展方向的推理时扩展方法。
- [[Self-Consistency]]：与 Best-of-N 并列的并行扩展方法，区别在于使用多数投票而非验证器打分。
- [[过程奖励模型]]：Best-of-N 依赖奖励模型作为代理评估器。

## 参考来源

[[raw/papers/推理时扩展.md]]
