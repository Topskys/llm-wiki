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
| 2026-09-11 23:41:15 | Ingest | [[raw/notes/贸易AI业务.md]] | 15 | 0 | 编译《贸易AI业务》（原：商城AI业务矩阵-面试整理，3013行面试整理）为15页全类型：topics 1（商城AI业务矩阵）、entities 5（灵购AI/DataBus/ModelForge-AI/LiveClip-AI/MultiVis-AI）、concepts 7（RAG五层/Hybrid/TTFT/FEC/微调vsRAG/QLoRA-LoRA/LangGraph）、comparisons 1、summaries 1；素材文件经用户授权改名，全库 source 与链接同步更新 |
| 2026-09-12 23:03:13 | Ingest | [[raw/papers/The AI-Native SDLC playbook.md]] | 13 | 0 | 编译《The AI-Native SDLC playbook》（Anthropic Applied AI，2026-08-21）为13页：overviews 1（AI-native-SDLC）、concepts 10（committed-artifact/CLAUDE记忆文件/Skills技能/Hooks护栏与审批门/plan模式/并行会话与子代理/Agent反馈闭环/持续评估/AI代码评审/监控闭环）、comparisons 1（传统SDLC与AI-native-SDLC对比）、summaries 1（AI-native-SDLC·素材摘要） |
| 2026-09-13 18:55:11 | Ingest | [[raw/books/三十六计/000-总说·三十六计.md]] | 12 | 0 | 编译《三十六计》（5000言站已校订版，总说+36计共37篇落盘raw/books/三十六计/）为12页：overviews 1（三十六计全库总览）、concepts 2（阴阳燮理/走为上）、topics 6（胜战/敌战/攻战/混战/并战/败战计）、comparisons 1（六套体系对比）、summaries 1（素材摘要）；2张Mermaid图校验通过；index与shturl同步 |
| 2026-09-13 22:31:33 | Ingest | [[raw/papers/面向大模型服务的动态路由与流量治理架构研究.md]] | 11 | 2 | 编译《面向大模型服务的动态路由与流量治理架构研究》为11页：overviews 1（LLM网关动态路由与流量治理总览）、concepts 8（双层网关架构/RPM与TPM联合令牌桶/熔断器状态机/429流量治理/能力标签驱动降级/灰度回切/SSE流式容错/重试预算与幂等保护）、comparisons 1（主流LLM网关方案对比）、summaries 1（素材摘要）；9张Mermaid图校验通过；联动更新 MultiVis-AI、TTFT首字延迟优化（仅刷新updated_at+新增关联链接） |
| 2026-09-14 23:20:00 | Ingest | [[raw/papers/面向SSE流式转发的背压与内存治理研究.md]] | 10 | 1 | 编译《面向SSE流式转发的背压与内存治理研究》为10页：overviews 1（SSE背压与内存治理总览）、concepts 7（背压透传/SSE有界队列/慢消费者处置/断线续传/入口网关水位熔断/Node.js stream背压/Python异步背压）、comparisons 1（SSE背压方案三源对比）、summaries 1（素材摘要）；5张Mermaid图校验通过；联动更新 SSE流式容错（补交叉链接，刷新updated_at） |
| 2026-09-16 08:30:12 | Ingest | [[raw/articles/doubao-向量Embedding与向量数据库介绍.md]] | 10 | 2 | 编译《向量(Embedding)与向量数据库介绍》（豆包会话，Playwright提取）为10页：overviews 1（向量Embedding与向量数据库总览）、concepts 7（Embedding向量嵌入/向量数据库/ANN近似最近邻搜索/HNSW图索引/IVF倒排索引/PQ乘积量化/向量搜索加速）、comparisons 1（向量数据库与传统数据库对比）、summaries 1（素材摘要）；1张Mermaid图校验通过；联动更新 RAG检索优化五层、Hybrid混合检索（补交叉链接，刷新updated_at） |

---

> 操作类型说明：
> - **Ingest**：新素材摄入编译
> - **Query-WriteBack**：问答结果回写Wiki
> - **Lint-Fix**：巡检问题修复
> - **Governance**：月度治理（归档、标签规整等）
> - **Rule-Update**：规则文件更新
