# 页面通信

### 理解路径

页面通信的核心不是"传消息"本身，而是先判断通信双方的关系：是否同源、是否有窗口引用、是否需要广播、是否经过 Service Worker。不同关系对应不同 API。

### 页面之间如何通信？

| 场景 | API | 关键边界 |
| --- | --- | --- |
| iframe / popup 跨窗口 | `postMessage` | 必须校验 `origin` |
| 同源多标签广播 | `BroadcastChannel` | 同源上下文内广播 |
| 同源 localStorage 变化通知 | `storage` 事件 | 触发于其它同源页面 |
| 页面与 Worker 双向通信 | `postMessage`、`MessageChannel` | 数据经结构化克隆 |
| Service Worker 与页面 | `postMessage`、`clients.matchAll()` | 需要考虑作用域和生命周期 |

### `postMessage` 怎么安全使用？

`postMessage` 可以在不同窗口、iframe 或 popup 之间传递消息。跨源通信时必须校验来源，不能对任意来源消息执行敏感操作。

发送方应指定明确的 `targetOrigin`：

```js
iframe.contentWindow.postMessage({ type: 'ready' }, 'https://example.com')
```

接收方应校验 `origin` 和消息结构：

```js
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') return
  if (event.data?.type !== 'ready') return

  console.log('child ready')
})
```

### BroadcastChannel 适合什么场景？

`BroadcastChannel` 适合同源页面之间广播消息，例如多个标签页同步登录状态、主题偏好或业务状态。

```js
const channel = new BroadcastChannel('app-state')

channel.postMessage({ type: 'theme-change', theme: 'dark' })

channel.addEventListener('message', (event) => {
  if (event.data.type === 'theme-change') {
    applyTheme(event.data.theme)
  }
})
```

它只在同源上下文中通信，不适合跨源 iframe 通信。

### `storage` 事件有什么特点？

当一个同源页面修改 `localStorage` 时，其它同源页面会收到 `storage` 事件。触发修改的当前页面通常不会收到自己的 `storage` 事件。

```js
window.addEventListener('storage', (event) => {
  if (event.key !== 'logout') return
  location.reload()
})

function logout() {
  localStorage.setItem('logout', String(Date.now()))
}
```

`storage` 事件适合简单同步，不适合承载复杂实时通信。

### MessageChannel 解决什么问题？

`MessageChannel` 可以创建一对相互连接的端口，适合建立更明确的双向通信通道。它常用于页面和 iframe、Worker、Service Worker 之间建立专门通道。

```js
const channel = new MessageChannel()

worker.postMessage({ type: 'connect' }, [channel.port2])

channel.port1.onmessage = (event) => {
  console.log(event.data)
}

channel.port1.postMessage({ type: 'ping' })
```

### 安全的 `postMessage`

```js
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') return
  if (event.data?.type !== 'ready') return

  console.log('child ready')
})
```

## 参考来源

- [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN: BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [MDN: Window storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [MDN: MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [MDN: ServiceWorker.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/postMessage)
