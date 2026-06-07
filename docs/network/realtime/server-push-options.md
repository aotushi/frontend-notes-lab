# 服务端主动推送数据到客户端

## 问题

Web 应用从服务器主动推送数据到客户端有哪些方式？

## 结论

常见方案有轮询、长轮询、Server-Sent Events、WebSocket、Web Push。选择时看是否需要双向通信、实时性、兼容性和基础设施成本。

| 方案 | 特点 | 适合场景 |
| --- | --- | --- |
| 短轮询 | 客户端定时请求 | 简单状态刷新，实时性要求低 |
| 长轮询 | 服务端等到有数据或超时再响应 | 兼容性好，实时性中等 |
| SSE | 服务端到客户端单向事件流 | 通知、日志、进度、行情 |
| WebSocket | 双向持久连接 | 聊天、协同编辑、游戏、实时控制 |
| Web Push | 浏览器推送通知，可在页面关闭后触达 | 通知类产品 |

SSE 示例：

```js
const source = new EventSource('/events');

source.onmessage = (event) => {
  console.log(event.data);
};
```

WebSocket 示例：

```js
const socket = new WebSocket('wss://example.com/socket');
socket.onmessage = (event) => console.log(event.data);
```

面试回答：

> 服务端向客户端推送可以用短轮询、长轮询、SSE、WebSocket 和 Web Push。只需要服务端单向推送时 SSE 简单稳定；需要双向实时通信时用 WebSocket；通知类场景可用 Web Push。轮询兼容性好但浪费请求，长轮询是折中方案。

## 参考来源

- [MDN: Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [MDN: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
