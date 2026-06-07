# 页面缓存与强制更新

## 问题

如何禁止 HTML 页面缓存？怎样实现每次页面打开时都清除本页缓存？微信 H5 页面如何更新缓存？

## 结论

页面缓存首先是 HTTP 问题，优先通过响应头控制，而不是只靠 HTML 里的 `meta`。

常见响应头：

```http
Cache-Control: no-store
```

`no-store` 表示浏览器不应存储请求或响应，适合登录页、支付页、强敏感页面。普通业务页面更常用：

```http
Cache-Control: no-cache
```

`no-cache` 不是“不缓存”，而是可以缓存，但每次使用前需要重新验证。

静态资源常见策略：

```http
Cache-Control: public, max-age=31536000, immutable
```

前提是文件名带内容哈希，例如 `app.8f3a1.js`。HTML 则通常设置较短缓存或重新验证，避免引用旧资源。

不推荐只依赖：

```html
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
```

这些历史写法兼容性和效果都不如服务端响应头可靠。

微信 H5 缓存更新常见做法：

- HTML 设置短缓存或 `no-cache`，让入口页能及时更新。
- 静态资源文件名带 hash，发布时 URL 改变。
- 对必须刷新的接口或页面使用版本号参数。
- 避免把敏感数据保存在前端长期缓存中。
- 必要时引导用户清理微信缓存，但这不应作为主要发布策略。

## Demo

Vite/现代前端发布常见策略：

```txt
index.html       Cache-Control: no-cache
assets/app.[hash].js  Cache-Control: public, max-age=31536000, immutable
assets/app.[hash].css Cache-Control: public, max-age=31536000, immutable
```

面试回答：

> 禁止或控制页面缓存应优先使用 HTTP 响应头。敏感页面用 `Cache-Control: no-store`；普通 HTML 入口页常用 `no-cache` 让它每次重新验证；带 hash 的静态资源可以长缓存。微信 H5 更新缓存的核心也是入口 HTML 短缓存、静态资源 hash、必要时加版本参数，而不是依赖 meta 标签或让用户手动清缓存。

## 参考来源

- [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
