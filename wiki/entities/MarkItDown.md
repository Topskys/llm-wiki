---
type: entity
source: "[[raw/web_clip/MarkItDown.md]]"
description: "微软 AutoGen 团队开源的轻量级 Python 工具，把 PDF/Word/PPT/Excel/图片/音频/HTML 等统一转成 LLM 友好的干净 Markdown。设计上刻意弱化二维版面建模、强化格式覆盖与结构保留，是文档智能生态中「面向 LLM 文本消费」路线的代表。使用量极高：GitHub 约 17.7 万 Star（全球 Rank #43）、PyPI 月下载千万级；可选对接 Azure Document Intelligence 与 LLM 图片描述，提供 CLI/Python API/Docker/MCP。"
created_at: 2026-10-19 22:03:27
updated_at: 2026-10-19 22:03:27
tags: [document_ai, markitdown, markdown, llm, rag, microsoft]
---

# MarkItDown

## 简介

MarkItDown 是微软 AutoGen 团队开源的轻量级 Python 工具，核心是把各种文件格式统一转换为 **LLM 友好的 Markdown**。它属于 [[文档智能]] 生态中"文档 → LLM 友好文本"路线（见 [[文档智能工程落地]] 的输入预处理环节），与 [[MinerU]]、[[Docling]] 的"精细结构还原/文档建模"路线定位互补。

一句话：**胜在简单通用、LLM 友好、格式覆盖广**——面向文本消费而非高保真版面还原。

## 为什么选 Markdown（而非 HTML/纯文本）

MarkItDown 选择 Markdown 输出，理由天然适配 LLM：

- **接近纯文本**：语法简洁，保留结构同时无冗余标记
- **LLM 原生**：主流模型（如 GPT-4o）原生理解 Markdown，训练语料大量含 Markdown
- **Token 效率**：比 HTML 等标记更省 token、降成本
- **结构与可读性平衡**：让 LLM 懂结构又不干扰内容

## 支持格式与使用量

### 格式覆盖（覆盖 99% 办公场景，弱化二维版面建模）

| 类别 | 格式 |
|---|---|
| Office 全家桶 | Word、PPT、Excel（新旧版通吃） |
| 文档 | PDF（含扫描 OCR）、EPUB |
| 多媒体 | 图片（OCR+EXIF）、音频（语音转写） |
| 网页/数据 | HTML、CSV、JSON、XML |
| 其他 | ZIP 批量、Outlook 邮件、YouTube 字幕 |

### 使用量（抓取时点核验，权威数据）

| 指标 | 数值 | 来源 |
|---|---|---|
| GitHub Star（最新） | 约 17.7 万，Global Rank #43 | star-history / 头条（17.9万） |
| GitHub Star（演进） | 54.8k（2025-04）→ 12.6万 → 13.8万（2026-05） | 腾讯云/CSDN 多时点 |
| PyPI 日下载 | 约 37 万 | pypistats API |
| PyPI 月下载 | 约 1457 万 | pypistats API |

> MarkItDown 是文档智能/预处理方向**使用量最高的开源工具之一**：Star 跻身 GitHub 全球前 50，PyPI 月下载破千万，明显高于多数同赛道工具。完整口径见 [[raw/web_clip/MarkItDown.md]]。

## 技术架构与使用

### 模块化设计

1. 核心转换引擎（格式识别与协调）
2. 文件格式转换器（分格式专用模块）
3. 插件系统（默认禁用，需显式启用：`--use-plugins`）
4. 命令行接口
5. Python API

转换四步：文件类型识别 → 内容提取 → 结构保留 → Markdown 生成。

### 典型用法

```bash
pip install 'markitdown[all]'          # 全功能安装
markitdown 报告.pdf -o 输出.md          # CLI 指定输出
cat 报告.pdf | markitdown                # 管道流式
```

```python
from markitdown import MarkItDown
md = MarkItDown(enable_plugins=False)
result = md.convert("数据.xlsx")
print(result.text_content)   # 得到 Markdown 文本
```

### 可选增强

- **对接 Azure Document Intelligence**：`MarkItDown(docintel_endpoint="...")` 高精度解析复杂 PDF
- **LLM 图片描述**：`MarkItDown(llm_client=client, llm_model="gpt-4o")` 给图片/PPT 生成描述
- **MCP 服务器**：可接入 Claude Desktop 等 LLM 应用
- **Docker**：`docker run --rm -i markitdown:latest < f.pdf > out.md`

## 在文档智能生态中的定位

| 维度 | [[MinerU]] | [[Docling]] | MarkItDown |
|---|---|---|---|
| 核心 | 高精度解析 VLM | 统一文档模型+流水线 | 轻量通用转换 |
| 强项 | 版面/公式/表格精度 | 文档建模、RAG 分块 | 格式覆盖广、API 简单、生态 |
| 弱项 | 工程较重 | 偏框架 | 复杂二维版面还原弱 |
| 面向 | 精确解析结果 | 可编排文档底座 | LLM 文本消费 |

**共同点**：都服务于把非结构化文档转成机器可用/LLM 可读的结构化形态（呼应 [[文档智能]] 四段能力链的解析段）。完整横向对比见 [[MinerU与Docling对比]]。

## 相关

- 出身上下文：[[文档智能工程落地]]、[[文档智能]]
- 同赛道：[[MinerU]]、[[Docling]]
- 对比：[[MinerU与Docling对比]]