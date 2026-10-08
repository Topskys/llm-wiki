---
type: entity
source: [[raw/papers/大模型推理全链路.md]]
description: "RoPE（旋转位置编码）通过对 Q、K 做角度正比于位置的旋转变换，使注意力得分仅依赖 token 间的相对位置差，是现代主流大模型的位置编码方案。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-10-08 22:28:16
tags: [rope, position_encoding, llm, transformer]
---

# RoPE 旋转位置编码

## 核心结论

RoPE（Rotary Position Embedding）不额外加向量，而是对每层的 Q、K 做角度正比于位置的旋转变换，使注意力得分仅依赖 token 间的**相对位置差**。LLaMA、Qwen、DeepSeek 等主流开源模型均采用 RoPE。

## 要点拆解

### 数学原理

对位置 $m$ 的 query/key 向量，按维度对施加旋转：

$$q'_m = R_m \cdot q_m, \quad k'_n = R_n \cdot k_n$$

其中 $R_m$ 为旋转矩阵，角度 $\theta = m \cdot \omega$。注意力得分：

$$q'_m \cdot k'_n = q_m^T R_{n-m} \cdot k_n$$

仅依赖相对位置 $n - m$。

### 外推方案

| 方案 | 机制 | 效果 |
|---|---|---|
| **线性插值** | 位置索引线性压缩到训练范围 | 简单但损失分辨率 |
| **NTK-aware scaling** | 按频率缩放旋转角度 | 保留高频分辨率 |
| **YaRN** | 结合 NTK 与注意力温度缩放 | 4K → 128K+ |

### 与绝对位置编码对比

| 维度 | 绝对位置编码 | RoPE |
|---|---|---|
| 方式 | 学习可训练向量叠加 | 旋转变换 Q/K |
| 外推 | 超出训练长度无法外推 | 配合插值可外推 |
| 相对位置 | 不直接编码 | 天然编码相对位置 |
| 代表模型 | 原始 Transformer | LLaMA、Qwen、DeepSeek |

## 相关页面

- [[Embedding与位置编码]]：位置编码在推理流水线中的位置
- [[位置编码]]：位置编码的演进全景
- [[自注意力机制]]：RoPE 如何影响注意力得分
- [[大模型推理全链路]]：RoPE 在推理流水线中的位置

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
