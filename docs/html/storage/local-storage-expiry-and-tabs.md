# localStorage 时效性与多标签页通信

## 问题

如何设计一个带时效性的 `localStorage`？如何实现浏览器多个标签页之间通信？

## 结论

`localStorage` 自身没有过期时间。如果要保证数据时效性，应该把数据和过期时间一起存进去，读取时判断是否过期，过期就删除。

```js
function setWithExpiry(key, value, ttl) {
  localStorage.setItem(key, JSON.stringify({
    value,
    expiresAt: Date.now() + ttl
  }));
}

function getWithExpiry(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const item = JSON.parse(raw);
  if (Date.now() > item.expiresAt) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
```

多个标签页通信有几种常见方式：

| 方式 | 特点 |
| --- | --- |
| `storage` 事件 | 其它同源页面修改 `localStorage` 时触发，简单但只能传字符串 |
| `BroadcastChannel` | 同源页面之间广播消息，语义更直接 |
| `SharedWorker` | 多页面共享 Worker，适合更复杂的协调 |
| Service Worker | 更偏离线、缓存和网络代理，不是普通标签页通信首选 |

`storage` 事件示例：

```js
window.addEventListener('storage', (event) => {
  if (event.key === 'logout') {
    location.reload();
  }
});

localStorage.setItem('logout', String(Date.now()));
```

`BroadcastChannel` 示例：

```js
const channel = new BroadcastChannel('app');

channel.onmessage = (event) => {
  console.log('收到消息', event.data);
};

channel.postMessage({ type: 'theme-change', theme: 'dark' });
```

注意：`localStorage` 是同步 API，频繁读写大数据会阻塞主线程；敏感信息也不应保存在 `localStorage` 中。

## Demo

面试回答：

> `localStorage` 没有原生过期时间，可以保存 `{ value, expiresAt }`，读取时检查过期并清理。多标签页通信可以用 `storage` 事件，现代浏览器更推荐 `BroadcastChannel`，它语义更清晰，适合同源页面之间广播状态变化。

## 参考来源

- [MDN: Window localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: Window storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [MDN: BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
