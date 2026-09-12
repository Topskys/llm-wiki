---
type: entity
source: [[贸易AI业务]]
description: "商城智能语音客服平台：商品知识库 + RTC 7×24 语音客服，核心为 CustomLLM 回调服务的 RAG 检索与微调模型流式推理；用户主负责的 RTC 链路、RAG 接入与 TTFT 优化项目。"
created_at: 2026-09-11 23:41:15
updated_at: 2026-09-11 23:41:15
tags: [lingou_ai, rtc, rag, voice_agent, e_commerce]
---

# 灵购AI

## 技术架构

```mermaid
flowchart LR
    subgraph Client["用户端"]
        WEB[Web/H5 语音客服页]
        MIC[麦克风采集]
    end

    subgraph RTCCloud["火山 RTC AIGC 云端"]
        ASR[ASR 语音识别]
        TTS[TTS 语音合成]
        PIPE[流式对话管道]
    end

    subgraph LingGou["灵购 AI 自研服务"]
        PROXY[场景代理 / Token 签发]
        CB[/api/chat_callback<br/>CustomLLM 回调]
        RAG[RAG 检索服务]
        LLM[微调大模型推理<br/>ModelForge 产出]
    end

    subgraph Storage["知识存储"]
        VDB[(Milvus 向量库)]
        REDIS[(Redis 会话缓存)]
        MYSQL[(MySQL 商品主数据)]
    end

    WEB --> MIC
    MIC -->|RTC 音频流| RTCCloud
    RTCCloud --> ASR --> PIPE
    PIPE -->|HTTP SSE| CB
    CB --> RAG --> VDB
    CB --> LLM
    LLM -->|流式文本| PIPE
    PIPE --> TTS --> WEB
    PROXY --> RTCCloud
```

## 核心结论
- 商品知识库 + RTC 实时语音智能客服，业务覆盖无人机/Osmo/DJI Care/配件咨询、活动解答、下单引导，7×24 接待。
- **LLM 和 RAG 都在自研回调服务 `/api/chat_callback` 里**，不在浏览器、也不在 RTC SDK 中：云端 ASR 出文本 → 回调做 RAG → 微调模型 SSE 流式返回 → TTS 播报。
- 用户在该项目负责 **RTC 交互、CustomLLM 回调、RAG 在线检索接入、检索/TTFT 性能优化**；数据入库与模型训练是协作。

## 要点拆解

### 内部分层（四层）
| 层级 | 模块 | 职责 |
|------|------|------|
| ① 知识与模型 | DataBus、[[ModelForge-AI]]、Milvus | 提供「知道什么」和「怎么说」 |
| ② 自研业务服务 | 代理服务、CustomLLM 回调、RAG | 把知识与模型接到语音场景 |
| ③ 实时音视频 | RTC SDK + AIGC 云端 | 传声音、ASR/TTS、对话编排 |
| ④ 用户交互 | React 前端 | 进房、开麦、字幕、挂断 |

### 两条链路（必记）
| 链路 | 传什么 | 谁负责 |
|------|--------|--------|
| RTC 音频链路 | 声音 | 火山 RTC + AIGC 云端 |
| LLM 推理链路 | 文字 HTTP + SSE | 自研 CustomLLM 回调 |

### 负责范围 vs 协作
| 我主要负责 | 团队协作 |
|------------|----------|
| RTC 前端/SDK 集成、进房退房、设备与字幕 | DataBus：清洗、切片、向量入库 |
| 代理服务 / CustomLLM 回调开发 | ModelForge：LoRA 微调、模型部署 |
| RAG 在线检索接入（召回、过滤、拼 prompt） | Milvus 集合与索引参数设计 |
| TTFT、检索耗时、Token 成本优化 | Prompt Pilot、素材中心、K8s |

### 优化四方向（答得准/快/稳＋研得快）
- **答得准**：[[RAG检索优化五层]]（HNSW/Int8/元数据/Top20/Rerank，命中率 72%→89%）+ [[Hybrid混合检索]]
- **答得快**：检索耗时↓、[[TTFT首字延迟优化]]（前缀缓存/KV Cache/prompt 精简/SSE，15s→2s）
- **听得稳**：[[FEC与自适应JitterBuffer]]（~50% 丢包仍可通话）
- **研得快**：uvicorn reload 精细化，开发态重启 10s→2s（研发效率，非线上指标）

### 代码仓库结构速查（ark_aigc_demo）
| 目录/文件 | 作用 |
|-----------|------|
| `src/` | React 18 前端，RTC 通话 UI |
| `src/lib/RtcClient.ts` | RTC 引擎封装，startAgent/stopAgent |
| `Server/` | 官方 Node 代理（Koa，端口 3001） |
| `Server/scenes/*.json` | 场景配置（AK/SK、RTC、VoiceChat） |
| `rag_llm_server/` | CustomLLM 回调 + RAG + 豆包流式推理 |
| `rag_llm_server/main.py` | `/proxy` + `/api/chat_callback` |

## 相关页面
- [[商城AI业务矩阵]]：灵购 AI 在五大项目体系中的位置
- [[DataBus]]：灵购 RAG 知识来源（供数 → 用数 → 回流）
- [[ModelForge-AI]]：灵购 LLM 与 Rerank 能力来源
- [[RAG检索优化五层]]、[[TTFT首字延迟优化]]、[[FEC与自适应JitterBuffer]]：灵购优化主线

## 参考来源
- [[贸易AI业务]]