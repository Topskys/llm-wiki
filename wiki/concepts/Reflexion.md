---
type: concept
source: [[raw/papers/推理时扩展.md]]
description: Reflexion 把语言化反思存进情景记忆，在 HumanEval 上达到 91% 的 pass@1，高于 GPT-4 的 80%。
created_at: 2026-10-29 10:00:00
updated_at: 2026-10-29 10:00:00
tags: [reflexion, reflection, episodic_memory]
---

# Reflexion

## 核心结论

Reflexion 把语言化反思存进情景记忆，在 HumanEval 上达到 91% 的 pass@1，高于 GPT-4 的 80%。

## 要点拆解

### 核心机制

Reflexion 属于反思与自我修正方向，先出草稿再批判修订。与 Self-Refine 不同，Reflexion 把语言化反思存进情景记忆，供后续推理参考。

### 实证表现

在 HumanEval 上达到 91% 的 pass@1，高于 GPT-4 的 80%。

## 相关页面

- [[推理时扩展]]：Reflexion 属于反思与自适应方向的推理时扩展方法。
- [[Self-Refine]]：与 Reflexion 并列的反思方法，区别在于反思存储机制。
- [[过思考]]：反思迭代过多可能导致过思考，需要给思考长度设上限。

## 参考来源

[[raw/papers/推理时扩展.md]]
