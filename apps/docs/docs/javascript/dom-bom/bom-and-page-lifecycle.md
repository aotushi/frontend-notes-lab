# BOM 与页面生命周期

### 理解路径

DOM 面向文档树，BOM 面向浏览器窗口和浏览器环境。回答 BOM 相关问题时，应先说明对象所在层级，再说明浏览器限制、页面生命周期和安全边界。

### BOM 是什么？

BOM 通常指浏览器暴露给 JavaScript 的窗口和环境对象集合。它不是 ECMAScript 标准的一部分，而是浏览器宿主能力。

常见对象：

| 对象 | 作用 |
| --- | --- |
| `window` | 浏览器窗口，全局对象入口 |
| `location` | 当前页面 URL 的读取和跳转 |
| `history` | 会话历史记录控制 |
| `navigator` | 浏览器、设备和权限相关信息 |
| `screen` | 屏幕信息 |
| `document` | DOM 文档入口 |

`document` 经常和 BOM 一起出现，但它本身更准确地说属于 DOM API。

### History API 能做什么？

`history.pushState` 和 `history.replaceState` 可以修改地址栏而不刷新页面，`popstate` 可监听浏览器前进后退。SPA 路由通常基于这组能力实现。

```js
history.pushState({ page: 'detail' }, '', '/detail/1')

window.addEventListener('popstate', (event) => {
  console.log(event.state)
})
```

注意点：

1. `pushState` 只改变当前会话历史和地址栏，不会主动请求新页面。
2. URL 通常必须同源。
3. `popstate` 主要响应用户前进后退或代码调用 `history.back()` / `history.forward()`。
4. 页面刷新后，前端应用需要能根据当前 URL 重新还原状态。

### 页面可见性怎么处理？

标签页切换、最小化或被其它页面遮挡时，可监听 `visibilitychange`，读取 `document.visibilityState`。

```js
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    pauseVideo()
  }

  if (document.visibilityState === 'visible') {
    resumeVideo()
  }
})
```

常见用途：

1. 页面隐藏时暂停视频、动画或轮询。
2. 页面重新可见时刷新数据。
3. 页面隐藏时做轻量统计上报。

### 页面关闭前上报怎么处理？

页面隐藏、关闭或跳转前的数据上报优先考虑 `navigator.sendBeacon()`，或使用 `fetch` 的 `keepalive` 选项处理小型请求。

```js
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden') return

  const body = JSON.stringify({ event: 'page-hidden' })
  navigator.sendBeacon('/analytics', body)
})
```

不建议把关键业务保存完全依赖 `beforeunload`，因为浏览器可能限制弹窗、跳过部分异步任务，移动端也可能直接终止页面。

### History API

```js
function goDetail(id) {
  history.pushState({ id }, '', `/detail/${id}`)
  renderDetail(id)
}

window.addEventListener('popstate', (event) => {
  if (event.state?.id) {
    renderDetail(event.state.id)
  } else {
    renderHome()
  }
})
```

## 参考来源

- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [MDN: Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)
- [MDN: Location](https://developer.mozilla.org/en-US/docs/Web/API/Location)
- [MDN: Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN: Navigator.sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
