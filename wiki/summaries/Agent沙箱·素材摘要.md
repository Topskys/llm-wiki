---
type: source_summary
source: "[[raw/papers/Agent沙箱.md]]"
description: "对 raw 论文《AI Agent 沙箱》的要点摘录：定义与安全价值、六类隔离技术谱系、三组容器逃逸 CVE 与三条 Agent 特有绕过路径、七个平台横评、四层技术栈与 Dify 实配、CubeSandbox 快照克隆加速及三条落地误区索引。"
created_at: 2026-10-10 21:15:19
updated_at: 2026-10-10 21:15:19
tags: [agent_sandbox, source_summary]
---

# Agent沙箱·素材摘要

## 素材信息

- 来源：[[raw/papers/Agent沙箱.md]]
- 关键词：智能体沙箱；隔离技术；OS原语；gVisor；Firecracker；microVM；CubeSandbox
- 参考文献 12 条，正文跳转引用 15 处

## 要点摘录

| 主题 | 要点 | 落点页面 |
|---|---|---|
| 定义 | 封闭工作间类比；约束对象是智能体自主行动而非外部恶意代码；目标可控、可回滚、可审计 | [[Agent沙箱定义与安全价值]] |
| 安全价值 | 防线从防外部攻击转向防自身失控；根因是「组装-推理-执行-回灌」循环截断致目标偏移 | [[Agent沙箱定义与安全价值]] |
| 隔离谱系 | 共享进程地址空间 < 共享内核 < 共享虚拟化层 < 独立内核 < 硬件加密内存 | [[隔离技术谱系]] |
| OS 原语 | seccomp / namespaces / cgroups / Landlock / Seatbelt 五分工；混合架构「OS原语管文件 + 用户态代理管网络」 | [[OS原语沙箱机制]] |
| gVisor | Sentry 用户态内核重新实现约 274/350 个系统调用；不需 KVM，可跑在普通 VM 内；腾讯日均数百万 | [[gVisor用户态内核]] |
| microVM | Firecracker 约 125ms 启动、VMM 内存 <5MiB、单机数千实例；无已知 VM 逃逸 CVE；jailer 为组合外壳 | [[Firecracker微虚拟机]] |
| 其余形态 | Kata（每 Pod 一 VM）、Wasm/WASI 能力安全、浏览器沙箱、TEE（SEV-SNP / TDX + attestation） | [[隔离技术谱系]] |
| 逃逸史 | CVE-2019-5736、CVE-2024-21626、CVE-2025-31133/52565/52881；结论「容器已知不充分」 | [[容器逃逸与沙箱绕过]] |
| 绕过路径 | DNS C2 外泄（AgentCore CVSS 7.5）、元数据服务凭据外泄、VMM 与 jailer 缺陷 | [[容器逃逸与沙箱绕过]] |
| 共性教训 | 数据外泄几乎都走网络；沙箱是概率性降低损失而非绝对保证 | [[容器逃逸与沙箱绕过]]、[[沙箱选型权衡与落地避坑]] |
| 选型对比 | 六类技术在机制 / 延迟 / 内存 / 优势 / 场景上的对照 | [[沙箱隔离技术选型对比]] |
| 平台横评 | Codex、Claude Code、OpenClaw、E2B、Daytona、Modal、AgentCore 七行对照；84% 权限提示减少 | [[Agent沙箱平台横评]] |
| 四层栈 | 隔离层 / 策略控制层 / 状态管理层 / 可观测层；禁止 Agent 自证安全 | [[沙箱四层技术栈]] |
| Dify 实配 | 代码节点沙箱与命令行工作区沙箱两套不可混用，含镜像、隔离与资源上限 | [[沙箱四层技术栈]] |
| 冷启动 | 预置快照 + CoW 克隆压至 60ms、单沙箱基础内存约 5MB、50 并发 P99≈150ms | [[沙箱冷启动加速技术]] |
| 落地误区 | 只读根目录≠安全；远端≠安全；退出码 137 时 Agent 收不到异常 | [[沙箱选型权衡与落地避坑]] |
| 趋势 | 动态权限自适应、TEE 与 microVM 互补、接口标准化尚无定论 | [[Agent沙箱技术全景总览]] |

## 参考文献索引

素材内 12 条参考文献覆盖：CubeSandbox（腾讯云）、GitLab 网络访问、Dify 官方文档、沙箱概念科普、Firecracker NSDI 论文、Firecracker/gVisor 对比研究、gVisor 架构指南、Leaky Vessels、AWS AgentCore DNS 外泄、Claude Code Sandboxing、Google Agent Sandbox、腾讯 Agentic-RL gVisor 实践。完整条目见 [[raw/papers/Agent沙箱.md]] 参考文献区。

## 相关页面

- [[Agent沙箱技术全景总览]]：本素材编译出的领域总览。
- [[LLM-Agent安全防护总览]]：沙箱与提示词注入防御同属纵深防御体系。
- [[Agent生产落地实践]]：确定性边界与权限治理的上位主题。

## 参考来源

- [[raw/papers/Agent沙箱.md]]
