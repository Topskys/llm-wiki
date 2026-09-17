---
type: source
source: https://chatglm.cn/main/alltoolsdetail?t=1789393742280&lang=zh&cid=6aa7fb52bcfb614d92c665de
description: AI 对 SSE 上游快下游慢导致内存暴涨/OOM 的处理方案回答（含重生成 Node/Python 版）
created_at: 2026-09-14 15:10:00
tags: sse, backpressure, oom, streaming
---

# AI3：SSE 内存暴涨问题处理

> 来源：AI 回答（会话共享链接：https://chatglm.cn/main/alltoolsdetail?t=1789393742280&lang=zh&cid=6aa7fb52bcfb614d92c665de）

**问题**：你们用 SSE，上游大模型生成特别快，但是到下游（C 端）特别慢，会导致内存暴涨或者存在 OOM 风险，是怎么处理的？

## 一、问题根因

典型的**生产者-消费者速率不匹配**问题。本质：上游快、下游慢，如果中间应用层"贪心地"把上游数据全部读进来缓存在内存里，背压就断了，连接一多必然内存暴涨。

- SSE 是长连接，一个大模型生成回答可能持续几十秒、产生几 MB token；
- 下游客户端网络差、弱网、用户页面卡死，消费速度极慢；
- 如果服务端"边收边堆"到内存队列（先全量读完上游再往下发），单连接缓存没有上限 → 高并发下 OOM。

**核心原则**：不要打破背压，让它**透传**。下游写不进去时，就暂停读上游，让内核 TCP 窗口收缩，上游网关自然减速。

## 二、核心手段：背压透传

错误写法（把上游响应整个读进内存）：

```go
// ❌ 错误：把上游响应整个读进内存
body, _ := io.ReadAll(resp.Body)  // 背压完全失效
```

正确做法是流式转发 + 有界缓冲：

- **Go**：用 `io.Copy` / 自定义 reader 逐块转发；下游 Write 阻塞或出错时，通过 context 取消上游请求，读端自然停住。
- **Netty/Java**：检查 `channel.isWritable()`，不可写时暂停读上游（`channel.config().setAutoRead(false)`），可写时恢复。
- **Node.js**：利用 stream 自带的 `highWaterMark`，`write()` 返回 false 时 `pause()` 上游可读流，drain 后 `resume()`。
- **Reactor/WebFlux**：用有界的背压策略，如 `onBackpressureBuffer(maxSize)` / `onBackpressureDrop`，禁止无界 buffer。

### Node.js 版本（利用 stream 的 highWaterMark 背压）

```javascript
const http = require('http');
const axios = require('axios');
const { Transform } = require('stream');

const HIGH_WATER_MARK = 64 * 1024;   // 单连接缓冲上限
const STALL_TIMEOUT = 15_000;        // 持续阻塞 15s 判定为慢连接

async function handleChat(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');  // 关闭 nginx 缓冲
  res.flushHeaders();

  const abortController = new AbortController();

  let stallTimer = setTimeout(() => {
    abortController.abort();
    res.destroy(new Error('slow consumer'));
  }, STALL_TIMEOUT);

  try {
    const upstream = await axios.post(
      'https://upstream-llm-api/v1/chat/completions',
      { /* ... */ stream: true },
      {
        responseType: 'stream',
        signal: abortController.signal,
        headers: { Authorization: `Bearer ${process.env.LLM_KEY}` },
      }
    );

    upstream.data.on('data', () => clearTimeout(stallTimer));
    upstream.data.on('data', () => {
      stallTimer = setTimeout(() => {
        abortController.abort();
        res.destroy(new Error('slow consumer'));
      }, STALL_TIMEOUT);
    });

    // 关键：pipe 会自动处理背压。下游 res 写缓冲超过 highWaterMark 时，
    // write() 返回 false，Node 内部自动 pause() 上游可读流，drain 后自动 resume()
    upstream.data.pipe(
      new Transform({
        highWaterMark: HIGH_WATER_MARK,
        transform(chunk, _, cb) {
          cb(null, chunk);
        },
      })
    ).pipe(res);
  } catch (err) {
    res.destroy();
  }

  req.on('close', () => abortController.abort());  // 客户端断开时取消上游
}
```

不用 pipe 而手动转发时必须自己处理背压（最易踩坑）：

```javascript
// ❌ 错误：无脑异步写，缓冲无界增长
upstream.data.on('data', (chunk) => res.write(chunk));  // 返回 false 也不管

// ✅ 正确：手动处理背压
upstream.data.on('data', (chunk) => {
  const ok = res.write(chunk);
  if (!ok) {
    upstream.data.pause();              // 下游写不进去，暂停读上游
    res.once('drain', () => upstream.data.resume());  // 排空后恢复
  }
});
```

### Python 版本（aiohttp 有界缓冲 + stall 检测）

