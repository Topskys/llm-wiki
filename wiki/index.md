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
- [[Embedding向量嵌入]]：把非结构化数据（文本/图片/音频/视频）经模型转成固定长度浮点数数组（768/1536维），语义相近的内容在向量空间里距离更近，检索用余弦/欧氏相似度。
- [[向量数据库]]：向量 Embedding + 元数据的存储检索平台（Chroma/Milvus/Qdrant/Pinecone），用 HNSW/IVF/FAISS 等 ANN 索引做近似相似度检索，适合 RAG/图文检索/推荐；不擅长事务与多表 join。
- [[ANN近似最近邻搜索]]：向量库加速的底层机制：不扫全量、索引剪枝只搜小部分候选，牺牲一点召回率换毫秒级查询；HNSW/IVF/PQ 是其实现。
- [[HNSW图索引]]：层次化导航小世界 ANN 索引：多层跳表+图结构，高层稀疏点粗略导航、底层存全部向量，Milvus/Qdrant/Chroma 常用。
- [[IVF倒排索引]]：先聚类分桶再局部搜索的 ANN 索引：查询只算最近的少数桶（1000万→3万条），加速明显但可能漏检跨桶最相似向量。
- [[PQ乘积量化]]：把高维向量压缩成短编码省内存减 IO、距离计算变查表，代价是损失精度，与 ANN 的 trade-off 同向。
- [[向量搜索加速]]：向量搜索快的四个关键：ANN 剪枝（最大加速源）、向量量化、内存优先、SIMD 批量浮点运算；速度↔召回率是核心权衡。
- [[TTFT首字延迟优化]]：大模型首字延迟优化全景：RAG 压检索让 LLM 更早开跑、前缀缓存/KV Cache 减 prefill、prompt 精简、SSE 流式，首字 15s→2s。
- [[FEC与自适应JitterBuffer]]：RTC 音频传输层弱网优化：FEC 冗余抗丢包、自适应 Jitter Buffer 平滑抖动，与 RAG/TTFT 分属不同层级。
- [[微调与RAG分工]]：电商垂直场景模型策略：微调管「怎么说」（话术风格），RAG 管「知道什么」（实时业务知识），更新知识库不必重训模型。
- [[QLoRA与LoRA微调]]：参数高效微调：QLoRA 量化基座降显存单卡可训；本地验证（rank=64）+云端量产（rank=32）两阶段，SFT+DPO 盲评 2.1→4.3。
- [[LangGraph与Checkpointer工作流]]：LangGraph 子图编排 + PostgreSQL Checkpointer 节点级状态持久化，实现故障自愈与断点续跑，SSE 流式 + 多模型路由配套。
- [[committed-artifact]]：AI-native SDLC 的核心机制：每个阶段结束时向版本库提交一个 artifact（intent.md/spec.md/plan.md/diff+tests/PR+findings/incident），下一阶段从读它开始，commit 链同时充当审计轨迹。
- [[CLAUDE记忆文件]]：仓库根目录的 agent 记忆文件：给出新加入者需要的一切（命令/约定/架构/易错点），agent 每次会话开始即读取，全团队共享一份并随错误迭代。
- [[Skills技能]]：组织把制度知识可操作化的机制：显式、版本化、广泛适用、中心化更新的指令包，按需自动触发；是建议性控制，政策必须必然成立时需 hooks 兜底。
- [[Hooks护栏与审批门]]：agent 动作前的确定性控制层：build 阶段做护栏（保护路径/格式化/防密钥泄露）、deploy 阶段做强制的审批门（allow/ask/block），非不可商量的 hook 可被工程师关闭。
- [[plan模式]]：Claude Code plan mode 作为实现阶段的默认入口：给 agent 批准过的 spec.md，让其先产出可审查的实现计划（plan.md），人在计划层把关后再进入实现，实现偏离计划时同步更新。
- [[并行会话与子代理]]：一个工程师驱动多条并行工作流：parallel session（git worktree 隔离、互不可见、人负责 steering）+ subagent（会话内作用域助手、独立上下文），控制来自仓库配置，输出归属到发起人。
- [[Agent反馈闭环]]：给 agent 一个验证自己工作的机制：量化验收目标 + 反馈通道（测试/build/截图 diff），可先写失败测试再用 hook 保护它；与 verifier 子代理的区别在于它贯穿整个任务、在工程师看到前自修错误。
- [[持续评估]]：CI 中的持续评估：把近期真实任务固化为 eval 套件，在 CLAUDE.md/skills/hooks 等 agent 配置变更时自动回归，防止换模型/改提示词降低完成质量；生产事故也沉淀为回归 eval。
- [[AI代码评审]]：AI 双端参与 PR 评审：对入站 PR 按 REVIEW.md 分 pass 审查（bugs/security/compliance）、对自家 PR 响应 @claude 评审意见并推送修复；findings 不自动放行/拦截，approval 仅来自人类 branch protection。
- [[监控闭环]]：让 SDLC 闭环自主运转：确定性脚本监控生产指标控制带（1σ 记日志/2σ 只读诊断/3σ 提议修复），带置信门控触发 agent 写 intent.md 走正常管道；Claude Tag 把一线 on-call 纳入频道内闭环。
- [[阴阳燮理]]：三十六计的哲学根基：事物对立统一、相反相成的规律，是全部三十六计运筹的理论基础——计谋成败取决于能否正确把握阴阳变化规律。
- [[走为上]]：三十六计最后一计：敌我力量悬殊时有计划的主动撤退，保全实力、以退为进，出《南齐书·王敬则传》『走为上计』，重在保存火种而非消极逃跑。
- [[双层网关架构]]：Nginx+AI业务网关双层流量治理架构：边缘层管连接/安全/并发粗粒度，AI 网关层管鉴权/令牌桶/熔断/动态路由细粒度调度，职责分离解决 RPM+TPM 双配额调度难题。
- [[RPM与TPM联合令牌桶]]：RPM+TPM 联合配额两级令牌桶：本地桶接口/用户级快速预拦截、Redis 分布式桶全局权威防多实例超发，预扣预估 Token+响应后按请求ID退款的令牌生命周期管理。
- [[熔断器状态机]]：网关熔断器状态机：Closed/Open/Half-Open 三态，仅由 5xx 错误率驱动（429 走配额通道），SSE 以请求发起时刻计入滑动窗口，配半开探测与灰度回切闭环。
- [[429流量治理]]：429 流量治理：解析区分短时 RPM 超限/TPM 耗尽/月度配额用尽三类，前两者走配额感知切换（换同模型Key或降级）、月度用尽标记长期失效不重试再切，配滑动窗口计数防惊群。
- [[能力标签驱动降级]]：异构模型降级：能力标签体系驱动候选筛选，硬性标签（多模态/Function Call/上下文长度）必须满足、软性标签（速度/成本/质量）可放宽，allow_fallback 开关防 Agent 场景误降级。
- [[灰度回切]]：熔断/降级后的恢复路径：半开探针连续成功判定节点恢复后，不一次性全量切回，采用渐进式灰度放量（逐步提升回切流量比例）持续观测 429 与错误率，防瞬间流量冲击再触发限流。
- [[SSE流式容错]]：SSE 流式响应差异化容错：已开始输出即直接中断不重试不切节点，防止拼接内容语义断层；长流以发起时刻计入熔断统计；对流式请求的预扣 Token 按流结束真实 usage 结算。
- [[背压透传]]：不打破 TCP 背压，让其透传：下游写不进去时暂停读上游，上游 TCP 窗口自然收缩、网关自然减速，同步转发是最稳做法。
- [[SSE有界队列]]：SSE 每连接独立有界队列：满则暂停读上游/降速/丢弃，杜绝无界缓冲与全局共享；队列水位 Q(t) 为上下游速率积分差，在 Qmax 处反向切断上游供给。
- [[慢消费者处置]]：监控每连接缓冲区水位、排空速率与连续写阻塞时长，越过阈值主动断开；配合断线续传把"内存里扛住慢消费者"转化为"随时安全断开"。
- [[断线续传]]：SSE 断线后增量落盘 Redis/DB，客户端带 Last-Event-ID/offset 从断点续传，是敢激进断开慢连接的前提保障。
- [[入口网关水位熔断]]：关闭代理层 buffer（proxy_buffering off + X-Accel-Buffering: no）、全局面水位熔断（70% 熔断新请求/85% 踢最慢）与 load shedding、cgroup 隔离、SSE 网关与 LLM 推理集群拆分。
- [[Node.js stream背压]]：Node.js SSE 背压实现：res.write 返回 false 时 pause 上游、drain 后 resume；pipe() 内建 highWaterMark 自动背压；15s stall 检测主动中断。
- [[Python异步背压]]：Python SSE 背压实现：aiohttp bytearray 缓冲 + asyncio.Event 水位同步；FastAPI StreamingResponse 生成器串行拉取天然背压，严禁攒 list 再返回。
- [[重试预算与幂等保护]]：网关重试约束体系：全请求级重试预算（外部重试≤3次、换节点≤2次）防循环放大；非幂等接口禁重试、长上下文低重试快失败、Retry-After 严格等待与指数退避+抖动防惊群，月配额耗尽零重试。
- [[MCP网关]]：AI 业务网关的 MCP 落地形态：MCP服务端解析 JSON-RPC、路由模块统一编排 RAG/Tool/Memory 等能力模块，模型推理请求下沉 LLM 调用子模块（RPM/TPM 令牌桶→熔断→路由降级）再达上游供应商。
- [[上下文污染]]：多Agent系统中N个Agent竞争编排器上下文窗口时，任务状态相互污染导致决策质量下降的问题，及RCR-Router/DACS/Agent-Radar等解决方案。
- [[Agent状态一致性]]：多Agent并发操作共享状态时的一致性保障：写时冲突检测（STORM）、事务补偿（SagaLLM）、Schema验证（PatchBoard）、自动读集重建（S-Bus）四种方案。
- [[Agent异常处理与循环检测]]：多Agent系统异常处理：阶段感知分类（SHIELDA）、图引导修复（AgentTether）、静态循环检测（IAL-Scan）、自愈编排器方案。
- [[自注意力机制]]：Transformer 最核心的建模原语：Q/K/V 投影 + 点积相似度 + softmax 加权，让每个 token 与全部 token 建立关联，复杂度 O(N²·d)，完全并行替代 RNN 串行循环。
- [[多头注意力]]：把注意力拆成 8 个 head 并行，各 head 学习语法/指代/局部模式等不同依赖；衍生 MQA/GQA（LLaMA）/MLA（DeepSeek）/Flash Attention 等高效变体。
- [[位置编码]]：向排列不变的自注意力注入序列顺序，正弦/余弦固定函数可外推长序列；后续演进出 RoPE（LLaMA/Qwen）、ALiBi 等相对位置编码。
- [[Transformer编码器结构]]：双向多头自注意力 + FFN 两个子模块，残差+LayerNorm；Pre-LN/Post-LN 影响训练稳定性，BERT 类模型的骨干。
- [[Transformer解码器结构]]：掩码自注意力 + 交叉注意力（Q=解码器/K/V=编码器）+ FFN 三子模块；GPT 类裁剪交叉注意力只留掩码自注意力 + FFN。
- [[残差连接与层归一化]]：子层输入直接加到输出的跳连 + 层归一化，缓解深层梯度消失、稳定训练，是 Transformer 可堆叠数十层的保障。
- [[SKILL.md规范]]：渐进式披露架构：启动只加载 YAML frontmatter 元数据（~100 tokens），命中触发才读 body；token 节省率达 98%，含标准目录结构与 11 大编写模块。
- [[Skill架构模式]]：Skill 设计模式 P1-P7 七层（手动触发→元技能，按自主程度递增）+ 5 核心 5 支撑十架构模式，配模式选择决策矩阵。
- [[Skill质量治理]]：六维 100 分评审（SOP 25/意图 20/输出 20/安全 15/性能 10/可维护 10）、Smells 三级反面模式与定义-评审-度量-改进治理闭环。
- [[Function Calling三阶段模型]]：LLM 工具调用三阶段：Pre-call 意图识别与参数生成 → On-call 函数执行与结果回注 → Post-call 结果解析与后续推理；受控间接执行、语义路由与物理执行分离。
- [[Function Tool设计规范]]：原子 Tool 设计四铁律：单一职责 / Pydantic 入参校验（自动 JSON Schema）/ 统一 success+data+msg 返回 / 面向 LLM 的 description 工程。
- [[MCP协议架构]]：MCP（Model Context Protocol）Client-Host-Server 三层 + JSON-RPC 2.0；能力协商、tools/list 自动发现、tools/call 执行，传输层 stdio→SSE→Streamable HTTP 演进。
- [[结构化输出与Tool抑制]]：strict JSON Schema / CFG 约束解码保证输出合规，但与 tool_call 约束解码空间冲突会压制工具调用（Tool Suppression），两阶段解耦与约束路由可缓解。
- [[ToolRegistry跨框架互操作]]：所有 tool call 本质是 RPC；协议无关工具管理库用 Adapter 统一适配 OpenAI/Anthropic/Google/MCP，工具一次实现处处复用。

