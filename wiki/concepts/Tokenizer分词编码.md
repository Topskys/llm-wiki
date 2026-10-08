---
type: concept
source: [[raw/papers/大模型推理全链路.md]]
description: "Tokenizer 将连续自然语言切分为模型词表中的最小离散单元 token，现代大模型普遍采用 BPE 或其变体（Unigram、WordPiece），切分粒度介于词与字符之间。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-10-08 22:28:16
tags: [tokenizer, bpe, tokenization, llm]
---

# Tokenizer 分词编码

## 核心结论

Tokenizer 负责将连续自然语言切分为模型词表中的最小离散单元——token。每个 token 在词表中对应唯一整数 ID，模型的输入输出始终是 ID 序列，**模型从未见过"文字"本身**。

## 要点拆解

### 切分粒度

- 高频英文词通常映射为单 token
- 生僻词被拆成子词
- 中文多按字或词组切分

### 主流算法

| 算法 | 特点 | 代表模型 |
|---|---|---|
| **BPE**（Byte Pair Encoding） | 从字符级开始，反复合并最高频相邻对 | GPT 系列、LLaMA |
| **Unigram** | 基于概率的子词切分，可输出多种切分概率 | SentencePiece |
| **WordPiece** | 类似 BPE 但用似然最大化选择合并对 | BERT |

### 关键特性

- **可逆性**：Detokenizer 将 ID 序列还原为可读文本
- **词表大小**：通常 32K~256K，影响 embedding 层参数量与稀有词切分粒度
- **特殊 token**：BOS、EOS、PAD、UNK 等控制 token

## 相关页面

- [[BPE分词算法]]：BPE 算法的详细原理
- [[Embedding与位置编码]]：token ID 到向量的映射
- [[大模型推理全链路]]：Tokenizer 在推理流水线中的位置

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
