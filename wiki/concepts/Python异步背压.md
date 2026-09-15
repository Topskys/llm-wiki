---
type: concept
source: [[raw/papers/面向SSE流式转发的背压与内存治理研究.md]]
description: "Python SSE背压实现范式：aiohttp用bytearray缓冲+asyncio.Event水位同步暂停读上游；FastAPI StreamingResponse生成器串行拉取天然自带背压，严禁先把数据攒进list再返回。"
created_at: 2026-09-14 23:20:00
updated_at: 2026-09-14 23:20:00
tags: [python, sse, backpressure, fastapi, aiohttp]
---

# Python异步背压

## 核心结论

- **aiohttp**：`bytearray`缓冲 + `asyncio.Event`水位同步，缓冲超限时暂停读上游，stall超时抛错主动断连。
- **FastAPI/httpx**：`StreamingResponse`用生成器**串行拉取天然自带背压**——只需逐chunk `yield`，消费端写不出去时生成器挂起、httpx流读取随之暂停；**严禁先把数据攒进list再返回**（会切断背压导致OOM）。
- 设置响应头`X-Accel-Buffering: no`通知nginx关闭代理缓冲。

## FastAPI代码骨架

```python
from fastapi.responses import StreamingResponse

async def stream_llm(payload, client):
    async with client.stream("POST", UPSTREAM_URL, json=payload) as resp:
        async for line in resp.aiter_lines():
            if line.startswith("data: "):
                yield f"{line}\n\n"

@app.post("/chat")
async def chat(req: Request):
    client = httpx.AsyncClient(timeout=httpx.Timeout(None, read=15))
    return StreamingResponse(stream_llm(await req.json(), client),
                             media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no"})
```

## 相关页面
- [[背压透传]]：第一层——TCP背压透传在各语言的落点
- [[SSE有界队列]]：第二层——Bytearray缓冲与队列的关系
- [[慢消费者处置]]：第三层——stall超时断连
- [[Node.js stream背压]]：Node.js对应实现范式
- [[入口网关水位熔断]]：X-Accel-Buffering在外层网关的配合

## 参考来源
- [[raw/papers/面向SSE流式转发的背压与内存治理研究.md]]