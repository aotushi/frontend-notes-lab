# 同源策略与跨域

## 问题

什么是同源策略？如何解决跨域问题？正向代理和反向代理的区别？Nginx 的工作原理？

## 结论

### 什么是同源策略

同源策略（Same-Origin Policy）要求**协议、域名、端口**三者必须一致，是浏览器隔离潜在恶意资源的重要安全机制。

**限制范围（JS 脚本）：**
- 不能访问其他源下的 Cookie、localStorage、indexedDB
- 不能操作其他源的 DOM
- 不能发送跨域 AJAX 请求

注意：`<img>`、`<script>`、`<link>` 等标签加载资源不受同源策略限制（不通过响应结果进行危险操作）。

### 如何解决跨域问题

#### CORS（跨域资源共享）

最标准的解决方案，由服务器在响应头中声明允许的跨域来源。

**简单请求**（方法为 GET/POST/HEAD，请求头字段受限）：浏览器直接发请求，带 `Origin` 头，服务器返回 `Access-Control-Allow-Origin`。

**非简单请求**（如 PUT/DELETE 或自定义头）：浏览器先发 **OPTIONS 预检请求**，服务器响应后再发真实请求。

```http
# 服务器响应头（最少需要设置）
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Max-Age: 1728000   # 预检结果缓存时间（秒）
```

**跨域携带 Cookie 的三个条件：**
1. 请求设置 `withCredentials: true`
2. 服务器设置 `Access-Control-Allow-Credentials: true`
3. `Access-Control-Allow-Origin` 不能为 `*`，必须指定具体源

#### JSONP

利用 `<script>` 标签不受跨域限制的特性，通过 `src` 发起 GET 请求，服务端将数据包裹在回调函数中返回。

```javascript
var script = document.createElement('script');
script.src = 'http://api.domain2.com/data?callback=handleResponse';
document.head.appendChild(script);

function handleResponse(data) {
  console.log(data);
}
```

**缺点：** 仅支持 GET 请求，存在 XSS 风险。

#### postMessage 跨域

HTML5 API，适用于页面与 iframe、多窗口间通信：

```javascript
// 发送
iframe.contentWindow.postMessage(JSON.stringify(data), 'http://domain2.com');

// 接收
window.addEventListener('message', function(e) {
  console.log(e.data);
});
```

#### nginx 代理跨域

通过 Nginx 反向代理，将跨域请求转发到目标服务器，同时在响应头添加 CORS 字段：

```nginx
server {
    listen 81;
    server_name www.domain1.com;
    location / {
        proxy_pass http://www.domain2.com:8080;
        add_header Access-Control-Allow-Origin http://www.domain1.com;
        add_header Access-Control-Allow-Credentials true;
    }
}
```

#### Node.js 中间件代理跨域

原理与 Nginx 相同，通过 `http-proxy-middleware` 等中间件转发请求：

```javascript
// webpack-dev-server 配置（Vue/React 开发环境常用）
devServer: {
  proxy: {
    '/api': {
      target: 'http://www.domain2.com:8080',
      changeOrigin: true
    }
  }
}
```

#### document.domain + iframe（仅主域相同，子域不同）

两个页面均设置 `document.domain = 'domain.com'` 实现同域：

```javascript
// 父窗口
document.domain = 'domain.com';

// 子窗口（child.domain.com）
document.domain = 'domain.com';
console.log(window.parent.user); // 可访问父窗口变量
```

#### location.hash + iframe

利用 URL hash 不会触发页面刷新的特性，通过中间页 C 实现 A-B-A 的跨域通信链。

#### window.name + iframe

`window.name` 在跨域页面加载后仍保留（支持 2MB 数据），通过切换 iframe src 到同域代理页来读取数据。

#### WebSocket 跨域

WebSocket 协议本身支持跨域，可用于实时双向通信：

```javascript
var socket = io('http://www.domain2.com:8080');
socket.on('connect', function() {
  socket.on('message', function(msg) { console.log(msg); });
});
```

### 正向代理和反向代理的区别

两者结构相同（client → proxy → server），区别在于 proxy 是哪方设置的：

| 维度 | 正向代理 | 反向代理 |
| --- | --- | --- |
| **设置方** | 客户端设置 | 服务端设置 |
| **隐藏对象** | 隐藏真实客户端 | 隐藏真实服务器 |
| **典型用途** | 访问外网（翻墙代理） | 负载均衡、CDN |
| **客户端感知** | 客户端知道代理存在 | 客户端感知不到真实服务器 |

### Nginx 的概念及其工作原理

Nginx 是轻量级的 Web 服务器，也用于反向代理、负载均衡和 HTTP 缓存。

**工作模型：** 基于 **event-driven（事件驱动）** 的异步非阻塞模型（对比 Apache 的 process-based 模型）。

**架构：**
- 一个 **master process**：负责管理配置和 worker 进程
- 多个 **worker process**：每个 worker 可同时处理大量 HTTP 请求（通过 I/O 多路复用）

这使得 Nginx 在高并发场景下性能远优于每个请求独占一个进程的 Apache。

## 参考来源

- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
