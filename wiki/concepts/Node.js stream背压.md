---
type: concept
source: [[raw/papers/面向SSE流式转发的背压与内存治理研究.md]]
description: "Node.js SSE背压实现范式：res.write返回false时pause上游、drain后resume的手动转发；pipe()内建highWaterMark自动背压；15s stall检测主动中断慢连接。"
created_at: 2026-09-14 23:20:00
updated_at: 2026-09-14 23:20:00
tags: [nodejs, sse, backpressure, stream]
---

# Node.js stream背压

## 核心结论

- Node的`pipe()`内建背压：写缓冲超`highWaterMark`（默认16KB）时自动`pause`上游，`drain`后`resume`，一行`upstream.data.pipe(res)`即可安全转发。
- 手动转发（需暴露背压状态以做慢连接判定）时：`res.write()`返回**false**即进入背压态——`pause`上游、`drain`后`resume`，绝不能无脑`on('data')`直接写。
- 慢连接检测：记录下游写阻塞起始时间，15s内未`drain`则`ac.abort()`取消上游并`res.destroy`。

## 手动转发代码骨架

```javascript
// 核心：write 返回 false → pause 上游；drain → resume
upstream.data.on('data', (chunk) => {
  if (res.write(chunk)) return;
  upstream.data.pause();               // 写缓冲满，暂停读上游
  res.once('drain', () => {
    upstream.data.resume();            // 排空后恢复
  });
});
```

## 相关页面
- [[背压透传]]：第一层——TCP背压透传在各语言的落点
- [[SSE有界队列]]：第二层——highWaterMark与有界队列的关系
- [[慢消费者处置]]：第三层——stall检测与主动断开
- [[Python异步背压]]：Python对应实现范式

## 参考来源
- [[raw/papers/面向SSE流式转发的背压与内存治理研究.md]]