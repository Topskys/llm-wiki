---
type: source_summary
source: "https://arxiv.org/abs/2401.03568"
description: "对 raw 论文《Agent AI: Surveying the Horizons of Multimodal Interaction》（线上原文 https://arxiv.org/abs/2401.03568，v2）的要点摘录：Agent AI 定义、Agent Transformer 与 agent token、三级训练阶梯、六类分类学、五大风险面、游戏/机器人/医疗应用与 CuisineWorld/VideoAnalytica 两基准索引。"
created_at: 2026-10-24 14:36:44
updated_at: 2026-10-24 15:22:00
tags: [source_summary, agent_ai, multimodal, embodied]
---

# Agent-AI综述·素材摘要

## 素材信息

| 项 | 内容 |
|---|---|
| 原文链接 | https://arxiv.org/abs/2401.03568 |
| 版本 | arXiv:2401.03568v2，2024-01-07 提交、2024-01-25 修订，无后续版本 |
| 篇幅 | 80 页（约 44 MB），当前仍为预印本（页眉标注 A PREPRINT） |
| 作者 | Zane Durante（一作）、Qiuyuan Huang、Naoki Wake、Ran Gong、Jae Sung Park、Bidipta Sarkar、Rohan Taori、Yusuke Noda、Demetri Terzopoulos、Yejin Choi、Katsushi Ikeuchi、Hoi Vo、Li Fei-Fei、Jianfeng Gao |
| 机构 | Microsoft Research / Microsoft Gaming、Stanford University、UCLA、University of Washington |
| 核验 | 线上原文已核验（arXiv:2401.03568v2）；曾下载 PDF 全文逐节解析，字节数与 arXiv Content-Length 一致、首尾分段比对一致；该 PDF 备份已按用户决定删除，现行引用仅保留线上地址 |

## 要点索引

- **定义**：Agent AI = 能感知视觉刺激、语言输入与其他环境接地数据、并能产出有意义的具身动作的交互式系统；训练目标为下一具身动作预测。见 [[具身Agent与环境接地]]。
- **贯穿主张**：在接地环境中训练智能体可缓解大模型把内部知识当世界状态、生成与环境不符输出的倾向。见 [[环境接地式幻觉治理]]。
- **范式**：Agent Transformer 在视觉/语言 token 外增设 agent token，为动作预留输入输出子空间；对照冻结 LLM+视觉编码器方案有四项优势。见 [[AgentToken与下一动作预测]]。
- **训练阶梯**：L1 零样本模块（MindAgent 五模块）、L2 预训练微调（RL/IL/BC）、L3 持续自我改进（当前普遍缺失）。见 [[Agent训练方法阶梯]]。
- **分类学**：通才、具身（动作型/交互型）、仿真与环境、生成式、知识与逻辑推理、LLM/VLM 六类。见 [[AgentAI综述总览]]。
- **五大风险面**：幻觉、偏见与包容性、数据隐私与使用、可解释性（模仿学习→解耦→泛化→涌现）、监管。
- **基准**：CuisineWorld（文本协作游戏，集中调度/去中心双模式，配 CoS 协作效率指标）；VideoAnalytica（视频文本检索 + 视频辅助信息型问答，LLM 造难负例后人工清洗）。见 [[协作效率指标CoS]]。
- **无限记忆智能体**：从专家状态-动作对学策略，以 in-context prompt 或隐式奖励刻画专家行为关键特征，避开「需要海量专家数据」的模仿学习老问题。
- **过时提示**：§6 的应用实测与附录 A-F 为 2023 年 GPT-4V 定性观察，能力结论需按当前模型重新核验；全文约 45% 篇幅（§6 + 附录）属场景细节，工程复用价值低。

## 相关页面

- [[AgentAI综述总览]]：由本素材编译的领域总览页。
- [[具身Agent与环境接地]]、[[AgentToken与下一动作预测]]、[[环境接地式幻觉治理]]、[[Agent训练方法阶梯]]、[[协作效率指标CoS]]：五块原子化解读。
