---
type: source_summary
source: [[raw/articles/cc-switch-codex-第三方模型接入.md]]
description: "对《cc-switch 与 Codex 多模型接入》两份联网素材（codex-docs 第三方模型接入指南 + CCNavX 安装教程）的要点摘录：CC Switch 定位、本地路由协议转换、三条接入路线、模型映射、排障与验收。"
created_at: 2026-09-19 14:46:24
updated_at: 2026-09-19 14:46:24
tags: [cc_switch, codex, third_party_models, local_routing, source_summary, query_write]
---

# cc-switch与Codex多模型接入·素材摘要

> 原始素材：[[raw/articles/cc-switch-codex-第三方模型接入.md]] · [[raw/articles/cc-switch安装与使用教程.md]]
> 来源：联网抓取（www.codex-docs.com 第三发模型接入指南，2026-08-14；CCNavX 安装教程，2026-05-07）
> 日期：2026-09-19

## 素材一：《cc-switch 与自定义 Provider 接入 Codex》（codex-docs）

核心结构与关键结论索引：

### CC Switch 解决了什么
- 新版 Codex 只发 Responses API；第三方多为 Chat Completions / Anthropic Messages → 协议不兼容，直接填地址必有 404 / 解析错 / 流式截断；
- CC Switch 本地路由做协议转换（默认 `http://127.0.0.1:15721`），Codex 视角仍是 OpenAI 兼容接口。

### 三条接入路线
| 路线 | 协议前提 | 适用 |
|---|---|---|
| CC Switch + 本地路由 | 任意（自动转换） | 常见第三方 / 多家中转 / 图形界面 |
| 自定义 model provider | 原生完整 Responses API | 服务器 / CI / 无界面 |
| 配置档案 Profile | 各 provider 原生 Responses | 按任务分档手动切换 |

### 关键操作锚点
- 添加 provider：优先预设（自动配 Base URL / 模型 / 协议 / 路由 / 映射），无预设用自定义 + 精确选 Upstream Format；
- 三开关：本地路由总开关、Routing Enabled → Codex、Needs Local Routing；
- 切完必须**重启 Codex**；验证用 `/status` `/model` `/debug-config`；
- 保留官方登录：先切 OpenAI Official → 官方登录 → 开 Keep official login → 再切第三方；
- 验收三层：连接（curl 直测 /responses）→ 工具（读/写/命令）→ 任务（改→测→修闭环）。

### 安全与边界
- Key / auth.json 敏感，不入库；
- provider 配置只放用户级 config.toml，项目级会忽略（防克隆劫持）；
- Chat/Messages 场景 CC Switch 必须常驻；Web Search / 图片 / WebSocket 等高级功能需逐项验证。

## 素材二：《CC Switch 安装与使用教程》（CCNavX）

- 两版区分：桌面版 `--cask cc-switch` vs CLI 版 `cc-switch-cli`（名字极像易装混）；CLI 适合服务器 / SSH / 自动化；
- 管理目标：Claude Code / Codex / Gemini CLI / OpenCode 的 provider、Base URL、API Key、模型名，附 MCP / prompts / skills / 用量集中管理；
- 铁则：**CC Switch 管配置、不保证接口兼容**；先用最小配置手动跑通，再录入 CC Switch；
- CLI 用法：`cc-switch --app codex provider list/current/switch <id>`；默认应用是 claude，`--app` 别漏；
- "切换没生效"排查：先重启 → 查当前 provider → `env check` 看环境变量残留（OPENAI_BASE_URL 等优先级盖过 config）→ 手动绕过重测。

## 关键洞察

- **协议是水岭，工具是皮**：CC Switch 的一切价值建立在「Responses ↔ Chat/Messages 转换」上，协议判断错了（把兼容 OpenAI 宣传当真）后面全是坑；
- **多一层工具就多一类排障成本**：单一稳定场景不必上 CC Switch；
- **官方登录是退路**：想来回切，先保 auth.json 与 config.toml 分工。

## 延伸页面索引

- [[cc-switch]] · [[CC Switch本地路由]] · [[Codex自定义模型Provider]] · [[Codex配置档案Profile]] · [[Codex模型映射与模型目录]] · [[Codex官方登录保留机制]] · [[Codex接入第三方模型总览]] · [[Codex第三方模型接入方式对比]] · [[Codex接第三方模型排障清单]]