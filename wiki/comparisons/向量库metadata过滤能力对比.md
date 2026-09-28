---
type: comparison
source: "[[raw/papers/RAG知识库权限隔离.md]]"
description: "向量库 metadata 过滤能力对比：Pinecone/Qdrant/Weaviate/Milvus/ChromaDB/pgvector/LanceDB 原生支持标量过滤，FAISS 不支持需降级为业务层白名单；pre-filter 与 post-filter 在延迟和召回率上差异显著。"
created_at: 2026-09-28 23:24:19
updated_at: 2026-09-28 23:24:19
tags: [rag, vector_database, metadata_filter, comparison, pre_filter, post_filter]
---

# 向量库metadata过滤能力对比

## 核心结论

- **原生支持**：Pinecone、Qdrant、Weaviate、Milvus、ChromaDB、pgvector、LanceDB 均提供 metadata 标量过滤参数。
- **原生不支持**：FAISS 无 metadata 概念，须降级为业务层白名单。
- **性能语义**：pre-filter 延迟增加 <10%，post-filter 召回率下降 15%-30%。

## 对比表

| 向量库 | metadata 过滤 | 过滤策略 | 备注 |
|--------|--------------|----------|------|
| Pinecone | 原生支持 | pre/post filter | 命名空间隔离 |
| Qdrant | 原生支持 | filtered HNSW | ANN 一体化 |
| Weaviate | 原生支持 | pre/post filter | |
| Milvus | 原生支持 | pre/post filter | |
| ChromaDB | 原生支持 | pre filter | |
| pgvector | 原生支持 | WHERE 子句 | |
| LanceDB | 原生支持 | pre filter | |
| FAISS | 不支持 | 业务层白名单 | 需自维护映射 |

## 性能基准

| 指标 | pre-filter | post-filter |
|------|-----------|-------------|
| P99 延迟增加 | <10% | 较低 |
| 召回率@K | 无明显损失 | 下降 15%-30%（漏斗坍塌） |
| 过滤开销占比 | 引擎层承担 | 业务层承担 |

## 降级方案

对于 FAISS 等不支持原生 metadata 过滤的向量库：业务层预先拉取该用户全部有权文档 ID 集合，构建文档白名单，检索时限定 doc_id 范围。缺点：有权文档数量庞大时性能显著下降。

## 相关页面

- [[检索前置过滤机制]]：前置过滤机制详解
- [[检索漏斗坍塌]]：post-filter 的漏斗坍塌现象
- [[向量数据库]]：向量数据库概念
- [[HNSW图索引]]：HNSW 索引机制
- [[RAG权限隔离全链路架构]]：全链路架构中的向量库选型

## 参考来源

- [[raw/papers/RAG知识库权限隔离.md]]
