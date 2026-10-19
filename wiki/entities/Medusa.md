---
type: entity
source: "[[raw/papers/投机解码.md]]"
description: "Medusa 是投机解码的附加预测头方案：在目标模型头部加多个并行 decoding head、一次预测多个未来 token 作草稿，省去独立小模型部署。曾在 vLLM 主导，现相对被 EAGLE 等替代。"
created_at: 2026-10-19 23:00:22
updated_at: 2026-10-19 23:00:22
tags: [medusa, speculative_decoding, draft_model, decoding_head]
---

# Medusa

## 核心结论

**Medusa** 是投机解码的**附加预测头**方案：不引入独立小模型，从目标模型自身加推断头作草稿。具体做法是在模型头部加**多个并行 decoding head**、一次预测多个未来 token [[3]](#ref-3)。

## 机制与定位

```mermaid
flowchart LR
    A[目标模型主干] --> B[Medusa 多头<br/>并行解码头]
    B --> C["一次前向预测多个未来 token"]
    C --> D{"目标模型验证"}
```

- **省去独立小模型部署**：草稿来自目标模型自身，属于**自投机**（self-speculative）。
- **机制**：多个并行 decoding head 一次预测多个未来 token，作为草稿候选。

## 现状

Medusa 在推理引擎中的地位**相对衰退**：当前 vLLM 的投机解码核心支持已转向 **EAGLE** 等方案，Medusa 主导地位式微 [[3]](#ref-3)。它属于识别草稿技术谱系中的早期代表。

## 相关概念

- [[草稿模型分类]]：附加预测头类别
- [[EAGLE]]：当前更优的特征级自回归方案
- [[投机解码]]：所属的推理优化机制

## 参考来源

- [[raw/papers/投机解码.md]]

<a id="ref-3"></a>[3] vLLM Project. "Speculative Decoding (vLLM Docs)." *vLLM Documentation*, 2025.