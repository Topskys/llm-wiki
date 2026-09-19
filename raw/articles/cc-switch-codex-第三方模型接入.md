# Codex 接入外部模型（CC Switch 与自定义 Provider）

> 来源：ChatGPT 中文教程站（zihai.dev）
> 原文：https://www.codex-docs.com/docs/third-party-models
> 抓取日期：2026-09-19

Codex 本地客户端不只能够使用 OpenAI 官方模型。通过 CC Switch 或 Codex 的自定义 model provider，你可以把 Codex 接入第三方模型厂商、API 聚合平台或企业内部模型网关。

本文只介绍第三方在线模型，提供两种接入路线：

| 接入方式 | 适合场景 / 是否需要协议转换 |
|---|---|
| CC Switch | 第三方接口只支持 Chat Completions、Anthropic Messages，或者你希望通过图形界面快速切换多个 provider；协议转换由 CC Switch 根据上游协议自动处理 |
| 自定义 `model provider` | 第三方服务原生、完整地兼容 OpenAI Responses API；不需要协议转换 |

**关键限制**：Codex 自定义 provider 当前使用 **OpenAI Responses API**。`wire_api` 唯一支持的值是 `responses`。如果第三方服务只有 `/v1/chat/completions`，不能仅把地址写进 `config.toml` 直接使用，应该通过 CC Switch 或其他协议转换网关接入。

适用于运行在本机的 Codex CLI、Codex IDE 扩展以及读取同一套 config.toml 的桌面客户端。Codex 云端会话不能通过本文方式切换为自定义模型。

## 开始之前

### 安装或更新 Codex CLI

```bash
npm install -g @openai/codex@latest
codex --version
```

首次安装后，至少运行一次 `codex` 以初始化用户配置目录。

### Codex 配置文件位置

- macOS / Linux：`~/.codex/config.toml`
- Windows：`%USERPROFILE%\.codex\config.toml`

修改配置前建议备份。

### 区分 provider、MCP 和模型网关

- `model_provider`：决定 Codex 把模型请求发送到哪里；
- MCP：给 Codex 增加浏览器、GitHub、数据库等工具与上下文；
- 模型网关：在 Codex 和模型服务之间完成协议转换、鉴权、路由、日志或限流。

因此，更换 Codex 的底层模型需要配置 provider，不是配置 MCP。

### API Key 安全

不要把真实 API Key 提交到 Git 仓库，也不要把完整密钥放进公开截图、日志或工单。手动配置 provider 时优先使用环境变量：

```toml
[model_providers.example]
env_key = "EXAMPLE_API_KEY"
```

CC Switch 是本机第三方开源工具，应从官方渠道安装，并保护好本机配置、数据库和备份文件。

## 1. 使用 CC Switch 接入第三方模型

### 1.1 CC Switch 解决了什么问题

新版 Codex 按 Responses API 发送请求，但不少第三方服务提供的是：

- OpenAI Chat Completions；
- Anthropic Messages；
- 非 Codex 默认识别的模型 ID；
- 厂商自定义的推理参数和流式事件格式。

CC Switch 的本地路由可以把调用链转换为：

```text
Codex
  │  Responses API
  ▼
CC Switch 本地路由
  │  根据 provider 配置转换协议和模型名称
  ▼
第三方模型 API
  │
  ▼
CC Switch 将响应、SSE、推理内容和工具调用转换回 Responses 格式
  │
  ▼
Codex
```

对于原生支持 Responses API 的 provider，CC Switch 可以不做 Chat 协议转换；对于 Chat Completions 或 Anthropic Messages provider，则必须启用本地路由。

### 1.2 安装 CC Switch

只从官方来源获取安装包：官方网站 https://ccswitch.io/ 、GitHub https://github.com/farion1231/cc-switch 、Releases https://github.com/farion1231/cc-switch/releases

- macOS：`brew install --cask cc-switch`，更新 `brew upgrade --cask cc-switch`
- Windows：Releases 下载 `.msi` 安装包或便携版压缩包
- Linux：Releases 下载 `.deb`、`.rpm` 或 AppImage

### 1.3 准备工作

1. 已安装并运行过一次 Codex；
2. 已安装并能够正常启动 CC Switch；
3. 已获得目标模型服务的 API Key；
4. 已从供应商文档确认 Base URL、模型 ID 和上游 API 协议；
5. 如果需要保留 Codex 官方账号能力，先完成一次官方登录。

检查登录：`codex login status`；登录：`codex login` 或 `codex login --device-auth`。

