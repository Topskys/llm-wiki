# Index — Wiki全局索引

> 用途：供AI快速检索全库页面，每条附带一句话核心摘要。
> 维护规则：Ingest/回写后自动更新；摘要复用页面Frontmatter的description字段；_archive页面不纳入索引。

---

## entities 实体

- [[karpathy]]：LLM-Wiki 个人知识库框架的提出者，主张由 AI 承担知识编译劳动、人类聚焦思考与决策。目前素材仅一笔带过，背景信息待后续补充。
- [[LLM-Wiki框架]]：基于 Karpathy 思想、以 Obsidian + Git 落地的一套 AI 编译型个人知识库框架，核心是 raw 原始素材层、wiki 编译知识层、SCHEMA 规则契约层的三层架构。
- [[灵购AI]]：商城智能语音客服平台；商品知识库 + RTC 7×24 语音，CustomLLM 回调服务的 RAG 检索与微调模型流式推理，用户主负责项目。
- [[DataBus]]：全域 AI 业务数据中台；汇聚多源对话与商品文档，ETL 五层流水线产出 SFT 训练集与 RAG 知识库素材，并接收 Agent 数据回流。
- [[ModelForge-AI]]：电商自有化模型微调工厂；本地 QLoRA 验证 + 云端量产（SFT+DPO），搭建 Embedding 粗召回→Cross-Encoder 精排的三段式检索。
- [[LiveClip-AI]]：直播切片智能剪辑 Agent；FFmpeg.wasm 轻量压缩上传，PostgreSQL 自研任务队列调度 ASR+大模型识别高光片段，批量产出短视频。
- [[MultiVis-AI]]：图文视频一体化自媒体运营 Agent；LangGraph 三子图 + PostgreSQL Checkpointer 节点级故障自愈，SSE 流式输出 + 多模型路由降本。

## concepts 概念

- [[编译型知识库]]：将原始素材一次性预编译为原子化、可关联、可治理的知识网络，而非留存素材碎片的知识管理模式，是 LLM-Wiki 与普通 RAG 的核心分水岭。
- [[三层架构]]：Raw 原始素材层 / Wiki 知识编译层 / SCHEMA 规则契约层三层权责分离的架构，配套 index.md 索引与 shturl.md 变更日志两个 AI 元数据文件。
- [[ingest工作流]]：新素材摄入并联动编译整个 Wiki 知识网络的过程：准入判断、存 raw、AI 解析、联动更新 10-15 个页面、双链、冲突检测、同步索引日志、人工验收。
- [[query工作流]]：基于已编译 Wiki 进行问答并反向沉淀高质量答案的工作流：index 定位、读 Wiki 生成结论先行答案、有长期复用价值时以 source_summary + query_write 标签回写；wiki 未命中时按 L1 wiki → L2 raw/本地项目信息 → L3 联网 → 兜底逐层回退。
- [[lint工作流]]：对全库做定期质量体检的工作流：按 P0 阻断 / P1 重要 / P2 优化三级输出问题清单与统计，只提建议、禁止自行修改 Wiki 文件。
- [[元数据规范]]：Wiki 页面强制携带的 Frontmatter 字段规范：type / source / description / created_at / updated_at / tags，其中 created_at 创建后永久不可修改。
- [[结构化垃圾场]]：AI 知识库失败模式：批量生成大量精美页面但无人阅读、无人校验，最终沦为无价值、只增不剪的归档坟场；核心应对是严格准入、先学原文再用 Wiki、月度治理裁剪。
- [[防膨胀闸门]]：控制知识库膨胀的三道机制：素材准入（仅长期复用才 Ingest）、数量控制（单素材 10-15 页）、定期裁剪（闲置页面归档），配合归档隔离避免无限堆积。
- [[RAG检索优化五层]]：在线检索优化组合拳：HNSW 要快、Int8 要省、元数据要准、Top20 要控、Rerank 要精，标准口径 Top20→Top5，命中率 72%→89%。
- [[Hybrid混合检索]]：粗召回阶段稠密语义路 + 稀疏关键词路并行、dense_weight 融合分数；精排不复算向量，dense_weight 在线预设、离线评测调参。
- [[TTFT首字延迟优化]]：大模型首字延迟优化全景：RAG 压检索让 LLM 更早开跑、前缀缓存/KV Cache 减 prefill、prompt 精简、SSE 流式，首字 15s→2s。
- [[FEC与自适应JitterBuffer]]：RTC 音频传输层弱网优化：FEC 冗余抗丢包、自适应 Jitter Buffer 平滑抖动，与 RAG/TTFT 分属不同层级。
- [[微调与RAG分工]]：电商垂直场景模型策略：微调管「怎么说」（话术风格），RAG 管「知道什么」（实时业务知识），更新知识库不必重训模型。
- [[QLoRA与LoRA微调]]：参数高效微调：QLoRA 量化基座降显存单卡可训；本地验证（rank=64）+云端量产（rank=32）两阶段，SFT+DPO 盲评 2.1→4.3。
- [[LangGraph与Checkpointer工作流]]：LangGraph 子图编排 + PostgreSQL Checkpointer 节点级状态持久化，实现故障自愈与断点续跑，SSE 流式 + 多模型路由配套。

## overviews 总览

- [[LLM-Wiki个人知识库建设方案]]：LLM-Wiki 个人知识库建设方案全貌：痛点与目标、三层架构、三大工作流、治理体系、Git 管控、分阶段落地路径与避坑指南。

## comparisons 对比

- [[知识管理方式对比]]：传统个人笔记、普通 RAG、LLM-Wiki 三种知识管理方式横向对比：知识形态、检索方式、沉淀机制与治理能力差异。
- [[四大项目架构对比]]：DataBus/ModelForge/LiveClip/MultiVis 横向对比：核心问题、架构形态、状态存储、长任务处理、实时性、产出物与灵购 AI 协作关系。

## topics 主题页

- [[商城AI业务矩阵]]：大疆商城 AI 业务矩阵五大项目（DataBus/ModelForge/灵购AI/LiveClip/MultiVis）体系总览与数据闭环：数据底座 → 模型能力 → 多 Agent 应用 → 数据回流。

## conflicts 冲突记录

（暂无页面）

## summaries 素材摘要

- [[LLM-Wiki知识库方案·素材摘要]]：对 raw 素材《LLM-Wiki 知识库建设可行性方案》的要点摘录：方案完整覆盖架构设计、三大工作流、治理体系、Git 规范与落地路径，全库所有页面的共同出处。
- [[商城AI业务矩阵·素材摘要]]：对 raw 素材《贸易AI业务》（原：商城AI业务矩阵-面试整理）的要点摘录：五大项目体系、RAG 五层优化、TTFT、FEC/JitterBuffer、LoRA 微调、LangGraph 工作流等核心知识点索引。

---

> 提示：执行第一次Ingest后，本索引已自动填充（2026-09-05）。