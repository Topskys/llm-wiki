---
type: source_summary
source: "[[raw/papers/MoE.md]]"
description: "对 raw 论文《大模型原理之 MoE 混合专家模型》的要点摘录：门控路由与 Top-K 形式化、容量与算力解耦、路由坍缩与七种均衡方案、DeepSeekMoE 两项架构创新、显存/通信/推理三座工程大山与适用边界索引。"
created_at: 2026-10-03 21:00:36
updated_at: 2026-10-03 21:00:36
tags: [moe, source_summary, sparse_activation, load_balancing, model_architecture]
---

# MoE混合专家模型·素材摘要

## 核心结论

该素材把 MoE 从「多养几个 FFN」整理成一套**四维技术体系**：基础架构（专家网络与门控路由）、稀疏激活（容量与算力解耦）、训练负载均衡（路由演进）、工程挑战（显存/通信/推理）。核心论断是**「容量翻倍、算力打折」的经济学优势只在大规模成立**，数 B 以内稠密模型仍占优。

## 要点拆解

### 架构与形式化

- MoE 层：$y = \sum_{i=1}^{N} g_i(x) \cdot \mathrm{FFN}_i(x)$，Top-K 门控只让 $\mathcal{T}=\mathrm{TopK}$ 中的 $K$ 个专家非零。
- K 演进：Shazeer Top-4 → GShard Top-2 → Switch Top-1 → DeepSeek-V3 Top-8 路由 + 1 共享。
- 路由四范式：Token-Choice（主流，需均衡兜底）、Expert-Choice（天然均衡，收敛 2×）、软分配 Soft MoE（完全可微）、Hash Layers（零路由参数）。
- 变体：MMoE 按任务独立门控共享专家池；ReMoE 用 ReLU + $L_1$ 正则做完全可微路由。

### 稀疏激活

- 解耦式：$|\theta_{\text{total}}| = N \cdot |\theta_e|$ 决定容量，$|\theta_{\text{active}}| = K \cdot |\theta_e|$ 决定算力。
- 参数对比：Mixtral 8×7B 激活 ~28%、DeepSeek-V3 激活 ~5.5%、Switch 2048 选 1。
- 专家容量 $C = \lfloor \frac{B \cdot S}{N} \cdot \mathrm{CF} \rfloor$，CF 推荐 1.0–1.25，超限 token 丢弃；MegaBlocks 取消容量约束，训练加速最高 40%。

### 负载均衡与路由演进

- 病因：路由器是 softmax 分类器，微弱优势 → 更多梯度 → 更强 → 更常被选中的「赢家通吃」正反馈，最终路由坍缩。
- $\mathcal{L}_{\text{aux}} = \alpha \cdot N \sum f_i P_i$，均匀时最小值为 1；$\alpha$ 过大产生干扰梯度。
- ST-MoE z-loss 惩罚 logits 幅度，防 softmax 饱和，与均衡损失互补。
- DeepSeek-V2/V3 专家偏置：$b_i$ 只参与 Top-K 排序、不进门控权重，按近期负载动态调节，无梯度干扰。
- DeepSeekMoE 两项创新：细粒度切分（$N\to mN$、$K\to mK$，$\binom{4}{2}=6 \to \binom{8}{3}=56$）与共享专家隔离；16B 用约 40% 算力达 DeepSeek 7B 稠密水平。

### 工程挑战三座大山

- **显存墙**：全部专家驻留。EP 按专家切多卡；QMoE 把 1.6T SwitchTransformer-c2048 压到 160GB 以下（0.8bit、20×、开销 <5%）；Sparse Upcycling 复用约 50% 沉没训练成本。
- **通信开销**：All-to-All 的 dispatch/combine 两轮交换，未优化可占训练时间 30%–40%。三条正交路线——通信融合（算子融合 / chunk 重叠：MegaScale-MoE 1.41M tokens/s、1.88× / 分层 All-to-All 跳数 $O(p)\to O(G+p/G)$）、量化压缩（FP8 传输减半）、拓扑感知调度（路由层 TA-MoE 1.01–1.61×；放置层 0-1 整数规划）。
- **负载不均与推理**：线上分布偏差靠**冗余专家**（DeepSeek EPLB）；需大 batch 吃满算力；静态 Top-K 掩码代价由 Dynamic Gating 消除（吞吐 6.21–11.23×、内存降 1.36×）；动态形状使 CUDA Graph 难捕获【推导】。

### 适用边界

| 场景 | 结论 |
|---|---|
| 数十 B 以上 | MoE 容量/算力比优势显著，已成前沿主流 |
| 数 B 以内 | 稠密模型在稳定性与部署简易性上仍占优 |

## 相关页面

- [[MoE混合专家模型总览]]：四维结构与时间线的总入口。
- [[门控路由与Top-K稀疏激活]]：形式化公式的完整展开。
- [[稀疏激活与容量解耦]]：解耦收益与专家容量约束。
- [[辅助均衡损失与Router z-loss]]、[[无辅助损失的专家偏置]]：两条均衡路线的公式。
- [[MoE通信开销与优化路线]]：三条通信优化路线与实测数字。
- [[MoE与稠密模型对比]]：七维对比与选型建议。

## 参考来源

- [[raw/papers/MoE.md]]
