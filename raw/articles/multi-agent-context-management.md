# 多Agent模式下的上下文管理机制研究综述

> 来源：联网搜索 + 论文整理
> 日期：2026-09-16
> 问题：多Agent模式下上下文是怎么做的？
opencode -s ses_f837fda9effe6keZj0zHaJ7WHv
---

## 1. 核心挑战

多Agent系统中，上下文管理面临五个关键瓶颈：

### 1.1 上下文窗口限制
大多数LLM具有固定大小的上下文窗口，限制了任意时刻可处理的信息量。即使模型支持百万级token窗口，长对话中信息检索准确度仍会显著下降（"Lost in the Middle"现象）。

### 1.2 上下文污染（Context Pollution）
当N个并发Agent竞争编排器（Orchestrator）的上下文窗口时，每个Agent的任务状态、部分输出和待决问题会相互污染，导致决策质量下降。DACS论文指出：在flat-context编排器中，Agent $a_i$ 请求决策时，编排器上下文同时持有 $a_j$ 的transformer注意力调查和 $a_k$ 的CSV编码问题。

### 1.3 上下文爆炸（Context Explosion）
根Agent将完整历史传递给子Agent，子Agent再继续传递，导致token数量指数级增长，子Agent被无关对话历史淹没。

### 1.4 上下文碎片化
上下文信息分布在多个Agent中，没有单一Agent拥有完整视图，导致理解不一致和决策偏差。

### 1.5 上下文过时
在动态环境中，上下文信息可能迅速过时，需要机制判断哪些上下文仍有效、哪些应更新或丢弃。

---

## 2. 框架示例：Google ADK的四层架构

Google ADK（Agent Development Kit）是上述挑战的一个工业级实现范例，其核心设计思想是将上下文分为四层，实现存储与呈现分离：

| 层级 | 说明 | 生命周期 |
|------|------|----------|
| **Working Context** | 当前模型调用的即时prompt：系统指令、Agent身份、选定历史、工具输出、可选记忆结果 | 临时（调用后丢弃） |
| **Session** | 交互的持久日志：每条用户消息、Agent回复、工具调用、控制信号、错误 | 持久 |
| **Memory** | 跨Session的长期可搜索知识：用户偏好、历史对话 | 持久 |
| **Artifacts** | 与Session或用户关联的大文件（文件、日志、图片），按名称和版本寻址 | 持久 |

**关键设计原则**：
- **存储与呈现分离**：Session（存储）vs Working Context（视图），可独立演进
- **显式转换**：上下文通过命名的、有序的处理器（Processor）构建，而非临时字符串拼接
- **默认最小化**：每个模型调用和子Agent只看到所需的最小上下文，Agent必须通过工具显式获取更多信息

**Contents处理器**（核心编译器）执行三个关键步骤：
1. **选择（Selection）**：过滤事件流，丢弃无关事件和框架噪音
2. **转换（Transformation）**：将事件扁平化为带正确角色（user/assistant/tool）的Content对象
3. **注入（Injection）**：将格式化历史写入`llm_request.contents`

ADK还实现了**上下文压缩（Compaction）**：当调用次数达到阈值时，用LLM对旧事件进行摘要，写回Session，从而裁剪原始事件。

---

## 3. 上下文路由策略

从简单的静态分配到动态感知，上下文路由策略经历了三代演进：

### 3.1 静态路由（Static Routing）
为每个Agent分配固定输入集（基于预定义模板）。简单但缺乏适应性。

### 3.2 全上下文路由（Full-Context Routing）
向每个Agent提供完整记忆或交互历史。实现简单但token消耗过大，且引入无关信息。

### 3.3 角色感知上下文路由（RCR-Router）

**论文**：RCR-Router: Efficient Role-Aware Context Routing for Multi-Agent LLM Systems with Structured Memory

**核心思想**：每个Agent $A_i$ 根据其角色 $R_i$ 和当前任务阶段 $S_t$，从共享记忆 $M_t$ 中动态选择语义相关的子集 $C_t^i$。

