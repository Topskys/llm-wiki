---
type: source
source: https://www.doubao.com/chat/38441372338426114
description: 豆包 AI 对 SSE 上游快下游慢导致内存暴涨/OOM 的处理方案回答
created_at: 2026-09-14 15:06:00
tags: sse, backpressure, oom, streaming
---

# AI1 豆包：SSE 上游快下游慢内存暴涨/OOM 处理方案

> 来源：豆包 AI 回答（会话共享链接：https://www.doubao.com/chat/38441372338426114）

**问题**：你们用 SSE，上游大模型生成特别快，但是到下游（C 端）特别慢，会导致内存暴涨或者存在 OOM 风险，是怎么处理的？

## 核心根源

SSE 是单向流式推送，上游大模型 token 输出速率 > 下游用户浏览器/客户端接收速率，消息在服务端内存排队积压，队列持续膨胀，最终 OOM。

- 大模型推理侧（vLLM/Ollama 这类）吐 token 很快；但 C 端网络弱、客户端渲染慢、TCP 滑动窗口小，服务端 write 阻塞，消息塞在内存缓冲区。
- SSE 原生没有内置背压反馈机制，不会自动让上游 LLM 降速。

## 一、问题拆解

- **SSE 协议特性**：服务端 `Transfer-Encoding: chunked`，长连接持续 write。客户端读得慢时 `res.write()` 会阻塞或数据堆积在 Node/Python Web 框架的内存缓冲区。
- **LLM 推理是独立异步生产者**：推理进程/协程源源不断吐 token，不知道下游消费速度，不会自动暂停。生产者速率 > 消费者速率 → 消息队列无限增长。

### 两种典型内存暴涨场景

- **场景 A**：框架内部缓冲区堆积（Node.js 的 response buffer、Python aiohttp/starlette 的 write queue），服务端进程内存持续涨。
- **场景 B**：自己手动维护内存队列，把 LLM token 丢进数组/`asyncio.Queue`，不设上限，慢客户端连接直接塞满队列。

一句话：LLM 生产者和 SSE 客户端消费者之间缺少背压控制，没有限流 + 队列上限。

## 二、分层解决方案（从简单到生产级）

### 1. 有界队列 + 丢弃/暂停上游（最核心）

生产者（LLM 输出）不能无脑推，加带最大长度的阻塞队列做背压：

- 队列满时：暂停向 LLM 拉取 token（不直接丢弃，对话场景不能丢 token）；
- 当队列水位下降，恢复消费 LLM 输出；
- 每个 SSE 连接独立队列，不要全局共享队列，防止一个慢用户拖垮所有连接。

要点：不是缓存已生成好的大量 token 在内存，而是**控制上游大模型的生成节奏**。vLLM / OpenAI 兼容接口支持中途中断生成，队列满时可暂停迭代器/取消请求。

伪代码（异步逻辑示意）：

```python
# 每个用户连接单独队列，设置最大容量
queue = asyncio.Queue(maxsize=30)

async def llm_producer():
    async for token in llm_stream():
        # 队列满时，put 会阻塞，自动背压，LLM 停止拉新 token
        await queue.put(token)

async def sse_consumer(res):
    while True:
        token = await queue.get()
        res.write(f"data: {token}\n\n")
        await res.drain()  # drain() 关键！等待底层缓冲区刷到网络，感知客户端慢
```

`await res.drain()` 就是拿到 TCP 层背压：客户端接收慢时 drain 会阻塞，让消费变慢，反向阻塞生产者队列。

### 2. 队列水位策略，区分保护策略

- **低水位**：正常全速推
- **高水位**：通知上游推理降采样/降低吐 token 速度（如果大模型支持）
- **硬上限**：队列达到最大 size
  - 对话场景：暂停 LLM 生成，不再产生新 token，等待客户端消费；
  - 非关键场景（日志、非实时摘要）：可丢弃旧消息。

### 3. 连接超时、断连检测，及时释放资源

- SSE 连接设置读写超时；
- 监听客户端断开事件（close 事件），立刻取消 LLM 推理任务，清空该连接队列，释放内存；
- 心跳包（SSE `: ping\n\n`），检测僵死连接，超时直接关闭连接，终止 LLM 请求。

> 坑：很多实现只监听 http close，但忘记取消正在运行的大模型推理任务，LLM 还在后台疯狂生成 token，白白占用 GPU + 内存。

### 4. 缓冲区优化，避免框架内部 buffer 膨胀

- 每次 write 之后调用 `res.drain()`，不要批量攒大量消息一次性 write；
- 不要手动拼接超大字符串；尽量小块写入；
- 关闭不必要的服务端侧缓冲。

### 5. 推理侧架构层面隔离（大规模场景）

多用户并发场景，单进程托管 SSE+LLM 很容易 OOM，建议分离：

```text
Client <--> API Gateway/SSE服务（无GPU，只做SSE长连接、背压、队列管理） <--> LLM推理集群（vLLM等）
```

- SSE 服务：纯 CPU，只管理长连接、队列、背压，不跑模型；
- LLM 推理集群：独立服务，支持取消/暂停生成，支持 OpenAI 兼容 stream 接口；
- 两者之间通过 HTTP/grpc stream 通信；SSE 服务作为中间层，控制每个用户 token 拉取速率。
- 好处：SSE 服务 OOM 不会影响推理，推理扩容和 SSE 长连接扩容解耦。

### 6. 降级策略（极端保护，防止雪崩）

- 全局连接上限：限制同时在线 SSE 连接总数；
- 单连接 token 速率限流：限制每秒推多少 token；
- 内存监控告警：进程内存达到阈值，拒绝新 SSE 连接。

## 三、常见踩坑点

- ❌ 只用无限队列，`queue.put()` 永不阻塞，LLM 疯狂塞 token，内存爆炸。
- ❌ 忘记 `drain()`，write 直接丢进内核 buffer，业务代码感知不到客户端慢，看不到背压。
- ❌ 客户端断开后没有取消 LLM 请求，GPU 持续生成 token 扔到已失效的连接队列。
- ❌ 全局队列：一个慢用户阻塞所有用户。
- ❌ 把完整历史文本全部存在 SSE 连接内存，只保留待推送 token，历史放 Redis / 外部存储。

## 四、额外方案：分片/缓冲落盘（超大流量，慎用）

业务容忍少量延迟时，队列高水位可把待发送 token 临时写到本地磁盘 / Redis stream，而不是全放内存。缺点：增加 IO 延迟；对话场景一般优先用背压暂停 LLM 生成，而不是落盘。

## 五、选型参考（不同语言）

- **Python Starlette/FastAPI**：`await response.drain()` + per-connection bounded async queue
- **Node.js**：`res.write()` + `res.drain()`，每个连接单独 pipeline 队列，on close 终止上游 fetch stream
- **Go**：`http.ResponseController` 控制 flush，利用 `io.Writer` 天然背压

## 一句话总结

SSE 下游慢，不能只靠服务端缓存 token；必须做「每个连接独立有界队列 + drain 感知 TCP 背压 + 队列满时暂停/取消上游 LLM 生成 + 断连立刻回收推理任务」，从源头阻止 token 持续生产，避免内存无限堆积。