---
type: concept
source: "[[raw/papers/KV Cache.md]]"
description: "Prefill 算力密集、Decode 访存密集的资源不对称是推理调度的核心矛盾；由此派生 Chunked Prefill 防长 Prompt 阻塞与 PD 分离部署，整体吞吐可提升 30%–50%。"
created_at: 2026-10-02 19:41:03
updated_at: 2026-10-02 19:41:03
tags: [prefill, decode, pd_separation, chunked_prefill, llm_serving, kv_cache]
---

# Prefill与Decode两阶段

## 两阶段资源特性

```mermaid
flowchart LR
    P["Prefill 预填充<br/>批量算全部 Prompt 的 K/V"] -->|写入 KV 缓存| D["Decode 解码<br/>逐 Token 读 KV 算注意力"]
    D -->|循环生成| D
```

| 阶段 | 核心操作 | 资源瓶颈 | 计算特性 |
|---|---|---|---|
| Prefill（预填充） | 批量计算全部 Prompt 的 K/V | 算力密集（Compute-bound） | 计算量与长度平方正相关 |
| Decode（解码） | 逐 Token 读取 KV 缓存计算注意力 | 显存带宽密集（Memory-bandwidth-bound） | 计算量与长度线性相关 |

## 核心结论

KV 缓存把推理切成两阶段，而两阶段的资源需求**恰好相反**：Prefill 要算力，Decode 要显存带宽与容量。这种**不对称性**导致单一硬件配比难以同时优化两个阶段，是推理调度工程的核心矛盾，也是后续 Chunked Prefill 与 PD 分离的出发点。

解码阶段的访存绑定特征非常尖锐：计算量仅 $O(T)$，却每步都要读完整个 KV 缓存——以 A100 为例，2GB 的 KV 缓存单次读取约需 1.3ms，远超计算本身耗时。

## Chunked Prefill（分块预填充）

长 Prompt 场景下单次 Prefill 计算量大、耗时长，会**阻塞后续 Decode 请求的调度**，导致首 Token 延迟飙升。

Chunked Prefill 把长 Prompt 切成多个小块，分批预填充并**穿插在 Decode 请求之间调度**，避免长请求独占 GPU，从而降低调度延迟、提升系统公平性。

## PD 分离部署架构

针对两阶段的不同资源特性，将 Prefill 与 Decode **分开部署**：

- **Prefill 节点**：配置高算力 GPU，专责预填充计算；
- **Decode 节点**：配置大显存、高带宽 GPU，专责生成解码；
- 计算完成的 KV 缓存经**高速网络**从 Prefill 节点传输至 Decode 节点。

如此可实现硬件资源的按需配比与弹性伸缩，整体吞吐量可提升 **30%–50%**。

## 并行切分策略

大规模部署中 KV 缓存需配合并行计算分片：

- **张量并行**：按注意力头维度切分 KV，各卡存部分头；
- **流水线并行**：按 Transformer 层维度切分，各卡存部分层；
- **序列并行**：超长上下文下按序列维度切分，配合分布式注意力计算。

不同并行模式下 KV 的存储与通信开销差异显著，需按模型规模与上下文长度选型。

## 相关页面

- [[KV Cache]]：两阶段所依托的缓存本体
- [[TTFT首字延迟优化]]：Prefill 主导的首字延迟优化主线
- [[KVCache场景选型指南]]：PD 分离与 Chunked Prefill 的选型位置
- [[KV Cache优化技术栈总览]]：应用调度层在五级栈中的位置

## 参考来源

- [[raw/papers/KV Cache.md]]
