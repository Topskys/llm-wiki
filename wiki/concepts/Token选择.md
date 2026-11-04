---
type: concept
source: [[raw/papers/自适应推理.md]]
description: Token 选择跳过对输出贡献小的 token 或空间位置——视觉场景用动态分辨率、区域裁剪与 patch 选择，语言场景对应 token 剪枝与稀疏注意力中的 token 选择；Byte Latent Transformer 按字节熵动态切 patch 是同思想的序列粒度版本，难处切细、易处切粗。
created_at: 2026-11-04 10:00:00
updated_at: 2026-11-04 10:00:00
tags: [token_selection, dynamic_resolution, blt, adaptive_inference]
---

# Token 选择

## 核心结论

Token 选择是动「输入」维度的一支：跳过对输出贡献小的 token 或空间位置，把算力集中在信息密度高的区域。视觉场景用动态分辨率、区域裁剪与 patch 选择；语言场景对应 token 剪枝与稀疏注意力中的 token 选择。Byte Latent Transformer（BLT）按字节熵动态切 patch，是同一思想在序列粒度上的版本 [[4]](#ref-4)——难处切细、易处切粗。

## 要点拆解

### 三个层面

| 场景 | 手段 | 说明 |
|---|---|---|
| 视觉 | 动态分辨率 / 区域裁剪 / patch 选择 | 内容简单处用低分辨率，主体区域保留高分辨率 |
| 语言 | token 剪枝 | 直接丢弃低贡献 token，压缩有效序列 |
| 序列粒度 | BLT 字节熵切分 | 按 patch 熵决定切片粗细，替代固定分词器 [[4]](#ref-4) |

### 与稀疏注意力的关系

稀疏注意力里的 token 选择（如 DSA 的 Top-k KV 选择）在注意力输入侧筛选 token，与本页的序列级剪枝同属「输入维度的按需分配」，但选择对象是历史 KV 条目而非输入序列本身。机制细节见 [[DSA 稀疏注意力]] 与 [[Top-k 选择]]。

### 熵的作用

熵在 Token 选择中承担难度信号的角色：熵高 = 内容不确定 = 切细；熵低 = 可预测 = 切粗。与 [[难度信号]] 页的输出族信号同源，只是应用对象从「是否多算」变成「切多细」【推导】。

## 相关页面

- [[自适应推理]]：Token 选择所属的上位概念，动输入的一支。
- [[DSA 稀疏注意力]]、[[Top-k 选择]]：注意力输入侧的 token 选择分支。
- [[难度信号]]：熵谱系在切分决策中的复用。
- [[raw/papers/Token分词.md]]：固定分词与 BLT 动态切分对照的 raw 素材源文件。
- [[Tokenizer分词编码]]：固定分词机制本身，与「无分词器按熵切 patch」构成对照。

## 参考来源

[[raw/papers/自适应推理.md]]
