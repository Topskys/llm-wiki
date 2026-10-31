---
type: source_summary
source: [[raw/papers/DSA稀疏注意力.md]]
description: 《DSA 稀疏注意力》素材摘要：梳理 DSA 的动机、索引与选择机制、训练配方、内核实现与成本效果，并对照 NSA、MoBA、Quest 等方案给出适用边界，包含 8 个章节、5 张表格、2 个 Mermaid 图、17 条参考文献。
created_at: 2026-11-01 10:00:00
updated_at: 2026-11-01 10:00:00
tags: [source_summary, dsa, sparse_attention]
---

# DSA 稀疏注意力·素材摘要

## 核心结论

《DSA 稀疏注意力》梳理 DSA 的动机、索引与选择机制、训练配方、内核实现与成本效果，并对照 NSA、MoBA、Quest 等方案给出适用边界。DSA 是 DeepSeek 在 V3.2-Exp 中引入的查询感知稀疏注意力，用轻量索引器给每个 query 的历史 token 打分，只把 Top-k 个 KV 条目送进精确注意力，把主注意力复杂度从 O(L²) 降到与 k 成正比，并用两阶段继续训练把稀疏模式练进模型。

## 要点拆解

### 动机与瓶颈

MLA 解决的是"存不下"：把每 token 的 KV 压成低秩隐向量，KV Cache 显著缩小。但注意力计算本身仍是 query 与全部历史 token 的两两交互，FLOPs 随序列长度平方增长。从 V2 到 V3.1，长上下文的主要瓶颈从显存容量迁移到计算与访存带宽：预填充受算力限制，解码每一步都要把整条 KV Cache 读一遍，受带宽限制【推导】。

### 索引与选择

索引器对 query 与历史 token 的每一对给出标量相关性分数，64 头 × 128 维 FP8，ReLU 加权求和。每个 query 保留分数最高的 2048 个历史 token 的 KV 条目，选择是 token 级而非块级，所有注意力头共享同一份 top-k 索引集合。

### 训练配方

从 V3.1-Terminus 的 128K 检查点出发做继续训练，分两个阶段：
- 阶段一 索引热身：冻结主模型，学习率 1e-3，跑 1000 步，每步 16 条 128K 序列，合计约 2.1B token
- 阶段二 稀疏联合训练：解冻全部参数，学习率 7.3e-6，跑 15000 步，每步 480 条 128K 序列，合计约 943.7B token
索引器输入从计算图中断开，索引器只由 $L_I$ 优化，主模型只由语言建模损失优化，二者梯度解耦。

### 系统内核

DeepSeek 自研并开源整套内核：TileLang 版侧重可读性，CUDA 版面向高性能推理；索引器 logit 内核放在 DeepGEMM，稀疏注意力内核放在 FlashMLA。预填充与解码分开实现，预填充受算力限制，解码受访存带宽限制。SGLang 与 vLLM 均已适配，覆盖 Hopper 与 Blackwell 架构。

### 成本与评测

V3.2-Exp 上线当日 API 价格下调 50% 以上。官方评测整体持平：除 Codeforces Elo 评分 2046 升至 2121 外，其余各项差异在 3 分以内，BrowseComp 两项、SimpleQA、AIME 2025、Terminal-bench 微升，GPQA-Diamond、HLE、HMMT 2025、Aider-Polyglot 微降。短序列下滑被归因于推理链变短，补预算后收敛。

### 适用边界

- 短上下文：$k$ 固定 2048，短序列退化为稠密，稀疏收益趋零，走 masked MHA 路径
- 超长上下文：索引器仍是 $O(L^2)$ 打分，会成为新瓶颈，配合上下文管理或分块检索
- 部署门槛：动态 Top-k 需专用内核与分页支持，依赖 SGLang、vLLM 等已适配框架
- 显存：索引器另存单头 128 维 key 缓存，主 KV 不变，需预留余量
- 能力波动：部分推理基准小幅回退，补推理预算或经后训练修复

### 版本演进

2025 年 9 月 29 日的 V3.2-Exp 是验证件，2025 年 12 月 1 日的 V3.2 是正式版，架构沿用 DSA，重心转向可扩展强化学习与 Agent 能力，并发布高算力变体 V3.2-Speciale。

## 相关页面

- [[DSA 稀疏注意力]]：本素材摘要对应的主概念页面。
- [[DSA 稀疏注意力方案对比]]：DSA 与 NSA、MoBA、Quest、MInference 的横向对比页面。
- [[DeepSeek-V3.2-Exp]]：引入 DSA 的 DeepSeek 实验版模型页面。
- [[DeepSeek-V3.2]]：沿用 DSA 架构的 DeepSeek 正式版模型页面。

## 参考来源

[[raw/papers/DSA稀疏注意力.md]]
