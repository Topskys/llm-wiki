---
type: comparison
source: "[[raw/papers/KV Cache.md]]"
description: "vLLM、TensorRT-LLM、TGI、llama.cpp、SGLang 五家主流推理框架在 KV 技术上的横向对比：核心 KV 技术、分页管理、量化支持、前缀缓存与适用场景差异，vLLM 吞吐较原生 HF 提升 14–24×。"
created_at: 2026-10-02 19:41:03
updated_at: 2026-10-02 19:41:03
tags: [inference_framework, vllm, tgi, sglang, llamacpp, tensorrt_llm, kv_cache, comparison]
---

# 主流推理框架KV技术对比

## 能力对照表

| 框架 | 核心 KV 技术 | 分页管理 | 量化支持 | 前缀缓存 | 适用场景 |
|---|---|---|---|---|---|
| vLLM | PagedAttention + 连续批处理 | ✅ 原生支持 | INT8 / INT4 / KIVI | ✅ 自动前缀缓存 | 高并发服务、长上下文 |
| TensorRT-LLM | Paged KV + 算子深度优化 | ✅ | INT8 / INT4 / FP8 | ✅ | NVIDIA 硬件极致性能 |
| TGI | 连续批处理 + 分页 KV | ✅ | INT8 / INT4 | ✅ | HuggingFace 生态 |
| llama.cpp | 全平台量化 KV | ❌ 连续分配 | INT8 / INT4 / Q4_K 等 | ❌ | CPU / 端侧轻量推理 |
| SGLang | RadixAttention 前缀树 | ✅ | INT8 / INT4 | ✅ 前缀树匹配 | 多前缀高并发场景 |

## 核心结论

五家框架的区别，本质是**在[[KV Cache优化技术栈总览|五级技术栈]]上各自铺到哪一层**：vLLM 把系统管理层做满（PagedAttention + 自动前缀缓存），SGLang 在应用调度层的前缀复用上做到极致（RadixAttention 前缀树），TensorRT-LLM 走算子深度优化路线，llama.cpp 则以量化换资源、放弃分页管理以换取端侧可移植性。

**vLLM** 凭借 PagedAttention 的内存效率优势，吞吐量相比原生 HuggingFace 实现提升 **14–24 倍**，相比 TGI 提升 **2.2–3.5 倍**，是目前工业界部署的主流选择。

## 选型判据

- 要 **NVIDIA 硬件极致性能** → TensorRT-LLM（算子层铺满，量化支持最宽含 FP8）；
- 要 **HuggingFace 生态与易用性** → TGI；
- 要 **多前缀高并发**（统一系统提示词、多租户）→ SGLang 的 RadixAttention 前缀树；
- 要 **CPU / 端侧轻量** → llama.cpp（量化最全，但无分页与前缀缓存）；
- 其余通用高并发与长上下文 → vLLM。

## 相关页面

- [[PagedAttention分页内存]]：vLLM 的核心技术本体
- [[vLLM]]：提出 PagedAttention 的推理引擎实体
- [[前缀缓存与PagedAttention]]：SGLang 前缀树所依赖的复用机制
- [[KVCache低比特量化]]：各家量化支持列的技术底座
- [[KVCache场景选型指南]]：按业务约束反查框架与技术组合

## 参考来源

- [[raw/papers/KV Cache.md]]
