# HTTP 各版本特性与协议细节

## 问题

HTTP 1.0、1.1、2.0、3.0 各有什么区别？POST 和 PUT 有什么区别？请求/响应报文的结构是什么？URL 由哪些部分组成？

## 结论

### HTTP 1.0 vs HTTP 1.1

| 维度 | HTTP/1.0 | HTTP/1.1 |
| --- | --- | --- |
| 连接方式 | 默认短连接，每次请求新建 TCP | 默认长连接（Keep-Alive），同一 TCP 复用 |
| 资源请求 | 只能请求完整资源 | 支持 `Range` 头部分请求（响应 206 Partial Content） |
| 缓存控制 | `If-Modified-Since`、`Expires` | 新增 `ETag`、`If-None-Match`、`If-Unmodified-Since` 等 |
| 虚拟主机 | 无 `Host` 字段 | 必须携带 `Host` 字段，支持一台服务器多域名 |
| 新增方法 | — | PUT、DELETE、HEAD、OPTIONS、PATCH |

### HTTP 1.1 vs HTTP 2.0

| 特性 | HTTP/1.1 | HTTP/2.0 |
| --- | --- | --- |
| 编码 | 文本（ASCII） | 二进制（帧，Frame） |
| 多路复用 | 串行请求，队头阻塞 | 同一 TCP 连接可并发多个请求/响应，无需按序 |
| 数据流 | — | 每个请求/响应是独立的数据流（Stream），有 Stream ID |
| 头部压缩 | 无（每次全量携带） | HPACK 算法：首部表索引 + 哈夫曼编码，压缩率 50%~90% |
| 服务器推送 | 不支持 | 支持（静态资源预推送） |

**队头阻塞**：HTTP/1.1 中请求必须按顺序处理，队首请求慢会阻塞后续请求。HTTP/2 在应用层解决了这个问题，但 TCP 层仍有队头阻塞（丢包需等待重传）。

### HTTP 3.0 (QUIC)

HTTP/3 基于 UDP 实现，通过 QUIC 协议提供类 TCP 的可靠传输：

- **流量控制与可靠性**：QUIC 在 UDP 之上添加了重传、拥塞控制等机制
- **集成 TLS 1.3**：握手时直接加密，减少 RTT 数
- **多路复用**：独立逻辑数据流，彻底解决 TCP 层队头阻塞
- **快速握手**：0~1 个 RTT 建立连接（相比 TCP+TLS 需要 3 个 RTT）

### POST vs PUT 区别

| | POST | PUT |
| --- | --- | --- |
| 语义 | **创建**新资源 | **更新/替换**已有资源 |
| 幂等 | 否（多次提交可能创建多条） | 是（多次请求结果相同） |
| 典型场景 | 提交表单、新增订单 | 更新用户信息、替换文件 |

### 常见 HTTP 请求方法

| 方法 | 说明 |
| --- | --- |
| GET | 获取资源（幂等、可缓存） |
| POST | 提交数据，创建资源（非幂等） |
| PUT | 更新/替换资源（幂等） |
| DELETE | 删除资源 |
| HEAD | 只获取响应头，不返回 body（常用于检测资源是否存在） |
| OPTIONS | 查询服务器支持的方法，也用于 CORS 预检 |
| PATCH | 局部修改资源（与 PUT 区别：非完整替换） |
| CONNECT | 建立 TCP 隧道（常用于 HTTPS 代理） |

### 常见请求头与响应头

**请求头（Request Headers）：**

| 头部 | 说明 |
| --- | --- |
| `Accept` | 客户端能处理的内容类型 |
| `Accept-Encoding` | 支持的压缩格式（gzip、br 等） |
| `Accept-Language` | 语言偏好 |
| `Authorization` | 认证信息（Bearer Token 等） |
| `Cache-Control` | 缓存控制指令 |
| `Connection` | 连接类型（keep-alive / close） |
| `Content-Type` | 请求体的媒体类型 |
| `Cookie` | 当前域的 Cookie |
| `Host` | 请求目标的域名:端口 |
| `Referer` | 请求来源页面 URL |
| `User-Agent` | 浏览器/客户端标识 |

**响应头（Response Headers）：**

| 头部 | 说明 |
| --- | --- |
| `Cache-Control` | 缓存策略 |
| `Content-Type` | 响应体类型（含 charset） |
| `Content-Encoding` | 响应体压缩方式 |
| `ETag` | 资源版本标识（协商缓存） |
| `Last-Modified` | 资源最后修改时间（协商缓存） |
| `Location` | 重定向目标地址 |
| `Set-Cookie` | 设置 Cookie |
| `Server` | 服务器软件信息 |

### HTTP 报文结构

**请求报文（4部分）：**

```
请求行：GET /index.html HTTP/1.1
请求头：Host: example.com\nAccept: text/html\n...
空行
请求体：（GET 无 body；POST/PUT 携带数据）
```

**响应报文（4部分）：**

```
响应行：HTTP/1.1 200 OK
响应头：Content-Type: text/html\nContent-Length: 1234\n...
空行
响应体：<html>...</html>
```

### URL 组成部分

`http://www.example.com:8080/news/index.html?id=1&page=2#section`

