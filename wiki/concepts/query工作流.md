---
type: concept
source: [[llm-wiki知识库方案]]
description: "基于已编译 Wiki 进行问答并反向沉淀高质量答案的工作流：index 定位、读 Wiki 生成结论先行答案、有长期复用价值时以 source_summary + query_write 标签回写。"
created_at: 2026-09-05 12:37:30
updated_at: 2026-09-05 12:37:30
tags: [workflow, query, knowledge_base]
---

# Query 工作流

## 核心结论
- **Query**（问答回写）＝基于已编译 Wiki 知识库回答问题，高质量答案再反哺知识库，形成「越用越完整」的闭环。
- 回答要求**结论先行**，每个观点标注 `[[来源页面]]`；库中无内容如实告知、禁止编造，推测内容标【推导】并绑定来源。
- 只有**具备长期复用价值**的答案才回写为 `source_summary` 页面，`tags` 追加 `query_write` 标签，便于月度治理优先复核质量。

## 要点拆解
1. **定位主题**：优先读取 `index.md`，通过 description 快速定位相关主题页面。
2. **读取内容**：综合读取对应 Wiki 页面生成答案；**非必要不读取 raw 原始素材**，保障查询效率。
3. **生成答案**：结论先行 + 来源标注，冲突中立（分别列明双方与依据，不自行站队）。
4. **延伸推荐**：末尾输出 2-3 个高度相关的延伸主题及 Wiki 链接。
5. **回写判断与执行**：需回写时新建页面，type 统一为 `source_summary`，同步更新 index.md 与 shturl.md。

## 相关页面
- [[ingest工作流]] 的产物是 Query 的输入
- [[lint工作流]]：query_write 页面的质量由月度治理优先复核
- [[元数据规范]]：回写页面同样必须携带完整 Frontmatter

## 参考来源
- [[llm-wiki知识库方案]]