**路由策略**：
$$\pi_{\text{route}}(C_t^i | M_t, R_i, S_t, B_i)$$

其中 $B_i$ 是分配给Agent的token预算。

**三个模块**：
- **Token Budget Allocator**：分配token预算
- **Importance Scorer**：计算重要性分数 $\alpha(m; R_i, S_t)$
- **Semantic Filter**：按分数排序，累积token直到预算用尽

**优势**：每个Agent获得最优信息量和简洁上下文的平衡，支持多轮推理的自适应上下文精炼。

### 3.4 门控记忆路由（Gated-Memory Routing）

**论文**：Learning What to Retain: Gated-Memory Routing for Efficient Collaboration in Multi-Agent LLM Systems

**核心思想**：条件化每个决策于查询和学习的执行记忆。与RCR-Router不同，本方法引入可学习的门控机制。

**两个门控**：
- **Memory Write Gate**：仅提交非冗余推理步骤到共享记忆
- **Retrieval Gate**：为每个Agent提供紧凑、相关的记忆子集

**效果**：在5个推理和代码生成基准上，平均准确率超过最强基线2.44分，同时将HumanEval推理成本降低31.9%。

---

## 4. 上下文隔离与注意力控制

### 4.1 动态注意力上下文隔离（DACS）

**论文**：Dynamic Attentional Context Scoping (DACS)

**核心问题**：多Agent并发时的上下文污染（对应挑战1.2）。

**两种非对称模式**：

| 模式 | 编排器持有的内容 | 用途 |
|------|-----------------|------|
| **Registry模式** | 每个Agent的轻量状态摘要（≤200 token） | 监控所有Agent，响应用户 |
| **Focus($a_i$)模式** | Agent $a_i$ 的完整上下文 + 其他Agent的压缩摘要 | 被请求Agent获得全保真度 |

**关键特性**：
- **Agent触发**：上下文隔离由Agent请求驱动，而非每轮都切换
- **非对称**：被引导Agent获得完整上下文，其他Agent被压缩
- **确定性**：上下文窗口精确构造为 $F(a_i) + R_{-i}$
- **子线性**：Focus上下文大小与Agent数量N无关

**实验结果**：在8个合成场景中，DACS达到90.0%–98.4%的引导准确率，而flat-context基线仅为21.0%–60.0%（$p<0.0001$）。

### 4.2 注意力引导（Agent-Radar）

**论文**：Enhancing Multi-Agent Communication through Attention Steering with Context Relevance

**核心思想**：从上下文压缩/剪枝转向选择性引导Agent注意力——保留完整历史，但通过权重引导模型关注相关内容。

**三层衰减机制**：
1. **空间衰减**：基于Agent间拓扑距离的衰减，优先来自紧密交互Agent的消息
2. **时间衰减**：降低过时信息的权重（借鉴人类记忆的时间衰减特性）
3. **语义匹配**：在句子级粒度提取相关证据

**效果**：在5个基准上最高提升7.64个绝对百分点，且随Agent数量和交互轮次增加保持鲁棒。

---

## 5. 记忆架构

### 5.1 层次化记忆（G-Memory）

**论文**：G-Memory: Tracing Hierarchical Memory for Multi-Agent Systems

**核心问题**：现有MAS记忆机制过于简单，忽略跨试次学习和Agent间协作轨迹。

**三层图层次结构**：

| 层级 | 内容 | 粒度 |
|------|------|------|
| **Insight Graph** | 从历史经验中抽象的可泛化洞察 | 高层 |
| **Query Graph** | 任务查询的元信息及其连接性 | 中层 |
| **Interaction Graph** | Agent间细粒度文本通信日志 | 底层 |

**双向遍历**：
- **向上遍历**（Query → Insight）：提取关联的高层洞察，实现跨试次知识利用
- **向下遍历**（Query → Interaction）：识别与当前任务最相关的核心交互子图

**效果**：在5个基准、3个LLM骨干和3个流行MAS框架上，G-Memory在具身动作成功率上提高20.89%，在知识QA准确率上提高10.12%。

### 5.2 自主上下文管理（ACM）

