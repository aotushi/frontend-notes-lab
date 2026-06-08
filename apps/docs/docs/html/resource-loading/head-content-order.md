# head 标签中的内容顺序如何安排？

## 问题

`<head>` 中有 `meta`、`title`、`preconnect`、`preload`、`stylesheet`、`script`、`prefetch`、SEO 相关标签时，怎样安排顺序更合理？错误顺序为什么会影响加载和渲染效率？

## 结论

`head` 顺序的核心不是背一份固定清单，而是让浏览器尽早拿到三类信息：

1. 会影响浏览器解析和安全策略的声明。
2. 会影响连接建立、资源发现和资源优先级的信息。
3. 会影响首屏渲染和脚本执行路径的关键资源。

可以把 `<head>` 理解成浏览器的“启动队列”：越早出现，越早被发现；同优先级资源通常也会按发现顺序下载。因此，高紧急度、会影响当前页面的内容放前面，未来页面或纯元数据放后面。

一个现代项目可采用下面的顺序作为默认模板：

| 顺序 | 具体标签 / 写法 | 作用 | 为什么放这里 |
| --- | --- | --- | --- |
| 1 | `<meta charset="utf-8">` | 声明文档字符编码。 | 如果不用 HTTP `Content-Type` 头声明编码，`charset` 需要尽早出现，避免标题和正文中的非 ASCII 字符被错误解码。 |
| 2 | `<meta http-equiv="content-security-policy" ...>`、`<meta http-equiv="origin-trial" ...>`、`<meta http-equiv="accept-ch" ...>` | CSP 约束资源加载和脚本执行；origin trial 打开实验特性；client hints 告诉浏览器后续请求可携带哪些设备/网络提示。 | 这些声明会影响浏览器后续行为，应在子资源请求和脚本执行前出现。更推荐 CSP 和 Client Hints 用 HTTP 响应头声明；必须写在 HTML 里时才放在这里。 |
| 3 | `<meta name="viewport" content="width=device-width, initial-scale=1">`、`<base href="...">`、`<title>...</title>` | `viewport` 决定移动端布局视口；`base` 影响相对 URL 解析；`title` 影响标签页标题和加载感知。 | 移动端尺寸、相对链接基准和标题都应尽早确定。`base` 如果使用，必须放在依赖相对 URL 的 `link` / `script` 前。 |
| 4 | `<link rel="preconnect" href="https://cdn.example.com" crossorigin>` | 提前完成 DNS、TCP、TLS 等连接准备。 | 关键第三方源要在请求真正发生前建连；数量要少，通常只给字体 CDN、关键 API、关键静态资源域名使用。 |
| 5 | `<script async src="https://analytics.example.com/a.js"></script>` | 并行下载，下载完成后尽快执行，不保证执行顺序。 | 适合不依赖 DOM、不依赖其它脚本的独立第三方脚本。越早发现越早下载，但不要给有顺序依赖的业务脚本用 `async`。 |
| 6 | `<style>@import url("/legacy.css");</style>` | CSS `@import` 会再触发额外样式表请求。 | 不推荐使用 `@import`。如果遗留代码里必须有，它必须在其它 CSS 规则之前；更好的做法是改成 `<link rel="stylesheet">`。 |
| 7 | `<script src="/blocking-config.js"></script>`、`<script>...</script>` | 普通同步脚本会阻塞 HTML 解析；外链同步脚本还要先下载再执行。 | 如果必须同步执行，应只保留真正影响首屏启动的最小代码，例如运行时配置、极小的特性开关。大部分业务脚本应改成 `defer` 或模块脚本。 |
| 8 | `<link rel="stylesheet" href="/styles.css">`、首屏关键 `<style>...</style>` | CSS 会影响首屏渲染；匹配当前媒体条件的样式表通常会阻塞首次渲染。 | 主样式表和关键内联样式需要尽早发现。非首屏 CSS 应拆分、延后或按媒体条件加载。 |
| 9 | `<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">`、`<link rel="modulepreload" href="/app.entry.js">` | 提前发现当前页马上要用、但浏览器不容易及时发现的资源。 | 适合字体、LCP 图片、CSS 背景图、模块入口依赖。必须写对 `as`，字体等跨源资源要配 `crossorigin`。 |
| 10 | `<script src="/app.js" defer></script>`、`<script type="module" src="/app.js"></script>` | 并行下载，等 HTML 解析完成后执行；`defer` 保持文档顺序，模块脚本默认延迟执行。 | 适合主业务脚本。它们不应该挡住 HTML 解析和首屏关键 CSS 的早期发现。 |
| 11 | `<link rel="prefetch" href="/next-page-data.json">`、`<link rel="prerender" href="/next-page">` | 为未来导航或未来交互提前准备资源。 | 不服务于当前页面首屏，应该靠后，避免和当前页面关键 CSS、字体、脚本竞争带宽和优先级。 |
| 12 | `<meta name="description" ...>`、`<link rel="canonical" ...>`、`<meta property="og:title" ...>`、`<meta name="twitter:card" ...>`、`<link rel="icon" ...>` | SEO、社交分享、图标、主题色等展示型元数据。 | 这些通常不影响当前页面关键渲染路径，可以放在关键资源之后；但仍要保持完整，方便搜索引擎、分享卡片和浏览器 UI 使用。 |

这份顺序不是让你把所有项目都机械改成一样，而是提醒你：当前页面关键路径优先，未来页面和展示型元数据靠后。

## Demo

推荐写法示例：