### 1.4 可选：切换第三方 provider 时保留官方登录

1. 在 CC Switch 的 Codex 页面切换到 **OpenAI Official**；
2. 启动 Codex，并完成官方账号登录；
3. CC Switch 打开 **Settings → General → Codex App Enhancements**；
4. 开启 **Keep official login when switching third-party providers**；
5. 再添加或切换第三方 provider。

开启后 CC Switch 会尽量保持 `~/.codex/auth.json`（官方登录状态）与 `~/.codex/config.toml`（当前第三方 provider、模型、地址和认证配置）。auth.json 含敏感登录信息，勿复制或提交版本库。

### 1.5 添加第三方 provider

打开 CC Switch，切换到顶部 Codex 页面，点击右上角添加按钮。

**优先使用预设**：预设通常自动配置 Base URL、默认模型、上游协议、是否本地路由、模型映射、部分推理参数。预设列表随版本更新，以应用内列表和供应商官方文档为准。

**使用自定义 provider**：选择自定义配置并填写：

| 字段 | 说明 |
|---|---|
| Provider Name | 自定义名称，仅用于识别 |
| API Key | 第三方服务的密钥 |
| Base URL | 供应商公布的 API 根地址 |
| Model ID | 上游真实模型 ID，必须完全一致 |
| Upstream Format | 上游实际使用的协议 |
| Model Mapping | Codex 中显示和调用的模型列表 |

最关键的是正确选择 Upstream Format：

| 上游格式 | 何时使用 | 是否需要本地路由 |
|---|---|---|
| Responses (native) | 上游原生实现 Responses API | 通常不需要协议转换 |
| Chat Completions (routing required) | 上游提供 /chat/completions | 需要 |
| Anthropic Messages (routing required) | 上游使用 Anthropic Messages 协议 | 需要 |

不要因为供应商宣传"兼容 OpenAI API"就默认选择 Responses。很多所谓 OpenAI 兼容接口只兼容 Chat Completions。

### 1.6 正确填写 Base URL

CC Switch 默认会在 Base URL 后拼接对应的 API 路径，通常只填写供应商文档给出的 API 根地址，不要自行重复添加 `/chat/completions` 或 `/responses`。例如供应商要求 `POST https://api.example.com/v1/chat/completions`，通常填写 `https://api.example.com` 或按预设要求填 `https://api.example.com/v1`。非标准完整路径时才使用 **Full URL Mode**。

### 1.7 配置 Needs Local Routing 和模型映射

provider 使用 Chat Completions、Anthropic Messages，或模型名称不是 Codex 默认模型时，应启用 **Needs Local Routing**。常见字段：

- **Model ID**：第三方 API 接收的真实模型名称（必须与供应商文档一致）
- **Display Name**：Codex `/model` 菜单中显示的名称
- **Context Window**：可选，模型真实上下文窗口

模型列表变化后需要重启 Codex；CC Switch 会根据映射生成 Codex 使用的模型目录。

### 1.8 开启本地路由并接管 Codex

CC Switch：**Settings → Routing → Local Routing**，完成：
1. 开启本地路由总开关；
2. 在 **Routing Enabled** 中开启 **Codex**；
3. 确认目标 provider 的 **Needs Local Routing** 状态正确；
4. 使用期间保持 CC Switch 正在运行。

本地路由默认地址通常是 `http://127.0.0.1:15721`。接管生效后 Codex 的实时配置指向 CC Switch 本地路由，CC Switch 再根据当前选中的 provider 把请求转发到真正的第三方 API。

Chat Completions 上游的实际过程：`Codex POST /responses → CC Switch 转换为 POST /chat/completions → 第三方返回 JSON/SSE → CC Switch 转换回 Responses JSON/SSE → Codex 继续执行工具调用`。

### 1.9 切换 provider 并重启 Codex

选中 provider 点击启用。切换后建议完全退出并重新启动 Codex（启动时读取 config.toml、/model 菜单加载模型目录）。CLI 重新运行 `codex`。

### 1.10 验证是否接入成功

进入 Codex 后运行 `/status`、`/model`、`/debug-config`。检查 CC Switch 当前选中 provider、本地路由日志、第三方平台请求记录、`~/.codex/config.toml` 是否指向本地路由。

不要只发送"你好"验证，至少完成一次智能体能力测试：列出项目文件 → 读取文件总结 → 修改小文件 → 运行测试 → 故意留错误观察能否根据测试结果继续修复。只有文本对话成功，不代表工具调用和多轮智能体工作流已兼容。

