---
type: comparison
source: [[raw/articles/cc-switch-codex-第三方模型接入.md]]
description: "Codex 第三方模型接入三方式横向对比：CC Switch（协议转换+图形切换）、自定义 Responses provider（原生直连）、配置档案 Profile（多档手动切换），在协议前提、适用场景、运行时依赖、上限能力上差异明确。"
created_at: 2026-09-19 14:46:24
updated_at: 2026-09-19 14:46:24
tags: [codex, cc_switch, model_provider, profile, comparison]
---

# Codex第三方模型接入方式对比

## 核心结论

- 三方式**不是并列替代**，而是按「上游协议 + 使用形态」分工：Chat/Messages 上游只能走 [[CC Switch本地路由]]；完整 Responses 上游可直接 [[Codex自定义模型Provider]]；多 provider 按任务分档时用 [[Codex配置档案Profile]]。
- 唯一不能到位的组合：第三方只有 Chat Completions 却想"纯手写 config.toml 直连"——`wire_api` 只支持 `responses`，这条路不存在。

## 对比表

| 维度 | CC Switch（+本地路由） | 自定义 model provider | 配置档案 Profile |
|------|----------------------|---------------------|-----------------|
| 上游协议要求 | Chat Completions / Messages / Responses 均可（转换） | 必须原生完整 Responses API | 各 provider 均为原生 Responses |
| 协议转换 | ✅ 自动 | ❌ 无 | ❌ 无 |
| 切换方式 | 图形界面一键切 provider | 改 config / CLI 覆盖 | `codex --profile <name>` |
| 模型列表来源 | CC Switch 模型映射自动生成 | model_catalog_json / model_context_window | profile 叠加 model_catalog_json 等 |
| 运行时依赖 | **CC Switch 必须持续运行**（Chat/Messages 场景） | 无 | 无 |
| 官方登录保留 | ✅ Keep official login 开关 | 无此概念（auth 走 env_key） | 无此概念 |
| 适用场景 | 常见第三方、多家中转、图形化管理 | 服务器/CI/无界面、企业网关直连 | 多原生 provider 按任务分档（fast/quality） |
| 高级能力（Web Search/图片等） | 可能不兼容，需验证 | 可声明，需上游真实兼容 | 随所选 provider |
| 上手难度 | 低（预设一键） | 中（手写 TOML + 环境变量） | 中（拆多文件） |
| 出错时排查面 | CC Switch + 路由日志 + 上游 | config + 上游 | config + profile + 上游 |

## 要点拆解

### 三者的配置文件落点

| 方式 | 改什么 |
|---|---|
| CC Switch | 写 `~/.codex/config.toml`，指向本地路由 `http://127.0.0.1:15721`；provider 数据存 CC Switch 本地 |
| 自定义 provider | `~/.codex/config.toml` 的 `[model_providers.<id>]` + `model_provider`/`model` |
| Profile | `~/.codex/<name>.config.toml` 独立文件，叠加基础配置 |

### Profile 与 CC Switch 的重叠

都用"切换 provider"，但定位不同：

- CC Switch = 书记角色：图形化改 config.toml，适合日常多态切换；
- Profile = 档位角色：按任务语义打包（fast/quality/deep-review），适合固定几档、服务器自动化（`codex exec --profile <name>`）。

两者并不冲突：可以把 CC Switch 选定 provider 作为基础配置，再在层上用 Profile 调模型档位。

### 与"企业模型网关"的关系

企业统一鉴权/审计/限流属于**模型网关**层（可参考 [[双层网关架构]] 的思路），Codex 侧用自定义 provider 指向网关即可，不需要 CC Switch。CC Switch 更偏个人本机的多供应切换。

## 相关页面

- [[Codex接入第三方模型总览]]：选型全景
- [[CC Switch本地路由]] / [[cc-switch]]：方式一
- [[Codex自定义模型Provider]]：方式二
- [[Codex配置档案Profile]]：方式三
- [[Codex官方登录保留机制]]：方式一的特色能力
- [[主流LLM网关方案对比]]：网关侧的同类思路

## 参考来源

- [[raw/articles/cc-switch-codex-第三方模型接入.md]]
- [[raw/articles/cc-switch安装与使用教程.md]]