## overviews 总览

- [[LLM-Wiki个人知识库建设方案]]：LLM-Wiki 个人知识库建设方案全貌：痛点与目标、三层架构、三大工作流、治理体系、Git 管控、分阶段落地路径与避坑指南。
- [[AI-native-SDLC]]：AI-native SDLC（AI 原生软件开发生命周期）总览：代码不再是瓶颈，六阶段从线性流程重构为带承交付物与自动触发的循环流程，覆盖 Plan/Design/Build/Test/Deploy/Maintain 六阶段的 plays、控制原语与治理原则。
- [[三十六计全库总览]]：中国传统兵书《三十六计》全库总览：以阴阳燮理为哲学根基、数中有术的谋略观，按六六三十六排布为胜战/敌战/攻战/混战/并战/败战六套体系，每套六计的完整地图。
- [[LLM网关动态路由与流量治理总览]]：LLM 网关动态路由与流量治理全景：Nginx+AI业务网关双层架构、RPM/TPM 联合令牌桶、5xx 熔断与 429 配额感知双通道分离调度、能力标签驱动降级与灰度回切，解决上游 429 限流与业务连续性问题。
- [[SSE背压与内存治理总览]]：SSE 上游大模型快、下游 C 端慢时的 OOM 分层治理框架：背压透传、每连接有界队列、慢消费者主动断开、断线续传、入口网关水位熔断五层纵深防御，综合豆包/DeepSeek/ChatGLM 三家交叉验证。
- [[向量Embedding与向量数据库总览]]：Embedding 与向量数据库全景：把非结构化内容翻译成向量空间坐标、以 ANN 近似检索替代暴力扫描，覆盖 Embedding 定义、向量库 vs 传统库、IVF/HNSW/PQ 三大加速机制与检索权衡。
- [[多Agent上下文管理总览]]：多Agent系统上下文管理全景：上下文路由（RCR-Router/DACS/Agent-Radar）、状态一致性（STORM/SagaLLM/PatchBoard）、异常处理与循环检测（SHIELDA/AgentTether/IAL-Scan）三大核心问题的主流方案与架构演进。
- [[Transformer总览]]：Transformer 架构全景：自注意力替代循环、Encoder/Decoder 两大块、位置编码/多头注意力/残差+归一化核心机制，是 GPT/BERT/LLaMA 及 RAG 技术的架构基石。
- [[Skill工程化总览]]：AI Agent Skill 工程化全景：Tool/Skill/MCP 三层抽象、SKILL.md 渐进式披露、P1-P7 架构模式与六维质量治理，Agent 从"即兴调用"走向"可复用流程编排"。

