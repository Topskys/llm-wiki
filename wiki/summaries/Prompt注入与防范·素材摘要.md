---
type: source_summary
source: [[raw/papers/Prompt注入与防范.md]]
description: "对 raw 素材《Prompt 注入与防范》的要点摘录：注入定义与边界、四类攻击载体、危害三层分类、根因分析、纵深防御五原则与六层体系、五套架构层方案对比、成本与误报权衡、失效模式与降级、Promptware Kill Chain 七阶段、六类新兴攻击向量、三阶段实施路线、验证与运营闭环索引。"
created_at: 2026-10-14 23:04:54
updated_at: 2026-10-14 23:04:54
tags: [prompt_injection, security, source_summary]
---

# Prompt 注入与防范·素材摘要

## 核心要点索引

### 定义与边界
- OWASP LLM01 头号风险，2023/2025 两版均保持第一
- 注入 vs 越狱：攻击目标、典型后果、责任主体、防御重心四维度区分
- LLM 上下文中所有来源内容被拼接为同质 token 流，任一入口都可被污染

### 攻击类型
- 四类载体：直接注入、间接注入、多模态注入、Agent 工具滥用
- 间接注入六种载体：网页/PDF/图片/邮件/RAG 文档/工具返回
- 已验证案例矩阵：Greshake 插件攻击、Chevrolet $1 成交、Bing Chat 外泄链、ChatGPT 记忆持久化、Claude Computer Use、EchoLeak

### 危害分层
- 信息层（读权限即可）：敏感数据泄露
- 逻辑层（无需工具）：输出被操纵
- 执行层（需写权限/工具）：未授权操作

### 根因
- LLM 没有"指令"与"数据"的天然边界
- 混淆代理问题：低完整性数据影响高完整性控制流
- OpenAI 2025.12 承认注入"不可能被彻底解决"

### 纵深防御
- 五原则：零信任输入、指令与数据分离、最小权限、人在回路、持续监控
- 六层体系：输入层→提示层→架构层→权限层→输出层→监控层
- 五套架构层方案：StruQ、SecAlign、Task Shield、双 LLM、CaMeL

### 成本与权衡
- SecAlign：无显著效用损失，ASR 降至 1%/8%
- CaMeL：可证明安全，AgentDojo 77% vs 84%（-7pp）
- 双 LLM：约 2× token 成本
- StruQ：对优化攻击仍脆弱（27%/45% ASR）

### 失效模式
- fail-closed（默认拒绝）vs fail-open（默认放行）
- 三层降级：Fallback（换模型）→ Degraded Mode（缓存/静态）→ 熔断+转人工

### 前沿攻击
- Promptware Kill Chain 七阶段
- 六类新向量：记忆投毒、MCP 工具投毒、多智能体横向传播、Goal Hijack、语义层隐式注入

### 实施路线
- 三阶段：止血→加固→运营
- 验证闭环：红队→发现→修复→上线→监控→复盘→红队

## 相关页面

- [[Prompt注入定义与边界]]
- [[Prompt注入攻击类型谱系]]
- [[Prompt注入危害分层]]
- [[Prompt注入根因分析]]
- [[纵深防御五原则]]
- [[Prompt注入分层防御体系]]
- [[Prompt注入架构层防御方案对比]]
- [[Prompt注入防御成本与误报权衡]]
- [[Prompt注入失效模式与降级方案]]
- [[Promptware Kill Chain]]
- [[新兴Prompt注入攻击向量]]
- [[Prompt注入防御实施路线]]
- [[Prompt注入验证与运营]]
- [[EchoLeak零点击攻击案例]]
- [[LLM-Agent安全防护总览]]

## 参考来源

- [[raw/papers/Prompt注入与防范.md]]
