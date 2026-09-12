---
type: topic
source: [[贸易AI业务]]
description: "大疆商城 AI 业务矩阵五大项目（DataBus/ModelForge/灵购AI/LiveClip/MultiVis）体系总览：数据底座 → 模型能力 → 多 Agent 应用 → 数据回流闭环，以及各项目在体系中的职责分工。"
created_at: 2026-09-11 23:41:15
updated_at: 2026-09-11 23:41:15
tags: [e_commerce, ai_platform, project_system, lingou_ai]
---

# 商城AI业务矩阵

## 架构总览

```mermaid
flowchart TB
    subgraph Sources["全渠道原始数据"]
        GT[GT / 微信客服对话]
        LIVE[直播录像 + 弹幕]
        MALL[商城订单/商品/售后]
        MEDIA[自媒体运营素材]
    end

    subgraph DataBus["DataBus 全域 AI 业务数据中台"]
        ETL[ETL 采集 · DataFilter 9级过滤 · 脱敏]
        RAW[(raw_chats 原始库)]
        STG[(staging_conversations 质检暂存)]
        OUT_SFT[SFT 训练集<br/>ShareGPT/Alpaca/JSONL]
        OUT_RAG[RAG 素材<br/>knowledge_chunks 向量分片]
    end

    subgraph ModelForge["ModelForge-AI 模型工厂"]
        LOCAL[本地 QLoRA 验证<br/>Qwen2.5-3B + LLaMA-Factory]
        CLOUD[云端量产<br/>豆包1.5 LoRA on 火山方舟]
        MODEL[(商城专属销售话术大模型)]
        RERANK[三段式混合检索<br/>Embedding→粗召回→Cross-Encoder精排]
    end

    subgraph Agents["三大 AI Agent 应用层"]
        LG["灵购 AI<br/>RAG + RTC 语音客服"]
        LC["LiveClip-AI<br/>直播切片剪辑"]
        MV["MultiVis-AI<br/>图文视频自媒体运营"]
    end

    GT & LIVE & MALL & MEDIA --> ETL
    ETL --> RAW --> STG
    STG --> OUT_SFT & OUT_RAG
    OUT_SFT --> LOCAL --> CLOUD --> MODEL
    OUT_RAG --> RERANK --> LG & MV
    MODEL --> LG & LC & MV
    LC -->|ASR转写/高光标签/爆款分| DataBus
    MV -->|图文视频素材| SC
    LG -->|高质量对话语料| DataBus
    SC[(素材中心)] -->|多模态回复素材| LG
    LC -->|短视频素材| MV
```

## 核心结论
- 五项目遵循「**先聚数据 → 再训模型 → 再落地 Agent**」体系，各管一环，整体形成 **数据—模型—应用—反哺** 闭环。
- 骂你核心分工：**DataBus 洗数据，ModelForge 训模型，灵购/LiveClip/MultiVis 三个 Agent 落场景，产出回流 DataBus 持续迭代**。
- 用户主负责 [[灵购AI]] 的 RTC 语音链路、[[RAG检索优化五层|RAG 接入]]与推理优化；其余项目架构上深悉、流水线与专项同学共建。

## 要点拆解

### 五项目一句话定位

| 项目 | 定位 | 理顺关系 |
|------|------|----------|
| [[DataBus]] | 全域 AI 业务数据中台 | 供灵购知识库；收各 Agent 回流 |
| [[ModelForge-AI]] | 电商自有化模型微调工厂 | 供灵购 LLM + Rerank 能力 |
| [[灵购AI]] | 商品知识库 + RTC 语音客服 | 消费 DataBus 知识 + ModelForge 模型 |
| [[LiveClip-AI]] | 直播切片智能剪辑 Agent | ASR/高光标签回流 DataBus，短视频供 MultiVis |
| [[MultiVis-AI]] | 图文视频自媒体运营 Agent | 素材入素材中心 → 供灵购多模态回复 |

### 数据流转闭环
```
微信/GT客服对话 ┐
商城商品/售后文档 ┼→ DataBus → SFT集 / RAG素材
直播ASR/话术回流 ┤         ↓
线上优质对话回流 ┘   ModelForge 微调模型
                               ↓
        灵购AI ← RAG知识库 → LiveClip / MultiVis
                   ↓ 回流
                DataBus
```

## 相关页面
- [[灵购AI]]：用户主负责的项目，RTC + RAG + 推理优化全链路
- [[DataBus]]、[[ModelForge-AI]]：体系的数据与模型底座
- [[LiveClip-AI]]、[[MultiVis-AI]]：内容生产侧 Agent，参与闭环
- [[四大项目架构对比]]：DataBus/ModelForge/LiveClip/MultiVis 横向对比
- [[RAG检索优化五层]]、[[TTFT首字延迟优化]]、[[FEC与自适应JitterBuffer]]：灵购 AI 三条核心优化主线

## 参考来源
- [[贸易AI业务]]