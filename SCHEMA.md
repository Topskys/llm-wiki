# SCHEMA.md — LLM-Wiki 知识库完整主规则

> 主规则源文件。AGENTS.md会引用本文件；网页对话时直接复制全部内容给到大模型。
> 铁律：`raw/` 目录AI仅可读，禁止写入、修改任何原始素材。

---

## 一、Wiki页面元数据规范

每一篇Wiki页面头部必须携带Frontmatter：

```yaml
---
type: concept|entity|overview|comparison|source_summary
source: [[来源双链]]
description: "1-3句话简述本页面核心内容，用于索引预览、Agent快速理解页面主旨"
created_at: YYYY-MM-DD hh:mm:ss
updated_at: YYYY-MM-DD hh:mm:ss
tags: []
---
```

### 字段约束

| 字段 | 约束规则 |
|---|---|
| `type` | 限定5种类型：concept / entity / overview / comparison / source_summary |
| `source` | 使用Obsidian双链指向原始素材或来源页面，支持溯源 |
| `description` | 必填，1-3句话，`index.md`摘要直接复用此字段 |
| `created_at` | 页面首次创建时间，**后续任何更新永久不可修改** |
| `updated_at` | 每次Ingest、修正、回写均刷新为当前时间 |
| `tags` | 统一小写蛇形命名（如 `agent_memory`、`graph_rag`），避免同义标签爆炸 |

### 时间格式
- 统一使用 `YYYY-MM-DD hh:mm:ss`（24小时制）
- 示例：`2026-09-05 14:30:00`

### 检索提示
- 如需做时间范围筛选、按type分类统计，Obsidian需要安装Dataview插件，开启「Enable time in date parsing」，方可将created_at/updated_at识别为完整datetime对象，支持比较、排序。
- 无插件环境仅支持字符串文本检索，无法做时间区间运算。

---

## 二、目录权责定义

```
llm-wiki-vault/
├─ AGENTS.md             # Agent自动读取入口，引用SCHEMA.md
├─ SCHEMA.md             # 主规则文件（本文件）
├─ README.md             # 知识库说明文档
├─ .gitignore            # Git版本控制忽略配置
│
├─ raw/                  # 原始素材库（AI只读，永不修改）
│   ├─ articles/         # 网页、文章
│   ├─ papers/           # 论文、报告
│   └─ video_transcripts/ # 视频转录稿
│
└─ wiki/                 # AI编译知识库
   ├─ _archive/          # 归档目录，过时/低价值页面，不进索引
   ├─ entities/          # 实体类页面（人物、项目、组织）
   ├─ concepts/          # 概念类页面（技术、方法论、模型）
   ├─ overviews/         # 总览类页面（领域全景梳理）
   ├─ comparisons/       # 对比类页面（多主题横向对比）
   ├─ source_summaries/  # 素材摘要页（单份原始素材要点）
   ├─ index.md           # 全局索引页
   └─ shturl.md          # 知识库变更日志
```

### 各目录说明