**论文**：Agentic Context Management for Long Horizon Tasks

**灵感来源**：人类短期记忆与长期记忆的交互（Atkinson-Shiffrin模型）。

**两个工具**：
- **manage_context**：压缩前几轮为简洁摘要，原始消息保存到外部存储
- **query_memory**：允许Agent查询存储的原始消息以精确检索信息

**关键特性**：
1. **无损压缩**：所有丢弃的消息保存在外部存储中，可随时访问
2. **Agent自主决策**：Agent可随时调用压缩，而非依赖固定调度

**效果**：将Qwen3.5-9B的搜索和编码性能在BrowseComp-Plus上提高27%，DeepSearchQA上提高16%，SWE-Bench Verified上提高8%。

---

## 6. 计算层面的优化

### 6.1 KV-Cache跨Agent复用（KVCOMM）

**论文**：KVCOMM: Online Cross-context KV-cache Communication for Efficient LLM-based Multi-agent Systems

**核心问题**：多Agent系统中，一旦Agent从前驱接收消息，完整上下文必须从头重新处理，导致 $O(M^2)$ 的预填充复杂度。

**解决方案**：通过锚点池（Anchor Pool）在线估计和调整KV-Cache偏移量。

**关键洞察**：相同文本在不同前缀上下文下会产生不同的KV偏移量。通过存储和插值已观察到的偏移量，可以避免重新预填充。

**效果**：在5-Agent设置中实现7.8倍预填充加速（TTFT从~430ms降至~55ms），70%+的KV-Cache复用率。

### 6.2 去中心化共享验证（DeLM）

**论文**：Decentralized Multi-Agent Systems with Shared Context

**核心思想**：通过并行Agent、共享验证上下文和任务队列实现去中心化协调，避免中心编排器成为瓶颈。

**工作机制**：
- Agent异步领取子任务
- 读取累积进度（共享验证上下文）
- 执行本地推理
- 写回紧凑的验证更新

**效果**：在SWE-bench Verified上，DeLM在Avg.@1、Pass@2和Pass@4上均取得最佳性能，最高提升10.5个百分点，同时将每任务成本降低约50%。

---

## 7. 事务与安全

### 7.1 SagaLLM：事务级上下文管理

**论文**：SagaLLM: Context Management, Validation, and Transaction Guarantees for Multi-Agent LLM Planning

**核心洞察**：多Agent规划本质上是分布式事务，需要ACID保证。

**解决四个根本限制**：
1. 自我验证不足
2. 上下文收窄（Context Narrowing）——LLM的注意力机制导致长序列中早期信息被遗忘
3. 缺乏事务属性
4. Agent间协调不足

**关键设计**：将Agent的工作上下文（输入prompt、推理空间）与事务状态显式分离。Agent可使用最小上下文，系统维护完整事务信息（包括依赖图、补偿序列）。

### 7.2 SAMEP：安全记忆交换协议

**论文**：SAMEP: A Secure Agent Memory Exchange Protocol for Persistent Context Sharing in Multi-Agent AI Systems

**三大挑战**：
1. 跨Agent会话的持久上下文保持
2. 细粒度访问控制的安全多Agent协作
3. 高效的语义相关历史上下文发现

**实现**：
- 分布式记忆仓库 + 向量语义搜索
- AES-256-GCM加密访问控制
- 与MCP、A2A协议兼容

**效果**：73%冗余计算减少，89%上下文相关性提升，100%合规性。

---

## 8. 编排器视角

### 8.1 COMPASS：三组件分治

**论文**：COMPASS: Enhancing Agent Long-Horizon Reasoning with Evolving Context

**三组件架构**：
1. **Main Agent**：执行推理和工具使用（战术层）
2. **Meta-Thinker**：监控进度并发出战略干预（战略层）
3. **Context Manager**：为不同推理阶段维护简洁、相关的进度简报（上下文层）

**效果**：在GAIA、BrowseComp和Humanity's Last Exam上，准确率最高提升20%。

---

## 9. 状态一致性保障

多Agent并发操作共享状态时，如何保证一致性是核心难题。现有方案从三个层面切入：

