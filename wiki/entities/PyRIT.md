---
type: entity
source: "[[raw/papers/AI安全与红队测试.md]]"
description: "PyRIT（Python Risk Identification Tool）是微软开源的自动化红队框架，把 GCG、红队语言模型等攻击编排为与模型和平台无关的自动化流水线，用于多模态生成式系统的规模化风险识别，是红队四步闭环中迭代阶段的工程化编排层。"
created_at: 2026-10-17 16:20:35
updated_at: 2026-10-17 16:20:35
tags: [pyrit, red_teaming, automation, microsoft, orchestration]
---

# PyRIT

## 核心结论

- **PyRIT 是微软开源的自动化红队框架**，把前述攻击技术（如 [[GCG对抗攻击]]、红队语言模型）编排为**与模型和平台无关的自动化流水线**，用于多模态生成式系统的规模化风险识别[[8]](#ref-8)。
- 其价值在于把[[红队测试四步闭环]]的「迭代阶段」从手工编排升级为可复用流水线，是「混合人机协作」实现方式的代表系统。
- 与 [[HarmBench]] 的分工：HarmBench 是**评测基准**（统一指标与横向对比），PyRIT 是**攻击编排框架**（把攻击规模化地跑起来）。

## 要点拆解

| 维度 | 内容 |
|---|---|
| 提供方 | 微软（开源） |
| 定位 | 自动化红队编排框架（工具/流水线层） |
| 编排对象 | GCG、红队语言模型等多类攻击技术 |
| 特性 | 模型与平台无关、面向多模态生成式系统 |
| 关联 | [[红队实现方式对比]]中「混合人机协作」代表系统 |

## 相关页面

- [[AI安全与红队测试总览]]：本页所在的上位总览
- [[红队测试四步闭环]]：PyRIT 承载迭代阶段的规模化编排
- [[GCG对抗攻击]]：被编排的代表攻击之一
- [[HarmBench]]：与 PyRIT 配套的评测基准
- [[红队实现方式对比]]：PyRIT 所代表的人机混合路线
- [[MCP安全最佳实践]]：同为工具链安全工程视角（既有沉淀）

## 参考来源

- [[raw/papers/AI安全与红队测试.md]]

---

<a id="ref-8"></a>[8] G. Lopez Munoz, T. Burt, R. Golshan, A. Venzke, and S. Bahl. [Announcing Microsoft's Open Automation Framework to Red Team Generative AI Systems](https://www.microsoft.com/en-us/security/blog/2024/02/22/announcing-microsofts-open-automation-framework-to-red-team-generative-ai-systems/) *Microsoft Security Blog*, 2024.
