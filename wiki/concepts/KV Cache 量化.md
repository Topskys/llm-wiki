---
type: concept
source: [[raw/papers/权重量化.md]]
description: KV Cache 量化对长上下文场景缓存单独压低比特（per-channel INT8/FP8-E4M3/NVFP4），因为此时 KV Cache 显存可能反超权重本身；NVFP4 实测 3× TTFT 降低、20% 缓存命中率提升、准确率损失小于 1%，须与权重量化协同设计。
created_at: 2026-11-02 12:00:00
updated_at: 2026-11-02 12:00:00
tags: [kv_cache_quantization, long_context, inference_optimization]
---

# KV Cache 量化

## 核心结论

KV Cache 量化是长上下文推理的独立量化维度：上下文足够长时，逐 token 累积的 KV Cache 显存可能反超权重本身，只压权重不解决瓶颈。可选格式包括 per-channel INT8、FP8-E4M3 与 NVFP4——NVIDIA 在 Blackwell 架构上的实测表明，相比 FP8 KV Cache，NVFP4 可带来 3× TTFT 降低与 20% 缓存命中率提升，准确率损失小于 1% [[9]](#ref-9)。KV Cache 量化与权重量化同样重要，两者需协同设计。

## 要点拆解

### 为什么单独立项

KV Cache 的规模随上下文长度与 batch 线性增长：128K 上下文下，一个 70B 级模型的 KV 显存即可与权重同量级。权重量化管一次性权重，KV Cache 量化管随会话增长的动态部分，两者是并列的显存账本【推导】。

### 格式谱系

| 格式 | 位宽 | 特点 |
|---|---|---|
| per-channel INT8 | 8-bit | 通用、生态成熟 |
| FP8-E4M3 | 8-bit | Hopper 原生支持，vLLM 以 `kv_cache_dtype="fp8"` 直配 |
| NVFP4 | 4-bit | Blackwell 实测 3× TTFT 降、命中率高 20%、精度损失 <1% [[9]](#ref-9) |

### 与注意力机制的协同

KV Cache 量化改变的是缓存的存储格式，不改注意力计算语义。与 [[DSA 稀疏注意力]] 这类稀疏注意力互补：稀疏注意力省「读多少」，KV 量化省「每条多大力气存」，两条路径正交可叠加【推导】。

### 协同设计要点

权重量化后码率预算重新分配：KV Cache 不量化则长上下文显存反超权重，务必与权重选型同步决定；对长上下文服务，先把 KV 位数定下来（FP8 起步），再回头选权重量化档位【推导】。

## 相关页面

- [[权重量化]]：KV Cache 量化所属的上位概念，三类量化对象之一。
- [[DSA 稀疏注意力]]：正交的注意力侧优化路径。
- [[量化选型与避坑]]：选型决策流程中 KV Cache 的必做一步。

## 参考来源

[[raw/papers/权重量化.md]]