### 9.1 写时冲突检测（STORM）

**论文**：Multi-agent Collaboration with State Management

**核心思想**：不隔离Agent工作区，而是在写入时检测冲突。

**局部状态一致性**：Agent不需要全局快照，只需保证其读取的文件在推理期间未被修改。

**机制**：
- 每个文件维护单调递增版本号 $v_f$
- 读取时返回内容 + 版本号
- 写入时声明期望版本，系统验证：若Agent读取的任何文件已被修改，写入被拒绝
- 拒绝时返回：当前文件内容、差异diff、过期依赖列表

**效果**：在Commit0-Lite上达到82.5%通过率，比GitWorktree隔离（63.8%）高18.7个百分点。

### 9.2 事务级一致性（SagaLLM）

**论文**：SagaLLM: Context Management, Validation, and Transaction Guarantees

**核心思想**：将多Agent工作流建模为分布式Saga事务。

**Saga模式**：将长事务分解为可独立提交的子操作，每个操作有对应的补偿操作。

**一致性保证**：
- 操作序列 $O = \{o_1, o_2, ..., o_n\}$ 作用于状态 $S$，结果要么是完全提交的新状态 $S'$，要么通过补偿恢复到原始状态 $S$
- 依赖图追踪操作间依赖，失败时精确计算补偿序列
- 检查点（Checkpoint）保存完整世界状态，支持可靠回滚

**两级恢复**：
- **操作级恢复**：单个操作失败时，执行补偿事务逆转其效果
- **工作流级恢复**：影响整个工作流的失败时，遍历依赖图编排多个补偿操作

### 9.3 Schema级验证（PatchBoard）

**论文**：PatchBoard: Schema-Grounded State Mutation

**核心思想**：用结构化JSON Patch替代自然语言对话，确定性内核验证每次状态变更。

**机制**：
- Architect Agent定义任务Schema、Worker契约、上下文预算、工作流规则
- 确定性内核验证每个JSON Patch：语法检查 → 路径授权 → 临时应用 → Schema验证 → 不变量检查
- 通过后原子提交，失败则拒绝并记录原因

**效果**：在ALFWorld上达到84.6%成功率，vs LangGraph 30.8%、Flock 61.6%；token消耗仅为LangGraph的12.4%。

### 9.4 并发异常的形式化验证

**论文**：Verified Detection and Prevention of Concurrency Anomalies

**四种并发异常**（类比数据库隔离级别）：

| 异常 | 类比 | 说明 |
|------|------|------|
| stale-generation | 脏读 | Agent基于过期读集生成输出 |
| phantom-tool | 幻读 | 工具注册表在读写间变化 |
| causal-cascade | 级联中止 | 已提交的外部效应无法撤销 |
| tool-effect reordering | 写写冲突 | 工具调用效果乱序 |

**一致性层级**：$L_0 \subsetneq L_1 \subsetneq L_2 \subsetneq L_3 \subsetneq L_4$，从悲观锁到可验证的因果追踪。

---

## 10. 异常处理与循环检测

### 10.1 异常分类与结构化处理（SHIELDA）

**论文**：SHIELDA: Structured HandlIng of Exceptions in LLM-Driven Agentic Workflows

**36种异常类型**，覆盖12种Agent制品，横跨推理阶段和执行阶段。

**框架组件**：
- **异常分类器**：从预定义模式库中选择处理模式
- **处理执行器**：按序执行本地处理（重试/升级）、流程控制（继续/跳过）、状态恢复（回滚/清理）
- **升级控制器**：当本地处理失败时，追踪异常到根因（可能跨阶段）

**关键特性**：**阶段感知**——执行阶段的异常可能根因在推理阶段。SHIELDA能将底层系统异常关联到高层策略缺陷。

### 10.2 实时检测与修复

**论文**：Real-Time Detection and Repair of LLM Agent Failures

**检测**：基于可观测步骤遥测（而非第二个LLM判断），成本降低3个数量级（~200μs/步）。

