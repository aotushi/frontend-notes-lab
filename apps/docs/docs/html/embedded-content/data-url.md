# Data URL 是什么？什么时候该用？

## 问题

Data URL 是什么？它和普通资源 URL、Blob URL 有什么区别？现代前端里还应该用 Base64 / Data URL 优化图片吗？

## 结论

Data URL 是使用 `data:` 协议把**资源内容直接写进 URL** 的形式。浏览器读取它时不需要再向服务器请求一个独立资源，而是直接解析 URL 中的数据。

Data URL 不等于 Base64：Base64 只是它可选的一种编码方式。完整格式是：

```txt
data:[<media-type>][;base64],<data>
```

- `<media-type>` 表示资源类型，例如 `image/png`；省略时默认为 `text/plain;charset=US-ASCII`。
- `;base64` 表示后面的数据使用 Base64 编码，常用于图片等二进制内容。
- 文本内容可以不使用 Base64，但空格、`#`、`%` 等特殊字符需要进行百分号编码。
- 媒体类型与数据之间的逗号不能省略。

例如，下面两个 Data URL 分别表示纯文本和一张 SVG 图片：

```txt
data:,Hello%2C%20World%21
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%230f766e'/%3E%3C/svg%3E
```

### 普通 URL、Data URL 与 Blob URL 的区别

| 对比项 | 普通资源 URL | Data URL | Blob URL |
| --- | --- | --- | --- |
| 示例 | `/images/logo.svg` | `data:image/svg+xml,...` | `blob:https://example.com/uuid` |
| 表示什么 | 资源的位置 | URL 自身包含的资源内容 | 浏览器内存中 `Blob` 或 `File` 的临时引用 |
| 是否单独请求 | 首次读取通常需要，命中缓存时除外 | 不需要 | 不需要 |
| 缓存方式 | 可以作为独立资源缓存 | 只能随所在的 HTML、CSS 或 JS 一起缓存 | 不是持久地址，刷新后通常需要重新创建 |
| 体积 | 不增加引用它的文件体积 | 直接增加引用它的文件体积 | URL 很短，实际数据保存在 `Blob` 中 |
| 生命周期 | 由资源地址和缓存策略决定 | 与包含它的字符串同时存在 | 使用 `URL.createObjectURL()` 创建，不再需要时使用 `URL.revokeObjectURL()` 释放 |
| 典型用途 | 网站图片、字体、脚本等常规资源 | 极小且不复用的内联资源、单文件文档 | 本地文件预览、动态生成的图片或下载内容 |

最容易混淆的是：**Data URL 保存的是内容，Blob URL 保存的是引用**。因此 Blob URL 更适合较大的本地文件；它不会把整个文件编码进一个长字符串。

### 什么时候使用 Data URL

可以考虑：

- 资源非常小、只使用一次，并且需要与当前 HTML 或 CSS 一起分发。
- 需要生成完全独立的单文件 HTML，例如离线示例或测试夹具。
- 接收方接口明确要求 Data URL 字符串，例如某些图片上传或图像处理接口。
- 构建工具经过体积测量后，将少量小资源自动内联。

通常不推荐：

- 会跨页面复用的 logo、图标或背景图，独立文件更容易复用缓存。
- 大图片、字体、音频和视频，它们会显著放大所在文件并增加解析与内存成本。
- 普通的用户文件预览，这类场景优先使用 Blob URL。
- 仅仅为了“减少一次请求”而手动把资源全部转成 Base64。HTTP/2、HTTP/3 和浏览器缓存已经降低了小文件请求的部分成本，是否内联仍应根据实际体积和加载性能判断。

Base64 会把每 3 个字节编码为 4 个字符，因此**编码后的原始载荷通常约增大三分之一**。这是编码层面的变化，不等同于启用 HTTP 压缩后的最终传输体积；SVG 等文本资源使用百分号编码还是 Base64 更小，也需要以实际结果为准。

### 完整示例

下面的完整 HTML 同时演示两种适合的用法：

1. 把一个很小的 SVG 直接写成 Data URL。
2. 使用 Blob URL 预览用户选择的本地图片。

Blob URL 不应在图片刚触发 `load` 时立即释放，否则图片虽然已经显示，却可能无法继续用于右键保存或在新标签页打开。示例只在**替换或清除预览**、图片不再可访问时释放旧 URL。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data URL 与 Blob URL 示例</title>
</head>
<body>
  <h1>Data URL 与 Blob URL</h1>

  <section>
    <h2>1. 小型 Data URL</h2>
    <img
      width="160"
      height="90"
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90' viewBox='0 0 160 90'%3E%3Crect width='160' height='90' rx='12' fill='%230f766e'/%3E%3Ctext x='80' y='52' text-anchor='middle' font-family='sans-serif' font-size='18' fill='white'%3EData%20URL%3C/text%3E%3C/svg%3E"
      alt="写在 Data URL 中的绿色 SVG 图片"
    >
  </section>

  <section>
    <h2>2. 本地图片 Blob URL 预览</h2>
    <label for="image-file">选择图片：</label>
    <input id="image-file" type="file" accept="image/*">
    <button id="clear-preview" type="button">清除预览</button>

    <p>
      <img
        id="image-preview"
        width="320"
        alt="所选本地图片的预览"
        hidden
      >
    </p>
  </section>

  <script>
    const fileInput = document.querySelector('#image-file')
    const preview = document.querySelector('#image-preview')
    const clearButton = document.querySelector('#clear-preview')

    let currentObjectUrl = null

    function clearPreview() {
      preview.removeAttribute('src')
      preview.hidden = true

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl)
        currentObjectUrl = null
      }
    }

    fileInput.addEventListener('change', () => {
      clearPreview()

      const file = fileInput.files[0]
      if (!file) return

      currentObjectUrl = URL.createObjectURL(file)
      preview.src = currentObjectUrl
      preview.hidden = false
    })

    clearButton.addEventListener('click', () => {
      clearPreview()
      fileInput.value = ''
    })
  </script>
</body>
</html>
```

如果目标接口明确要求字符串，可以使用 `FileReader.readAsDataURL(file)`。它返回的是带有媒体类型前缀的完整 Data URL，而不只是 Base64 数据：

```js
const file = document.querySelector('#image-file').files[0]

if (file) {
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    console.log(reader.result)
    // data:image/png;base64,iVBORw0KGgo...
  })

  reader.readAsDataURL(file)
}
```

### 缓存与安全边界

- Data URL 不能像独立文件那样单独更新和缓存；包含它的 HTML、CSS 或 JS 变化时，整份文件都可能需要重新下载。
- 以 Data URL 打开的文档会获得新的不透明源，不会继承创建页面的源；现代浏览器还会阻止页面顶层直接导航到 `data:` URL。
- 不要把不可信内容拼进 `data:text/html` 或可执行脚本的 SVG。
- 使用内容安全策略时，需要在对应指令中明确决定是否允许 `data:`，例如 `img-src 'self' data:`。不要为了一个资源把 `data:` 无限制加入所有资源类型。
- 浏览器没有统一承诺 Data URL 的最大长度；即使某个浏览器允许很长的地址，也不代表它适合承载大文件。

## 参考来源

- [MDN: data URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data)
- [MDN: blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)
- [MDN: Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
- [MDN: FileReader.readAsDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)
- [MDN: Content Security Policy `img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src)
- [WHATWG URL Standard: Data URL processor](https://url.spec.whatwg.org/#data-url-processor)
