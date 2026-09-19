# CC Switch 安装与使用教程：管理 Claude Code / Codex 中转配置

> 来源：CCNavX（zhihu 中转站信息站）
> 原文：https://ccnavx.com/zh/tutorials/cc-switch
> 发布：2026-05-07
> 抓取日期：2026-09-19

## 先分清两个版本

| 版本 | 适合谁 | 入口 |
|---|---|---|
| CC Switch 桌面版 | 日常在本机用图形界面管理多个 provider | https://github.com/farion1231/cc-switch/releases |
| cc-switch-cli | 服务器、SSH、自动化脚本、喜欢终端 TUI 的用户 | https://github.com/SaladDay/cc-switch-cli/releases |

不要把它们当成"中转站本身"。CC Switch 负责管理本地配置，真正能不能跑通取决于服务商的 Base URL、API Key、模型名、协议兼容和流式响应。

## 桌面版 CC Switch 安装

- macOS：`brew install --cask cc-switch`；更新 `brew upgrade --cask cc-switch`
- Windows：优先 `.msi` 安装包
- Linux：按发行版选 `.deb`、`.rpm` 或 AppImage

安装完成后打开应用，新建 provider，填入服务商给的 Base URL、API Key 和模型名。

## cc-switch-cli 安装

macOS / Linux 一键脚本：

```bash
curl -fsSL https://github.com/SaladDay/cc-switch-cli/releases/latest/download/install.sh | bash
```

默认安装到 `~/.local/bin`，可用 `CC_SWITCH_INSTALL_DIR` 改安装目录。PATH 找不到时检查 PATH / 手动 export。Homebrew 装 CLI 版：`brew install cc-switch-cli`。

注意：桌面版包名是 `--cask cc-switch`，CLI 版是 `cc-switch-cli`，装错会出现"命令找不到"。

## 配置前准备

先确认目标 CLI 能启动（`claude --help` / `codex --help` / `gemini --help`），不要一上来把全部配置塞进 CC Switch。cc-switch-cli 可用 `cc-switch env tools`、`cc-switch env check` 检查本地工具。

准备好三类信息：
- **Base URL**：服务商给出的 OpenAI / Anthropic 兼容地址，注意是否需要 /v1；
- **API Key / Token**：不同工具可能需不同分组令牌，不要把 Claude Code、Codex、Gemini 的 token 混用；
- **模型名**：不要默认以为 `claude-sonnet`、`gpt-5`、`gemini-pro` 别名都可用，先按服务商文档填。

## 推荐使用方式

1. 先手动跑通 Claude Code 或 Codex 的最小配置；
2. 确认 Base URL、API Key、模型名都没问题；
3. 再把这套配置录入 CC Switch；
4. 每次切换后重新打开对应 CLI 或终端会话，确认配置已生效。

先手动跑通再交给 CC Switch——反向操作是把一个未知问题包进另一个未知问题。

## 用桌面版配置 provider

1. 打开 CC Switch；
2. 新增 provider，起能识别来源和协议的名字（如"某某服务商 - Claude"）；
3. 填入 Base URL、API Key / Token、模型名；
4. 选择 provider 作用到 Claude Code、Codex、Gemini CLI 或其他支持的工具；
5. 保存并切换；
6. 重启目标 CLI 或重新打开终端会话。

字段注意：Provider 名称给人看；Base URL 严格按服务商文档（尤其 /v1）；API Key 区分 OpenAI Key、Anthropic Key、Bearer Token；模型名不要想当然；作用工具——同一 provider 可能只适合 Claude Code 不一定适合 Codex。

## 用 cc-switch-cli 配置和切换

第一次配置直接进 TUI：`cc-switch`。指定应用管理：

```bash
cc-switch --app claude
cc-switch --app codex
cc-switch --app gemini
```

常用命令：

```bash
cc-switch provider list
cc-switch provider current
cc-switch provider switch <id>
cc-switch use <id>
cc-switch provider stream-check <id>
cc-switch provider fetch-models <id>
cc-switch env tools
cc-switch env check
```

管理 Codex/Gemini 时：`cc-switch --app codex provider list` / `provider current` / `provider switch <id>`。

`claude` 是默认应用——不写 `--app` 时改的是 Claude Code 的 provider。想切 Codex 却忘加 `--app codex`，只是改了 Claude Code 配置。

## 切换后没有生效怎么办

1. 先重启目标 CLI / 重开终端；
2. `cc-switch provider current`（或 `--app` 对应命令）确认当前 provider；
3. `cc-switch env check` 看是否有环境变量覆盖工具写入的配置；
4. 临时绕过 CC Switch，手动用 Base URL + API Key 跑一次最小配置；
5. 手动配置也不通则问题大概率在服务商接口、模型名、token 分组或协议兼容。

常见误判：切换工具没问题，但 shell 里残留 `OPENAI_BASE_URL`、`OPENAI_API_KEY`、`ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 等环境变量——环境变量优先级盖过配置文件，CC Switch 里怎么切都像"没生效"。

## 适合什么场景

- 同时使用 Claude Code、Codex、Gemini CLI、OpenCode 或类似工具；
- 经常在官方 API、OpenAI 兼容中转站和本地模型接口之间切换；
- 不想每次切换 provider 手动改 shell 配置、settings.json 或 config.toml；
- 需要 MCP、prompts、skills、provider、用量和备份集中管理。

只接一个服务商且手动配置稳定时，先别急着上管理工具。多一层工具就多一层状态，多一层状态就多一类排障成本。

## 一个实用原则

CC Switch 负责"管理配置"，不负责"保证接口兼容"。真正决定能不能跑通的是服务商是否支持对应 CLI 需要的协议、模型和流式能力。

接中转站的顺序：先手动跑通 → 再交给 CC Switch 管理。