**方法**：单类回声状态网络集成 + CUSUM报警，在健康运行上训练，检测0.71的失败（AUROC 0.872）。

**确定性验证层**：重新计算工具结果的总和、确认必需调用已完成。零误报，捕获60%失败（加覆盖率检查达96%）。

**修复**：失败运行回滚重跑，恢复45%失败（vs 16%随机重跑，$p=0.0005$），任务成功率从52%提升到73%。

### 10.3 无限循环检测（IAL-Scan）

**论文**：When Agents Do Not Stop: Uncovering Infinite Agentic Loops

**问题定义**：无限Agent循环（IAL）——反馈路径反复触发LLM调用、工具调用或Agent交接，无有效终止条件。

**IAL-Scan**：静态分析工具
1. 将异构Agent代码抽象为框架无关的Agent IR
2. 构建Agent循环依赖图（ALDG），恢复显式和框架诱导的反馈路径
3. 检查路径是否能反复到达高成本或状态增长操作，且无有效边界

**实验**：在6,549个LLM Agent项目中检测74个候选，人工确认68个IAL失败（91.9%精确率）。

**根因**：69.1%的失败源于无界的工具重试、模型控制的终止、无轮次限制的多Agent对话。

### 10.4 图引导的运行时修复（AgentTether）

**论文**：AgentTether: Graph-Guided Diagnosis and Runtime Intervention

**三阶段闭环**：
1. **诊断**：将运行抽象为Transition Unit，构建关键转换图（CTG），定位失败关键子轨迹
2. **引导**：将诊断转化为行为范围内的修复指令，跨迭代修复记忆保留已修复/未修复状态
3. **干预**：运行时检查器在工具返回和文本响应边界检测循环重复、意图漂移、期望偏差，注入最小修正

**效果**：在Banking任务上修复59.04%初始失败的Qwen3.7-max任务和65.12%的GPT-5.4任务。

### 10.5 自愈编排器

**论文**：Self-Healing Agentic Orchestrators

**机制**：将可靠性建模为有界运行时控制问题。
- 映射可观测失败信号 → 推断失败类别
- 在显式预算下选择针对性恢复动作
- 验证恢复后的轨迹
- 记录可观测性追踪

**效果**：98.8%任务成功率（vs retry-only 94.5%、full-replanning 93.8%）。在语义静默失败场景中，验证器引导的自愈将静默失败降至0.0%。

---

## 11. 总结与对比

### 上下文管理方法

| 方法 | 核心策略 | 解决的挑战 | Token效率 | 适用场景 |
|------|----------|-----------|-----------|----------|
| RCR-Router | 角色感知路由 | 碎片化、过时 | 高 | 多角色协作推理 |
| DACS | 非对称上下文隔离 | 污染 | 高 | 并发Agent编排 |
| Agent-Radar | 注意力引导 | 污染、过时 | 高 | 多轮对话 |
| G-Memory | 三层图记忆 | 碎片化、过时 | 中 | 跨试次学习 |
| ACM | Agent自主管理 | 窗口限制、过时 | 高 | 长期任务 |
| KVCOMM | KV-Cache复用 | 窗口限制 | 极高 | 推理加速 |
| DeLM | 去中心化共享 | 爆炸、碎片化 | 高 | 并行子任务 |
| COMPASS | 三组件分治 | 窗口限制、过时 | 中 | 长期推理 |

### 状态一致性方法

| 方法 | 核心策略 | 一致性级别 | 适用场景 |
|------|----------|-----------|----------|
| STORM | 写时冲突检测 | 局部状态一致性 | 并发代码编辑 |
| SagaLLM | Saga事务+补偿 | 最终一致性 | 多步规划、预订 |
| PatchBoard | Schema验证+确定性内核 | 强一致性 | 结构化状态管理 |
| S-Bus | 自动读集重建+OCC | 可观测读隔离 | HTTP共享状态 |

### 异常处理与循环检测

