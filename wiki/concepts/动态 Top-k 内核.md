---
type: concept
source: [[raw/papers/DSA稀疏注意力.md]]
description: 动态 Top-k 内核是 DSA 的系统内核部件，包括 DeepGEMM 索引 logit 内核与 FlashMLA 稀疏注意力内核，支持动态稀疏路径、分页与 CUDA Graph 捕获，适配 SGLang 与 vLLM 服务框架。
created_at: 2026-11-01 10:00:00
updated_at: 2026-11-01 10:00:00
tags: [dynamic_topk_kernel, dsa_kernel, system_kernel]
---

# 动态 Top-k 内核

## 核心结论

动态 Top-k 内核是 DSA 的系统内核部件，包括 DeepGEMM 索引 logit 内核与 FlashMLA 稀疏注意力内核，支持动态稀疏路径、分页与 CUDA Graph 捕获，适配 SGLang 与 vLLM 服务框架。动态 Top-k 意味着每个 query 参与计算的 KV 长度不同，gather 索引在运行时才产生，形状随输入变化，通用算子库很难直接高效支撑这类动态稀疏路径【推导】。

## 要点拆解

### 自研动因

动态 Top-k 意味着每个 query 参与计算的 KV 长度不同，gather 索引在运行时才产生，形状随输入变化，通用算子库很难直接高效支撑这类动态稀疏路径【推导】。DeepSeek 因此自研并开源了整套内核：TileLang 版侧重可读性、方便研究改动，CUDA 版面向高性能推理；索引器 logit 内核（含分页版）放在 DeepGEMM，稀疏注意力内核放在 FlashMLA [[15]](#ref-15)。

### 内核分工

表1 汇总了各部件在开源栈中的落点：

| 部件 | 实现位置 | 关键点 |
|---|---|---|
| 索引器打分（预填充） | DeepGEMM 索引 logit 内核 | 64 头 × 128 维、FP8、算力受限 |
| 索引器打分（解码） | DeepGEMM 分页版内核 | 单 query、访存受限、按页读索引缓存 |
| Top-k 选择 | 索引内核内的选择步骤 | 每 query 取 2048，索引在运行时生成 |
| 稀疏注意力（预填充） | FlashMLA sparse 内核（`flashmla_sparse`） | token 级 gather 后整段计算 |
| 稀疏注意力（解码） | FlashMLA sparse 内核（`flashmla_sparse`） | 动态 Top-k 加 KV 分页，可图捕获 |
| 研究参考实现 | TileLang 版本 | 可读性优先，便于改结构做消融 |
| 服务框架 | SGLang、vLLM | DSA 后端、索引 key 独立缓存、分页与图捕获 |

### 预填充与解码的差异

预填充与解码的优化方向并不相同，因此两条路径是分开实现的：预填充分块处理整段序列，受算力限制，优化重点是 FP8 打分与张量核心利用率；解码每步只来一个 query，受访存带宽限制，优化重点是按页只读必要的索引缓存与 KV 条目，把搬运量压到最低 [[1]](#ref-1) [[17]](#ref-17)【推导】。SGLang 正是把预填充与解码后端拆成两个独立参数暴露出来，可按硬件分别选择 `flashmla_sparse`、`flashmla_sparse_q8`、`fa3`、`tilelang` 等实现 [[17]](#ref-17)。

### 分页与图捕获

工程上最容易踩坑的是页大小。索引器需要一份独立的 `key&key_scale` 缓存，要求页大小为 64，而 token 级稀疏前向算子要求页大小为 1，SGLang 在同一注意力后端里同时支持了这两种页大小 [[11]](#ref-11)。解码路径支持 CUDA Graph 捕获（以 `--cuda-graph-max-bs-decode` 配置最大批大小），把逐层的调度开销摊平 [[17]](#ref-17)。vLLM 在发布当日即支持该模型，覆盖 Hopper（H100/H200/H20）与 Blackwell（B200/GB200）[[14]](#ref-14）。第三方基准站收录的索引器参考内核标明 64 索引头、128 维、topk 2048、页大小 64、FP8 [[16]](#ref-16)，与官方配置一致。

## 相关页面

- [[DSA 稀疏注意力]]：动态 Top-k 内核所属的上位概念，查询感知稀疏注意力的系统内核部分。
- [[闪电索引器]]：动态 Top-k 内核中的索引器打分部件，对应 DeepGEMM 索引 logit 内核。
- [[DeepSeek-V3.2-Exp]]：使用动态 Top-k 内核的 DeepSeek 实验版模型。

## 参考来源

[[raw/papers/DSA稀疏注意力.md]]
