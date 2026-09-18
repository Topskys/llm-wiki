---
type: source_summary
source: [[raw/papers/LLM-Agent安全防护-提示词注入防御与权限最小化综合研究.md]]
description: "对 raw 素材《LLM-Agent安全防护-提示词注入防御与权限最小化综合研究》（三份聊天素材 + 联网验证融合）的要点摘录：提示词注入成因分类、纵深防御六层面、CaMeL/双LLM/任务对齐/工具管控/权限最小化核心方案与量化效果索引。"
created_at: 2026-09-18 23:55:00
updated_at: 2026-09-18 23:55:00
tags: [source_summary, agent_security, prompt_injection, query_write]
---

# LLM-Agent安全防护·素材摘要

> 素材：《LLM-Agent安全防护-提示词注入防御与权限最小化综合研究》（锚点引用见 [[raw/papers/LLM-Agent安全防护-提示词注入防御与权限最小化综合研究.md]]）

## 素材构成

| 部分 | 内容 | 关联页面 |
|---|---|---|
| ChatGLM 防提示词注入方法 | 清洗管道、恶意指令向量库六步流程、Prompt-Guard-2 修正 | [[输入清洗与恶意指令向量库]] |
| DeepSeek Agent 防提示词注入 | CaMeL、双LLM、Task Shield、DRIFT、MELON、Janus | [[CaMeL能力沙箱]]、[[双LLM模式]]、[[任务对齐验证]] |
| 豆包 LLM 权限最小化落地 | 权限最小化四层、工具白名单、人工审批 | [[LLM权限最小化]]、[[工具调用零信任管控]] |
| 联网验证 | 论文级溯源与数字修正、OWASP LLM Top 10 2025 | 各页引用锚点 |

## 核心知识索引

- **威胁**：[[提示词注入]]——LLM 无法根本区分指令与数据，Agent 场景间接注入最危险（OWASP LLM01）。
- **纵深防御六层面**：输入治理 → 架构隔离 → 任务对齐 → 工具管控 → 输出审批 → 监控运营（见 [[LLM-Agent安全防护总览]]）。
- **关键量化记忆点**：

| 方案 | 关键数字 |
|---|---|
| CaMeL | 77% 任务可证明安全（无防御 84% 不安全）；外部攻击 949 条 0 成功 |
| Task Shield | ASR 2.07%，效用 69.79%（GPT-4o）|
| DRIFT | ASR 30.7%→1.3%（GPT-4o-mini）|
| MELON-Aug | ASR 0.32% |
| Prompt-Guard-2 | 官方为二分类（benign/malicious），素材"三分类"为 v1 旧口径 |

- **体系对比**：[[Agent注入防御方案对比]]——输入侧治理 vs 架构隔离 vs 执行层验证的选型。
- **范式核心**：从"防止被说服"到"被说服也做不了坏事"——权限最小化 + 架构隔离 + 关键动作人类在环[[LLM权限最小化]]。

## 素材沉淀记忆锚点

- 输入侧挡"已知"，架构侧挡"未知"+降级，执行层兜底"污染后上下文"，输出侧做人机边界。
- 权限最小化四层：模型只提案、工具最小集+白名单、数据按需分片+uid过滤、Runtime 非root/只读/密钥隔离。
- 高风险动作（转账/写库/删数据/发信/执行代码）必须有**人类在环审批**。

## 相关页面

- [[LLM-Agent安全防护总览]]、[[提示词注入]]
- 各方案 page：[[输入清洗与恶意指令向量库]]、[[双LLM模式]]、[[CaMeL能力沙箱]]、[[任务对齐验证]]、[[工具调用零信任管控]]、[[LLM权限最小化]]、[[输出验证与人工审批]]
- [[Agent注入防御方案对比]]

## 参考来源

- [[raw/papers/LLM-Agent安全防护-提示词注入防御与权限最小化综合研究.md]]
- [[raw/articles/chatglm-防提示词注入方法.md]]
- [[raw/articles/deepseek-agent防提示词注入.md]]
- [[raw/articles/doubao-LLM权限最小化落地.md]]