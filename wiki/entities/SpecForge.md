---
type: entity
source: "[[raw/papers/投机解码.md]]"
description: "SpecForge 是 LMSYS 开源的投机解码统一栈，把'围绕目标采集特征→训练草稿→导出'变成一条可复用流水线，支持 EAGLE3、DFlash、Domino 等多种算法并开源多款草稿模型，推动草稿训练系统化。"
created_at: 2026-10-19 23:00:22
updated_at: 2026-10-19 23:00:22
tags: [specforge, lmsys, speculative_decoding, draft_model, training_pipeline]
---

# SpecForge

## 核心结论

**SpecForge** 是 LMSYS 开源的投机解码统一栈（a Unified Disaggregated and Colocated Speculative Decoding Stack），把"围绕目标采集特征 → 训练草稿 → 导出"变成一条**可复用的训练流水线**，并开源多款草稿模型 [[6]](#ref-6)。

## 作用

```mermaid
flowchart LR
    A[围绕目标采集特征] --> B[训练草稿]
    B --> C[导出草稿模型]
    C --> D[推理引擎<br/>vLLM / SGLang]
```

- **系统化草稿训练**：解决草稿模型训练碎片化、难复用的问题，提供统一的可复用流水线。
- **多算法支持**：支持 EAGLE3、DFlash、Domino 等多种算法。
- **开源草稿模型**：配套开源多款草稿模型，降低接入成本。

## 趋势意义

SpecForge 代表投机解码草稿训练走向**系统化**的前沿演进——草稿不再各方案各自造轮子，而是走统一、可复用、可互操作的生产化路线 [[6]](#ref-6)。

## 相关概念

- [[投机解码]]：所属机制
- [[草稿模型分类]]：草稿方案谱系
- [[EAGLE]]：SpecForge 支持的算法之一
- [[投机解码工程落地]]：草稿训练的工程化

## 参考来源

- [[raw/papers/投机解码.md]]

<a id="ref-6"></a>[6] The SpecForge Team. "SpecForge v0.3.0: a Unified Disaggregated and Colocated Speculative Decoding Stack." *LMSYS Blog*, 2026.