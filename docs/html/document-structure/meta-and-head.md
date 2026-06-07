# head 与 meta 常见问题

## 问题

`head` 中通常放什么？`meta` 标签有哪些属性和常见写法？`charset`、`name`、`content`、`http-equiv`、`itemprop`、`property`、`media` 分别应该怎么理解？

## 结论

`head` 用来放文档元数据。它不会作为页面正文直接显示，但会影响浏览器解析、页面标题、移动端视口、搜索结果摘要、社交分享卡片、资源发现、安全策略、颜色主题和爬虫行为。

一个现代页面的基础 `head` 通常至少包含：

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>页面标题</title>
  <meta name="description" content="页面内容摘要">
</head>
```

`meta` 不是“什么都能塞”的万能标签。它主要有四种互斥用法：

| 用法 | 示例 | 作用 |
| --- | --- | --- |
| `charset` | `<meta charset="utf-8">` | 声明 HTML 文档字符编码 |
| `name` + `content` | `<meta name="viewport" content="width=device-width, initial-scale=1">` | 提供页面级元数据 |
| `http-equiv` + `content` | `<meta http-equiv="refresh" content="3;url=/login">` | 模拟少量 HTTP 响应头指令 |
| `itemprop` + `content` | `<meta itemprop="priceCurrency" content="CNY">` | 给 Microdata 结构化数据提供值 |

`itemprop` 不能和 `name`、`http-equiv`、`charset` 混在同一个 `<meta>` 上。`media` 只在 `name="theme-color"` 时有实际意义，用来按媒体查询指定不同主题色。

## head 里常见内容

| 元素 | 常见写法 | 作用 |
| --- | --- | --- |
| `meta charset` | `<meta charset="utf-8">` | 字符编码，应该尽量靠前 |
| `title` | `<title>订单详情</title>` | 浏览器标签页、收藏夹、搜索结果标题来源之一 |
| `meta viewport` | `<meta name="viewport" content="width=device-width, initial-scale=1">` | 移动端布局视口 |
| `meta description` | `<meta name="description" content="...">` | 页面摘要，可能被搜索结果采用 |
| `link canonical` | `<link rel="canonical" href="https://example.com/page">` | 标记规范 URL |
| `link icon` | `<link rel="icon" href="/favicon.ico">` | 站点图标 |
| `link stylesheet` | `<link rel="stylesheet" href="/app.css">` | 样式资源 |
| `link preload/preconnect` | `<link rel="preload" href="/font.woff2" as="font">` | 资源加载提示 |
| `script` | `<script src="/app.js" defer></script>` | 脚本资源，现代业务脚本优先 `defer` 或模块脚本 |
| `style` | `<style>...</style>` | 内联关键样式或小段样式 |
| `base` | `<base href="https://example.com/">` | 影响页面内相对 URL 的解析，整页只能有一个有效 `base href` |

## meta 属性分类

| 属性 | 是否常用 | 说明 |
| --- | --- | --- |
| `charset` | 常用 | HTML5 文档只应使用 UTF-8；声明编码的 `meta` 应位于文档前 1024 字节内 |
| `name` | 常用 | 元数据名称，和 `content` 组成键值对 |
| `content` | 常用 | `name`、`http-equiv` 或 `itemprop` 对应的值 |
| `http-equiv` | 谨慎使用 | 模拟少量 HTTP 头；安全、缓存、Cookie 等优先用真实 HTTP 响应头 |
| `itemprop` | 场景化 | Microdata 结构化数据用；不能和 `name`、`http-equiv`、`charset` 混用 |
| `media` | 很少 | 只对 `name="theme-color"` 有意义 |
| `property` | 常见于社交分享 | Open Graph 等协议常用，例如 `property="og:title"`；它不是 `meta` 元素的核心四类用法，但业务中很常见 |
| `lang` | 场景化 | 可用于多语言 `application-name` 等元数据 |

## 常见 name 值

| `name` | 示例 | 作用与注意点 |
| --- | --- | --- |
| `viewport` | `<meta name="viewport" content="width=device-width, initial-scale=1">` | 移动端必备。不要轻易写 `user-scalable=no`，会影响可访问性 |
| `description` | `<meta name="description" content="前端面试资料站">` | 页面摘要。搜索引擎可能使用，也可能根据页面内容重写 |
| `robots` | `<meta name="robots" content="noindex,nofollow">` | 控制协作爬虫索引和跟踪链接 |
| `googlebot` | `<meta name="googlebot" content="nosnippet">` | 针对 Googlebot 的爬虫指令 |
| `theme-color` | `<meta name="theme-color" content="#0f172a">` | 建议浏览器 UI 使用的主题色，可配合 `media` 区分亮暗模式 |
| `color-scheme` | `<meta name="color-scheme" content="light dark">` | 告诉浏览器页面兼容哪些颜色模式，影响表单控件、滚动条等默认颜色 |
| `referrer` | `<meta name="referrer" content="strict-origin-when-cross-origin">` | 控制从当前文档发出的请求携带怎样的 Referer |
| `application-name` | `<meta name="application-name" content="Frontend Notes Lab">` | 标记 Web 应用名称，和 `title` 不同 |
| `author` | `<meta name="author" content="作者名">` | 文档作者，业务价值有限 |
| `generator` | `<meta name="generator" content="VitePress">` | 生成页面的软件 |
| `keywords` | `<meta name="keywords" content="HTML,CSS">` | 历史 SEO 标签。现代主流搜索排名中不应作为重点 |
| `creator` / `publisher` | `<meta name="publisher" content="组织名">` | 非标准但常见的扩展元数据 |

`robots` 常见值：

| 值 | 含义 |
| --- | --- |
| `index` | 允许索引，通常是默认行为 |
| `noindex` | 不在搜索结果中展示该页面 |
| `follow` | 允许跟踪页面上的链接，通常是默认行为 |
| `nofollow` | 不跟踪页面上的链接 |
| `none` | 等同于 `noindex,nofollow` |
| `nosnippet` | 不展示文本摘要或视频预览 |
| `max-snippet:50` | 限制摘要最大字符数 |
| `max-image-preview:large` | 允许较大的图片预览 |

非 HTML 资源不能写页面内 `robots` meta，应使用 `X-Robots-Tag` 响应头。

## 常见 http-equiv 值

`http-equiv` 只能模拟一小部分 HTTP 头，不要把它当作所有响应头的替代品。

| `http-equiv` | 示例 | 注意点 |
| --- | --- | --- |
| `content-type` | `<meta http-equiv="content-type" content="text/html; charset=utf-8">` | 旧写法；现代页面优先用 `<meta charset="utf-8">` |
| `content-language` | `<meta http-equiv="content-language" content="zh-CN">` | 不推荐作为主要语言声明，优先用 `<html lang="zh-CN">` |
| `content-security-policy` | `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">` | 可声明部分 CSP，但生产环境更推荐 HTTP 响应头 |
| `refresh` | `<meta http-equiv="refresh" content="3;url=/login">` | 自动刷新/跳转，可访问性较差，业务中谨慎使用 |
| `default-style` | `<meta http-equiv="default-style" content="default">` | 指定默认样式表集，少见 |
| `set-cookie` | `<meta http-equiv="set-cookie" ...>` | 浏览器现在会忽略，应该用 `Set-Cookie` 响应头 |
| `x-ua-compatible` | `<meta http-equiv="x-ua-compatible" content="IE=edge">` | IE 历史兼容写法，现代浏览器忽略 |

