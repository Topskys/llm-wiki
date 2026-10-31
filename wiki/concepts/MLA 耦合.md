---
type: concept
source: [[raw/papers/DSA稀疏注意力.md]]
description: MLA 耦合是 DSA 的架构特征，DSA 长在 MLA（Multi-head Latent Attention）之上，实现在 MLA 的 MQA 模式下，KV 条目跨头共享，主 KV 格式不变，只决定哪些低秩隐向量被读取。
created_at: 2026-11-01 10:00:00
updated_at: 2026-11-01 10:00:00
tags: [mla_coupling, dsa_architecture, multi_head_latent_attention]
---

# MLA 耦合

## 核心结论

MLA 耦合是 DSA 的架构特征，DSA 长在 MLA（Multi-head Latent Attention）之上，而非替换它。DSA 实现在 MLA 的 MQA 模式下，原因是内核层面每个 KV 条目必须能被同一 query 的所有注意力头共享，否则重复访存会把稀疏省下来的收益吃掉 [[2]](#ref-2)。

## 要点拆解

### 架构关系

MLA 把每 token 的 KV 压成低秩隐向量 $\mathbf{c}_s$（配置中 `kv_lora_rank` 为 512，另有 64 维解耦 RoPE 分量）[[5]](#ref-5) [[12]](#ref-12)，DSA 只决定哪些 $\mathbf{c}_s$ 被读取，不改变 $\mathbf{c}_s$ 本身的格式。

由此得到两条推论：主 KV Cache 的格式与容量不变，所谓"省显存"指的是不再把全部历史搬进计算，而不是压缩率又提高了一档；但索引器需要自己维护一份很小的 key 缓存（单头、128 维），显存并非零增量【推导】。

### 与 V3.1-Terminus 的关系

与 V3.1-Terminus 相比，V3.2-Exp 唯一的架构改动就是引入 DSA，MoE 主干、MLA 注意力与 MTP 预测头都原样保留 [[1]](#ref-1) [[12]](#ref-12)。

## 相关页面

- [[DSA 稀疏注意力]]：MLA 耦合所属的上位概念，查询感知稀疏注意力的架构基础。
- [[DeepSeek-V3.2-Exp]]：使用 MLA 耦合 DSA 的 DeepSeek 实验版模型。
- [[DeepSeek-V3.2]]：沿用 MLA 耦合 DSA 架构的 DeepSeek 正式版模型。

## 参考来源

[[raw/papers/DSA稀疏注意力.md]]
