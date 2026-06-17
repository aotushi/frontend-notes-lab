# DOM/BOM 事件、存储与页面通信

## 问题

DOM 事件流、事件委托、事件对象、浏览器窗口对象、前端存储、页面可见性、History API 和跨窗口通信如何归类？哪些属于 JavaScript 语言，哪些属于浏览器宿主 API？

## 结论

### 理解路径

DOM/BOM 不属于 ECMAScript 语言核心，而是浏览器提供给 JavaScript 的宿主 API。回答时应先说明 API 所在层级，再讲事件流、生命周期、权限、同源和容量限制等边界。

### DOM 事件流是什么？

浏览器事件传播通常分为捕获、目标和冒泡三个阶段。`addEventListener` 第三个参数或 options 中的 `capture` 可以决定监听捕获阶段还是冒泡阶段。

```js
button.addEventListener('click', onClick, { capture: false })
```

常用控制方法：

1. `event.preventDefault()`：阻止默认行为。
2. `event.stopPropagation()`：阻止继续传播。
3. `event.stopImmediatePropagation()`：阻止后续监听器执行并停止传播。

### 事件委托有什么作用？

事件委托把子元素事件统一绑定到稳定的父元素上，利用冒泡阶段识别真实触发目标。

适用场景：

1. 列表项动态增删。
2. 子元素数量多，减少监听器数量。
3. 统一处理同类交互。

```js
list.addEventListener('click', (event) => {
  const item = event.target.closest('[data-id]')
  if (!item || !list.contains(item)) return
  console.log(item.dataset.id)
})
```

不是所有事件都适合委托，例如 `focus` / `blur` 默认不冒泡，可使用 `focusin` / `focusout`。

### `target` 和 `currentTarget` 有什么区别？

`event.target` 是最初触发事件的节点，`event.currentTarget` 是当前正在执行监听器的节点。事件委托中通常用 `target` 找子元素，用 `currentTarget` 表示绑定监听器的父元素。

### DOM 查询和操作有哪些注意点？

1. `querySelector` / `querySelectorAll` 使用 CSS 选择器。
2. `getElementById` 返回单个元素，老 API 如 `getElementsByClassName` 返回动态集合。
3. 频繁读写布局属性可能触发同步布局，应批量读写。
4. 大量插入节点时可以使用 `DocumentFragment` 或一次性 HTML 片段。

### Web Storage、Cookie、IndexedDB 怎么比较？

| 能力 | Cookie | localStorage | sessionStorage | IndexedDB |
| --- | --- | --- | --- | --- |
| 容量 | 较小 | 较小到中等 | 较小到中等 | 较大 |
| 生命周期 | 可设置过期 | 持久，直到清理 | 标签页会话 | 持久，直到清理 |
| 是否随请求发送 | 是 | 否 | 否 | 否 |
| API | 字符串 | 同步字符串 API | 同步字符串 API | 异步结构化存储 |
| 适用 | 会话标识、小型服务端需要字段 | 小型客户端偏好 | 单标签临时状态 | 大量结构化数据 |

敏感令牌不应简单放入可被脚本读取的存储中；安全策略要结合 HttpOnly Cookie、SameSite、CSRF/XSS 防护一起设计。

### 页面之间如何通信？

| 场景 | API |
| --- | --- |
| iframe / popup 跨窗口 | `postMessage` |
| 同源多标签广播 | `BroadcastChannel` |
| 同源 localStorage 变化通知 | `storage` 事件 |
| Service Worker 与页面 | `postMessage`、MessageChannel |
| URL 状态同步 | History API、URLSearchParams |

跨源通信必须校验 `origin`，不要对任意来源消息执行敏感操作。

### 页面可见性和关闭前上报怎么处理？

标签页切换可监听 `visibilitychange`，读取 `document.visibilityState`。页面隐藏、关闭或跳转前的数据上报优先考虑 `navigator.sendBeacon()`，或使用 `fetch` 的 `keepalive` 选项处理小型请求。

### History API 能做什么？

`history.pushState` 和 `history.replaceState` 可以修改地址栏而不刷新页面，`popstate` 可监听浏览器前进后退。SPA 路由通常基于这组能力实现。

```js
history.pushState({ page: 'detail' }, '', '/detail/1')
```

## Demo

### 事件委托

```html
<ul id="todo-list">
  <li data-id="1">Learn JS</li>
  <li data-id="2">Review DOM</li>
</ul>

<script>
  const list = document.querySelector('#todo-list')

  list.addEventListener('click', (event) => {
    const item = event.target.closest('li[data-id]')
    if (!item) return
    console.log(item.dataset.id)
  })
</script>
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

- [MDN: Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)
- [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
