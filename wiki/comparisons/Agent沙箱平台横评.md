---
type: comparison
source: "[[raw/papers/Agent沙箱.md]]"
description: "七个主流 Agent 沙箱方案横评：本地 Coding Agent（Codex、Claude Code、OpenClaw）与云端沙箱即服务（E2B、Daytona、Modal、AgentCore）在隔离层级、冷启动、网络策略与多租户能力上的差异。"
created_at: 2026-10-10 21:15:19
updated_at: 2026-10-10 21:15:19
tags: [agent_sandbox, platform, codex, claude_code, e2b, comparison]
---

# Agent沙箱平台横评

## 核心结论

当前格局分**两条主线**：本地 Coding Agent 走 [[OS原语沙箱机制]] 轻量隔离路线，云端沙箱即服务走轻量级虚拟化（microVM / gVisor）路线。

| 方案 | 隔离层级 | 冷启动 | 网络策略 | 多租户不可信 | 定位 |
| --- | --- | --- | --- | --- | --- |
| OpenAI Codex CLI | OS原语（macOS Seatbelt / Linux bwrap+seccomp+Landlock） | 近零 | 禁网 + 越界审批 | 否 | 本地 Coding，默认即沙箱 |
| Claude Code（sandbox-runtime） | OS原语（bwrap / Seatbelt） | 近零 | 代理 + 域名白名单 | 否 | 本地 Coding，可沙箱任意进程与本地 MCP server |
| OpenClaw | Docker 容器 / SSH / OpenShell | 容器级 | 随后端 | 否 | 个人助理信任模型，非敌对多租户边界 |
| E2B | Firecracker microVM | 约150-200ms | 可配 | 是 | 不可信代码多租户执行的事实标准 |
| Daytona | 容器（可选 gVisor / Kata） | 90ms以内 | 可配 | 中 | 持久化工作区，速度优先 |
| Modal | gVisor | 快 | 可配 | 是 | 大规模并发与 GPU |
| AWS Bedrock AgentCore | Firecracker（一会话一 microVM） | — | 可配 | 是 | 托管 Agent 运行时 |

> 表中冷启动与隔离层级均为各厂商官方口径，未经第三方复现。

## 要点拆解

### 两个关键数字

- **Claude Code 沙箱化 bash 工具后权限提示减少 84%**——印证「扩大沙箱边界 + 减少审批」是当前共识方向；
- **Modal 基于 gVisor 可扩至 5 万到 10 万以上并发**——说明用户态内核路线在极致规模上有独到优势。

前者说明沙箱不是为了加摩擦而是为了**少打扰**，后者说明 [[gVisor用户态内核]] 在密度上的独特位置。

### 冷启动加速的同源思路

**Google Agent Sandbox** 以 Kubernetes CRD 提供，用 **SandboxWarmPool** 常驻预热 microVM 实现即时领取，与腾讯云 CubeSandbox 的快照克隆思路同源——快照与预热池是各家一致的方向，机制见 [[沙箱冷启动加速技术]]。

### 一条收敛信号

跨公司独立收敛到几乎相同的架构——**OS 原语 + 网络代理 + 沙箱与审批解耦**——本身就是路线正确的信号。三家本地方案的具体差异：

| | Codex CLI | Claude Code | OpenClaw |
|---|---|---|---|
| 隔离 | Seatbelt / bwrap+seccomp+Landlock | bwrap / Seatbelt | Docker / SSH / OpenShell |
| 网络 | 禁网 + 越界审批 | 代理 + 域名白名单 | 随后端 |
| 信任模型 | 本地 Coding | 本地 Coding + 本地 MCP server 沙箱 | 个人助理，非敌对多租户 |

## 相关页面

- [[沙箱隔离技术选型对比]]：本表「隔离层级」列的技术展开。
- [[沙箱冷启动加速技术]]：本表「冷启动」列的优化手段。
- [[沙箱选型权衡与落地避坑]]：本地 / 云端两条路线的完整判据。
- [[Firecracker微虚拟机]]、[[gVisor用户态内核]]：云端两档载体的机制详解。
- [[Agent沙箱技术全景总览]]：本页所属的领域全景。

## 参考来源

- [[raw/papers/Agent沙箱.md]]
