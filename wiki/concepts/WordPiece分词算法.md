---
type: concept
source: [[raw/papers/Token分词.md]]
description: WordPiece 是 BERT 采用的子词分词算法，与 BPE 的差别在合并准则——每次选择合并后能使语言模型似然增益最大的符号对（近似互信息打分，频率与捆绑度一起看），词内续片用 ## 前缀标记。
created_at: 2026-11-07 14:10:00
updated_at: 2026-11-07 14:10:00
tags: [tokenization, wordpiece, subword, bert]
---

# WordPiece 分词算法

## 核心结论

WordPiece 是 BERT 的方案 [[2]](#ref-2)，与 BPE 同属子词路线，差别只在合并准则：它不选最高频相邻对，而是每次选择合并后能使语言模型似然增益最大的符号对，具体判据近似互信息打分，即最大化 freq(xy) 除以 freq(x) 与 freq(y) 的乘积，频率与捆绑度一起看。

## 要点拆解

### 合并准则

- **BPE**：选最高频相邻对；
- **WordPiece**：选似然增益最大的对，score ≈ freq(xy) / (freq(x) × freq(y))；
- 直觉差异：BPE 看频次，WordPiece 额外要求两个符号「喜欢一起出现」，避免高频但互不相干的碎片被合并。

### 词内标记

词内续片用 ## 前缀标记，例如 playing 会切成 play 与 ##ing，便于还原词边界。

### 代表用户

BERT、DistilBERT 等以 BERT 体系为骨架的模型。

## 相关页面

- [[BPE分词算法]]：同为子词路线，对照「最高频合并」与「似然增益合并」两种准则。
- [[Unigram分词算法]]：反向删减路线。
- [[主流分词方案对比]]：三算法与 SentencePiece 的横向对照。
- [[Tokenizer分词编码]]：分词在推理流水线中的整体位置。
- [[Token分词·素材摘要]]：本页所在素材全篇索引。

## 参考来源

[[raw/papers/Token分词.md]]
