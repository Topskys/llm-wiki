---
type: entity
source: [[raw/papers/大模型推理全链路.md]]
description: "BPE（Byte Pair Encoding）是现代大模型最主流的分词算法，从字符级开始反复合并最高频相邻对，直到达到目标词表大小。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-10-08 22:28:16
tags: [bpe, tokenizer, subword, llm]
---

# BPE 分词算法

## 核心结论

BPE（Byte Pair Encoding）从字符级开始，反复合并最高频相邻对，直到达到目标词表大小。GPT 系列、LLaMA 等主流模型均采用 BPE 或其变体。

## 要点拆解

### 训练过程

1. 初始化：将语料拆为字符级序列
2. 统计：计算所有相邻对的出现频率
3. 合并：将最高频相邻对合并为新符号
4. 重复：直到词表达到目标大小

### 推理过程

1. 将文本拆为字符级序列
2. 按训练得到的合并规则顺序执行合并
3. 输出 token ID 序列

### 变体

| 变体 | 特点 |
|---|---|
| **BPE** | 最高频合并，GPT-2/LLaMA |
| **Byte-level BPE** | 以字节为最小单元，支持全字符集 |
| **BPE-Dropout** | 训练时随机跳过合并，增强鲁棒性 |

## 相关页面

- [[Tokenizer分词编码]]：Tokenizer 的整体机制
- [[Embedding与位置编码]]：token ID 到向量的映射
- [[大模型推理全链路]]：Tokenizer 在推理流水线中的位置

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