```python
import asyncio
import aiohttp
from aiohttp import web

HIGH_WATER_MARK = 64 * 1024   # 单连接有界缓冲
STALL_TIMEOUT = 15            # 持续阻塞 15s 判定为慢连接

async def handle_chat(request: web.Request) -> web.StreamResponse:
    resp = web.StreamResponse(
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # 关闭 nginx 缓冲
        }
    )
    await resp.prepare(request)

    timeout = aiohttp.ClientTimeout(total=None, sock_read=STALL_TIMEOUT)
    session = request.app["llm_session"]

    buffer = bytearray()
    stalled = False
    stall_event = asyncio.Event()

    async def upstream_to_buffer(session, payload):
        nonlocal stalled
        async with session.post(
            "https://upstream-llm-api/v1/chat/completions",
            json=payload,
            timeout=timeout,
        ) as upstream:
            async for chunk in upstream.content.iter_chunked(4096):
                buffer.extend(chunk)
                # ✅ 背压：缓冲超限时 await，暂停从上游读取
                while len(buffer) >= HIGH_WATER_MARK:
                    stalled = True
                    try:
                        await asyncio.wait_for(stall_event.wait(), STALL_TIMEOUT)
                    except asyncio.TimeoutError:
                        raise web.HTTPServiceUnavailable(text="slow consumer")
                    stall_event.clear()
                stalled = False

    task = asyncio.create_task(upstream_to_buffer(session, await request.json()))

    try:
        while not task.done() or buffer:
            if buffer:
                await resp.write(bytes(buffer))
                buffer.clear()
                stall_event.set()  # 通知可以继续填充
            else:
                await asyncio.sleep(0.01)  # 等上游产出
        await resp.write_eof()
    except (asyncio.TimeoutError, ConnectionResetError):
        pass  # 慢消费者 / 客户端断开，主动断连
    finally:
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task
    return resp
```

FastAPI + httpx 更简洁（StreamingResponse 生成器串行拉取，天然自带背压）：

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import httpx

app = FastAPI()

async def stream_llm(payload: dict, client: httpx.AsyncClient):
    # ✅ 逐 chunk yield，消费端（ASGI 服务器）写不出去时
    # 生成器会挂起，httpx 流读取随之暂停 → 背压自动透传
    async with client.stream("POST", UPSTREAM_URL, json=payload) as resp:
        async for line in resp.aiter_lines():
            if line.startswith("data: "):
                yield f"{line}\n\n"

@app.post("/chat")
async def chat(request: dict):
    client = httpx.AsyncClient(timeout=httpx.Timeout(None, read=15))
    return StreamingResponse(
        stream_llm(request, client),
        media_type="text/event-stream",
        headers={"X-Accel-Buffering": "no"},
    )
```

```python
# ❌ Python 里最典型的错误写法：先攒完再返回
chunks = []
async for line in resp.aiter_lines():
    chunks.append(line)   # 背压完全失效，上游多快内存涨多快
return StreamingResponse(iter(chunks), ...)
```

## 三、应用层策略

### 1. 有界队列 + 明确的溢出策略

每条连接的发送缓冲设上限（如 256KB 或 N 个 chunk），超限后按业务选择：

- 丢弃并断开（推荐：聊天场景宁可断线重连）；
- 合并压缩 chunk（把多个 delta 合并成大块再 flush，降低写次数）。

### 2. 慢消费者识别与主动断开

监控每个连接的：

- 缓冲区水位、排空速率（drain rate）；
- 连续"写阻塞"时长。

超过阈值（如缓冲持续满 10s）判定为慢连接，主动断开。**关键配套是断线续传**：把会话内容增量落盘（Redis / DB），客户端带 Last-Event-ID 或上传 offset 重连时从断点续传。有了兜底才敢激进杀慢连接，不怕用户丢内容。

### 3. 上游结束后残余数据的处理

上游已生成完、客户端还剩一大坨没发出去：

- 设排空超时（如 30s），超时断开，内容已落盘可恢复；
- 极端情况可 spill 到磁盘，不占堆内存。

## 四、入口层与资源保护

### 1. 代理层配置

关闭响应缓冲（`X-Accel-Buffering: no`、nginx `proxy_buffering off`），避免数据被代理层整段缓冲。但注意：适度的代理层缓冲其实能隔离慢客户端、保护后端，要按场景权衡 buffer 大小。

### 2. 全局水位控制

- 单机连接数上限、单用户并发 SSE 数限制；
- 进程内存水位监控（如超 70% 熔断新请求、超 85% 强制踢掉最慢的一批连接），做 **load shedding** 而不是等 OOM；
- Python 多进程部署（gunicorn/uvicorn workers）时每个 worker 的连接数要单独限制。

### 3. 超时兜底

下游 idle timeout、整体响应超时，防止僵尸连接长期占用缓冲。

## 五、监控指标

- 每连接缓冲字节数 / 队列深度的分布；
- 慢连接数量、主动断开率、续传成功率；
- 慢连接占比突增往往意味着下游网络故障或攻击，可作为告警信号。

## 总结

一句话版本：**流式转发保持背压透传（Node 的 pipe/drain、Python 的 async 生成器）+ 有界缓冲 + 慢连接检测主动断开 + 内容落盘支持断线续传 + 全局内存水位熔断**。其中"落盘 + 续传"是工程上最优雅的一环，它把"内存里扛住慢消费者"的问题，转化成了"随时可以安全断开慢消费者"的问题。