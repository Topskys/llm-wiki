---
type: entity
source: [[raw/papers/大模型推理全链路.md]]
description: "BPE（Byte Pair Encoding）是现代大模型最主流的分词算法，从字符级开始反复合并最高频相邻对；字节级变体自 GPT-2 起成为默认形态，GPT 系列、Llama 等主流模型均采用。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-11-07 14:10:00
tags: [bpe, tokenizer, subword, llm]
---

# BPE 分词算法

## 核心结论

BPE（Byte Pair Encoding）从字符级开始，反复合并最高频相邻对，直到达到目标词表大小。GPT 系列、LLaMA 等主流模型均采用 BPE 或其变体，GPT-2 起字节级 BPE 成为默认形态 [[1]](#ref-1)。

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

### 迷你语料手算示例

词频为 low 5 次、lower 2 次、newest 6 次、widest 3 次：

```text
初始     l o w   l o w e r   n e w e s t   w i d e s t
第 1 轮  合并 (e, s)→es        频次 9，new es t 与 wid es t
第 2 轮  合并 (es, t)→est      得到 n e w est 与 w i d est
第 3 轮  合并 (l, o)→lo        频次 7
第 4 轮  合并 (lo, w)→low      低频前缀整体成词
编码示例 lowest → low + est（词表有 low 有 est，无 lowest）
```

哲学：高频搭配自动凝固成词表项，低频词被拆成高频碎片重组，即子词方案「高频保留、低频拆分」的具体实现。

## 相关页面

- [[Tokenizer分词编码]]：Tokenizer 的整体机制
- [[Embedding与位置编码]]：token ID 到向量的映射
- [[大模型推理全链路]]：Tokenizer 在推理流水线中的位置
- [[WordPiece分词算法]]、[[Unigram分词算法]]：不同合并准则的对照路线
- [[SentencePiece]]：封装 BPE 的工程框架
- [[主流分词方案对比]]：算法与工具的横向对照
- [[分词路线演进]]：BPE 所在的子词路线与四路线权衡
- [[Token分词·素材摘要]]：本页补充内容的素材来源

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
- [[raw/papers/Token分词.md]]
