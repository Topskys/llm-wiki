---
type: concept
source: [[The AI-Native SDLC playbook]]
description: "Skills 是组织把制度知识可操作化的机制：显式、版本化、广泛适用、中心化更新的指令包，按需自动触发；是建议性控制，政策必须必然成立时需 hooks 兜底。"
created_at: 2026-09-12 23:03:13
updated_at: 2026-09-12 23:03:13
tags: [skills, governance, institutional_knowledge, ai_native_sdlc]
---

# Skills技能

## 生命周期

```mermaid
flowchart LR
    A["锁定一个<br/>执行不一致的制度点"] --> B["写成 SKILL.md<br/>frontmatter 定义触发时机"]
    B --> C["入库 .claude/skills/&lt;名&gt;/<br/>或插件分发"]
    C --> D["测试触发<br/>换不同问法都加载"]
    D --> E["政策变更→更新 skill<br/>policy owner 签字"]
    E --> C
```

## 核心结论
- Skill 是组织把**制度知识（institutional knowledge）变成可操作指令**的载体：显式、版本化、广泛适用、政策变更时中心化更新 [[The AI-Native SDLC playbook]]。
- 触发条件写在 `SKILL.md` 的 frontmatter（何时自动加载），主体写怎么执行；以文件夹形式放 `.claude/skills/<name>/` 随代码分发，或经插件生态组织级分发。
- **建议性控制**：skill 让 agent 在写代码时**大概率**遵循政策，但不强制任何会话遵守；规则必须始终成立时，需要 [[Hooks护栏与审批门]] 这类确定性执行兜底（violations rare by skill，close to impossible by hook）。

## 要点拆解
- **选材原则**：为"必须被一致执行的制度知识"写 skill；属于"团队上下文"的放 [[CLAUDE记忆文件|CLAUDE.md]]，一次性提示不固化。
- **写法示例**：安全 API 评审 skill，frontmatter 声明"创建/修改外部端点、评审 API 代码、生成 OpenAPI spec 时触发"，正文给认证、输入校验、审计、PII 分类四条铁律 + 运行校验脚本的输出要求 [[The AI-Native SDLC playbook]]。
- **测试与治理**：每次用不同问法验证触发；政策变化时由 policy owner 签字后更新；调用记录进 session trace；skill 文件变更像代码一样评审。
- **与 hooks 的分工**：skill 不能拦截动作——需要禁止时，由 hook `allow / ask / block`；skill 让违规稀有，hook 让违规近乎不可能。

## 相关页面
- [[CLAUDE记忆文件]]：团队上下文（CLAUDE.md）与制度知识（skill）的边界
- [[Hooks护栏与审批门]]：建议性控制背后的确定性层
- [[AI-native-SDLC]]：skill 在六阶段中的嵌入位置

## 参考来源
- [[The AI-Native SDLC playbook]]