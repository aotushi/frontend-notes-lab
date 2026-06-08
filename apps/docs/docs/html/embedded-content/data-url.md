# Data URL 是什么？什么时候该用？

## 问题

Data URL 是什么？它和普通资源 URL、Blob URL 有什么区别？现代前端里还应该用 Base64 / Data URL 优化图片吗？

## 结论

Data URL 是一种把资源内容直接写进 URL 的方案，格式是：

```txt
data:[<media-type>][;base64],<data>
```

例如：

```html
<img
  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E...%3C/svg%3E"
  alt="内联 SVG 示例"
>
```

它的核心特点是：浏览器不再为这个资源单独发起 HTTP 请求，而是直接从当前 HTML、CSS 或 JS 字符串里解析资源内容。

Data URL 适合很小、低复用、和当前文件强绑定的资源，比如极小图标、内联 SVG、离线 Demo、邮件模板、上传前的小图预览。不适合大图片、字体、视频、会跨页面复用的公共资源。

常见判断：

| 场景 | 是否适合 Data URL | 原因 |
| --- | --- | --- |
| 小型 SVG 图标 | 可以考虑 | SVG 文本可 URL 编码，省去小请求 |
| 上传前图片预览 | 小图可以，大图不推荐 | `readAsDataURL()` 简单，但大文件会生成很长字符串 |
| 多页面复用的 logo | 不推荐 | 独立文件更容易被浏览器缓存 |
| 大图、字体、视频 | 不推荐 | 体积、解析成本和内存占用都不划算 |
| 离线单文件 Demo | 适合 | 单文件可分发是核心收益 |

Data URL 不是现代 Web 的通用性能优化。HTTP/2、HTTP/3、缓存、预加载和构建工具已经显著降低“小文件多请求”的问题。把大资源转成 Base64 通常会让 HTML/CSS/JS 变大，拖慢解析，还失去独立缓存。

Base64 编码会让体积大约膨胀 33%，因为它把每 3 个字节编码成 4 个字符。SVG 等文本资源有时不需要 Base64，可以直接 URL 编码；是否更小要看具体内容。

浏览器安全上也要注意：现代浏览器会把 Data URL 当成唯一的不透明源，而不是继承创建它的页面源。不要把不可信内容拼进 `data:text/html`、`data:image/svg+xml` 这类可解析格式里；如果站点使用 CSP，还需要明确控制是否允许 `img-src data:`、`font-src data:` 等来源。

## Demo

这个 Demo 可以验证三件事：

1. 同一段 SVG，Data URL 会变成很长的字符串。
2. Blob URL 只是浏览器内部生成的临时引用，适合较大的本地文件预览。
3. Blob URL 用完应该调用 `URL.revokeObjectURL()` 释放引用。

<DemoFrame
  src="/demos/data-url/index.html"
  title="Data URL 与 Blob URL 对比"
  height="720"
/>

关键代码：

```js
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">...</svg>`

const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`
imgFromDataUrl.src = dataUrl

const blob = new Blob([svg], { type: 'image/svg+xml' })
const blobUrl = URL.createObjectURL(blob)
imgFromBlobUrl.src = blobUrl

imgFromBlobUrl.onload = () => {
  URL.revokeObjectURL(blobUrl)
}
```

文件上传预览时，如果只是为了把本地文件显示到页面上，优先考虑 Blob URL：

```js
const url = URL.createObjectURL(file)
preview.src = url

preview.onload = () => {
  URL.revokeObjectURL(url)
}
```

只有当你确实需要“把文件内容变成字符串”，比如要写入 JSON、保存到本地存储或生成单文件 HTML，才更适合 `FileReader.readAsDataURL(file)`。

## 面试回答

Data URL 是把资源内容直接内联到 URL 中的方案，格式一般是 `data:mime/type;base64,...` 或 `data:mime/type,...`。它可以减少一次资源请求，适合极小、低复用、和当前文件强绑定的资源。缺点是 Base64 常见情况下会让体积膨胀约三分之一，资源无法独立缓存，还会增大 HTML/CSS/JS 的解析成本。现代 HTTP/2/HTTP/3 下不要机械把资源转 Base64。文件预览场景里，大文件通常用 `URL.createObjectURL()` 更合适，并在用完后 `revokeObjectURL()`。

## 参考来源

- [MDN: data URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data)
- [MDN: FileReader.readAsDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)
- [MDN: URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN: URL.revokeObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static)
- [MDN: Content Security Policy `img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src)
