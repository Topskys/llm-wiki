---
type: entity
source: [[raw/papers/Token分词.md]]
description: SentencePiece 是 Google 出品的语言无关分词工程框架，把空格当普通字符处理（记作 ▁），封装 BPE 与 Unigram 两种实现供选择；T5 与 Llama 系列均基于它训练词表。
created_at: 2026-11-07 14:10:00
updated_at: 2026-11-07 14:10:00
tags: [sentencepiece, tokenizer, tool]
---

# SentencePiece

## 核心结论

SentencePiece 不是分词算法而是工程框架 [[4]](#ref-4)：它把空格当成普通字符处理（记作 ▁），实现语言无关的「无预切分」训练，同时封装 BPE 与 Unigram 两种算法实现供选择，T5 与 Llama 系列都基于它。

## 要点拆解

### 框架定位

- **算法无关**：内嵌 BPE 与 Unigram 两套实现，选定一种即可产出词表与切分器；
- **语言无关**：以 ▁ 显式表示空格，训练语料不需要「先按空格切词」的预处理，对中文、日文等无空格语言天然友好；
- **可逆性**：切分与还原（detoeknize）配套提供，保证 encode/decode 闭环。

### 代表用户

T5、Llama 系列、大量多语言模型；与之并行的工程工具是 HuggingFace Tokenizers（Rust 实现）与 OpenAI 的 tiktoken [[6]](#ref-6)，三者分工见 [[主流分词方案对比]]。

## 相关页面

- [[Unigram分词算法]]：框架内嵌的两种算法之一。
- [[BPE分词算法]]：框架内嵌的另一种算法。
- [[中文分词特例]]：语言无关设计对无空格语言的意义。
- [[主流分词方案对比]]：与 HF Tokenizers、tiktoken 的工具层对比。
- [[Token分词·素材摘要]]：本页所在素材全篇索引。

## 参考来源

[[raw/papers/Token分词.md]]
