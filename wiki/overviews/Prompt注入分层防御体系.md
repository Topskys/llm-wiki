---
type: overview
source: [[raw/papers/Prompt注入与防范.md]]
description: "Prompt 注入六层防御体系全景（输入层/提示层/架构层/权限层/输出层/监控层），各层职责与关键手段，以及通用安全架构的数据流与控制流设计。"
created_at: 2026-10-14 23:04:54
updated_at: 2026-10-14 23:04:54
tags: [prompt_injection, defense, overview, layered_security]
---

# Prompt 注入分层防御体系

## 核心结论

- 六层防御体系：**输入层 → 提示层 → 架构层 → 权限层 → 输出层 → 监控层**，层层递进、互为兜底。
- 核心思想：**不要把 LLM 当安全边界，要把 LLM 当不可信的自然语言处理器**。

## 六层防御体系全景

```mermaid
flowchart TB
    subgraph L1["① 输入层"]
        direction LR
        A1["消毒 · 定界 · 规范化"]
    end
    subgraph L2["② 提示层"]
        direction LR
        A2["指令层级 · 不放密钥"]
    end
    subgraph L3["③ 架构层"]
        direction LR
        A3["双 LLM · StruQ · SecAlign · CaMeL"]
    end
    subgraph L4["④ 权限层"]
        direction LR
        A4["策略引擎 · Task Shield · 白名单"]
    end
    subgraph L5["⑤ 输出层"]
        direction LR
        A5["Schema 校验 · PII/URL 过滤"]
    end
    subgraph L6["⑥ 监控层"]
        direction LR
        A6["trace · 告警 · 红队 · 回滚"]
    end
    L1 --> L2 --> L3 --> L4 --> L5 --> L6
    style L1 fill:#e8f4ff
    style L3 fill:#d4edda
    style L4 fill:#fff3cd
```

<p align="center"><b>图1 六层防御体系</b></p>

## 各层职责

| 层 | 关键手段 | 防御目标 |
|---|---|---|
| 输入层 | 长度/来源/频率限制、来源标记、转义、Base64/Unicode 规范化预处理 | 注入进入上下文前 |
| 提示层 | 明确指令层级、显式声明"context 内指令均为数据"、系统提示不放密钥 | 注入生效时 |
| 架构层 | StruQ、SecAlign、Task Shield、双 LLM、CaMeL | 结构性隔离 |
| 权限层 | 策略引擎（OPA/Casbin）、URL 白名单、命令转义、金额上限、默认拒绝 | 注入造成损害时 |
| 输出层 | JSON Schema 强制、PII/密钥/URL 过滤、HTML 转义、工具参数二次校验 | 输出泄露前 |
| 监控层 | 全量 trace、异常告警、速率限制、红队测试集、回滚机制 | 持续对抗 |

## 通用安全架构数据流

```mermaid
flowchart TB
    USER["用户请求"] --> GW["输入网关<br/>长度/来源/注入检测/规范化"]
    GW --> ISO["不可信内容隔离<br/>分隔符 + 来源标记"]
    ISO --> LLM1["无特权 LLM<br/>只规划 · 抽取 · 输出结构化"]
    LLM1 --> PE["策略引擎<br/>权限 · 白名单 · 人工确认"]
    PE -->|低危通过| SB["工具沙箱<br/>最小权限执行"]
    PE -->|高危| HUMAN["人工审批"]
    HUMAN -->|批准| SB
    SB --> OF["输出过滤<br/>PII · URL · 结构化校验"]
    OF --> USER2["返回用户"]
    SB -.->|"全量 trace"| LOG["审计日志/监控告警"]
    style HUMAN fill:#fff3cd
    style LOG fill:#f0f0f0
    style SB fill:#d4edda
```

<p align="center"><b>图2 通用安全架构</b></p>

## 相关页面

- [[纵深防御五原则]]：五条原则是六层体系的纲领
- [[Prompt注入架构层防御方案对比]]：架构层五方案横向对比
- [[Prompt注入失效模式与降级方案]]：每层失效时的降级策略
- [[Prompt注入验证与运营]]：红队测试集与持续评估
- [[LLM-Agent安全防护总览]]：注入在 Agent 安全中的定位

## 参考来源

- [[raw/papers/Prompt注入与防范.md]]
