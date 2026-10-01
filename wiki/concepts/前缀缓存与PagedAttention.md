---
type: concept
source: "[[raw/papers/KV Cache分级存储.md]]"
description: "前缀缓存跨请求复用相同前缀的 KV 降 prefill 开销，PagedAttention 用分页管理消除显存碎片提升利用率；两者都只提升利用率、不扩展显存总容量，KV Cache 分级存储才是直接扩容的方案。"
created_at: 2026-10-01 20:50:29
updated_at: 2026-10-01 20:50:29
tags: [prefix_caching, paged_attention, vllm, kv_cache, memory_fragmentation]
---

# 前缀缓存与PagedAttention

## 核心结论

两个最常与分级存储混淆的相邻技术，**都解决的是「利用率」问题，不是「总容量」问题**。前缀缓存跨请求复用 KV 省的是重复计算，PagedAttention 分页管理省的是碎片——显存总量该是多少还是多少。

```mermaid
flowchart TD
    P[KV Cache 显存问题] --> U{问题性质}
    U -->|重复计算| PC[前缀缓存<br/>跨请求复用前缀 KV]
    U -->|碎片浪费| PA[PagedAttention<br/>分页管理消除碎片]
    U -->|总量不足| TS[KV Cache 分级存储<br/>下沉到 DRAM/SSD]
    PC --> N1[不扩展总容量]
    PA --> N2[不扩展总容量]
    TS --> Y[直接解决容量瓶颈]
```

## 前缀缓存

- **复用范围**：跨请求。系统指令、回复格式、固定模板等 prompt 前缀的 KV 被缓存，下次前缀相同即跳过重复计算。
- **解决什么**：prefill 阶段的重复计算，主要降 [[TTFT首字延迟优化]]。
- **不解决**：单请求内 KV 的容量问题；每轮变化的部分（如 RAG Top5）也无法跨请求缓存。

## PagedAttention

- **机制**：把 KV 按页管理，页大小固定、按需分配，取代连续内存分配带来的碎片。
- **解决什么**：显存碎片，提升显存利用率。
- **不解决**：总容量不变；且当 KV 总量确实超过 HBM 容量时，仍需靠换出——页级换出正是它在容量不足时的手段。

## 三者对照

| 机制 | 维度 | 复用/作用范围 | 是否扩展总容量 |
|------|------|----------------|----------------|
| KV Cache | 单请求内 | 省历史 K/V 重算 | 否 |
| 前缀缓存 | 跨请求 | 省 prefill 重复计算 | 否 |
| PagedAttention | 单请求内 | 消除碎片、提升利用率 | 否 |
| 分级存储 | 跨层 | 冷 KV 下沉换容量 | **是** |

## 相关页面

- [[KV Cache]]：三者共同作用的对象
- [[KV Cache分级存储]]：唯一扩展总容量的方案
- [[vLLM]]：PagedAttention 的提出方
- [[TTFT首字延迟优化]]：前缀缓存的收益落点

## 参考来源

- [[raw/papers/KV Cache分级存储.md]]