---
type: concept
source: [[raw/papers/推理时扩展.md]]
description: Tree of Thoughts 是树搜索方法的代表，把每个中间想法当作节点，由模型自评为候选打分并决定探索或剪枝，在 Game of 24 上把 GPT-4 的成功率从 4% 提到 74%。
created_at: 2026-10-29 10:00:00
updated_at: 2026-10-29 10:00:00
tags: [tree_of_thoughts, tot, tree_search]
---

# Tree of Thoughts

## 核心结论

Tree of Thoughts（ToT）是树搜索方法的代表，把每个中间想法当作节点，由模型自评为候选打分并决定探索或剪枝。在 Game of 24 上把 GPT-4 的成功率从 4% 提到 74%，表达能力最强。

## 要点拆解

### 核心机制

树搜索把推理看成状态与动作构成的分支结构，在中间节点剪枝与回溯，表达能力最强。Tree of Thoughts 把每个中间想法当作节点，由模型自评为候选打分并决定探索或剪枝。

与 MCTS 加过程奖励模型的区别在于：ToT 由模型自评打分，而 MCTS 加 PRM 使用外部过程奖励模型对每一步打分。

### 实证表现

在 Game of 24 任务上，Tree of Thoughts 把 GPT-4 的成功率从 4% 提到 74%，显示出树搜索在复杂推理任务上的强大表达能力。

## 相关页面

- [[推理时扩展]]：Tree of Thoughts 属于树搜索方向的推理时扩展方法。
- [[过程奖励模型]]：ToT 使用模型自评打分，而 MCTS 加 PRM 使用外部过程奖励模型，两者是不同的打分机制。
- [[MCTS 加过程奖励模型]]：与 ToT 并列的树搜索方法，使用 PRM 而非模型自评。

## 参考来源

[[raw/papers/推理时扩展.md]]