### 1.11 切回 OpenAI 官方 provider

CC Switch 选择 **OpenAI Official**，重启 Codex，检查 `codex login status`；异常则 `codex login`。

### 1.12 CC Switch 的限制与注意事项

- 使用 Chat 或 Messages 协议时，CC Switch 必须持续运行；
- 协议转换不能保证还原所有供应商特有能力；
- 某些模型能聊天但工具调用质量不足；
- Web Search、图片输入、WebSocket、响应存储等高级功能可能不兼容；
- 供应商限流、计费和数据保留政策仍然生效；
- CC Switch、Codex或供应商升级后，旧配置需重新验证。

CC Switch 更适合本地桌面开发。服务器、CI 或无图形界面的长期自动化任务，优先使用原生 Responses API 或自建协议网关。

## 2. 手动接入第三方在线模型 API

仅当第三方原生支持 Responses API 时建议直接配置自定义 provider；只提供 Chat Completions 或 Anthropic Messages 时使用 CC Switch。

### 2.1 接口需要满足的条件

至少支持：POST /responses；Responses JSON 结构；Responses SSE 流式事件；function/tool calling；JSON Schema 工具参数；工具结果回传后的继续推理；多轮请求或 previous_response_id 连续对话机制；足够上下文窗口与稳定长请求；清晰认证、限流、错误响应。仅支持普通文本生成不足以稳定运行 Codex 智能体。

### 2.2 通用配置

```toml
model_provider = "third_party"
model = "provider-model-id"
model_reasoning_effort = "high"   # 仅模型明确支持时
# model_context_window = 131072  # 可选

[model_providers.third_party]
name = "My Responses-compatible Provider"
base_url = "https://provider.example.com/v1"
env_key = "THIRD_PARTY_API_KEY"
wire_api = "responses"
request_max_retries = 4
stream_max_retries = 5
stream_idle_timeout_ms = 300000
```

保留 provider ID 不可用：`openai`、`ollama`、`lmstudio`。

### 2.3 配置字段说明

| 字段 | 作用 |
|---|---|
| model_provider | 选择 [model_providers.<id>] 中定义的 provider |
| model | 第三方服务接收的真实模型 ID |
| name | 显示名称 |
| base_url | 第三方 Responses API 根地址 |
| env_key | 保存 API Key 的环境变量名称 |
| wire_api | 当前只能使用 responses，省略时默认也是 responses |
| request_max_retries | 普通 HTTP 请求失败后的重试次数 |
| stream_max_retries | 流式连接中断后的重试次数 |
| stream_idle_timeout_ms | SSE 多久没有事件后判定为空闲超时 |
| model_context_window | 可选，模型真实上下文窗口 |
| model_reasoning_effort | 可选，模型支持的推理强度 |

base_url 是否包含 /v1 以供应商文档为准，Codex 会在其后面访问 Responses 路径，常见最终地址 `https://provider.example.com/v1/responses`。

### 2.4 设置 API Key

```bash
export THIRD_PARTY_API_KEY="你的 API Key"
```

PowerShell 当前会话：`$env:THIRD_PARTY_API_KEY = "your key"`；持久：`[Environment]::SetEnvironmentVariable("THIRD_PARTY_API_KEY", "your key", [EnvironmentVariableTarget]::User)`。

### 2.5 先测试 Responses endpoint

```bash
export PROVIDER_BASE_URL="https://provider.example.com/v1"
curl "$PROVIDER_BASE_URL/responses" \
  -H "Authorization: Bearer $THIRD_PARTY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "provider-model-id", "input": "Reply with exactly: PROVIDER_OK", "stream": false}'
```

检查：endpoint 非 404、返回 Responses 风格结构（不是只有 choices）、模型 ID 正确、认证正确、错误响应可排查。随后单独测试 stream:true、工具调用、工具结果回传、多轮、长上下文、并发和限流。

### 2.6 验证 Codex 配置

严格模式启动：`codex --strict-config`（把不认识的配置项当错误）。运行 `/status`、`/debug-config`。临时覆盖：`codex -c 'model_provider="third_party"' -m 'provider-model-id'`。

### 2.7 模型目录与 Unknown model

模型目录可描述上下文窗口、推理等级、输入模态、工具调用能力、截断策略、客户端最低版本。供应商提供模型目录文件时配置 `model_catalog_json = "~/.codex/provider-models.json"`；没有则确认真实值后设置 `model_context_window`。不要复制另一模型的元数据来消除警告。

### 2.8 完整兼容性检查

