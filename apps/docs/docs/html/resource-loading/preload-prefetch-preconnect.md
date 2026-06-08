# preload、prefetch、preconnect 有什么区别？

## 问题

HTML 里哪个标签可以预加载？`preload`、`prefetch`、`preconnect` 分别适合什么场景？

## 结论

资源提示通常通过 `<link>` 标签完成，但不同 `rel` 的语义不同。

`preload` 是“当前页面很快就要用”的高优先级声明。它会提前请求资源，但不会自动应用资源，所以字体、脚本、图片等都要写对 `as`，跨源字体通常还要加 `crossorigin`。

`prefetch` 是“未来导航或未来交互可能会用”的低优先级预取。它适合下一页资源，不适合当前首屏关键资源。

`preconnect` 不是下载具体文件，而是提前建立到目标源的连接，包括 DNS、TCP、TLS 等准备工作。它适合关键第三方域名，例如字体 CDN、接口域名，但数量要少。

## Demo

```html
<head>
  <!-- 当前页首屏字体：提前下载，并声明资源类型 -->
  <link
    rel="preload"
    href="/fonts/inter.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  >

  <!-- 关键第三方域名：提前建连 -->
  <link rel="preconnect" href="https://cdn.example.com">

  <!-- 下一页可能用到的数据：低优先级预取 -->
  <link rel="prefetch" href="/next-page-data.json">
</head>
```

常见错误：

- 用 `prefetch` 加载当前首屏关键资源。
- `preload` 缺少或写错 `as`，导致优先级、缓存复用或安全策略不符合预期。
- 对大量第三方域名使用 `preconnect`，反而浪费连接资源。

## 参考来源

- [MDN：`rel=preload`](https://developer.mozilla.org/docs/Web/HTML/Reference/Attributes/rel/preload)
- [MDN：`rel=preconnect`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect)
- [MDN：`rel=prefetch`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch)
