---
type: source_summary
source: "[[raw/papers/KV Cache.md]]"
description: "对 raw 论文《KV Cache 缓存》的要点摘录：两阶段工作机制与显存占用式(1)、五级优化技术栈（架构/算子/表示/系统/调度）、PagedAttention 与 GQA-MQA-MLA 与 KIVI 量化与 FlashAttention 的实测收益、PD 分离与框架对比、场景选型决策表索引。"
created_at: 2026-10-02 19:41:03
updated_at: 2026-10-02 19:41:03
tags: [kv_cache, llm_inference, source_summary, inference_optimization]
---

# KV Cache原理与优化·素材摘要

## 核心结论

该素材把 KV Cache 从「一个缓存技巧」整理成**五级正交技术栈**：模型架构层（MQA/GQA/MLA）、算子计算层（FlashAttention）、数据表示层（低比特量化）、系统管理层（PagedAttention）、应用调度层（复用/分层/稀疏），各层可按需叠加，是当代推理引擎的标准优化栈。解码阶段本质是**内存带宽绑定**，所有优化都在「重算历史 KV」与「缓存全部 KV」两难之间取平衡。

## 要点拆解

### 原理与显存模型

- 两阶段：**Prefill** 一次性算完全部 Prompt 的 K/V 写入缓存（算力密集）；**Decode** 每步只算新增 Token 的 K/V 并追加，同时读全部历史缓存（访存密集）。
- 显存式(1)：$M_{\text{KV}} = 2 \times L \times H_{\text{kv}} \times d_k \times S \times B \times p$，四个线性因子（$S/B/L/H_{\text{kv}}$）任一扩张都线性推高显存。
- 量级：LLaMA-2 70B 若按 MHA 计，32K 约 86GB；LLaMA-3 8B（GQA 8 组）同长度仅约 4.3GB，为 MHA 的 1/4。
- 权重 INT4 后 KV 仍高精度，会出现**KV 反超权重**；朴素连续分配另有 60%–80% 碎片，有效容量只剩 20%–40%。

### 五级优化技术栈

| 层 | 技术 | 治什么症 |
|---|---|---|
| 模型架构层 | MQA / GQA / MLA | 存得太多 |
| 算子计算层 | FlashAttention / FlashDecoding / FlashMLA | 算得慢、读得累 |
| 数据表示层 | INT8 / INT4 / KIVI 非对称量化 | 存得太胖 |
| 系统管理层 | PagedAttention / 连续批处理 / 块共享 | 放得乱 |
| 应用调度层 | 稀疏淘汰 / 分层卸载 / 调度策略 | 放不下 |

### 各层实测收益

- **PagedAttention**：内存浪费 60%–80% → 4% 以下；Copy-on-Write 让 beam search 显存省 55%；与连续批处理互为使能。
- **GQA/MQA**：G=H 退化为 MHA、G=1 退化为 MQA，可连续平滑权衡；LLaMA-2 70B 用 8 组 GQA 把 KV 压到 1/8。
- **MLA**：DeepSeek-V2 缓存低维隐向量，KV 减 93.3%、生成吞吐 5.76×、训练成本降 42.5%。
- **KIVI 量化**：K 按通道 + V 按 Token 的非对称 2bit，峰值显存降 2.6×、最大批 4×、吞吐 2.35–3.47×。
- **FlashAttention**：分块 + 在线 Softmax，$N\times N$ 中间矩阵不落盘，显存 $O(N^2) \to O(N)$。

### 工程与选型

- **PD 分离**：Prefill 配高算力 GPU、Decode 配大显存高带宽 GPU，KV 走高速网络传输，整体吞吐可提升 30%–50%；Chunked Prefill 避免长 Prompt 独占 GPU。
- **并行切分**：张量并行按头维度、流水线并行按层维度、序列并行按序列维度切分 KV。
- **框架**：vLLM / TensorRT-LLM / TGI / llama.cpp / SGLang 五家对比，vLLM 吞吐较原生 HF 提升 14–24×、较 TGI 2.2–3.5×。
- **叠加正交**：GQA-8 + INT4 可把 KV 压到原 MHA FP16 的 1/16；落地优先级为 先工程（分页+连续批）→ 数据层（INT8/INT4）→ 计算层（FlashAttention）→ 复用（前缀缓存）→ 架构（GQA/MLA）→ 极端场景（分层卸载/稀疏淘汰）。

## 相关页面

- [[KV Cache]]：缓存机制本体与显存公式的入口
- [[KV Cache优化技术栈总览]]：五级栈的分层架构总览
- [[Prefill与Decode两阶段]]：资源不对称性的来源
- [[KV Cache分级存储]]：同一素材库中「以带宽换容量」的分层解法

## 参考来源

- [[raw/papers/KV Cache.md]]
