# Ajax、CORS 与浏览器缓存

## 问题

Ajax 是什么？如何创建 Ajax？Ajax 如何处理跨域和缓存？

## 结论

Ajax 指页面不刷新，通过脚本向服务器请求数据并更新局部 UI 的技术模式。传统实现使用 `XMLHttpRequest`，现代项目通常使用 `fetch`。

```js
const response = await fetch('/api/users', {
  method: 'GET',
  headers: {
    Accept: 'application/json'
  }
});

const users = await response.json();
```

Ajax 跨域受同源策略限制。标准方案是 CORS，由服务端返回允许的响应头；前端代理只是在开发或服务端层面转发请求，不能让浏览器忽略安全模型。

```http
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Credentials: true
```

携带 Cookie 时，不能使用 `Access-Control-Allow-Origin: *`，还需要前端设置：

```js
fetch('https://api.example.com/profile', {
  credentials: 'include'
});
```

### 同源策略的三种限制

浏览器同源策略要求协议、域名、端口三者全部相同。限制分三类：

| 限制类型 | 说明 |
| --- | --- |
| DOM 限制 | 不能通过脚本读取不同源 iframe 的 DOM |
| Web 数据限制 | `localStorage`、`IndexedDB`、`Cookie` 按域名隔离 |
| 网络限制 | XHR / fetch 只能访问同源资源（浏览器拦截**响应**） |

> 注意：同源策略拦截的是**响应**，不一定阻止请求发出。简单请求会先发出再被浏览器拦截；非简单请求先发 OPTIONS 预检，通过后才发真实请求。

### 简单请求与预检请求（POST 为什么发两次请求）

"POST 发两次请求"是 CORS 预检机制导致的——第一次是浏览器自动发出的 OPTIONS 预检，第二次才是真正的 POST。

**简单请求**条件（以下全部满足才是简单请求，直接发出、不预检）：

- 方法为 `GET`、`HEAD`、`POST` 之一
- `Content-Type` 仅限：`text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded`
- 没有自定义请求头（如 `Authorization`、`X-Custom-Header`）
- 不涉及 `ReadableStream` 或 XHR Upload 事件监听

**不满足上述任一条件，都会先触发 OPTIONS 预检**：

```http
OPTIONS /api/data HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

服务端返回允许信息后，浏览器才发出真实请求：

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

`Access-Control-Max-Age` 指定预检结果的缓存秒数，有效期内相同请求不再预检。

**携带凭证时不能用通配符 `*`**：带 Cookie 的跨域请求，`Allow-Origin`、`Allow-Headers`、`Allow-Methods` 必须明确指定值：

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

### Webpack devServer proxy 原理

开发时的 proxy 不改变浏览器安全模型，而是绕过它：

1. 浏览器请求 `localhost:3000/api/data`（同源，不触发 CORS）
2. 开发服务器以**服务端**身份转发给目标 API
3. 服务端间通信不受同源策略约束
4. 响应原样返回给浏览器

生产环境需要真正的 CORS 响应头或反向代理配置。

Ajax 缓存问题优先由 HTTP 缓存头控制，例如 `Cache-Control`、`ETag`、`Last-Modified`。临时绕过缓存可以给 URL 添加版本号或时间戳，但长期方案应该是正确缓存策略。

```js
fetch(`/api/list?v=${buildVersion}`);
```

旧题常问 Ajax 与 Flash。现代回答可以说明 Flash 已退出主流 Web 平台，不适合作为新项目方案；Ajax/fetch 是标准 Web 能力。

## Demo

XMLHttpRequest 版本：

```js
function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
}
```

面试回答：

> Ajax 是不刷新页面发起异步请求并局部更新 UI 的模式，传统用 XHR，现代多用 fetch。跨域由浏览器同源策略限制（协议/域名/端口三同），标准方案是服务端配置 CORS。POST 带自定义头或 JSON 类型会触发 OPTIONS 预检，这就是"发两次请求"的原因。带 Cookie 时 Allow-Origin 等不能用通配 `*`。开发代理只是在服务端转发，绕过了浏览器限制，生产仍需真实 CORS。缓存问题应优先用 HTTP 缓存头解决，时间戳只能算临时绕过。

## 参考来源

- [MDN: Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
