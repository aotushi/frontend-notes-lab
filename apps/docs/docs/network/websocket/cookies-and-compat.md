# WebSocket Cookie 与兼容问题

## 问题

WebSocket 可以携带 Cookie 吗？为什么？如何兼容低版本浏览器？

## 结论

WebSocket 握手从 HTTP/HTTPS 请求开始，浏览器会按同源和 Cookie 规则在握手请求中携带匹配的 Cookie。握手成功后连接升级为 WebSocket，后续消息不再是普通 HTTP 请求，也不会每条消息自动带 Cookie。

示例握手请求大致包含：

```http
GET /socket HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Cookie: sid=...
```

注意点：

- `ws://` 对应非加密连接，`wss://` 对应加密连接。
- HTTPS 页面中应使用 `wss://`，避免混合内容和安全问题。
- 跨站 WebSocket 握手是否携带 Cookie 会受到 Cookie 的 `SameSite`、`Secure`、域名等规则影响。
- 服务端应校验 Origin 和登录态，不要只相信连接建立成功。

低版本浏览器兼容：

- 现代项目优先要求支持 WebSocket 的浏览器。
- 真要兼容旧环境，可降级到 Server-Sent Events、长轮询、短轮询。
- 不建议继续维护 Flash Socket 这类历史方案。

## Demo

```js
const socket = new WebSocket('wss://example.com/socket');

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'ping' }));
});

socket.addEventListener('message', (event) => {
  console.log(event.data);
});
```

面试回答：

> WebSocket 握手阶段是 HTTP 请求，所以浏览器会根据 Cookie 规则携带匹配 Cookie；升级成功后就不是每条消息都自动携带 Cookie 了。生产环境应使用 `wss://`，并在服务端校验 Origin 和身份。兼容旧浏览器时可降级到 SSE、长轮询或短轮询，不推荐再用 Flash 类方案。

## 参考来源

- [MDN: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN: Writing WebSocket client applications](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
