---
type: concept
source: [[raw/articles/doubao-向量Embedding与向量数据库介绍.md]]
description: "PQ（乘积量化）：把高维向量压缩成很短编码，省内存、避免磁盘IO、距离计算变查表加速；代价是压缩损失精度。向量原始768维float单条约3072字节。"
created_at: 2026-09-16 08:30:12
updated_at: 2026-09-16 08:30:12
tags: [pq, product_quantization, vector_compression, ann, memory]
---

# PQ乘积量化

## 核心结论

- **作用**：把高维向量压缩成很短的编码，把向量从内存占用大户变小。
- **背景**：向量原始是 768 个 float（每个 float 4 字节，单条约 3072 字节）。
- **好处**：
  - 更多向量可以放进内存，避免磁盘 IO（磁盘读取是巨大瓶颈）；
  - 距离计算也变成查表，速度更快。
- **代价**：压缩会损失精度（与 ANN 的 trade-off 同向，需用 Rerank 兜底补救）。→ [[RAG检索优化五层]]

## 与 Int8 量化的关系

RAG 检索优化线上的 Int8 量化（float32→int8，存储约省 75%）同样是省内存思路，两者同属"减内存换精度"的量化家族；实际量产常按 float vs Int8 Top20 重叠率 >90% 验证后上线。→ [[RAG检索优化五层]]

## 相关页面
- [[ANN近似最近邻搜索]]：PQ 是 ANN 加速的配套手段
- [[向量数据库]]：PQ 压缩使亿级向量常驻内存
- [[向量Embedding与向量数据库总览]]：全景总览

## 参考来源
- [[raw/articles/doubao-向量Embedding与向量数据库介绍.md]]