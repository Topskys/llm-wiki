---
type: comparison
source: "[[raw/papers/文档智能.md]]"
description: "两条文档智能工程路线横向对比：MinerU（自研解析 VLM，追求高精度解析复杂版面/公式/表格，输出 Markdown/JSON）vs Docling（统一文档模型 DoclingDocument + 可插拔流水线，追求可编排、多格式、RAG 分块的文档底座）。共同趋势是从"流水线拼装"走向"统一模型 + 结构化文档表示"。"
created_at: 2026-10-19 22:03:27
updated_at: 2026-10-19 22:22:49
tags: [document_ai, comparison, mineru, docling, pipeline]
---

# MinerU与Docling对比

## 简介

[[文档智能工程落地]] 的两条工程路线——自研高精度解析引擎与可编排文档框架——的横向对比。两者代表当前阶段的架构共识：从"流水线拼装"走向"统一模型 + 结构化文档表示"（见 [[文档VLM三大范式]] 的解耦式路线）。

## 对比表

| 维度 | [[MinerU]] | [[Docling]] |
|---|---|---|
| 出身 | 上海人工智能实验室、OpenDataLab | IBM Research |
| 核心 | 高精度解析（自研文档 VLM） | 统一文档模型与可插拔流水线 |
| 强项 | 复杂版面、公式、表格精度 | 文档结构建模、多格式支持、RAG 分块 |
| 形态 | 解析引擎 | 转换框架与工具箱 |
| 输出 | Markdown、JSON（带 bbox） | DoclingDocument 多格式导出 |
| 适合场景 | 追求最高精度解析结果 | 需要可编排、可扩展的文档底座 |

## 深层差异

- **架构哲学**：MinerU 是解耦式 VLM（Stage I 全局版面 + Stage II 局部原生分辨率），追求解析精度；Docling 是统一文档对象模型（DoclingDocument 为中枢），后端/流水线/选项解耦，追求可编排与多格式。
- **价值取向**：MinerU 输出"最准的解析结果"；Docling 输出"可查询、可扩展、可入库的文档表示"（如 HybridChunker 直接分块入库 RAG）。
- **隐私设计**：Docling 默认全本地、显式才启用远程；MinerU 侧重精度与效率（[[文档智能校验三支柱]] / 私有部署合规驱动力都适用）。

## 第三路线：轻量通用转换（MarkItDown）

除这两条"重精细结构"路线外，同赛道还有一条**轻量通用**路线 [[MarkItDown]]（微软 AutoGen，PDF/Word/PPT/Excel/图片/音频→LLM 友好 Markdown）。三者不是替代而是分工：

- [[MinerU]] / [[Docling]] 胜在精细结构还原与统一文档建模（面向高保真解析与 RAG 结构化入库）；
- [[MarkItDown]] 胜在简单通用、格式覆盖广、API 简单、生态（MCP）丰富，GitHub 约 17.7 万 Star、PyPI 月下载千万级——使用量反而最高，面向 LLM 文本消费。

选型参考：要高保真结构 + 二选一于 [[MinerU]] 与 [[Docling]]；要快速把异构文档喂给 LLM/RAG 走 [[MarkItDown]]。三者完整谱系见 [[文档智能工程落地]]。

## 共同共识

两者共同趋势是从"流水线拼装"走向"统一模型 + 结构化文档表示"——无论自研模型还是做框架，最终都要落到一个显式、可查询的文档对象模型。这正是 [[文档智能]] 四段能力链中"解析段"的最佳实践形态。

## 相关

- [[文档智能工程落地]]、[[MinerU]]、[[Docling]]、[[MarkItDown]]、[[文档VLM三大范式]]