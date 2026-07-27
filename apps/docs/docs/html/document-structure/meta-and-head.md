# head 与 meta 常见问题

## 问题

`head` 中通常放什么？`meta` 标签有哪些属性和常见写法？`charset`、`name`、`content`、`http-equiv`、`itemprop`、`property`、`media` 分别应该怎么理解？社交分享和 Schema.org 结构化数据又属于哪一类？

## 结论

`head` 用来放文档元数据。它不会作为页面正文直接显示，但会影响浏览器解析、页面标题、移动端视口、搜索结果摘要、社交分享卡片、资源发现、安全策略、颜色主题和爬虫行为。

一个现代页面的基础 `head` 通常至少包含字符编码、移动端视口、页面标题和内容摘要，再按实际需要补充资源、搜索、分享、外观和 Web 应用信息。

`meta` 不是“什么都能塞”的万能标签。它主要有四种互斥用法：

| 用法                     | 示例                                                                   | 作用                          |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------------- |
| `charset`                | `<meta charset="utf-8">`                                               | 声明 HTML 文档字符编码        |
| `name` + `content`       | `<meta name="viewport" content="width=device-width, initial-scale=1">` | 提供页面级元数据              |
| `http-equiv` + `content` | `<meta http-equiv="refresh" content="3;url=/login">`                   | 模拟少量 HTTP 响应头指令      |
| `itemprop` + `content`   | `<meta itemprop="priceCurrency" content="CNY">`                        | 给 Microdata 结构化数据提供值 |

`itemprop` 不能和 `name`、`http-equiv`、`charset` 混在同一个 `<meta>` 上。`media` 只在 `name="theme-color"` 时有实际意义，用来按媒体查询指定不同主题色。

## head 与 meta 的概念模型

`head` 中的信息可以按“由谁消费”来理解，而不必背诵标签清单：

| 分类         | 典型内容                                        | 主要消费者                       |
| ------------ | ----------------------------------------------- | -------------------------------- |
| 文档身份     | 标题、摘要、规范 URL、语言                      | 浏览器、搜索引擎、收藏与分享工具 |
| 解析与呈现   | 字符编码、视口、颜色模式、主题色                | HTML 解析器与浏览器界面          |
| 请求与资源   | Referrer 策略、样式、脚本、预连接、预加载       | 浏览器网络层与渲染流水线         |
| 外部平台描述 | 爬虫指令、Open Graph、Twitter/X Card、结构化数据 | 搜索引擎、社交平台和其他机器     |

`name` 表达通用的页面级元数据，`http-equiv` 是少量 HTTP 指令的文档内替代写法，`property` 常用于 Open Graph 等协议扩展，`itemprop` 属于 Microdata。结构化数据还可以使用更独立的 JSON-LD：放在 `type="application/ld+json"` 的 `script` 中，并以 Schema.org 词汇描述页面实体。

## 关键属性与使用边界

- `charset` 应尽量靠前并使用 UTF-8；`viewport` 决定移动端布局视口，不应随意禁止用户缩放。
- `description`、`robots`、`referrer`、`theme-color`、`color-scheme` 等都采用 `name + content`，但分别服务于搜索、请求策略或浏览器外观。`media` 只在 `theme-color` 元数据上有意义。
- `http-equiv` 只能覆盖少数指令。CSP、缓存、Cookie、MIME 类型等生产策略优先使用真实 HTTP 响应头；自动刷新或跳转也应谨慎使用。
- `robots` 是对爬虫的协作指令，不是访问控制。常用限制包括 `noindex`、`nofollow`、`nosnippet` 和 `max-*`；非 HTML 资源应使用 `X-Robots-Tag` 响应头，私密内容仍需身份验证。
- Open Graph 与 Twitter/X Card 决定社交分享预览；Schema.org 结构化数据描述页面实体。两者都应与用户可见内容一致，但不能保证平台一定采用或展示。

旧资料中的 `keywords`、`pragma`、`renderer`、`x-ua-compatible`、`set-cookie` 等写法应了解其历史背景，不应作为现代页面的设计重点。旧的 `scheme` 是被移除的 `meta` 属性，与用于结构化数据词汇的 **Schema.org** 不是同一概念。

## 内容顺序原则

`head` 的书写顺序会影响浏览器何时发现并处理信息：

1. 先声明会影响后续解析或请求的内容，例如 `charset`、Referrer 与安全策略。
2. 再确定视口、标题与 URL 解析基础，随后尽早暴露关键连接、样式和预加载资源。
3. 无依赖的第三方脚本可用 `async`：下载完成就执行，不保证文档顺序；有依赖关系的脚本用 `defer`：并行下载，HTML 解析完成后按出现顺序执行。
4. 搜索、社交分享、结构化数据、站点图标和 Web 应用元数据通常放在关键资源之后。

