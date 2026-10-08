---
type: concept
source: [[raw/papers/大模型推理全链路.md]]
description: "Embedding 层将 token ID 映射为高维向量，位置编码从绝对位置演进到 RoPE（旋转位置编码），使注意力得分仅依赖 token 间的相对位置差。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-10-08 22:28:16
tags: [embedding, rope, position_encoding, llm]
---

# Embedding 与位置编码

## 核心结论

Embedding 层是可学习的查找矩阵 `[vocab_size, hidden_dim]`，将 token ID 映射为高维向量。位置编码从绝对位置演进到 **RoPE**，使注意力得分仅依赖 token 间的**相对位置差**。

## 要点拆解

### Embedding 层

- 形状 `[vocab_size, hidden_dim]`，如词表 128K × 隐藏维度 4096
- 语义相近的词在向量空间中距离更近
- 部分模型与 lm_head 共享权重（weight tying）

### 位置编码演进

| 方案 | 机制 | 局限 |
|---|---|---|
| **绝对位置编码** | 每个位置学习一个可训练向量叠加到词嵌入 | 超出训练最大长度即无法外推 |
| **RoPE** | 对 Q、K 做角度正比于位置的旋转变换 | 需配合插值方案外推长序列 |

### RoPE 外推方案

- **线性插值**：将位置索引线性压缩到训练范围内
- **NTK-aware scaling**：按频率缩放旋转角度
- **YaRN**：结合 NTK 与注意力温度缩放，可将 4K 训练长度外推至 128K 以上

LLaMA、Qwen、DeepSeek 等主流开源模型均采用 RoPE。详见 [[RoPE旋转位置编码]]。

## 相关页面

- [[RoPE旋转位置编码]]：RoPE 的详细原理与外推方案
- [[Tokenizer分词编码]]：token ID 的产生
- [[自注意力机制]]：位置编码如何影响注意力得分
- [[大模型推理全链路]]：Embedding 在推理流水线中的位置

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
