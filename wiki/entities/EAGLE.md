---
type: entity
source: "[[raw/papers/投机解码.md]]"
description: "EAGLE 是投机解码的特征级自回归草稿方案：复用目标模型特征做草稿，EAGLE-2 引入动态树形草稿、EAGLE-3 改为直接 token 预测并融合多层特征，五项任务最高 6.5× 加速、较 EAGLE-2 提升约 1.4×，是当前 vLLM 投机解码的核心支持方向。"
created_at: 2026-10-19 23:00:22
updated_at: 2026-10-19 23:00:22
tags: [eagle, speculative_decoding, draft_model, self_speculative]
---

# EAGLE

## 核心结论

**EAGLE** 是投机解码的**特征级自回归**草稿方案：不引入独立小模型，复**用目标模型特征**做草稿。它是当前推理引擎投机解码的核心支持方向 [[3]](#ref-3) [[5]](#ref-5)。

## 演进脉络

- **EAGLE-1**：复用目标特征做特征级自回归草稿。
- **EAGLE-2**：引入**动态树形草稿**，提高单轮验证的接受率。
- **EAGLE-3**：改为**直接 token 预测**并**融合多层特征**，进一步规模化推理加速 [[5]](#ref-5)。

## 实证性能

- 五项任务上最高 **6.5×** Decode 加速。
- 较 EAGLE-2 提升约 **1.4×**。
- SGLang 框架 batch size 64 下取得 **1.38×** 吞吐提升 [[5]](#ref-5)。

## 工程支持

- vLLM 的投机解码核心支持已转向 EAGLE 等。
- SGLang 通过 `--speculative-algorithm EAGLE3` 启用 EAGLE-3 草稿 [[5]](#ref-5)。
- 自定义草稿头的训练可由 LMSYS 开源框架 [[SpecForge]] 完成，支持 EAGLE3 等算法 [[6]](#ref-6)。

## 相关概念

- [[草稿模型分类]]：附加预测头/自投机类别
- [[Medusa]]：同属附加预测头的早期方案
- [[投机解码]]：所属机制
- [[投机解码工程落地]]：引擎支持与调优

## 参考来源

- [[raw/papers/投机解码.md]]

<a id="ref-3"></a>[3] vLLM Project. "Speculative Decoding (vLLM Docs)." *vLLM Documentation*, 2025.
<a id="ref-5"></a>[5] Y. Li, F. Wei, C. Zhang, H. Zhang. "EAGLE-3: Scaling up Inference Acceleration of Large Language Models via Training-Time Test." *NeurIPS*, 2025.
<a id="ref-6"></a>[6] The SpecForge Team. "SpecForge v0.3.0: a Unified Disaggregated and Colocated Speculative Decoding Stack." *LMSYS Blog*, 2026.