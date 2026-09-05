# AGENTS.md — LLM-Wiki Agent 全局契约

基于 Obsidian + Git 的编译型个人知识库（Karpathy LLM-Wiki 框架）。**所有业务规则的唯一权威来源是 [SCHEMA.md](./SCHEMA.md)，执行任何针对 wiki/ 的读写任务前，必须先完整阅读它**。本文档仅作入口引导与铁律重申，冲突以 SCHEMA.md 为准。

## 三层架构

- `raw/` — 原始素材。**AI 只读 + 只增不改：可读取、可新增素材文件（联网抓取网页等），禁止修改、删除、覆盖任何已有文件**。
- `wiki/` — AI 编译的知识网络。分类目录与 `type` 一一对应：
  - `entities/` → entity，`concepts/` → concept，`overviews/` → overview，`comparisons/` → comparison，`source_summaries/` → source_summary
  - `_archive/` — 归档页，**不纳入 index、不参与常规检索**（页面移入时从 index.md 删除该条目）
  - `index.md` 全库索引 / `shturl.md` 知识变更日志
- `SCHEMA.md` — 主规则文件（权威）
- `templates/` — 面向 Cursor/Claude-Code 等其它客户端的复制粘贴指令，OpenCode 会话直接按本文档 + SCHEMA.md 执行，不依赖模板文件

## 三大工作流（详见 SCHEMA.md 第三章）

- **Ingest**：素材准入判断（仅长期可复用知识才编译，碎片资讯只存 raw）→ 新增或联动更新 10~15 个相关页面 → 同步 index.md 与 shturl.md → 人工验收。
- **Query**：优先读 `wiki/index.md` 定位 → 只读 wiki/ 作答（非必要不读 raw）→ 结论先行、每观点标注来源 → 答案有长期复用价值时回写 `source_summary` 页面，`tags` 追加 `query_write`。
- **Lint**：按 P0/P1/P2 输出问题清单与统计，**只提建议，禁止自行修改 wiki 文件**，等待人类确认。

## 缺口回退与联网搜索约束

Query 时 wiki 未命中，按「L1 本地 wiki → L2 raw/本地项目信息 → L3 联网 → 兜底」逐层下探，命中即停、标注来源（wiki > raw > 项目路径 > 外链）：

1. **本地优先**：必须先检索本地 wiki；wiki 信息充足严禁联网。
2. **触发条件**：wiki 内容缺失 / 不足 / 过时，才允许联网。
3. **网页 = raw 素材**：联网获取的网页存入 `raw/articles/`（只增不改），**禁止直接写入 wiki、禁止粘贴摘要**。
4. **价值判定**：长期复用走 Ingest + 人工抽检验收入库；临时一次性查询仅对话输出，标注【来源：互联网搜索】，不入库。
5. **冲突**：网络/任何层内容与 wiki 已有结论语义冲突 → Agent 先自行调和（核对素材、附【当前采信结论】并告知用户）；无法调和才标 `⚠️观点冲突` 交人工裁决，不自动覆盖。
6. **兜底**：组合推理（标【推导】）→ 反问用户补料 → 登记缺口看板 `raw/_pending/`，素材到位后触发 Ingest。

## 元数据硬规则（不可违背）

每个 wiki 页面 Frontmatter：`type` / `source` / `description` / `created_at` / `updated_at` / `tags`。

- `type` 仅 5 种取值：concept / entity / overview / comparison / source_summary
- `source` 用 Obsidian 双链指向来源；`description` 必填 1-3 句（index.md 摘要直接复用，不重复撰写）
- `created_at` 首次创建后**永久不可改**；每次更新只刷新 `updated_at`，主旨变化时同步 description
- 时间格式统一 `YYYY-MM-DD hh:mm:ss`（24 小时制，例：`2026-09-05 14:30:00`）
- `tags` 统一小写蛇形命名，避免同义标签爆炸

## 链接与冲突

- 所有页面/概念引用一律 Obsidian 双链 `[[页面名]]`，**禁止裸链接**，链接附带一句关联说明。
- 信息冲突**禁止直接覆盖旧内容**：Agent 先自行调和——核对原始素材、区分「视角补充」与「语义矛盾」，可调和则合并更新并附【当前采信结论】告知用户；无法调和才标注 `⚠️观点冲突`，并列双方表述与依据，冲突页暂停自动更新，交人工裁决。
- 禁止编造；推断内容标【推导】并绑定 raw 来源。
- 新领域优先读 raw 原始素材学习，Wiki 用于复盘检索，不要无度生成页面。

## 配图规范（详见 SCHEMA.md 四章）

- 生成 Wiki 页面时**自行判断是否配图**：流程图/架构组织/机制/建设路线类必须配 1 张 Mermaid 图，纯表格对比、简单事实列举可不配。
- 工作流（ingest/lint/query）、[[三层架构]]、[[LLM-Wiki框架]]、[[防膨胀闸门]]、建设方案路线等必须配图；禁止 ASCII 字符画，一律 ` ```mermaid ` 绘制。

## 每次操作后必做

1. 更新 `wiki/index.md`
2. 追加 `wiki/shturl.md` 日志（仅记 Ingest / Query-WriteBack / Lint-Fix / Governance / Rule-Update 事件，时间格式同上）
3. 人工抽样验收，重点核查事实准确性与 created_at 是否被篡改

## Git 提交规范

`.git/hooks/commit-msg` 已在库中，强制校验，不合规会被拒绝：

- 格式 `type[(scope)]: 描述`，**必须单行、整行 ≤50 字符**
- 允许 type：CC 标准 `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert` + 领域 `ingest` `query` `lint` `governance` `rule`
- commit message **不写**页面清单与 shturl 引用，溯源统一查 shturl.md
- 远程仓库必须为**私有**，禁止公开个人知识库
