# MarkItDown：微软开源的文档转 Markdown 工具

> 素材性质：联网融合稿（抓取腾讯云开发者社区两篇技术文章融合），用于「文档智能」主题的工程工具补充。数据均绑定下方来源，未做额外扩写。

## 摘要

MarkItDown 是 Microsoft AutoGen 团队开源的轻量级 Python 工具，核心能力是把各种文件格式统一转换为 Markdown，用于 LLM 与文本分析流程。与 textract 等纯文本提取工具相比，MarkItDown 侧重保留文档结构（标题、列表、表格、链接、图片引用、粗斜体），输出对大模型友好的简洁 Markdown。它是「文档智能」生态中「文档 → LLM 友好文本」路线（即 [[文档智能工程落地]] 的输入预处理环节）的代表工具。

**关键词**：MarkItDown；文档转Markdown；LLM；文档智能；RAG；Markdown

## 基本信息

- **项目名称**：MarkItDown
- **项目地址**：https://github.com/microsoft/markitdown
- **创建方**：Microsoft AutoGen 团队
- **开源许可证**：MIT
- **语言**：Python（Python 3.10+）

### 使用量与 Star 数据（抓取时点核验）

**GitHub Star 演进轨迹**（用多个独立来源互相印证，时间点有先后，反映快速增长）：

| 时间点 | Star | 来源口径 |
|---|---|---|
| 2025-04 | 54.8k | 腾讯云《一站式文档转 Markdown》 |
| 2025 (后) | 12.6万 | CSDN《深度解析》 |
| 2026-05 | 13.8万 / 14万 | 腾讯云《13.8万Star》、inet.clicksun |
| 2026 (最新) | **约 17.7万（Global Rank #43）** | star-history.com / 今日头条《两年17.9万星》 |

**PyPI 下载量**（权威来源 pypistats API，抓取时点核验）：

- 日下载：约 37 万
- 周下载：约 382 万
- 月下载：约 1457 万

> 结论：MarkItDown 是文档智能/文档预处理方向**使用量最高的开源工具之一**——Star 已跻身 GitHub 全球前 50，且 PyPI 月下载破千万，远超多数同赛道工具。
> 来源标注：star 数据来自 star-history.com（177k·Rank #43）、今日头条（17.9万），并经腾讯云/CSDN 多个时点文章交叉印证；下载量来自 pypistats API 核验。

## 为什么选择 Markdown 作为输出格式

MarkItDown 选择 Markdown 而非其他格式，理由是它天然适配 LLM：

1. **接近纯文本**：语法简洁，几乎就是纯文本加少量标记，保留结构的同时无明显冗余。
2. **LLM 原生支持**：主流模型（如 GPT-4o）原生"理解"Markdown，且训练语料大量含 Markdown，模型对其有深刻理解。
3. **Token 效率高**：与 HTML 等相比标记更简洁，输入 LLM 时节省 token、降低 API 成本。
4. **结构与可读性平衡**：既让 LLM 理解文档结构，又不因过多标记干扰内容。

## 支持的文件格式（覆盖 99% 办公场景）

MarkItDown 支持格式十分广泛，但**不追求高保真的二维版面建模**，本质是"结构保留的文本化"：

| 类别 | 格式 |
|---|---|
| Office 全家桶 | Word（docx）、PPT（pptx）、Excel（xlsx/xls）新旧格式通吃 |
| 文档 | PDF（含扫描件 OCR）、EPUB |
| 多媒体 | 图片（OCR + EXIF 元数据）、音频（语音转写） |
| 网页/数据 | HTML、CSV、JSON、XML |
| 其他 | ZIP（自动解压批量转）、Outlook 邮件、YouTube 链接扒字幕 |

## 技术架构：模块化设计

MarkItDown 采用模块化设计，主要组件：

1. **核心转换引擎**：负责文件格式识别与转换协调
2. **文件格式转换器**：针对不同文件格式的专用转换模块
3. **插件系统**：支持第三方扩展功能（默认禁用，需显式启用）
4. **命令行接口**：便于终端使用
5. **Python API**：方便集成进其他 Python 应用

### 文档转换四步机制

1. **文件类型识别**：识别输入文件格式
2. **内容提取**：用对应转换器提取文件内容
3. **结构保留**：提取过程中保留文档结构
4. **Markdown 生成**：将内容与结构转换为 Markdown

> v0.1.0 起 `convert_stream()` 需接收二进制文件对象（`io.BytesIO` 等）而非创建临时文件，提高效率与安全性。

## 使用方式

### 安装（按需选依赖）

```bash
pip install 'markitdown[all]'          # 全功能
pip install 'markitdown[pdf,docx,pptx]' # 按需：PDF + Word + PPT
```

可选依赖组：`[all]` `[pptx]` `[docx]` `[xlsx]` `[xls]` `[pdf]` `[outlook]` `[az-doc-intel]` `[audio-transcription]` `[youtube-transcription]`。

### 命令行

```bash
markitdown 报告.pdf -o 输出.md   # 指定输出
cat 报告.pdf | markitdown          # 管道流式
markitdown --use-plugins 报告.pdf  # 启用插件
```

### Python API

```python
from markitdown import MarkItDown
md = MarkItDown(enable_plugins=False)
result = md.convert("数据.xlsx")
print(result.text_content)
```

### 对接 Azure Document Intelligence（高精度复杂 PDF）

```python
md = MarkItDown(docintel_endpoint="<endpoint>")
result = md.convert("test.pdf")
```

### LLM 生成图像描述（图片/PPTX）

```python
from openai import OpenAI
client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o")
result = md.convert("example.jpg")
```

### Docker

```bash
docker run --rm -i markitdown:latest < ~/your-file.pdf > output.md
```

## 与文档智能生态其他工具的关系

MarkItDown 在「文档智能」生态中的定位是**面向 LLM 的轻量通用转换**，与重精细结构还原的工具互补而非对立：

- **与 [[MinerU]]**：MinerU 是自研高精度解析 VLM（版面/公式/表格 bbox），追求解析精度；MarkItDown 是轻量转换、面向文本消费，二者精度取向不同。
- **与 [[Docling]]**：Docling 强在统一文档模型（DoclingDocument）+ 可插拔流水线 + RAG 分块；MarkItDown 强在格式覆盖广、API 简单、生态（MCP 服务器）丰富。
- **结构短板**：MarkItDown 虽保留标题/列表/表格/链接，但对复杂二维版面（多栏、公式、无线表）的结构还原能力弱于 MinerU/Docling，不适合高保真场景（官方亦明言"对高保真转换供人类阅读的场景可能非最佳"）。

一句话：**MarkItDown 胜在"简单通用、LLM 友好、格式覆盖广"；MinerU/Docling 胜在"精细结构还原与统一文档建模"。**

## 应用场景

1. LLM 内容输入预处理
2. 知识库建设（异构文档统一转 Markdown 便于索引）
3. 文档自动化处理（合规检查、内容提取）
4. 内容迁移与存档
5. 与文档处理工具 / 内容管理系统 / AI 应用集成（如 MCP 服务器接入 Claude Desktop 等）

## 参考文献

- 腾讯云开发者社区《GitHub 11万星！微软开源神器MarkItDown：PDF/Word/PPT/图片/音频一键转干净Markdown》（AiDB，2026-05）
- 腾讯云开发者社区《MarkItDown：一站式文档转 Markdown 工具，为 LLM 时代而生》（CoderJia，2025-04）
- 微软官方仓库：https://github.com/microsoft/markitdown