逐项验证：/responses 非流式；Responses SSE 流式；单个/多个工具调用；JSON Schema 参数；工具结果回传；长上下文与自动压缩；reasoning 参数；图片输入；限流与重试；代理是否缓冲 SSE；供应商是否修改/丢弃工具字段；数据保留、日志与隐私政策。

### 2.9 provider 配置应放在哪里

`model_provider`、`model_providers` 和认证配置应放在用户级 `~/.codex/config.toml`，不要放进项目 `<project>/.codex/config.toml`——Codex 会忽略项目级配置中可能重定向模型请求或认证的相关字段，防止克隆不可信仓库后被偷偷转发请求。

## 3. 使用配置档案管理多个第三方 provider

用 CC Switch 通常直接在图形界面切换即可，不必再配 Codex 配置档案（Profile）。Profile 适合手动配置多个原生 Responses provider 的用户。

基础配置 `~/.codex/config.toml`：

```toml
[model_providers.provider_a]
name = "Provider A"
base_url = "https://api.provider-a.example/v1"
env_key = "PROVIDER_A_API_KEY"
wire_api = "responses"

[model_providers.provider_b]
name = "Provider B"
base_url = "https://api.provider-b.example/v1"
env_key = "PROVIDER_B_API_KEY"
wire_api = "responses"
```

Profile 文件（`~/.codex/fast.config.toml`）：

```toml
model_provider = "provider_a"
model = "provider-a-fast-model"
model_reasoning_effort = "medium"
```

启动：`codex --profile fast` / `codex --profile quality`；非交互：`codex exec --profile quality "Review the current changes"`。

Profile 文件位于 `$CODEX_HOME/<profile-name>.config.toml`，默认 CODEX_HOME 为 `~/.codex`。较新 Codex 使用独立配置档案文件，不再读取旧式 `[profiles.<name>]` 表——从旧配置迁移应把每个 profile 拆分为独立 `<name>.config.toml`。

## 4. 特殊认证 Header 与高级认证

### 标准 Bearer Token

```toml
[model_providers.third_party]
env_key = "THIRD_PARTY_API_KEY"
```

### 自定义 API Key Header（如 x-api-key）

```toml
model_provider = "custom_header_provider"
model = "provider-model-id"

[model_providers.custom_header_provider]
name = "Custom Header Provider"
base_url = "https://provider.example.com/v1"
wire_api = "responses"
env_http_headers = { "x-api-key" = "VENDOR_API_KEY" }
```

右侧 VENDOR_API_KEY 是环境变量名称，不是真实密钥。

### 固定 Header 和查询参数

```toml
http_headers = { "X-Client-Name" = "codex", "X-Environment" = "development" }
query_params = { "api-version" = "2026-08-01" }
```

不要把真实密钥直接写进 http_headers。

### 命令式动态认证（企业短期 Token）

```toml
[model_providers.corporate]
name = "Corporate Gateway"
base_url = "https://gateway.example.com/v1"
wire_api = "responses"

[model_providers.corporate.auth]
command = "/usr/local/bin/fetch-codex-token"
args = ["--audience", "codex"]
timeout_ms = 5000
refresh_interval_ms = 300000
```

认证命令必须把 Token 输出到标准输出且不输出额外日志。以下认证方式不要混用：`[model_providers.<id>.auth]`、`env_key`、`experimental_bearer_token`、`requires_openai_auth`。

### 通过代理继续使用 OpenAI 认证

仅当代理后面仍访问 OpenAI 模型且希望 Codex 使用官方认证时，配置 `requires_openai_auth = true`。不适用于普通第三方 API Key；开启后忽略该 provider 的 env_key。

## 5. 常见错误与排查

### 5.1 CC Switch 已切换，但 Codex 仍使用旧模型

依次检查：CC Switch 当前启用的是目标 Codex provider；本地路由总开关开启；Routing Enabled 中开启 Codex；Chat/Messages provider 启用 Needs Local Routing；CC Switch 仍运行；完全重启 Codex/IDE；/debug-config 显示预期配置来源。模型映射变更后必须重启 Codex 才能刷新 /model 列表。

### 5.2 返回 404 / 400 / 找不到 /responses

常见原因：把 Chat Completions provider 当 Responses provider；Base URL 多/少一层 /v1；重复拼接 /chat/completions；非标准地址没开 Full URL Mode；CC Switch 本地路由没接管 Codex；第三方网关没实现完整 Responses API。用 curl 测试 `<base_url>/responses`。

### 5.3 401 / 403

