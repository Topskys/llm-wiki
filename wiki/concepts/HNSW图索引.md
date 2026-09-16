---
type: concept
source: [[raw/articles/doubao-向量Embedding与向量数据库介绍.md]]
description: "HNSW（层次化导航小世界）：多层跳表+图结构的 ANN 索引，建索引时高层是稀疏点做粗略导航、底层存全部向量；查询从高层快速跳到目标区域逐层向下导航，Milvus/Qdrant/Chroma 常用。"
created_at: 2026-09-16 08:30:12
updated_at: 2026-09-16 08:30:12
tags: [hnsw, ann, graph_index, vector_index, milvus]
---

# HNSW图索引

## 核心结论

- **HNSW（Hierarchical Navigable Small World）**：现在最常用的 ANN 索引，是 Milvus、Qdrant、Chroma 的主流选择。思路是**多层跳表 + 图结构**。
- **建索引**：构建多层有向图。高层是稀疏点（粗略导航），底层存储全部向量。
- **查询**：从最高稀疏层快速跳到靠近目标向量的区域，逐层往下导航；不需要遍历全部点，沿着图的边"跳着搜索"，快速收敛到候选集。

## 类比

找一个城市里离你最近的咖啡店：
- **暴力**：全城每家店全部算一遍距离；
- **HNSW**：先看全省地图跳到这个城市，再看城市地图跳到你所在片区，只在附近几条街找。

## 在线上检索的位置

HNSW 常作为 Dense 路的粗召回索引，配合 Int8 量化省内存、元数据过滤、Top20 控制与 Rerank 精排组成 RAG 检索优化五层。→ [[RAG检索优化五层]]

## 相关页面
- [[ANN近似最近邻搜索]]：HNSW 是 ANN 的实现方式之一
- [[IVF倒排索引]]：与 HNSW 并列的主流 ANN 索引
- [[RAG检索优化五层]]：HNSW 在粗召回层的实战参数（M/efConstruction/ef）
- [[向量数据库]]：HNSW 是专业向量库常用索引

## 参考来源
- [[raw/articles/doubao-向量Embedding与向量数据库介绍.md]]