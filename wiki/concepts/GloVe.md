---
type: concept
source: [[raw/papers/词嵌入.md]]
description: GloVe（Stanford，2014）是统计式静态嵌入：先统计全语料词对共现次数 X_ij，再做加权最小二乘拟合让向量点积逼近 log X_ij；权重函数在 x<x_max 时取 (x/x_max)^0.75 抑制高频词主导，性能与 Word2Vec 相当、实践中互为基线。
created_at: 2026-11-07 16:40:00
updated_at: 2026-11-07 16:40:00
tags: [embedding, glove, word_embedding]
---

# GloVe

## 核心结论

GloVe（Stanford, 2014）认为应该同时利用全局共现统计 [[4]](#ref-4)，与只看局部上下文窗口的 Word2Vec 互补：先统计整个语料中词对共现次数 $X_{ij}$，再做加权最小二乘拟合 $J = \sum_{i,j} f(X_{ij})(w_i^T\tilde{w}_j + b_i + \tilde{b}_j - \log X_{ij})^2$，性能与 Word2Vec 相当，实践中常互为基线 [[4]](#ref-4)。

## 要点拆解

### 目标函数与三个易错细节

- $w_i$ 是中心词向量、$\tilde{w}_j$ 是上下文词向量，**两套独立参数**；
- $b_i$、$\tilde{b}_j$ 是对应偏置项，拟合目标为 $\log X_{ij}$；
- 权重函数 $f(X)$ 在 $x < x_{max}$ 时取 $(x/x_{max})^{\alpha}$（通常 $\alpha = 0.75$），此后恒为 1，作用是抑制高频词（the、of 等）主导损失。

### 与 Word2Vec 的路线对偶

- **Word2Vec**：预测式，逐样本在局部窗口内猜词，隐式累积统计；
- **GloVe**：统计式，先数全局共现的账，再一次性拟合；
- Levy 与 Goldberg 的研究表明 PPMI + SVD 矩阵分解与 Skip-gram 带负采样的隐式目标在理论上等价 [[6]](#ref-6)。

### 取哪套参数

训练完成后通常取 $w_i + \tilde{w}_i$（或二者平均）作为最终词向量，与 Word2Vec 的「取哪套矩阵视实现而定」容易混淆，注意区分。

## 相关页面

- [[Word2Vec]]：预测式路线的机制与负采样。
- [[FastText]]：子词建模路线。
- [[静态嵌入方案对比]]：三方案与传统方法横向对照。
- [[词嵌入]]：分布式假设与度量基础。
- [[词嵌入·素材摘要]]：本页所在素材全篇索引。

## 参考来源

[[raw/papers/词嵌入.md]]
