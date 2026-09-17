---
type: source_summary
source: [[raw/articles/Transformer原理.md]]
description: "对 raw 素材《Transformer 原理》（豆包会话 + 公开学术资料综合，2026-09-17 落盘）的要点摘录：核心思想、整体结构、词嵌入+位置编码、多头自注意力、Encoder/Decoder 层结构、残差+归一化、输出层、Transformer vs RNN 实证对比与架构演进路线。"
created_at: 2026-09-17 10:00:00
updated_at: 2026-09-17 10:00:00
tags: [transformer, source_summary, attention, llm]
---

# Transformer原理·素材摘要

## 原始素材信息
- 素材：`raw/articles/Transformer原理.md`
- 来源：豆包 AI 会话《Transformer 原理》（[会话链接](https://www.doubao.com/chat/38442003078933762)）+ 公开学术资料（Vaswani 2017 原论文、CS231N/Princeton/CMU 课程、位置编码研究、RNN 长记忆证明等）
- 性质：综合整理的长文，含 12 篇参考文献

## 要点摘录

### 核心思想
- 用自注意力建模序列 token 全依赖，一次性读入、完全并行、捕捉长距离依赖；RNN $O(N)$ 串行、Transformer $O(N^2)$ 但并行。

### 结构分层
- **输入端**：词嵌入（$d_{model}=512$）+ 正弦/余弦[[位置编码]]（只加到 Q/K 效果更好；RoPE/ALiBi 为后续演进）。
- **Encoder 层**：双向自注意力 + FFN（$d_{ff}=2048$），残差 + LayerNorm。
- **Decoder 层**：掩码自注意力 + 交叉注意力（Q=解码器、K/V=编码器）+ FFN，残差 + LayerNorm。
- **输出**：Linear → Softmax → 采样下一个 token 循环生成。
- **架构变体**：Decoder-only（GPT/PaLM）、Encoder-only（BERT/RoBERTa）、Encoder-Decoder（T5/BART）。

### 实证对比
- Transformer 在 WMT 2014 英德翻译达 28.4 BLEU，超此前最优 2 BLEU 以上，训练成本更低。
- RNN/LSTM 无统计长记忆（Zhao, ICML 2020）；SSM/Mamba 长距离依赖随序列指数衰减（Ma, 2025）。

## 关联的 Wiki 页面（本素材 Ingest 编译）
- [[Transformer总览]]（overview）
- [[自注意力机制]] / [[多头注意力]] / [[位置编码]] / [[Transformer编码器结构]] / [[Transformer解码器结构]] / [[残差连接与层归一化]]（concept）
- [[Transformer与RNN对比]]（comparison）

## 参考来源
- [[raw/articles/Transformer原理.md]]