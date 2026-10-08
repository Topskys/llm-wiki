---
type: concept
source: [[raw/papers/大模型推理全链路.md]]
description: "KV Cache 显存估算公式：2 × 层数 × 序列长度 × KV 头数 × head_dim × 字节数，随序列长度线性增长、随 batch size 线性倍增，是长上下文部署的核心约束。"
created_at: 2026-10-08 22:28:16
updated_at: 2026-10-08 22:28:16
tags: [kv_cache, memory, estimation, llm]
---

# KV Cache 显存估算

## 核心结论

KV Cache 的显存代价由公式估算，随序列长度**线性**增长、随 batch size **线性**倍增。这是长上下文推理吃显存的根源，也是模型卡上"支持 128K"与实际可部署长度存在差距的原因。

## 显存公式

$$\text{KV Cache 显存} = 2 \times N_{\text{layer}} \times L_{\text{seq}} \times H_{\text{kv}} \times d_{\text{head}} \times b_{\text{dtype}}$$

| 符号 | 含义 |
|---|---|
| $N_{\text{layer}}$ | Transformer 层数 |
| $L_{\text{seq}}$ | 序列长度 |
| $H_{\text{kv}}$ | KV 头数（GQA 下小于 Q 头数） |
| $d_{\text{head}}$ | 每个头的维度 |
| $b_{\text{dtype}}$ | 数据类型字节数（FP16=2, FP8=1） |

## 实例计算

### Llama-2-7B（FP16, 4K 上下文）

- 32 层、32 头、head_dim=128
- $2 \times 32 \times 4096 \times 32 \times 128 \times 2\text{B} \approx 2\text{ GB}$
- batch=8 即占 16 GB

### Llama-3-8B（FP16, 128K 上下文）

- 32 层、8 KV 头（GQA）、head_dim=128
- $2 \times 32 \times 131072 \times 8 \times 128 \times 2\text{B} \approx 16\text{ GB}$
- 已逼近或超出多数消费级 GPU 容量

## 关键结论

**架构上限是训练时的属性，硬件可承载长度才是部署的真实约束，二者取较小值。**

## 相关页面

- [[KV Cache]]：Decode 阶段加速核心机制
- [[Prefill与Decode两阶段]]：两阶段计算模式
- [[GQA与MQA多头变体]]：通过减少 KV 头数压缩显存
- [[KVCache低比特量化]]：通过降低精度压缩显存
- [[PagedAttention分页内存]]：通过分页管理减少显存碎片
- [[大模型推理全链路]]：KV Cache 在推理流水线中的位置

## 参考来源

- [[raw/papers/大模型推理全链路.md]]
