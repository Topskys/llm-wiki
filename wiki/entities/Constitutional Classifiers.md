---
type: entity
source: "[[raw/papers/AI安全与红队测试.md]]"
description: "Constitutional Classifiers 是 Anthropic 提出的分类器防御方案，用带宪法（constitution）约束的分类器拦截通用越狱；部署前接受超过 3000 小时人类红队对抗，结果显示没有攻击报告能在更严格判定阈值下成功回答全部 10 个目标问题，验证了对通用越狱的实际拦截能力，代价是可观测的过度拒绝。"
created_at: 2026-10-17 16:20:35
updated_at: 2026-10-17 16:20:35
tags: [constitutional_classifiers, jailbreak_defense, classifier_defense, anthropic]
---

# Constitutional Classifiers

## 核心结论

- **Constitutional Classifiers 是分类器防御的代表实现**：用受「宪法」规则约束的分类器在输入/输出侧拦截通用越狱，属[[越狱攻击]]防御方向中的「分类器防御」[[7]](#ref-7)。
- 部署前**接受了超过 3000 小时的人类红队对抗**，结果显示没有攻击报告能在更严格判定阈值下成功回答全部 10 个目标问题，验证了分类器防御对通用越狱的实际拦截能力。
- 代价是**可观测的过度拒绝**：鲁棒性提升伴随 URR 上升，任何防御都需在 ASR 与 URR 之间做工程权衡，见[[红队测试边界与军备竞赛]]。

## 要点拆解

| 维度 | 内容 |
|---|---|
| 提出方 | Anthropic |
| 机制 | 受宪法约束的分类器，拦截通用越狱 |
| 验证 | 部署前 3000+ 小时人类红队；无报告能在更严阈值下答对全部 10 个目标问题 |
| 收益 | 显著提升对通用越狱的鲁棒性 |
| 代价 | 过度拒绝（URR）上升，需与 ASR 联合权衡 |

- 它是[[红队测试四步闭环]]「报告→修复」回路产出的防御，也是[[机器学习安全四大类别]]中「鲁棒性/对齐」在工程上的落点。

## 相关页面

- [[AI安全与红队测试总览]]：本页所在的上位总览
- [[越狱攻击]]：所防御的攻击类型
- [[红队测试边界与军备竞赛]]：防御成本（过度拒绝）的体现
- [[红队量化指标ASR与URR]]：ASR↔URR 权衡的量化落点
- [[机器学习安全四大类别]]：分类器防御在四类中的定位
- [[LLM-Agent安全防护总览]]：输出侧分类器防御在 Agent 体系中的对应层（既有沉淀）

## 参考来源

- [[raw/papers/AI安全与红队测试.md]]

---

<a id="ref-7"></a>[7] M. Sharma, M. Tong, T. Korbak, et al. [Constitutional Classifiers: Defending against Universal Jailbreaks across Thousands of Hours of Red Teaming](https://arxiv.org/abs/2501.18837) *arXiv:2501.18837*, 2025.
