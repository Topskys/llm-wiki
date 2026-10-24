---
type: source_summary
source: "[[raw/papers/RSI递归自我改进.md]]"
description: "对 raw 论文《RSI 递归自我改进》的要点摘录：Yampolskiy 形式化定义、四项判定标准、三层概念边界、哥德尔机理论框架、DGM 工程闭环与四件套验证、G=∏εᵢ 点火条件、有界收益实测数字与四类局限，附 9 条参考文献索引。"
created_at: 2026-10-24 15:16:52
updated_at: 2026-10-24 15:16:52
tags: [source_summary, rsi, recursive_self_improvement]
---

# RSI递归自我改进·素材摘要

## 素材信息

| 项 | 内容 |
|---|---|
| 素材 | [[raw/papers/RSI递归自我改进.md]] |
| 主题 | 递归自我改进（Recursive Self-Improvement, RSI） |
| 性质 | 自撰综述型论文（9 条参考文献，含 DOI/arXiv/Nature/官网可点击链接） |
| 自评 | 98/100（结构、逻辑、引用、空行排版四维检查通过） |
| 核验 | 素材自带 13 项自检报告；数据均绑定参考文献 |

## 要点索引

- **定义**：系统通过修改自身代码、权重或研发流程，系统性提升「产生下一代自我」的能力并跨代累积；形式化为 $f_{n+1}=\Phi(f_n,f_n)$。见 [[递归自我改进RSI]]。
- **四项判定标准**：持久性、自主闭环、递归增益、稳健可控；缺第三条即降级为有界 RSI。见 [[RSI四项判定标准]]。
- **概念边界**：自我对弈是 RSI 的封闭域特例；AutoML/NAS 是无进化的自动搜索；Reflexion/Self-Refine 属自我改进层；自我进化层级低于 RSI。
- **哥德尔机**：Schmidhuber 2003，仅当形式证明 $u(s')>u(s)$ 时才改写，所得全局最优无局部极值；实践中不可行，遂转向经验验证。见 [[哥德尔机]]。
- **DGM 工程闭环**：迭代改写自身代码 + SWE-bench 经验验证 + 开放式存档采样代理树；落地四件套为基准门槛、回归保护、多评估器交叉、回滚机制。
- **点火条件**：$G=\prod_{i=1}^{n}\epsilon_i$，$G>1$ 自我维持加速，$G<1$ 逐轮衰减；现有估算显示尚不足点火但正在增强。见 [[点火条件与复利因子G]]。
- **有界 vs 开放式**：已观测收益（8× 吞吐、12 小时任务、91% HumanEval、80% 代码自主率）属有界 RSI 线性加速，指数级智能爆炸未触发。见 [[有界RSI与开放式RSI]]。
- **四类局限**：研发收益递减、物理与算力瓶颈（最慢环节锁住）、验证比实现难（奖励黑客）、对齐退化（偏差跨代放大）。
- **参考文献 9 条**：Good 1965 智能爆炸、Schmidhuber 哥德尔机、Yampolskiy 形式化、Anthropic When AI Builds Itself、The Economics of RSI、Darwin Gödel Machine、AlphaGo Zero、Self-Refine、Reflexion。

## 相关页面

- [[递归自我改进总览]]：由本素材编译的领域总览页。
- [[递归自我改进RSI]]、[[RSI四项判定标准]]、[[有界RSI与开放式RSI]]、[[点火条件与复利因子G]]、[[哥德尔机]]：五块原子化解读。