1. **raw/**：人类维护，存放论文、网页剪藏、视频转录、摘录，保存来源链接，只增不改。
2. **wiki/entities/**：实体页面，人物、项目、组织、工具；type: `entity`
3. **wiki/concepts/**：概念、原理、方法论；type: `concept`
4. **wiki/overviews/**：领域总览综述；type: `overview`
5. **wiki/comparisons/**：对象横向对比；type: `comparison`
6. **wiki/source_summaries/**：单份原始素材摘要；type: `source_summary`
7. **wiki/_archive/**：归档目录，存放过时、低价值页面，**不纳入index索引，不参与常规Query检索**。
8. **wiki/index.md**：全库索引，每个页面附带一句话摘要（复用description字段），Ingest操作后更新。
9. **wiki/shturl.md**：知识库变更日志；字段：时间｜操作类型｜素材来源｜新增页面｜更新页面｜简要说明。

> `shturl` = Stuff Update Record Log，专门记录知识加工操作，区别于普通日志。如觉得难记，可重命名为 `wiki_change_log.md`，同步修改本文件所有引用。

---

## 三、三大工作流规范

### 3.1 Ingest 知识摄入

**定义**：新原始素材入库时，AI读取素材并更新整个Wiki网络的过程。

**执行步骤**：

1. **素材准入判断**：仅长期学习、反复复用的知识才执行Ingest；碎片化资讯只存入raw，不编译进Wiki。
2. **存入raw/**：将新素材存入`raw/`对应目录，保留完整来源信息（作者、发布时间、原文链接）。
3. **AI解析**：AI读取素材 + SCHEMA规则，提取核心实体、概念与观点。
4. **联动更新**：新增或联动更新10~15个相关Wiki页面，融入现有知识网络。
   - 新建页面：填写`created_at`、`updated_at`为本次完整时间，生成`description`。
   - 更新旧页面：**严禁修改created_at**，只更新`updated_at`；页面主旨变化时同步更新`description`。
5. **建立关联**：全部链接使用Obsidian双链`[[页面名]]`，链接附带关联说明，禁止裸链接。
6. **冲突检测**：遇到信息冲突禁止直接覆盖旧内容，标记 `⚠️观点冲突`，并列双方依据来源；冲突页面暂停自动更新，进入人工裁决队列，由人工在步骤8验收环节一并处理。
7. **同步元数据**：更新 `wiki/index.md`（摘要复用description），追加操作记录至 `wiki/shturl.md`。
8. **人工验收**：抽样校验事实准确性、元数据完整性、created_at未被篡改。不通过则修正SCHEMA规则后重新Ingest。

### 3.2 Query 查询问答

**定义**：基于已编译的Wiki知识库进行问答，高质量答案反哺知识库。

**执行步骤**：

1. **定位主题**：AI优先读取 `wiki/index.md`，通过description快速定位相关主题页面。
2. **读取内容**：读取对应Wiki页面内容，综合生成答案；非必要不读取raw原始素材。
3. **生成答案**：
   - 结论先行，每个观点标注对应`[[来源页面]]`。
   - 知识库无相关内容如实告知，禁止编造；推测内容标记【推导】并绑定来源。
   - 不同页面存在观点冲突时，分别列明双方表述与依据，不自行站队。
4. **延伸推荐**：回答末尾输出2-3个高度相关的延伸主题及对应Wiki链接。
5. **回写判断**：若回答具备长期复用价值，给出回写Wiki建议：页面名称、type、内容大纲。
6. **回写执行**：确认回写后，生成新Wiki页面，`type`统一标记为`source_summary`，`tags`追加`query_write`标签，设置`created_at`、`updated_at`为当前时间，生成description，同步更新index.md与shturl.md。月度治理时优先复核query_write类页面的内容质量。

### 3.3 Lint 巡检体检

**定义**：定期对全库做质量体检，排查问题并输出优化建议。

**检查清单**：

| 优先级 | 检查项 | 说明 |
|---|---|---|
| **P0 阻断级** | 事实错误 / 观点冲突未标记 | 必须优先处理 |
| **P0 阻断级** | 元数据严重缺失 | 缺少type/created_at/source任一字段 |
| **P0 阻断级** | created_at 被篡改 | 对比shturl日志校验，不一致立即修复 |
| **P0 阻断级** | source 断链 | source指向的页面已被删除或归档，溯源链路断裂 |
| **P1 重要级** | 孤儿页面 | 无入链、无出链，脱离知识网络 |
| **P1 重要级** | 断链 | 正文提及概念未创建对应Wiki页面 |
| **P1 重要级** | 时间格式错误 | 不符合YYYY-MM-DD hh:mm:ss |
| **P1 重要级** | description缺失 | 未填写description字段 |
| **P2 优化级** | 内容冗余 | 建议拆分或合并页面 |
| **P2 优化级** | description质量差 | 为空、仅复制标题、概括不准确 |
| **P2 优化级** | tags不规范 | 命名不统一、同义标签爆炸 |

**输出要求**：
- 按P0/P1/P2优先级输出问题清单：页面名、问题描述、修正建议。
- 输出巡检统计总览：总页面数、问题页面数、各类问题数量。
- **Lint只输出建议，不擅自修改Wiki文件**，修改交由人类确认。

**问题处置策略**：
1. **孤儿页面**：有用则补充入链融入网络；无用则移入`_archive`归档。
2. **断链概念**：重要则新建对应页面；不重要则改为普通文本。
3. **观点冲突**：核对原始素材，补充【当前采信结论】，保留双方历史表述。
4. **过时知识**：顶部标注`⚠️本内容已过时`，移入`_archive`，新建新版页面。
5. **低价值页面**：移入`_archive`，原始素材保留在raw，未来可重新编译。
6. **元数据缺陷**：补全字段，从shturl日志找回真实created_at，刷新updated_at。

---

## 四、Wiki页面正文模板

```markdown
---
type: concept
source: [[来源双链]]
description: "1-3句话简述页面核心内容"
created_at: 2026-09-05 14:30:00
updated_at: 2026-09-05 14:30:00
tags: []
---

# 页面标题

## 核心结论

## 要点拆解

## 相关页面
- [[xxx]]：说明关联原因

## 参考来源
```

---

## 五、index.md 维护规则

- `wiki/index.md`为全库索引，每一条条目的简短摘要优先读取对应Wiki页面Frontmatter内`description`字段，不重复撰写摘要。
- `_archive/`归档页面**绝不写入index**。
- 每次Ingest、Query回写后同步更新index.md。
- 页面移入`_archive`时，同步从index.md删除该条目。
- 如使用Dataview自动生成index：自动过滤`_archive`路径。
- 当活跃Wiki页面超过200页时，按`type`拆分为分域索引（如`index-concepts.md`、`index-entities.md`），根目录`index.md`仅保留分域入口与全库统计摘要，拆分在月度治理中评估执行，不自动触发。

---

## 六、shturl.md 日志规范

### 日志格式

```markdown
# shturl｜Wiki变更记录日志
> 记录每一次Ingest、Query回写、Lint修复操作

| 时间 | 操作类型 | 原始素材来源 | 新增页面 | 更新页面 | 简要说明 |
|------|----------|-------------|----------|----------|----------|
| 2026-09-05 14:30:00 | Ingest | [[raw/articles/xxx.md]] | 2 | 11 | 摄入XXX文章，更新相关概念页面 |
| 2026-09-05 15:00:00 | Query-WriteBack | 基于Wiki问答 | 1 | 0 | 回写对比页面 [[comparison-xxx]] |
| 2026-09-05 16:00:00 | Lint-Fix | 巡检处理 | 0 | 3 | 修复孤儿页面，修正元数据 |
```

### 规则
- 只记录Ingest / Query-WriteBack / Lint-Fix知识库变更事件；个人笔记、raw新增素材不写入。
- 日志单文件超过200条记录时按月份拆分，例如 `shturl-2026-09.md`，当前活跃文件仅保留最近一个月，历史月份置为只读。
- 时间格式与元数据一致：`YYYY-MM-DD hh:mm:ss`。

---

## 七、知识库治理规则

### 7.1 治理目标
1. wiki/只保留长期有复用价值的知识，低价值内容不进编译层。
2. 元数据完整率100%，时间格式统一，created_at零篡改，source指向有效页面。
3. 降低孤儿页面、断链占比，维持知识网络健康度。
4. 可控膨胀，定期裁剪归档，避免无限堆积。
5. 所有变更可追溯、可审计、可回滚。

### 7.2 日常即时治理（每次操作后）
1. 抽样校验AI输出事实准确性，有无编造内容。
2. 校验Frontmatter完整性，确认created_at未被覆盖。
3. 确认index.md与shturl.md同步更新。
4. 检查链接是否有上下文说明，禁止裸链接。

### 7.3 周期性治理机制

| 周期 | 任务 | 执行方式 |
|---|---|---|
| 每次操作后 | 即时抽检元数据、事实、索引与日志 | 人工 |
| 每周 | 全库Lint巡检，输出问题清单 | AI + 人工确认 |
| 每月 | 处理遗留问题、归档过时页面、标签规范化、裁剪低价值页面 | 人工 + Dataview |
| 每季度 | 规则迭代、知识库复盘、raw素材清理 | 人工 |

### 7.4 防膨胀三道闸门
1. **闸门1：素材准入**——仅长期学习、反复复用的知识才执行Ingest；碎片化资讯只存raw。
2. **闸门2：数量控制**——单份素材Ingest产出控制在10-15页，过度拆解则收紧规则。
3. **闸门3：定期裁剪**——月度治理将一年以上无引用、无访问的页面归档。

### 7.5 质量评估指标
通过Dataview定期统计：
- 活跃页面总数（排除归档）
- 孤儿页面占比
- 元数据完整率
- 断链数量
- 归档页面数量
- 月度变更次数

---

## 八、Git版本控制与Commit规范

### 8.1 版本管控价值
- 防护AI篡改元数据，可一键回退历史版本。
- 文件级变更记录，与shturl.md业务日志形成双重校验。
- 批量治理操作安全兜底，避免误删误改。
- 支持多端同步与备份，知识库可迁移。

### 8.2 Commit规范（Conventional Commits）

1. **格式**：`type[(scope)]: short description`
   - **scope可选**，简单提交可直接省略。
   - **单行不换行**，整行严格≤50字符，一句话概括变更。
2. **允许type**：Conventional Commits 标准类型 + 本库领域类型，两者都可通过 hook 校验
   - **CC 标准类型**：`feat` 新功能 / `fix` 缺陷修复 / `docs` 文档类改动 / `style` 格式与样式 / `refactor` 重构 / `perf` 性能优化 / `test` 测试 / `build` 构建 / `ci` 持续集成 / `chore` 杂项维护 / `revert` 回退
   - **本库领域类型**（CC 之外的自定义补充）：
     - `ingest`：Ingest摄入原始素材，生成更新wiki页面
     - `query`：Query问答结果回写wiki
     - `lint`：Lint巡检后的知识库修复
     - `governance`：知识库治理、归档、标签规整
     - `rule`：修改SCHEMA.md、AGENTS.md等规则
3. **scope（可选）**常用取值：`wiki`、`schema`、`archive`。
4. 页面清单、shturl引用**不写入commit message**，溯源查询统一依赖`shturl.md`。
5. 建议启用commit-msg hook强制校验格式与单行长度。
6. 远程仓库必须为**私有**，禁止公开本知识库。

### 8.3 标准示例

```
ingest: ingest agent permission related documents
lint: fix orphan pages and broken links
rule(schema): add description metadata field
governance: archive low-value knowledge pages
query: add GraphRAG vs LightRAG comparison
docs(readme): update wiki governance documentation
```

---

## 九、避坑原则（来自Karpathy LLM-Wiki视频）

1. **Wiki是编译复盘工具**：陌生领域优先阅读raw原始资料，不要直接靠Wiki做初次学习。原始素材有循序渐进的讲解逻辑，Wiki是原子化知识点，适合复习、复盘、检索。
2. **AI产出必须人工验收**：每次Ingest后抽样验收，发现错误立刻迭代更新本SCHEMA.md规则，而不是只改单页。如同请机器人替你健身，它每天跑跑步机，但你的身体不会变好。
3. **同时服务人和AI**：index、shturl、Frontmatter元数据本质上都是设计给AI读取的；未来越多日常维护操作会交给本地大模型低成本完成。设计内容时同时兼顾「人能不能读懂」和「AI能不能高效调用」。
4. **拒绝结构化垃圾场**：追求高质量小知识网络，而不是页面数量堆砌。不是所有raw素材都要执行Ingest，碎片化浏览资讯只存入raw，不盲目编译进Wiki。
5. **规则持续迭代**：每发现一次AI输出问题，就更新一次SCHEMA规则。规则迭代越精细，AI输出质量越贴合你的需求。

---

## 十、工具推荐

| 工具 | 用途 | 必要性 |
|---|---|---|
| Obsidian | 笔记载体，浏览Wiki、关系图谱、管理本地文件 | 必需 |
| Dataview插件 | 元数据检索、动态索引、质量统计报表 | 推荐 |
| Templater插件 | 自动生成页面模板、时间戳 | 推荐 |
| Obsidian Web Clipper | 一键保存网页素材到raw目录 | 可选 |
| Git | 版本管控、历史回退、多端同步 | 推荐 |
| Ollama + Obsidian Copilot | 本地大模型，全离线隐私优先 | 可选 |
| qmd / ripgrep | 规模化检索（页面超1000时考虑） | 可选 |
