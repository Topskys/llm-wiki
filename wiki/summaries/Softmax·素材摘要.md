---
type: source_summary
source: "[[raw/papers/Softmax.md]]"
description: "对 raw 论文《大模型原理之 Softmax》的要点摘录：四条硬约束与差分变比值、公式三步算例、输出层与注意力层两个位置、减 max 与 online softmax 数值稳定、交叉熵梯度简化、三族变体索引。"
created_at: 2026-10-08 22:05:26
updated_at: 2026-10-08 22:05:26
tags: [softmax, source_summary, attention, cross_entropy, numerical_stability]
---

# Softmax·素材摘要

## 核心结论

该素材以**「为什么 → 是什么 → 在哪 → 怎么稳 → 怎么训」**为主线梳理 Softmax：它是被概率分布的三项硬约束（各项为正、总和为一、保序）加上光滑可导要求**逼出来的唯一自然解**；在 Transformer 中**一内一外只出现两次**，分别决定「生成什么」与「关注什么」。

## 要点拆解

### 为什么需要

- 四条约束：每项 > 0（$e^z$ 恒正）、总和 = 1、保持相对强弱（指数单调）、处处光滑可导。
- 候选淘汰：线性归一化除完还有负数、argmax 没有梯度、sigmoid 各项独立加总不为 1。
- **差分变比值**：$z_i - z_j$ 直接变成概率比 $e^{z_i}/e^{z_j}$，logit 加法对应概率乘法；由此导出**平移不变性** $\text{softmax}(z+c)=\text{softmax}(z)$。
- 顺带获得指数放大差距的福利，是 argmax 的**可导软化版**。

### 公式与算例

$\text{softmax}(z)_i = e^{z_i} / \sum_j e^{z_j}$；logits `[2.0, 1.0, 0.1, 3.0]` → 指数 `[7.39, 2.72, 1.11, 20.09]` → 求和 `31.31` → 归一化 `[0.236, 0.087, 0.035, 0.642]`。

### 两个位置

- **输出层**：每步对整个词表做一次 softmax 再采样。温度 $\text{softmax}(z/T)$，$T<1$ 尖锐、$T>1$ 平坦，$T\to0$ 退化 argmax、$T\to\infty$ 退化均匀；Top-k / Top-p 截断后重归一化，**温度 + top-p 是生产最常见组合**。
- **注意力层**：$\text{softmax}(QK^\top/\sqrt{d_k})\cdot V$。除 $\sqrt{d_k}$ 是防点积方差过大把 softmax 推进饱和区致梯度消失；causal mask 加 $-\infty$，softmax 后概率严格为 0。

### 数值稳定

float32 上限约 $e^{88}$；靠平移不变性**先减 max**，指数上界压到 $e^0=1$；**online softmax** 分块流式更新运行最大值与分母，是 **FlashAttention 的核心技巧**，显存 $O(n^2) \to O(n)$。

### 训练与变体

- $\mathcal{L} = -\log\,\text{softmax}(z)_{y}$，复合后 $\partial \mathcal{L}/\partial z = p - y$，形式简洁且无饱和；$\text{PPL} = e^{\mathcal{L}}$。
- 三族变体：控尖锐度（温度、知识蒸馏传「暗知识」）、稀疏化（Sparsemax 精确 0、Gumbel-Softmax 可微近似 one-hot）、省算力（层次化 softmax $O(V)\to O(\log V)$、负采样、Flash Attention）。
- 共性：**牺牲标准 softmax 的某条性质换特定收益**。

## 相关页面

- [[Softmax技术全景总览]]：五段主线与两个位置的总入口。
- [[Softmax归一化原理]]：四条约束与差分变比值的完整展开。
- [[注意力缩放与因果掩码]]：$\sqrt{d_k}$ 与 causal mask 的机制页。
- [[Softmax数值稳定性]]：减 max 与 online softmax 的机制页。
- [[交叉熵与梯度简化]]：训练侧 $p-y$ 与困惑度。
- [[Softmax变体族谱]]：三族变体的完整索引。

## 参考来源

- [[raw/papers/Softmax.md]]