## comparisons 对比

- [[知识管理方式对比]]：传统个人笔记、普通 RAG、LLM-Wiki 三种知识管理方式横向对比：知识形态、检索方式、沉淀机制与治理能力差异。
- [[四大项目架构对比]]：DataBus/ModelForge/LiveClip/MultiVis 横向对比：核心问题、架构形态、状态存储、长任务处理、实时性、产出物与灵购 AI 协作关系。
- [[传统SDLC与AI-native-SDLC对比]]：传统 SDLC 与 AI-native SDLC 横向对比：阶段形态（线性 vs 循环）、瓶颈位置、阶段产物（文档/门票 vs committed artifact）、控制主体（人类逐项 vs agent 产出+人类 gate）、治理与审计方式差异。
- [[三十六计六套体系对比]]：三十六计六套体系横向对比：胜战/敌战/攻战/混战/并战/败战六套计在适用态势、策略主轴、核心机制与代表计上的差异，一张表看清全书结构。
- [[主流LLM网关方案对比]]：主流 LLM 网关方案横向对比：LiteLLM/Portkey/APISIX-AI/FrugalGPT 与本文双层网关在 RPM+TPM 联合配额、SSE 容错、能力标签降级、熔断灰度闭环上的能力差异。
- [[SSE背压方案三源对比]]：豆包/DeepSeek/ChatGLM 三家对 SSE 下游慢导致 OOM 问题的方案交叉对比：在背压透传、有界队列、慢连接主动处置上结论一致，分歧仅在落盘续传优先级与部署层细节补充。
- [[向量数据库与传统数据库对比]]：传统数据库（MySQL/PostgreSQL/MongoDB）与向量数据库（Chroma/Milvus/Qdrant/Pinecone）横向对比：精确匹配 vs ANN 近似检索、B树/哈希/倒排 vs HNSW/IVF/FAISS、适用场景与各自短板。
- [[Transformer与RNN对比]]：Transformer 与 RNN/LSTM 横向对比：并行 vs 串行、O(N²) vs O(N)、长距离依赖能力与位置/归纳偏置差异；RNN/LSTM 无统计长记忆、SSM/Transformer 注意力不受指数衰减约束。
- [[Function Tool与MCP Tool对比]]：Function Tool 与 MCP Tool 横向对比：进程内嵌 vs 独立 Server、单框架绑定 vs 跨框架复用、手动注册 vs 自动发现（tools/list）；按复用范围与生产化程度选型。

