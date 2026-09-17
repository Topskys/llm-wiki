---
type: comparison
source: [[raw/articles/Transformer原理.md]]
description: "Transformer 与 RNN/LSTM 横向对比：并行 vs 串行计算、O(N²) vs O(N) 时间、长距离依赖能力、位置信息处理与归纳偏置的差异；RNN/LSTM 经证明无统计长记忆、Mamba/SSM 长距离依赖随长度指数衰减，Transformer 注意力不受此限。"
created_at: 2026-09-17 10:00:00
updated_at: 2026-09-17 10:00:00
tags: [transformer, rnn, lstm, comparison, architecture]
---

# Transformer与RNN对比

## 核心结论
- Transformer 以"完全并行 + 自注意力直连任意两 token"取代 RNN 的"逐 token 串行 + 隐状态传递"，成为大模型时代的主流架构 [[raw/articles/Transformer原理.md]]。
- 实证层面，RNN/LSTM **不具有统计长记忆**（权重衰减指数级），Mamba/SSM 的长距离依赖同样随序列长度指数衰减；Transformer 注意力机制不受此约束。

## 对比表

| 维度 | RNN/LSTM | Transformer |
|------|----------|-------------|
| 计算方式 | 串行，逐 token 处理 | 并行，序列全部送入 |
| 时间复杂度 | $O(N)$ | $O(N^2)$ |
| 空间复杂度 | $O(N)$ | $O(N)$ |
| 长距离依赖 | 理论可行、实践梯度消失严重 | 自注意力直接建立任意两 token 关联 |
| 位置信息 | 时序天然有序 | 需[[位置编码]]显式注入 |
| 归纳偏置 | 强（固有时间结构） | 弱（需从数据中学习） |
| 并行能力 | 无法并行 | 完全并行 |

## 实证依据
- **RNN/LSTM 无长记忆**：Zhao et al. 从统计角度证明 RNN 与 LSTM 的权重衰减是指数级而非多项式级，不具长记忆 [[raw/articles/Transformer原理.md]]。
- **SSM 同样受限**：Ma et al. 证明 SSM/Mamba 长距离依赖随序列长度指数衰减（与 RNN 相同），Transformer 注意力更灵活、不受指数衰减约束。

## 相关页面
- [[Transformer总览]]：Transformer 架构全景
- [[自注意力机制]]：替代循环的关键机制
- [[位置编码]]：Transformer 显式注入的顺序信息

## 参考来源
- [[raw/articles/Transformer原理.md]]