缓存控制、Cookie、安全头、MIME 类型等关键策略优先通过服务端 HTTP 响应头设置。尤其不要用未知的 `http-equiv` 安全头伪装成有效防护。

## 社交分享元数据

社交平台和聊天软件常读取 Open Graph、Twitter/X Card 等元数据。它们不是 HTML 标准 `name` 列表的一部分，但业务中很常见。

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="Frontend Notes Lab">
<meta property="og:description" content="前端面试资料的实验驱动文档站">
<meta property="og:image" content="https://example.com/og-image.png">
<meta property="og:url" content="https://example.com/">

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Frontend Notes Lab">
<meta name="twitter:description" content="前端面试资料的实验驱动文档站">
<meta name="twitter:image" content="https://example.com/og-image.png">
```

面试时可以说明：`description` 面向通用页面摘要和搜索展示；`og:*`、`twitter:*` 更偏社交分享预览。它们可以内容一致，但用途不同。

## 旧资料中的属性如何取舍

| 名称 | 处理建议 |
| --- | --- |
| `keywords` | 可以知道，但不要作为现代 SEO 重点 |
| `revised` | 不作为现代 HTML 常规答案 |
| `scheme` | HTML5 中不再适合作为重点 |
| `window-target` | 历史浏览器行为，不作为现代答案 |
| `renderer` | 国内双核浏览器历史兼容场景，非通用标准能力 |
| `pragma` | 缓存相关历史写法，优先用 HTTP 响应头 |
| `author` / `generator` | 可以提，但业务价值通常低于 `charset`、`viewport`、`description`、`robots` |

## Demo

较完整的业务页面头部可以这样组织：

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">

  <title>Frontend Notes Lab</title>
  <meta name="description" content="前端面试资料的实验驱动文档站">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://example.com/html/document-structure/meta-and-head">

  <meta property="og:type" content="article">
  <meta property="og:title" content="head 与 meta 常见问题">
  <meta property="og:description" content="梳理 HTML head 与 meta 的常见属性、用法和面试回答。">
  <meta property="og:image" content="https://example.com/og/meta-head.png">

  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://cdn.example.com">
  <link rel="stylesheet" href="/assets/app.css">
  <script src="/assets/app.js" defer></script>
</head>
```

动态修改标题：

```js
document.title = '新的页面标题';
console.log(document.characterSet); // UTF-8
```

面试回答：

> `head` 放文档元数据和资源声明。`meta` 常见用法有 `charset`、`name + content`、`http-equiv + content`、`itemprop + content`。最重要的是 `charset`、`viewport`、`description`、`robots`、`theme-color`、`color-scheme`、`referrer` 等。`http-equiv` 只能模拟少量 HTTP 头，安全、缓存、Cookie 等生产策略优先用真实响应头。社交分享常用 `og:*` 和 `twitter:*` 元数据。旧的 `keywords`、`pragma`、`renderer`、`x-ua-compatible` 要知道历史背景，但不要作为现代最佳实践重点。

## 参考来源

- [MDN: `<meta>` HTML metadata element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta)
- [MDN: `<meta name>` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name)
- [MDN: `<meta http-equiv>` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv)
- [MDN: `<head>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
- [Google Search Central: Robots meta tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