## topics 主题页

- [[商城AI业务矩阵]]：大疆商城 AI 业务矩阵五大项目（DataBus/ModelForge/灵购AI/LiveClip/MultiVis）体系总览与数据闭环：数据底座 → 模型能力 → 多 Agent 应用 → 数据回流。
- [[胜战计]]：三十六计第一套（1-6）：瞒天过海/围魏救赵/借刀杀人/以逸待劳/趁火打劫/声东击西，适用于己方处优势时主动进攻取胜。
- [[敌战计]]：三十六计第二套（7-12）：无中生有/暗度陈仓/隔岸观火/笑里藏刀/李代桃僵/顺手牵羊，适用于敌我相当、临阵交锋时以虚实互变化被动为主动。
- [[攻战计]]：三十六计第三套（13-18）：打草惊蛇/借尸还魂/调虎离山/欲擒故纵/抛砖引玉/擒贼擒王，适用于主动进攻、攻坚破敌局面。
- [[混战计]]：三十六计第四套（19-24）：釜底抽薪/浑水摸鱼/金蝉脱壳/关门捉贼/远交近攻/假道伐虢，适用于局势混乱、多方并起时乘乱取利。
- [[并战计]]：三十六计第五套（25-30）：偷梁换柱/指桑骂槐/假痴不癫/上屋抽梯/树上开花/反客为主，适用于与友军并战、借势扩张时兼并壮大。
- [[败战计]]：三十六计第六套（31-36）：美人计/空城计/反间计/苦肉计/连环计/走为上，适用于己方劣势、败局求存时攻心破敌。

