---
type: concept
source: "[[raw/papers/投机解码.md]]"
description: "MTP（Multi-Token Prediction，多Token预测）是部分架构训练时内置的预测头：目标模型带一个 MTP 头、推理时直接用作草稿，官方即插即用、零额外部署；代表为 DeepSeek V3、腾讯混元，是 MoE 模型的首选投机解码方案。"
created_at: 2026-10-19 23:00:22
updated_at: 2026-10-19 23:00:22
tags: [mtp, multi_token_prediction, speculative_decoding, deepseek, moe]
---

# MTP多Token预测

## 核心结论

**MTP**（Multi-Token Prediction，多 Token 预测）指部分架构在训练时就内置的预测头。目标模型自带一个 MTP 头、推理时直接用作草稿，**官方即插即用、零额外部署**，是 **MoE 模型的首选**投机解码方案 [[4]](#ref-4)。

## 机制

```mermaid
flowchart LR
    A[目标模型<br/>训练时内置 MTP 头] --> B[推理时 MTP 头<br/>直接作草稿]
    B --> C[目标模型主干<br/>并行验证]
```

- 与 [[Medusa]]/[[EAGLE]]（推理期加头）不同，MTP 在**训练阶段**就内置多头下一个 token 预测，目标模型天然携带草稿能力。
- 代表：**DeepSeek V3**、腾讯混元。
- 官方即插即用、零额外部署，不需要额外训练或部署小模型。

## 与自投机方案对比

| 维度 | MTP | Medusa/EAGLE |
|------|-----|--------------|
| 预测头来源 | 训练时内置 | 推理期加装 |
| 额外部署 | 零 | 需训练草稿头 |
| 适用 | MoE 模型首选 | 稠密模型 |

## 相关概念

- [[草稿模型分类]]：模型内置 MTP 类别
- [[投机解码]]：所属机制
- [[EAGLE]]：推理期加装的特征级方案

## 参考来源

- [[raw/papers/投机解码.md]]

<a id="ref-4"></a>[4] nebius. "MTP-DeepSeek-V3-0324 (Model Card)." *Hugging Face*, 2025.