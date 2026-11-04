---
type: concept
source: [[raw/papers/权重量化.md]]
description: 量化工具链与kernel：Marlin 是 NVIDIA GPU 上最主流的 4-bit 混合精度 GEMM kernel（寄存器内反量化 + Tensor Core FP16 乘加 + Split-K），TinyChat 主打边缘 GPU；bitsandbytes/AutoGPTQ/AutoAWQ/llama.cpp/vLLM/TensorRT-LLM/torchao 六套工具链覆盖不同场景。
created_at: 2026-11-02 12:00:00
updated_at: 2026-11-02 12:00:00
tags: [quantization_toolchain, marlin_kernel, vllm, tensorrt]
---

# 量化工具链与kernel

## 核心结论

量化要落地靠两层配套：kernel 与工具链。kernel 侧，Marlin 是当前 NVIDIA GPU 上最主流的 4-bit 混合精度 GEMM kernel，AWQ 配套的 TinyChat 则瞄准边缘 GPU；工具链侧，bitsandbytes、AutoGPTQ/AutoAWQ、llama.cpp、vLLM、TensorRT-LLM、torchao 六套各覆盖不同场景 [[11]](#ref-11) [[12]](#ref-12)。选 criterion：训练态选生态、推理态选 kernel 成熟度。

## 要点拆解

### 去量化与矩阵乘一体化

W4A16 模式下的「反量化 + 矩阵乘」是一体化完成的。Marlin 的关键优化：把 INT4 权重在寄存器内反量化为 FP16、用 Tensor Core 执行 FP16 乘加、以 Split-K 并行减少访存延迟，解码场景下相对原生 FP16×FP16 可显著提升吞吐 [[12]](#ref-12)。vLLM 与 TensorRT-LLM 均内置多种模板实例以适配不同矩阵形状。

### 六套工具链对照

| 工具/框架 | 支持格式 | 典型用法 |
|---|---|---|
| bitsandbytes | INT8 / NF4 / INT4 | HuggingFace 一行加载即量化，QLoRA 微调首选 [[11]](#ref-11) |
| AutoGPTQ / AutoAWQ | INT4 / INT3 | 一行命令量化 HF 模型，vLLM 直接加载 |
| llama.cpp | GGUF 全系列（K-quants、IQ 系列） | CPU / Mac / 消费级 GPU 本地推理首选 [[8]](#ref-8) |
| vLLM | AWQ、GPTQ、FP8、Marlin、bitsandbytes | 生产环境高吞吐 serving [[12]](#ref-12) |
| TensorRT-LLM | FP8、INT8、W4A16、NVFP4 | NVIDIA 端到端最优 kernel |
| torchao | int8 / int4 / float8 / QAT | PyTorch 原生生态，支持 QAT+LoRA |

<p align="center">表 1 主流量化工具链生态对比</p>

### 选型速断

- 训练/微调：bitsandbytes + torchao；
- 本地单机：[[llama.cpp]]（GGUF 全套）；
- 服务端推理：vLLM（`quantization="awq_marlin"` 一行接入量化权重）；
- NVIDIA 端到端极致：TensorRT-LLM；
- 量化生成：AutoGPTQ / AutoAWQ。

## 相关页面

- [[权重量化]]：工具链所属的上位概念，工程与工具链章节总览。
- [[llama.cpp]]：K-quants 生态的承载实体。
- [[量化选型与避坑]]：把工具链选择放进完整决策流程。
- [[PTQ与QAT对比]]：torchao 的 QAT 支持对应训练侧路线。

## 参考来源

[[raw/papers/权重量化.md]]