```html
<head>
  <!-- 1. 字符编码：尽早声明，避免中文标题或正文被错误解码。 -->
  <meta charset="utf-8">

  <!-- 2. 顶层策略：更推荐放到 HTTP 响应头；必须写在 HTML 时放前面。 -->
  <meta
    http-equiv="content-security-policy"
    content="default-src 'self'; script-src 'self' https://analytics.example.com"
  >
  <meta http-equiv="origin-trial" content="TOKEN_FROM_BROWSER_VENDOR">
  <meta http-equiv="accept-ch" content="DPR, Width, Viewport-Width">

  <!-- 3. 视口、相对 URL 基准、标题：影响布局、资源 URL 和用户感知。 -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="https://example.com/app/">
  <title>Frontend Notes Lab</title>

  <!-- 4. 关键第三方源提前建连；不要给太多域名都 preconnect。 -->
  <link rel="preconnect" href="https://cdn.example.com" crossorigin>

  <!-- 5. 独立 async 脚本：不依赖 DOM 和执行顺序，例如部分统计脚本。 -->
  <script async src="https://analytics.example.com/analytics.js"></script>

  <!-- 6. 遗留 @import：不推荐；能改成 link stylesheet 就不要这样写。 -->
  <style>
    @import url("/legacy-reset.css");
  </style>

  <!-- 7. 普通同步脚本：会阻塞解析，只保留真正必须同步执行的最小代码。 -->
  <script src="/blocking-config.js"></script>
  <script>
    window.__APP_CONFIG__ = { locale: 'zh-CN' };
  </script>

  <!-- 8. 同步 CSS：主样式表和首屏关键样式要尽早被发现。 -->
  <link rel="stylesheet" href="/styles.css">
  <style>
    .app-shell {
      min-height: 100vh;
    }
  </style>

  <!-- 9. preload/modulepreload：当前页马上要用但发现较晚的关键资源。 -->
  <link
    rel="preload"
    href="/fonts/app.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  >
  <link rel="preload" href="/hero.webp" as="image" fetchpriority="high">
  <link rel="modulepreload" href="/app.entry.js">

  <!-- 10. 主业务脚本：优先 defer 或 type="module"，避免阻塞 HTML 解析。 -->
  <script src="/app.js" defer></script>
  <script type="module" src="/app.entry.js"></script>

  <!-- 11. 未来页面资源：prefetch/prerender 放后面，避免抢当前页关键资源。 -->
  <link rel="prefetch" href="/next-page-data.json">
  <link rel="prerender" href="/next-page">

  <!-- 12. SEO、社交分享、图标等元数据：完整保留，但不抢关键路径位置。 -->
  <meta name="description" content="前端面试资料的实验驱动文档站">
  <link rel="canonical" href="https://example.com/frontend-notes-lab">
  <meta property="og:title" content="Frontend Notes Lab">
  <meta property="og:description" content="前端面试资料的实验驱动文档站">
  <meta property="og:image" content="https://example.com/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico">
  <meta name="theme-color" content="#0f766e">
</head>
```

不推荐写法示例：

```html
<head>
  <!-- 把展示型元数据放到最前，不会帮助首屏关键路径。 -->
  <meta name="description" content="...">
  <meta property="og:title" content="...">

  <!-- 未来页面资源过早出现，可能和当前页面关键资源竞争。 -->
  <link rel="prefetch" href="/future-page.js">

  <!-- 普通同步脚本会阻塞 HTML 解析。 -->
  <script src="/app.js"></script>

  <!-- preconnect 太晚，可能已经错过建连收益。 -->
  <link rel="preconnect" href="https://cdn.example.com">

  <!-- charset 太晚，尤其不应晚于 title 或可见文本相关内容。 -->
  <meta charset="utf-8">

  <!-- CSS 发现被推迟，可能拖慢首次渲染。 -->
  <link rel="stylesheet" href="/styles.css">
</head>
```

问题在于：未来页面资源抢在当前页面关键资源前面；`preconnect` 出现太晚；`charset` 太晚；普通脚本阻塞解析；CSS 发现也被推迟。

## 面试回答

可以这样回答：

`head` 内容顺序本质上是在优化浏览器的早期发现和关键路径。先放 `charset`、安全策略、client hints、`viewport`、`title` 这类会影响解析、策略和用户感知的信息；再放少量关键 `preconnect`；然后让独立 `async` 脚本、必要同步脚本、主 CSS、关键 `preload` 尽早被发现；主业务脚本优先使用 `defer` 或 `type="module"`；`prefetch`、`prerender` 和大部分 SEO / 社交元数据可以放在后面，因为它们不应该抢当前首屏资源。

如果项目里 `<head>` 很复杂，可以用 `capo.js` 或 Chrome 插件辅助审计。它会把实际 `<head>` 顺序和按紧急程度排序后的顺序做对比，帮助发现放错位置的高影响元素。但工具结果仍要结合业务判断，例如同步脚本是否真的必要、`preload` 是否会造成资源竞争、第三方 `preconnect` 是否过多。

## 参考来源

- [capo.js：Get your `<head>` in order](https://rviscomi.github.io/capo.js/)
- [capo.js rules：`<head>` 元素排序规则](https://rviscomi.github.io/capo.js/user/rules/)
- [Capo Chrome extension](https://chromewebstore.google.com/detail/capo-get-your-%EF%B9%A4%F0%9D%9A%91%F0%9D%9A%8E%F0%9D%9A%8A%F0%9D%9A%8D%EF%B9%A5/ohabpnaccigjhkkebjofhpmebofgpbeb)
- [web.dev：Fetch Priority 与资源优先级](https://web.dev/articles/fetch-priority)
- [Chrome Developers：Eliminate render-blocking resources](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources)
- [原始笔记来源：Barret Lee 关于 head 顺序的整理](https://twitter.com/Barret_China/status/1684192099024146432)
