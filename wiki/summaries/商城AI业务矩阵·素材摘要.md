---
type: source_summary
source: [[贸易AI业务]]
description: "对 raw 素材《贸易AI业务》（原：商城AI业务矩阵-面试整理）的要点摘录：大疆商城五项目（DataBus/ModelForge/灵购AI/LiveClip/MultiVis）体系、RAG 五层优化、TTFT、FEC/JitterBuffer、LoRA 微调、LangGraph 工作流等核心知识点索引。"
created_at: 2026-09-11 23:41:15
updated_at: 2026-09-11 23:41:15
tags: [source_summary, e_commerce, ai_platform, interview_prep]
---

# 商城AI业务矩阵·素材摘要

## 核心结论
- 素材是 3000+ 行面试整理文档，结构：背诵卡片 + 五项目详解（6-9 节）+ 技术深度（RAG/TTFT/弱网/热更新，第 16 节）+ 全链路优化表（第 17 节）+ 面试问答（第 18 节）+ 深挖连环（第 19 节）。
- 知识体系完整覆盖**「数据底座 → 模型能力 → 多 Agent 应用 → 数据回流」**四层；灵购 AI（RTC + RAG + 推理优化）是用户主负责、面试主讲项目。
- 技术可复用度高：[[RAG检索优化五层]]、[[Hybrid混合检索]]、[[TTFT首字延迟优化]]、[[FEC与自适应JitterBuffer]]、[[微调与RAG分工]]、[[QLoRA与LoRA微调]]、[[LangGraph与Checkpointer工作流]] 均提炼为独立概念页。

## Wiki 衍生页面索引
| 类型 | 页面 | 来源章节 |
|------|------|----------|
| topic | [[商城AI业务矩阵]] | 二、三、十三、十九 |
| entity | [[灵购AI]] | 十五、十八·灵购 |
| entity | [[DataBus]] | 六·DataBus 深度、十八·DataBus |
| entity | [[ModelForge-AI]] | 六·ModelForge 深度、十八·ModelForge |
| entity | [[LiveClip-AI]] | 六·LiveClip 深度、十八·LiveClip |
| entity | [[MultiVis-AI]] | 六·MultiVis 深度、十八·MultiVis |
| concept | [[RAG检索优化五层]] | 十六（第一至五层） |
| concept | [[Hybrid混合检索]] | 十六（第四层补充） |
| concept | [[TTFT首字延迟优化]] | 十六（TTFT 专节） |
| concept | [[FEC与自适应JitterBuffer]] | 十六（RTC 弱网专节） |
| concept | [[微调与RAG分工]] | MF-Q1、MF-Q3 |
| concept | [[QLoRA与LoRA微调]] | MF-Q6、MF-Q7 |
| concept | [[LangGraph与Checkpointer工作流]] | MV-Q1、MV-Q6 |
| comparison | [[四大项目架构对比]] | 十九（架构对比表、连环拷打） |

## 相关页面
- [[商城AI业务矩阵]]：所有衍生页面的父主题页

## 参考来源
- [[贸易AI业务]]