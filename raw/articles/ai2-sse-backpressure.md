---
type: source
source: https://chat.deepseek.com/a/chat/s/9c925d7b-8a24-48ed-b6f1-cacd9e64719e
description: AI 对 SSE 上游快下游慢导致内存暴涨/OOM 的处理方案回答
created_at: 2026-09-14 15:13:00
tags: sse, backpressure, oom, streaming
---

# AI2：SSE 上游快下游慢内存暴涨/OOM 怎么处理

> 来源：AI 回答（会话共享链接：https://chat.deepseek.com/a/chat/s/9c925d7b-8a24-48ed-b6f1-cacd9e64719e）

**问题**：你们用 SSE，上游大模型生成特别快，但是到下游（C 端）特别慢，会导致内存暴涨或者存在 OOM 风险，是怎么处理的？

## 核心结论

不能靠加大内存或无界队列扛，必须做背压；SSE 本身只有 TCP 层背压，没有应用层流控。持续「上游生产 > 下游消费」时，内存迟早爆。最终只能选：**让上游慢下来、丢弃/合并、落盘/转异步，三者至少一个**。

一般分几层处理：

## 1. 应用层：有界缓冲 + 背压，不要无界 channel

最稳的是**同步转发**：从上游读一块，立即写下游，写阻塞就不读上游。这样下游 TCP 接收窗口变小，会自然反压到代理，代理不再读上游 Body，上游 TCP 窗口也会变小。

如果为了解耦必须用队列，一定要**有界队列**，例如 `chan []byte` 容量 32/64。队列满时阻塞上游读取，而不是继续读。

禁止：

- 无界 channel
- 无界 bytes.Buffer
- 先把整个模型结果拼完再发
- 单独起一个 goroutine 无限读上游塞队列

Go 伪代码：

```go
ch := make(chan []byte, 64)

go func() { // 上游读
    defer close(ch)
    for {
        ev, err := readUpstreamEvent(upstream)
        if err != nil {
            return
        }
        select {
        case ch <- ev: // 队列满会阻塞，从而不再读上游
        case <-ctx.Done():
            return
        }
    }
}()

for ev := range ch {
    rc := http.NewResponseController(w)
    rc.SetWriteDeadline(time.Now().Add(5 * time.Second))
    if _, err := w.Write(ev); err != nil {
        cancel() // 下游断了/太慢，取消上游
        return
    }
    flusher.Flush()
}
```

## 2. 写超时 + 断连取消

慢 C 端不能无限等。每次写设置写超时（比如 5s）；空闲超时 30s；总生成超时按业务设。客户端断开时 `request.Context()` 会取消，要立刻取消上游请求，避免上游继续生成、代理继续占内存。

## 3. 网关/反向代理关闭 buffering

Nginx/Envoy 很容易把 SSE 缓冲起来。Nginx 要：

```nginx
proxy_buffering off;
proxy_cache off;
proxy_read_timeout 3600s;
send_timeout 60s;
```

响应头加：

```http
X-Accel-Buffering: no
```

Envoy 也要限制 per-connection buffer，溢出直接断开，而不是无限缓存。

## 4. 全局资源限制

- 单连接缓冲上限，比如 256KB～1MB；
- 全局内存配额；
- SSE 并发连接数限制；
- 租户限流。
- 慢连接本身也占内存，100 万慢连接每连接几十 KB 也很可怕。
- 用 cgroup 隔离流式代理，OOM 不影响核心服务。

## 5. 慢消费者策略

- 首选：暂停读上游，让 TCP 背压。
- 上游不可暂停：取消上游，发 `event: error`，让客户端用 message_id 重新拉完整结果。
- 可丢事件：合并 token，比如 20ms 或 4KB 批量 flush，减少下游事件数；极端时只保留最新片段。
- 要求完整：落盘或写 Redis Stream/Kafka，SSE 只做通知，客户端慢拉。
- 熔断：队列水位持续过高，直接踢掉最慢连接，保护整体。

## 6. 监控

重点看：队列水位、写阻塞时间、上游读取速率、下游写入速率、慢客户端数、SSE 并发数、OOM 指标。没有这些，出问题只能猜。

## 一句话

同步转发/有界队列做背压，写超时和断连取消兜底，网关关 buffering，全局限流隔离，慢到不可救就降级到异步拉取或断开。