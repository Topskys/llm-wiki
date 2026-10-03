---
type: concept
source: [[raw/articles/Transformer原理.md]]
description: "Transformer 编码器层结构：双向多头自注意力 + 前馈网络 FFN 两个子模块，均为残差连接 + LayerNorm；Pre-LN/Post-LN 两种归一化顺序影响训练稳定性；是 BERT 类编码模型的骨干。"
created_at: 2026-09-17 10:00:00
updated_at: 2026-10-03 21:00:36
tags: [transformer, encoder, ffn, layer_norm, bert]
---

# Transformer编码器结构

## 核心结论
- 编码器每层由**两个子模块**组成：多头自注意力（双向）+ 前馈网络 FFN，都配残差连接 + LayerNorm [[raw/articles/Transformer原理.md]]。
- 双向自注意力：每个位置可看到整句所有 token，适合上下文理解类任务（BERT、RoBERTa 只保留编码器）。
- **FFN 子模块是 [[MoE混合专家模型总览|混合专家模型]] 的替换对象**：把单个 FFN 换成 N 个并行专家 + 可学习门控，每个 token 只激活 Top-K 个，即可在算力近恒定的前提下扩展参数总量（见 [[门控路由与Top-K稀疏激活]]）。

## 编码器层结构

```mermaid
flowchart TD
    X["输入 X"] --> A["多头自注意力(双向)"] --> R1["残差 + LayerNorm"] --> F["前馈网络 FFN"] --> R2["残差 + LayerNorm"] --> O["+ 下一层"]
    X -.-> R1
```

<p align="center"><b>编码器单层：自注意力→残差LN→FFN→残差LN</b></p>

## 公式与要点

### 层结构公式

$$H' = LayerNorm(SelfAttention(X) + X)$$

$$H = LayerNorm(FFN(H') + H')$$

### 前馈网络 FFN
- 逐 token 独立做两层全连接，token 之间互不影响，本质是每个位置独立的非线性 MLP：

$$FFN(x) = max(0, xW_1 + b_1)W_2 + b_2$$

- 内层维度 $d_{ff} = 2048$（$d_{model}=512$ 的 4 倍）

### Pre-LN vs Post-LN
- **Post-LN**（原始 Transformer）：子层计算完再做 LayerNorm
- **Pre-LN**（GPT、LLaMA）：先 Norm 再进子层，训练更稳定 [[raw/articles/Transformer原理.md]]

## 相关页面
- [[自注意力机制]] / [[多头注意力]]：子模块组成
- [[残差连接与层归一化]]：稳定训练的关键
- [[Transformer解码器结构]]：与编码器的结构差异
- [[Transformer总览]]：编码器在整体架构中的位置
- [[门控路由与Top-K稀疏激活]]：FFN 被替换为 MoE 层后的形式化
- [[MoE与稠密模型对比]]：替换 FFN 换来的收益与代价

## 参考来源
- [[raw/articles/Transformer原理.md]]