## conflicts 冲突记录

（暂无页面）

## summaries 素材摘要

- [[LLM-Wiki知识库方案·素材摘要]]：对 raw 素材《LLM-Wiki 知识库建设可行性方案》的要点摘录：方案完整覆盖架构设计、三大工作流、治理体系、Git 规范与落地路径，全库所有页面的共同出处。
- [[商城AI业务矩阵·素材摘要]]：对 raw 素材《贸易AI业务》（原：商城AI业务矩阵-面试整理）的要点摘录：五大项目体系、RAG 五层优化、TTFT、FEC/JitterBuffer、LoRA 微调、LangGraph 工作流等核心知识点索引。
- [[AI-native-SDLC·素材摘要]]：对 raw 素材《The AI-Native SDLC playbook》（Anthropic Applied AI，2026-08-21）的要点摘录：六阶段 plays、承交付物链、CLAUDE.md/Skills/Hooks 控制原语、AI 评审、CI evals、监控闭环与治理原则索引。
- [[三十六计·素材摘要]]：对 raw 素材《三十六计》（5000言国学站已校订版，37篇：总说+36计）的要点摘录：哲学基础（阴阳燮理）、六六三十六结构、六套体系划分、每计核心机制索引与『走为上』的全局地位。
- [[动态路由与流量治理·素材摘要]]：对 raw 论文《面向大模型服务的动态路由与流量治理架构研究》的要点摘录：Nginx+AI网关双层架构、RPM/TPM两级令牌桶、5xx熔断与429配额双通道、能力标签降级、灰度回切、SSE/幂等/长上下文容错、重试预算与可观测设计。
- [[SSE背压与内存治理·素材摘要]]：对 raw 论文《面向SSE流式转发的背压与内存治理研究》的要点摘录：SSE 上游快下游慢导致 OOM 问题的五层纵深治理框架、三家 AI 方案交叉验证结论、Node.js 与 Python 实现范式。
- [[向量Embedding与向量数据库·素材摘要]]：对 raw 素材《向量(Embedding)与向量数据库介绍》（豆包会话）的要点摘录：Embedding 定义、向量库 vs 传统库、ANN/HNSW/IVF/PQ 索引机制、向量搜索加速的四个关键与速度召回率权衡。
- [[多Agent上下文管理·素材摘要]]：对 raw 素材《多Agent模式下的上下文管理机制研究综述》（26篇论文联网整理）的要点摘录：上下文路由/状态一致性/异常处理三大问题的主流方案索引。
- [[Transformer原理·素材摘要]]：对 raw 素材《Transformer 原理》（豆包会话 + 公开学术资料）的要点摘录：核心思想、整体结构、位置编码/多头注意力/Encoder-Decoder/残差归一化、Transformer vs RNN 实证对比与架构演进路线。
- [[AI-Agent-Skill工程化·素材摘要]]：对 raw 论文《AI Agent Skill 工程化》的要点摘录：渐进式披露规范、P1-P7 + 十架构模式、六维评审与治理闭环、Skill-MCP 互补关系及五项铁律。
- [[Function-Calling与MCP-Tool设计·素材摘要]]：对 raw 论文《LLM Function Calling 与 MCP Tool 设计》的要点摘录：三阶段调用模型、Function Tool 四铁律、MCP Client-Host-Server 架构、Tool Suppression 与 ToolRegistry 跨框架互操作。

---

> 提示：执行第一次Ingest后，本索引已自动填充（2026-09-05）。