更完整的资源排序原因和取舍见[head 标签中的内容顺序](/html/resource-loading/head-content-order)。

## head 与 meta 实例

下面用一篇公开文章页把以上类别组合起来，并按照浏览器发现和处理信息的先后顺序组织。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <!-- 1. 解析与请求策略：必须早于会受它们影响的正文和子资源 -->
    <meta charset="utf-8" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <!-- CSP、Cookie、缓存等生产策略优先通过 HTTP 响应头设置 -->

    <!-- 2. 布局与用户感知：尽早确定移动端视口和标签页标题 -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>head 与 meta 常见问题 | Frontend Notes Lab</title>

    <!-- 3. 当前页面关键路径：越早出现，浏览器越早发现 -->
    <!-- 3.1 先连接确定会使用的关键第三方源 -->
    <link rel="preconnect" href="https://cdn.example.com" crossorigin />

    <!-- 3.2 async 只用于无依赖脚本：下载完成就执行，不保证文档顺序 -->
    <script src="https://analytics.example.com/analytics.js" async></script>

    <!-- 3.3 尽早发现主样式和稍后才会被 CSS 发现的关键字体 -->
    <link rel="stylesheet" href="/assets/app.css" />
    <link rel="preload" href="https://cdn.example.com/inter-var.woff2" as="font" type="font/woff2" crossorigin />

    <!-- 3.4 defer 脚本并行下载，HTML 解析完成后按出现顺序执行 -->
    <script src="/assets/vendor.js" defer></script>
    <script src="/assets/app.js" defer></script>
    <!-- 执行顺序是 vendor.js → app.js；async 脚本与它们之间没有固定先后 -->

    <!-- 4. 社交分享：属于同一分类，按协议细分 -->
    <!-- 4.1 Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Frontend Notes Lab" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:title" content="head 与 meta 常见问题" />
    <meta property="og:description" content="梳理 HTML head 与 meta 的属性、分类、实例和使用边界。" />
    <meta property="og:url" content="https://example.com/html/document-structure/meta-and-head" />
    <meta property="og:image" content="https://example.com/og/meta-and-head.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="head 与 meta 常见问题文章封面" />

    <!-- 4.2 Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="head 与 meta 常见问题" />
    <meta name="twitter:description" content="梳理 HTML head 与 meta 的属性、分类、实例和使用边界。" />
    <meta name="twitter:image" content="https://example.com/og/meta-and-head.png" />
    <meta name="twitter:image:alt" content="head 与 meta 常见问题文章封面" />

    <!-- 5. Schema.org 结构化数据：JSON-LD 是数据块，不使用 async 或 defer -->
    <!-- 字段必须和页面中用户实际可见的标题、作者、时间等内容一致 -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "head 与 meta 常见问题",
        "description": "梳理 HTML head 与 meta 的属性、分类、实例和使用边界。",
        "inLanguage": "zh-CN",
        "mainEntityOfPage": "https://example.com/html/document-structure/meta-and-head",
        "image": "https://example.com/og/meta-and-head.png",
        "datePublished": "2026-07-27T10:00:00+08:00",
        "dateModified": "2026-07-27T10:00:00+08:00",
        "author": {
          "@type": "Organization",
          "name": "Frontend Notes Lab",
          "url": "https://example.com/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Frontend Notes Lab",
          "url": "https://example.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
          }
        }
      }
    </script>

    <!-- 6. 搜索与抓取：完整保留，但不抢当前页面关键资源的发现顺序 -->
    <meta name="description" content="梳理 HTML head 与 meta 的属性、分类、实例和使用边界。" />
    <meta name="robots" content="max-snippet:-1, max-image-preview:large" />
    <link rel="canonical" href="https://example.com/html/document-structure/meta-and-head" />

    <!-- 7. 浏览器外观 -->
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />

    <!-- 8. 站点图标与 Web 应用：普通内容页可按需删减 -->
    <meta name="application-name" content="Frontend Notes Lab" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
  </head>
  <body>
    <!-- 页面正文 -->
  </body>
</html>
```

## 参考来源

- [MDN: `<meta>` HTML metadata element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta)
- [MDN: `<meta name>` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name)
- [MDN: `<meta http-equiv>` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv)
- [MDN: `<head>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
- [WHATWG HTML: The document element and metadata](https://html.spec.whatwg.org/multipage/semantics.html)
- [Google Search Central: Robots meta tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google Search Central: Specify a canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [The Open Graph protocol](https://ogp.me/)
- [MDN: `rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload)
- [MDN: Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [Schema.org: `Article`](https://schema.org/Article)
- [Google Search Central: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
