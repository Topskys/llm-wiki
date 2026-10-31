---
type: concept
source: [[raw/papers/DSA稀疏注意力.md]]
description: DSA（DeepSeek Sparse Attention，深度求索稀疏注意力）是 DeepSeek 在 V3.2-Exp 中引入的查询感知稀疏注意力，用轻量索引器为每个 query 的历史 token 打分，只把 Top-k 个 KV 条目送进精确注意力，把主注意力复杂度从 O(L²) 降到与 k 成正比，并用两阶段继续训练把稀疏模式练进模型。
created_at: 2026-11-01 10:00:00
updated_at: 2026-11-01 10:00:00
tags: [dsa, sparse_attention, deepseek, long_context]
---

# DSA 稀疏注意力

## 核心结论

DSA 是 DeepSeek 在 V3.2-Exp 中引入的查询感知稀疏注意力，用一个轻量索引器给每个 query 的历史 token 打分，只把分数最高的 Top-k 个 KV 条目送进精确注意力。它保留 MLA 的压缩 KV 格式，把主注意力复杂度从二次降到与 k 成正比，并用两阶段继续训练把稀疏模式练进模型。与 NSA、MoBA、Quest、MInference 等方案相比，DSA 的差异化在于 token 级选择粒度、独立可训练索引器、以及把稀疏写进继续训练流程。

## 要点拆解

### 定义与定位

DSA（DeepSeek Sparse Attention）是 DeepSeek 在 DeepSeek-V3.2-Exp 中引入的查询感知稀疏注意力机制，由**闪电索引器**（lightning indexer）与**细粒度 token 选择**（fine-grained token selection）两个部件组成：索引器先给当前 query 与每一个历史 token 打一个相关性分数，只把分数最高的 $k$ 个 token 的 KV 条目送进精确注意力计算 [[1]](#ref-1)。与 V3.1-Terminus 相比，V3.2-Exp 唯一的架构改动就是引入 DSA，MoE 主干、MLA 注意力与 MTP 预测头都原样保留 [[1]](#ref-1) [[12]](#ref-12)。

理解这一定位很关键：DSA 不是把注意力换成另一种结构，而是在原注意力外面加了一层"廉价的相关性预筛"。被筛中的 token 仍走标准注意力、仍做 softmax 归一化，因此它是精确计算而非近似打分，差别只在于参与计算的 token 少了一个数量级。

### MLA 耦合

DSA 长在 MLA（Multi-head Latent Attention）之上，而非替换它。技术报告明确说明，为了从 V3.1-Terminus 继续训练，DSA 实现在 MLA 的 MQA 模式下，原因是内核层面每个 KV 条目必须能被同一 query 的所有注意力头共享，否则重复访存会把稀疏省下来的收益吃掉 [[2]](#ref-2)。

MLA 把每 token 的 KV 压成低秩隐向量 $\mathbf{c}_s$（配置中 `kv_lora_rank` 为 512，另有 64 维解耦 RoPE 分量）[[5]](#ref-5) [[12]](#ref-12)，DSA 只决定哪些 $\mathbf{c}_s$ 被读取，不改变 $\mathbf{c}_s$ 本身的格式。由此得到两条推论：主 KV Cache 的格式与容量不变，所谓"省显存"指的是不再把全部历史搬进计算，而不是压缩率又提高了一档；但索引器需要自己维护一份很小的 key 缓存（单头、128 维），显存并非零增量【推导】。

### 稠密切换

DSA 保留了回到稠密的通路。参考实现里 Top-k 取值为 `min(index_topk, L)`，序列短于 2048 时等价于稠密注意力 [[13]](#ref-13)；服务端在短序列预填充时还专门实现了 masked MHA 模式来模拟 DSA，因为短上下文跑真正的稀疏路径反而不划算 [[1]](#ref-1)。参考实现同时用 `layer_types` 区分稠密层与稀疏层 [[13]](#ref-13)，说明"全层一律稀疏"并非硬约束。

## 相关页面

- [[闪电索引器]]：DSA 的索引打分部件，64 头 × 128 维 FP8，负责为每个 query 给历史 token 打相关性分数。
- [[Top-k 选择]]：DSA 的 token 级选择部件，每个 query 保留分数最高的 2048 个历史 token 的 KV 条目。
- [[索引热身]]：DSA 两阶段训练的第一阶段，冻结主模型只训练索引器，用 KL 散度让索引器逼近主注意力分布。
- [[无分支设计]]：DSA 只有一条主路径，没有压缩分支和独立滑窗分支，区别于 NSA 三分支结构。
- [[动态 Top-k 内核]]：DSA 的系统内核，DeepGEMM 索引 logit 内核与 FlashMLA 稀疏注意力内核。
- [[MLA 耦合]]：DSA 长在 MLA MQA 模式之上，KV 条目跨头共享，主 KV 格式不变。
- [[稀疏注意力适用边界]]：DSA 在短上下文、超长上下文、部署门槛、显存、能力波动五个维度的边界与应对。
- [[DeepSeek-V3.2-Exp]]：引入 DSA 的 DeepSeek 实验版模型，2025 年 9 月 29 日发布。
- [[DeepSeek-V3.2]]：沿用 DSA 架构的 DeepSeek 正式版模型，2025 年 12 月 1 日发布。
- [[DSA 稀疏注意力方案对比]]：DSA 与 NSA、MoBA、Quest、MInference 的横向对比。

## 参考来源

[[raw/papers/DSA稀疏注意力.md]]