| 部分 | 示例 | 说明 |
| --- | --- | --- |
| 协议 | `http:` | 传输协议（http/https/ftp 等） |
| 域名 | `www.example.com` | 也可以是 IP 地址 |
| 端口 | `:8080` | 可省略（HTTP 默认 80，HTTPS 默认 443） |
| 虚拟目录 | `/news/` | 从第一个 `/` 到最后一个 `/` |
| 文件名 | `index.html` | 最后一个 `/` 到 `?` 之间 |
| 参数 | `?id=1&page=2` | `?` 到 `#` 之间，多个参数用 `&` 分隔 |
| 锚点 | `#section` | `#` 之后，定位页面内位置 |

### 与缓存相关的 HTTP 请求头

**强缓存（不发请求，直接用缓存）：**

- `Cache-Control: max-age=3600`：指定缓存有效期（秒），优先级高于 Expires
- `Expires: Thu, 01 Dec 2026 00:00:00 GMT`：HTTP/1.0 遗留，绝对时间

**协商缓存（发请求验证，服务器返回 304 则用缓存）：**

- `ETag` / `If-None-Match`：资源哈希标识，精确比较
- `Last-Modified` / `If-Modified-Since`：最后修改时间，秒级精度

### 刷新操作对缓存的影响

| 操作 | 行为 |
| --- | --- |
| 地址栏回车 | 正常缓存流程：先检查强缓存，命中则直接用；否则发协商缓存请求 |
| F5 / 浏览器刷新按钮 | 跳过强缓存，携带 `If-Modified-Since` / `If-None-Match` 发协商请求，可能返回 304 或 200 |
| Ctrl+F5 强制刷新 | 完全绕过缓存，不携带条件请求头，服务器必须返回完整资源（200） |

### OPTIONS 请求方法及使用场景

OPTIONS 用于请求获得由 `Request-URI` 标识的资源在通信过程中可以使用的功能选项，该请求的响应**不能缓存**。

**主要用途**：
1. **获取服务器支持的所有 HTTP 请求方法**
2. **CORS 预检请求**：跨域复杂请求发送前，浏览器先发 OPTIONS 嗅探，判断服务器是否允许该跨域请求（检查 `Access-Control-Allow-Origin`、`Access-Control-Allow-Methods` 等响应头）

### GET 方法 URL 长度限制的原因

HTTP 协议规范本身**没有**对 GET 请求 URL 长度做限制，限制来自特定浏览器和服务器的实现。

各浏览器限制参考：
- IE：最大 2083 字符（最小值，以此为基准最安全）
- Firefox：65,536 字符
- Safari：80,000 字符
- Chrome：8182 字符

各服务器限制参考：
- Apache：8192 字符
- IIS：16,384 字符

实际开发中，URL 不超过 **2083 字符**可保证在所有主流浏览器和服务器中正常工作。

### 页面有多张图片，HTTP 是怎样的加载表现

- **HTTP/1 下**：浏览器对同一域名最大 TCP 连接数为 6，超过 6 张图片需要多次请求排队。可通过**多域名部署**（CDN 分散域名）提高并发请求数。
- **HTTP/2 下**：支持**多路复用**，可在一条 TCP 连接中并发发送多个 HTTP 请求，图片可接近同时加载，无需多域名分散。

### HTTP/2 的头部压缩算法

HTTP/2 使用 **HPACK 算法**进行头部压缩，压缩率可达 50%~90%。

原理：
- 客户端和服务端两端各维护一张**首部表**（Header Table）
- 对于相同的头部字段，后续请求不再重复发送，只发送**索引号**
- 首部表在连接存续期内始终存在，由双方共同渐进更新
- 整数和字符串采用**哈夫曼编码**压缩

例如第一次请求发送所有头部字段，第二次请求只需发送变化的字段，大幅减少冗余数据。

### HTTP 协议的性能

HTTP 性能关键在于底层 TCP 连接和请求-应答模型：

**长连接**（影响建立连接开销）：
- HTTP/1.0：默认短连接，每次请求新建 TCP，串行处理
- HTTP/1.1：默认长连接（Keep-Alive），多请求复用同一 TCP，同域名最多 6 条持久连接

**管道化网络传输**（HTTP/1.1）：
- 同一 TCP 连接内可不等响应就发出第二个请求，减少整体响应时间
- 但服务器仍按顺序回应，队首慢则后续全部排队等待

**队头阻塞（Head-of-Line Blocking）**：
- 请求队列中队首处理慢会阻塞后续所有请求
- 解决方案：
  1. **并发连接**：对一个域名允许多条长连接（增加队列数）
  2. **域名分片**：将静态资源分散到多个二级域名，变相增加并发连接数

HTTP/2 通过多路复用在应用层彻底解决了队头阻塞，HTTP/3 基于 UDP（QUIC）进一步解决了 TCP 层的队头阻塞。

## 参考来源

- [MDN: HTTP/1.x connection management](https://developer.mozilla.org/en-US/docs/Web/HTTP/Connection_management_in_HTTP_1.x)
- [MDN: HTTP/2](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2)
- [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114)
- [MDN: HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
