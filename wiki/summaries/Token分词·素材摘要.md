---
type: source_summary
source: [[raw/papers/Token分词.md]]
description: 《Token分词》素材摘要：基础概念（Token 与词表）、四路线演进（词/字符/子词/字节）、BPE/WordPiece/Unigram/SentencePiece 四方案、中文特例（歧义与传统方法栈、cl100k 到 o200k 效率）、评估指标与成本、词表权衡与能力影响、BLT 无分词器前沿，含 6 条参考文献与封面。
created_at: 2026-11-07 14:10:00
updated_at: 2026-11-07 14:10:00
tags: [source_summary, tokenization, subword]
---

# Token分词·素材摘要

## 核心结论

《Token分词》梳理大模型第一道工序的完整知识面：分词把文本切成词表中最小单元 Token 并映射为 ID，是离散符号进入神经网络的桥梁；算法从词到字符再到子词演进，BPE 用高频合并、WordPiece 用似然增益、Unigram 用反向删减，SentencePiece 把工程封装做齐；中文的老问题是歧义与效率，前沿的动态 patch 架构（BLT）正在尝试取消这道工序本身。

## 要点拆解

### 基础概念

Token 是文本进入模型前的最小处理单元，词、子词、字符、字节构成从粗到细的层次，Token 不等于词；词表从 BERT 3 万一路涨到 GPT-4o 级 20 万至 25 万，趋势是大词表换短序列；词表里驻着 BOS/EOS/PAD/UNK 与对话角色标记等特殊 Token；分词的根本原因是神经网络只能做数值计算，同时要在词表大小与序列长度之间找平衡 [[1]](#ref-1)。

### 四路线演进

基于词输给词表爆炸、基于字符输给序列长度、基于子词双赢成主流、基于字节消灭 UNK 但把组合学习负担转给模型。

### 核心算法

- **BPE**：从字符词表反复合并最高频相邻对，GPT 系、Llama、RoBERTa 用其字节级变体，GPT-2 起成默认 [[1]](#ref-1)；迷你语料手算：low 5、lower 2、newest 6、widest 3，依次合并 es、est、lo、low，lowest → low + est；
- **WordPiece**：选似然增益最大的对（近似互信息打分），## 前缀标记词内续片，BERT/DistilBERT [[2]](#ref-2)；
- **Unigram**：先建大候选词表再用 EM 式迭代与剪枝删除似然损失最小项，概率化切分天然支持采样与子词正则化，T5/ALBERT [[3]](#ref-3)；
- **SentencePiece**：工程框架，空格记 ▁ 语言无关，封装 BPE 与 Unigram，T5/Llama [[4]](#ref-4)。

### 中文特例

「南京市长江大桥」是老谜题；传统栈是最大匹配、HMM/CRF、词典有向图加动态规划；预训练时代字级切分内化；效率上 cl100k 一汉字 1 到 2 个 token，o200k 降到约 0.5 至 0.75，选型要用真实语料实测碎片化率。

### 工程评估与前沿

三指标——碎片化率、压缩比、fertility，越低越好再以下游任务验证；三笔成本——上下文窗口、API 计费、推理延迟；工具三件套 HF Tokenizers（Rust）、SentencePiece、tiktoken [[6]](#ref-6)；词表 25.6 万 × 4096 维嵌入约 10.5 亿参数的膨胀账；数字逐位拆分利于算术、数 r 是字母不可见的锅；BLT 按下一字节熵动态切 patch，8B/4T 追平词表模型且推理 FLOPs 最多省 50% [[5]](#ref-5)，Token 正从文本单元泛化为万物单元。

## 相关页面

- [[分词路线演进]]、[[BPE分词算法]]、[[WordPiece分词算法]]、[[Unigram分词算法]]、[[SentencePiece]]：演进链与四方案专页。
- [[主流分词方案对比]]：算法与工具双层横向对照。
- [[中文分词特例]]、[[分词质量评估]]、[[词表大小权衡]]、[[分词与模型能力]]、[[无分词器架构]]：中文、评估、权衡、能力与前沿五专页。
- [[Tokenizer分词编码]]：分词在推理流水线中的整体位置。

## 参考来源

[[raw/papers/Token分词.md]]
