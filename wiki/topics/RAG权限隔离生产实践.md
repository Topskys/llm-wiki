---
type: topic
source: "[[raw/papers/RAG权限隔离·三道闸门与全链路合并.md]]"
description: "RAG 权限隔离生产实践专题：权限变更传播（事件驱动同步向量库 metadata 与缓存）、性能基准（pre-filter vs post-filter 延迟与召回对比）、段落/字段级权限细化、向量库选型与降级策略。"
created_at: 2026-09-28 23:24:19
updated_at: 2026-09-28 23:24:19
tags: [rag, permission_isolation, production, performance, fine_grained]
---

# RAG权限隔离生产实践

## 核心结论

- **权限变更传播**：事件驱动，权限中心发变更事件 → 批量更新向量库 metadata + 失效相关缓存。
- **性能基准**：pre-filter 延迟增加 <10%，post-filter 召回率下降 15%-30%。
- **粒度细化**：段落/字段级权限需元数据 schema 扩展，代价是膨胀与复杂度。

## 要点拆解

### 一、权限变更传播

用户角色变更或文档密级调整后，向量库 metadata 和缓存需及时同步。采用事件驱动架构：

```python
@on_event("permission.changed")
def handle_permission_change(event):
    vector_db.update_metadata(
        filter={"doc_id": event.doc_id},
        update={"roles": event.new_roles, "classification": event.new_level}
    )
    cache.delete_pattern(f"rag:answer:*:{event.doc_id}:*")
```

### 二、性能基准

在同一查询集上分别测试 pre-filter 和 post-filter 两种模式：

| 指标 | pre-filter | post-filter |
|------|-----------|-------------|
| P99 延迟增加 | <10% | 较低 |
| 召回率@K | 无明显损失 | 下降 15%-30% |
| 过滤开销占比 | 引擎层承担 | 业务层承担 |

### 三、段落/字段级权限细化

元数据 schema 增加 section_id 和 field_name 维度，入库时按段落/字段独立标注权限。典型场景：员工档案中基本信息全员可见，薪资字段仅 HR 可见。

## 相关页面

- [[RAG权限隔离全链路架构]]：全链路架构
- [[检索前置过滤机制]]：核心机制
- [[检索漏斗坍塌]]：反模式
- [[权限元数据绑定]]：入库层
- [[上下文最小化]]：上下文层
- [[缓存隔离]]：缓存层
- [[审计与越权监控]]：审计层
- [[分层权限模型]]：权限模型
- [[段落字段级权限细化]]：细粒度权限
- [[向量库metadata过滤能力对比]]：向量库选型

## 参考来源

- [[raw/papers/RAG知识库权限隔离.md]]
