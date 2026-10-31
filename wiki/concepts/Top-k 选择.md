---
type: concept
source: [[raw/papers/DSA稀疏注意力.md]]
description: Top-k 选择是 DSA 的细粒度 token 选择部件，每个 query 保留分数最高的 2048 个历史 token 的 KV 条目，注意力只在这一子集上计算，选择粒度为 token 级而非块级。
created_at: 2026-11-01 10:00:00
updated_at: 2026-11-01 10:00:00
tags: [topk_selection, token_selection, dsa_component]
---

# Top-k 选择

## 核心结论

Top-k 选择是 DSA 的细粒度 token 选择部件，每个 query 保留分数最高的 $k$ 个历史 token 的 KV 条目，注意力只在这一子集上计算。选择是 token 级而非块级，粒度细到单个 token，不再受块边界约束。

## 要点拆解

### 选择公式

拿到分数后，每个 query 位置只保留分数最高的 $k$ 个历史 token 的 KV 条目，注意力只在这一子集上计算：

$$\mathbf{u}_{t}=\mathrm{Attn}\left(\mathbf{h}_{t},\left\{\mathbf{c}_{s}\ \middle|\ I_{t,s}\in \mathrm{Top}\text{-}k\left(I_{t,:}\right)\right\}\right)$$

其中 $\mathbf{c}_s$ 是 MLA 压缩后的低秩隐向量。

### 配置参数

$k$ 固定为 2048，与上下文长度无关 [[1]](#ref-1) [[12]](#ref-12)。参考实现里 Top-k 取值为 `min(index_topk, L)`，序列短于 2048 时等价于稠密注意力 [[13]](#ref-13)。

### 头共享

同一 query 位置的所有注意力头共享同一份 top-k 索引集合，这正是 MQA 模式下 KV 条目天然共享带来的红利 [[2]](#ref-2)。

### 与块级选择的区别

选择是 token 级而非块级：粒度细到单个 token，不再受块边界约束。同一块里只有少数 token 真正相关时，块级稀疏仍要整块计算，粒度损失换来了内核友好度；DSA 的 token 级选择避开了块边界带来的粗粒度浪费。

## 相关页面

- [[DSA 稀疏注意力]]：Top-k 选择所属的上位概念，查询感知稀疏注意力的整体架构。
- [[闪电索引器]]：Top-k 选择的前序步骤，负责为每个 query 给历史 token 打相关性分数。
- [[稀疏注意力适用边界]]：Top-k 固定 2048，短序列退化为稠密，稀疏收益趋零。

## 参考来源

[[raw/papers/DSA稀疏注意力.md]]
