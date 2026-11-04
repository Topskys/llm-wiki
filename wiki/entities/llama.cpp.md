---
type: entity
source: [[raw/papers/权重量化.md]]
description: llama.cpp 是 GGUF 格式与 K-quants 量化系列的开发与推理生态，llama-quantize 生成 GGUF、llama-cli 推理，覆盖 CPU/Mac/消费级 GPU 本地部署，Q4_K_M 为性价比最高主流档。
created_at: 2026-11-02 12:00:00
updated_at: 2026-11-02 12:00:00
tags: [llama_cpp, gguf, local_inference]
---

# llama.cpp

## 核心结论

llama.cpp 是本地推理与 GGUF 量化生态的承载实体：提供 `llama-quantize`（从 FP16 GGUF 生成任意 K-quants 档位）、`llama-cli`（加载推理）与 convert 脚本（HFP16 权重转 GGUF）的完整工具集 [[8]](#ref-8)，是 CPU / Mac / 消费级 GPU 本地推理的首选，也是 GGUF 全系列（K-quants、IQ 系列）的事实标准实现。

## 要点拆解

### 三步工作流

1. **转换**：`python convert_hf_to_gguf.py ./Qwen2.5-7B-Instruct --outfile qwen-f16.gguf` 从 HF 权重生 FP16 GGUF；
2. **量化**：`./llama-quantize qwen-f16.gguf qwen-q4km.gguf Q4_K_M` 按档位生成低比特文件；
3. **推理 + 验收**：`./llama-cli -m qwen-q4km.gguf -p "…" -n 128`，用困惑度与显存实测反馈，不满意换档回炉 [[8]](#ref-8)。

### K-quants 系列

Q2_K~Q6_K 超块双重量化结构、`Q{n}_{K}_{M}` 命名语义（K 指 K-quant 方法而非 K-means）、Q4_K_M 实际位宽约 4.85 而非严格 4.0 等档位细节见 [[K-quants]] 专页。

### 生态位

与 vLLM（服务器高吞吐）构成两端：llama.cpp 管单机本地与端侧，KV Cache、上下文长度与批推理能力弱于 vLLM，但对硬件零门槛 [[8]](#ref-8)；按硬件定工具链的完整决策见 [[量化选型与避坑]]。

## 相关页面

- [[K-quants]]：llama.cpp 侧量化格式的原理与档位表。
- [[权重量化]]：llama.cpp 在工具链生态中的定位。
- [[量化工具链与kernel]]：六套工具链总表中的 ctx 位。
- [[量化选型与避坑]]：CPU/Mac 分支的落点即本工具。

## 参考来源

[[raw/papers/权重量化.md]]
