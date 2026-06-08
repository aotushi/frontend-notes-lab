# HTTPS 页面加载 HTTP 资源为什么会报错？

## 问题

HTTPS 页面加载 HTTP 资源为什么会导致页面报错或资源加载失败？应该怎么解决？

## 结论

这属于 mixed content，中文常称“混合内容”。页面本身通过 HTTPS 加载，但又请求 HTTP 资源，会破坏 HTTPS 页面提供的完整性和安全性：攻击者可能篡改 HTTP 资源，从而影响安全页面。

现代浏览器会对混合内容采取限制。部分可被自动升级的资源可能尝试从 HTTP 升级为 HTTPS；高风险资源会被直接阻止，例如脚本、样式、iframe、XHR/fetch 等主动内容。

解决方式是让页面和所有子资源都走 HTTPS，并从源头消除 HTTP URL。

## Demo

```html
<!-- 不推荐：HTTPS 页面中加载 HTTP 脚本，通常会被阻止 -->
<script src="http://cdn.example.com/app.js"></script>

<!-- 推荐：所有资源都使用 HTTPS -->
<script src="https://cdn.example.com/app.js"></script>

<!-- 同源资源优先使用相对路径 -->
<link rel="stylesheet" href="/assets/app.css">
```

排查步骤：

- 打开 DevTools Console 和 Network，搜索 `Mixed Content`。
- 检查 HTML、CSS、JS、接口返回数据中的硬编码 `http://`。
- CDN、图片、字体、接口统一切到 HTTPS。
- 对历史内容做批量替换或服务端重写。
- 必要时使用 CSP 的 `upgrade-insecure-requests` 辅助升级，但不要把它当成替代治理。

## 参考来源

- [MDN：Mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
- [MDN：Content-Security-Policy upgrade-insecure-requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/upgrade-insecure-requests)