检查：API Key 有效性；Key 区域/项目/套餐；余额权限；服务要 Bearer 还是 x-api-key；环境变量名与 env_key 一致；CC Switch 保存正确密钥；代理是否删了认证 Header。打印环境变量用 `printenv THIRD_PARTY_API_KEY`，勿在共享日志打印完整密钥。

### 5.4 第三方模型没有出现在 /model

检查：Model Mapping 包含真实模型 ID；provider 已保存并启用；重启 Codex；手动配置提供正确 model_catalog_json；模型目录 JSON 有效；模型 ID 已被供应商下线或重命名。

### 5.5 可以聊天，但不能读写文件或运行命令

常见原因：模型本身不擅长工具调用；上游不支持 function calling；中转层丢失 tool call ID；SSE 分片未正确重组；JSON Schema 被修改；工具结果未正确回传下一轮；模型上下文过短；模型目录错误声明能力。用真实项目测试"读取→修改→运行测试→根据失败继续修复"完整循环。

### 5.6 流式响应频繁中断

看本地路由日志与上游响应。常见原因：上游排队/推理时间过长；第三方网关未及时发 SSE；CDN/反代/公司网络缓冲流；上游发非标准事件；CC Switch/provider 版本兼容问题。手动 provider 可增加 request_max_retries、stream_max_retries、stream_idle_timeout_ms=600000；超时只能缓解网络或长推理问题，不能修复错误协议实现。

### 5.7 wire_api = "chat" 无法启动

旧教程常见配置错误。当前 Codex 只支持 `wire_api = "responses"`。上游只有 Chat Completions 时改用 CC Switch。运行 `codex --strict-config` 检查其他过时字段。

### 5.8 修改项目内配置后 provider 没有变化

model_provider / model_providers 必须放用户级 ~/.codex/config.toml；项目内 .codex/config.toml 不能覆盖重定向请求或 provider 认证字段。

### 5.9 终端可用，但 IDE 扩展提示缺少 API Key

GUI 应用不继承终端临时环境变量。从已设置变量的终端启动 IDE；持久保存到系统用户环境；完全退出重开 IDE；改用 CC Switch 管理本地 provider 配置。

### 5.10 切换后官方登录状态或官方功能异常

检查：先切回 OpenAI Official；Keep official login 开启；~/.codex/auth.json 是否被旧配置覆盖；codex login status。必要时重新 `codex login`。不要手动分享/编辑含 Access Token 的 auth.json。

### 5.11 Web Search、图片或其他高级功能不可用

第三方 provider 能完成文本和工具调用，不代表支持 Codex 全部能力。自定义 provider 默认不会声明 standalone Web Search；只有真实兼容才配置 `supports_standalone_web_search = true`，否则会让 Codex 发送上游无法处理的请求。图片输入、WebSocket、响应存储等分别验证。

## 6. 如何选择接入方式

| 需求 | 推荐方式 |
|---|---|
| 第三方只提供 Chat Completions | CC Switch |
| 第三方只提供 Anthropic Messages | CC Switch |
| 经常在多个第三方模型之间切换 | CC Switch |
| 希望用图形界面管理 API Key 和模型 | CC Switch |
| 第三方原生支持完整 Responses API | 自定义 model provider |
| 服务器、CI 或无图形界面环境 | 原生 Responses provider 或自建网关 |
| 企业需要统一鉴权、审计和限流 | 企业模型网关 + 自定义 provider |
| 只完成普通聊天、不支持工具调用 | 不适合作为完整 Codex 智能体 provider |

验收三层：连接测试（稳定返回文本）→ 工具测试（读文件、调命令并正确回传）→ 任务测试（连续完成修改、测试和修复）。最后确认计费方式、速率限制、请求/代码是否被记录、数据保存地区、合规要求、模型升级后重新测试。

使用第三方 API Key 时费用由第三方服务或中转平台单独结算，不会自动使用或共享 ChatGPT Plus、Pro 或 Codex 订阅额度。

## 参考资料

- https://developers.openai.com/codex/config-basic
- https://developers.openai.com/codex/config-advanced
- https://developers.openai.com/codex/developer-commands
- CC Switch：https://github.com/farion1231/cc-switch
- CC Switch User Manual：https://github.com/farion1231/cc-switch/tree/main/docs/user-manual
- CC Switch Add Provider：https://github.com/farion1231/cc-switch/blob/main/docs/user-manual/en/2-providers/2.1-add.md
- Preserve Codex Official Login Guide：https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-official-auth-preservation-guide-en.md