| 方法 | 核心策略 | 能力 | 适用场景 |
|------|----------|------|----------|
| SHIELDA | 36类异常+阶段感知 | 分类→处理→升级→恢复 | 通用Agent工作流 |
| AgentTether | CTG诊断+运行时干预 | 诊断→引导→干预 | 运行时修复 |
| IAL-Scan | 静态分析+ALDG | 循环检测（离线） | 开发阶段预防 |
| 自愈编排器 | 信号→分类→恢复→验证 | 有界自愈 | 生产环境 |
| Real-Time Detection | 回声状态网络+CUSUM | 实时检测+回滚 | 低成本监控 |

---

## 参考文献

### 上下文管理
1. Google ADK. "Architecting efficient context-aware multi-agent framework for production." Google Developers Blog, 2025.
2. RCR-Router. "Efficient Role-Aware Context Routing for Multi-Agent LLM Systems with Structured Memory." arXiv:2508.04903.
3. DACS. "Dynamic Attentional Context Scoping." arXiv:2604.07911.
4. Gated-Memory Routing. "Learning What to Retain: Gated-Memory Routing for Efficient Collaboration in Multi-Agent LLM Systems." arXiv:2609.00237.
5. COMPASS. "Enhancing Agent Long-Horizon Reasoning with Evolving Context." ACL 2026.
6. DeLM. "Decentralized Multi-Agent Systems with Shared Context." arXiv:2606.10662.
7. ACM. "Agentic Context Management for Long Horizon Tasks." arXiv:2607.23809.
8. KVCOMM. "Online Cross-context KV-cache Communication for Efficient LLM-based Multi-agent Systems." NeurIPS 2025.
9. SAMEP. "A Secure Agent Memory Exchange Protocol for Persistent Context Sharing in Multi-Agent AI Systems." arXiv:2507.10562.
10. G-Memory. "Tracing Hierarchical Memory for Multi-Agent Systems." NeurIPS 2025.
11. Agent-Radar. "Enhancing Multi-Agent Communication through Attention Steering with Context Relevance." arXiv:2605.30136.

### 状态一致性
12. STORM. "Multi-agent Collaboration with State Management." arXiv:2605.20563, 2025.
13. SagaLLM. "Context Management, Validation, and Transaction Guarantees for Multi-Agent LLM Planning." arXiv:2503.11951.
14. PatchBoard. "Schema-Grounded State Mutation for Reliable and Auditable LLM Multi-Agent Collaboration." arXiv:2605.29313, 2025.
15. Verified Concurrency. "Verified Detection and Prevention of Concurrency Anomalies in Multi-Agent LLM Systems." arXiv:2606.17182, 2025.
16. S-Bus. "Automatic Read-Set Reconstruction for Multi-Agent LLM State Coordination." arXiv:2605.17076, 2025.

### 异常处理与循环检测
17. SHIELDA. "Structured HandlIng of Exceptions in LLM-Driven Agentic Workflows." arXiv:2508.07935, 2025.
18. Real-Time Detection. "Real-Time Detection and Repair of LLM Agent Failures." arXiv:2608.02464, 2026.
19. IAL-Scan. "When Agents Do Not Stop: Uncovering Infinite Agentic Loops in LLM Agents." arXiv:2607.01641, 2026.
20. AgentTether. "Graph-Guided Diagnosis and Runtime Intervention for Reliable LLM Agent Operations." arXiv:2607.06273, 2026.
21. Self-Healing Orchestrators. "Self-Healing Agentic Orchestrators for Reliable Tool-Augmented LLM Systems." arXiv:2606.01416, 2026.
22. SymTrace. "Repair or Resample? Rethinking Failure Debugging in LLM Multi-Agent Systems." arXiv:2608.25920, 2026.
23. ERRORPROBE. "Towards Self-Improving Error Diagnosis in Multi-Agent Systems." ACL Findings, 2026.
24. AgentGit. "A Version Control Framework for Reliable and Scalable LLM-Powered Multi-Agent Systems." arXiv:2511.00628, 2025.
25. ACRFence. "Preventing Semantic Rollback Attacks in Agent Checkpoint-Restore." arXiv:2603.20625, 2026.
26. Graph Harness. "The Agent Loop as a Scheduler." arXiv:2604.11378, 2025.
