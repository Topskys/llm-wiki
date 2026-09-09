# shturl｜Wiki变更记录日志

> 记录每一次 Ingest、Query回写、Lint修复操作。
> shturl = Stuff Update Record Log，专门记录知识加工事件。

| 时间 | 操作类型 | 原始素材来源 | 新增页面 | 更新页面 | 简要说明 |
|------|----------|-------------|----------|----------|----------|
| 2026-09-05 00:00:00 | Init | — | 0 | 0 | 初始化LLM-Wiki知识库，创建目录结构与规则文件 |
| 2026-09-05 12:37:30 | Ingest | [[raw/llm-wiki知识库方案.md]] | 13 | 0 | 首次Ingest，编译《LLM-Wiki知识库建设可行性方案》为13个Wiki页面（5类全覆盖），同步索引与双链网络 |
| 2026-09-06 00:37:31 | Rule-Update | 本轮规则修订 | 0 | 0 | raw权限改为AI只增不改；Query增补L1-L4四层回退；冲突处置改为Agent先调和告知用户、无法调和才交人工；新增3.4联网扩展与_raw/_pending缺口看板 |
| 2026-09-06 00:49:17 | Rule-Update | 规则措辞统一 | 0 | 4 | raw权限统一为「AI只读+只增不改」；冲突处置更新为「Agent先自行调和、无法调和才交人工」：SCHEMA 3.2、query工作流、ingest工作流、lint工作流、三层架构、LLM-Wiki框架、建设方案、两个模板 |
| 2026-09-06 00:55:05 | Governance | 配图治理 | 0 | 8 | 为8个页面补充Mermaid图：ingest/lint/query（流程总览）、三层架构、防膨胀闸门、LLM-Wiki框架、建设方案、编译型知识库，刷新updated_at |
| 2026-09-06 01:00:27 | Rule-Update | 新增配图规范 | 0 | 0 | SCHEMA四章增「配图规范（Mermaid）」：流程/架构/机制/路线类必须配图、自判断非表格类；AGENTS.md 同步重申 |
| 2026-09-08 22:34:02 | Rule-Update | 目录结构调整 | 0 | 4 | 对齐用户目录重构：wiki/source_summaries→summaries，新增topics（主题页）、conflicts（冲突记录），type扩为7种；raw新增notes（笔记）、web_clip（网页摘录）；同步SCHEMA/AGENTS/index/三层架构/LLM-Wiki框架/元数据规范/README/ingest、lint、wiki-note模板；获人类授权同步更新raw素材《llm-wiki知识库方案.md》目录树与type枚举 |

---

> 操作类型说明：
> - **Ingest**：新素材摄入编译
> - **Query-WriteBack**：问答结果回写Wiki
> - **Lint-Fix**：巡检问题修复
> - **Governance**：月度治理（归档、标签规整等）
> - **Rule-Update**：规则文件更新
