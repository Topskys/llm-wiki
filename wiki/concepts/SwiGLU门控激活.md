---
type: concept
source: [[raw/papers/大模型推理全链路.md]]
description: "SwiGLU 是现代大模型 FFN 的主流门控激活函数，以 Swish 门控替代传统 ReLU，中间维度约为隐层的 2.7 倍，FFN 参数量约占全模型的 2/3。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-10-08 22:28:16
tags: [swiglu, ffn, activation, llm]
---

# SwiGLU 门控激活

## 核心结论

现代大模型的前馈网络（FFN）以 **SwiGLU** 门控激活取代传统 ReLU，中间维度约为隐层的 2.7 倍。FFN 参数量约占全模型的 **2/3**，普遍被认为承担"知识存储"角色。

## 要点拆解

### 机制

SwiGLU 在标准 FFN 基础上引入门控分支：

$$\text{FFN}_{\text{SwiGLU}}(x) = (\text{Swish}(xW_1)) \odot (xW_2)$$

其中 Swish(x) = x · sigmoid(x)，$\odot$ 为逐元素乘法。门控分支让网络学习"哪些信息通过、哪些抑制"。

### 与 ReLU FFN 对比

| 维度 | ReLU FFN | SwiGLU FFN |
|---|---|---|
| 激活函数 | ReLU | Swish 门控 |
| 参数量 | $2 \times d \times d_{\text{ff}}$ | $3 \times d \times d_{\text{ff}}$（含门控投影） |
| 中间维度 | $d_{\text{ff}} \approx 4d$ | $d_{\text{ff}} \approx 2.7d$（总参数量与 ReLU FFN 相当） |
| 效果 | 基线 | 同等参数量下更优 |

### 层间分工

- 底层偏词法（拼写、形态）
- 高层偏抽象语义（概念、推理）

## 相关页面

- [[Transformer编码器结构]]：FFN 在 Transformer 中的位置
- [[Transformer解码器结构]]：Decoder-only 架构中的 FFN
- [[大模型推理全链路]]：FFN 在推理流水线中的位置

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
