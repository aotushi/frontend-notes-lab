# HTML5 离线存储、Application Cache 与现代替代方案

## 问题

HTML5 离线存储怎么使用？Application Cache / manifest 的工作原理是什么？应用缓存中的 `FALLBACK` 和 `NETWORK` 是什么？它和浏览器缓存有什么不同？

## 结论

旧面试资料里的“HTML5 离线缓存”大多指 Application Cache，也就是在 `<html>` 上写 `manifest`：

```html
<html manifest="/offline.appcache">
```

这种机制已经废弃，不应在现代项目中新建使用。现代离线能力应使用 Service Worker、Cache API、IndexedDB 等组合实现。

Application Cache 的大致工作方式：

1. 页面声明 `manifest` 文件。
2. 浏览器下载 manifest 中列出的资源。
3. 后续访问优先使用应用缓存。
4. manifest 文件内容变化后，浏览器才会尝试更新缓存。

manifest 旧格式示例：

```txt
CACHE MANIFEST

CACHE:
/index.html
/app.css
/app.js

NETWORK:
/api/

FALLBACK:
/ /offline.html
```

`NETWORK` 表示这些资源必须走网络，不从应用缓存取。`FALLBACK` 表示当网络资源不可用时，使用指定的回退资源。

Application Cache 和普通浏览器 HTTP 缓存不同：

| 对比项 | Application Cache | HTTP 缓存 |
| --- | --- | --- |
| 控制方式 | manifest 文件声明 | HTTP 响应头控制 |
| 缓存粒度 | 应用级资源清单 | 单个请求资源 |
| 更新触发 | manifest 内容变化 | `Cache-Control`、`ETag`、`Last-Modified` 等 |
| 现代状态 | 已废弃 | 仍是核心缓存机制 |

现代离线方案：

- 静态资源缓存：Service Worker + Cache API。
- 用户数据、本地状态：IndexedDB。
- 简单小状态：localStorage/sessionStorage。
- HTTP 层缓存：`Cache-Control`、`ETag`、CDN。

## 常见问题

### 浏览器是如何对 HTML5 离线储存资源进行管理和加载的？

**在线情况下：**

浏览器发现 HTML 头部有 `manifest` 属性后，会请求该 manifest 文件：

- 如果是第一次访问页面，浏览器根据 manifest 文件内容下载对应资源并进行离线存储。
- 如果已经访问过并已离线存储，浏览器先使用离线资源加载页面，再对比新旧 manifest 文件：
  - 文件未变化：不做任何操作。
  - 文件有变化：重新下载 manifest 中列出的资源并更新离线存储。

**离线情况下：**

浏览器直接使用离线存储的资源渲染页面，不发起网络请求。

这也是 Application Cache 的主要问题之一：资源更新必须依赖 manifest 文件本身发生变化，否则用户会一直看到旧版本。这是它被废弃的重要原因之一。

## Demo

Service Worker 注册：

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

Cache API 示例：

```js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-v1').then((cache) => {
      return cache.addAll(['/index.html', '/app.css', '/app.js']);
    })
  );
});
```

面试回答：

> 旧的 HTML5 离线缓存通常指 Application Cache，通过 `manifest` 文件声明缓存资源、网络资源和 fallback 资源。但 AppCache 已废弃，更新机制也容易出问题。现代离线能力应使用 Service Worker + Cache API 管理静态资源，用 IndexedDB 存结构化数据，用 HTTP 缓存控制常规资源。

## 参考来源

- [Chrome Developers: Uses Application Cache](https://developer.chrome.com/docs/lighthouse/best-practices/appcache-manifest/)
- [MDN: PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
