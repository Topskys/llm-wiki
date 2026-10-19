---
type: entity
source: "[[raw/papers/文档智能.md]]"
description: "论文文档解析与结构还原的公开权威基准 OmniDocBench，v1.6 基准包含 1,651 页真实文档、八项官方指标，覆盖文本/表格/公式/版面检测等文档解析任务的精度评估，是衡量 MinerU、Docling 等文档智能工具解析效果的公共标尺。"
created_at: 2026-10-19 22:03:27
updated_at: 2026-10-19 22:03:27
tags: [document_ai, benchmark, evaluation, omndocbench, ocr]
---

# OmniDocBench

## 简介

OmniDocBench 是文档智能领域的公开基准，用于衡量文档解析与结构还原的精度，是 [[文档精度评估三层]] 中"官方基准"的代表。v1.6 版本包含：

- **规模**：1,651 页真实文档
- **指标**：八项官方指标

覆盖 [[OCR文档解析]]、[[版面分析]]、[[表格结构还原]]、[[公式识别]] 等解析任务的精度评估，是衡量 [[MinerU]]、[[Docling]] 等工具解析效果的公共标尺。

## 与三层评估的关系

OmniDocBench 落在 [[文档精度评估三层]] 的定位：

- **字符层**：CER / WER（见 [[OCR文档解析]]）
- **结构层**：TEDS / CDM / mAP（表格 TEDS、公式 CDM，见 [[表格结构还原]] 与 [[公式识别]]）
- **语义层**：字段 F1 / STP

其中**公式 CDM**（Character Detection Matching）同时被 OmniDocBench 采纳，采用 `display_formula_Edit_dist` 与 `display_formula_CDM` 两项公式指标——比纯编辑距离更贴近"公式是否视觉正确"，见 [[公式识别]]。

## 使用边界

OmniDocBench 属于公共基准，评估时需注意 [[文档精度评估三层]] 的"四个陷阱"：

- **基准≠业务**：公共基准精度高不代表真实业务命中率高
- **静态基准饱和**：公开基准因公开而趋于饱和、区分度下降
- 应配合业务侧字段级指标（如字段 F1）综合使用

## 相关

- [[文档精度评估三层]]（评估体系）、[[文档智能校验三支柱]]（业务侧校验）