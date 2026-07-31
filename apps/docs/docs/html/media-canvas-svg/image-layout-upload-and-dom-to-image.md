# 图片布局、预览、压缩与 DOM 转图片

## 问题

如何让图片适应容器、固定比例裁剪、垂直居中或被文字环绕？图片上传前如何完成本地预览、等比缩放和压缩？DOM 转图片有哪些方案和限制？

## 结论

这类需求包含三个不同层次：

| 层次 | 解决的问题 | 主要技术 |
| --- | --- | --- |
| 图片布局 | 图片在页面中如何占位、缩放、裁剪和对齐 | CSS、图片固有宽高 |
| 上传处理 | 本地文件如何预览、缩小、重新编码并上传 | File、Blob URL、Canvas、FormData |
| DOM 转图片 | 如何把已经渲染的界面导出为图片 | DOM 转图片库、无头浏览器或屏幕捕获 |

### 图片布局

`<img>` 是具有固有尺寸和宽高比的替换元素。先确定是要“完整显示图片”，还是要“让图片填满固定盒子”：

| 场景 | 处理方式 | 边界 |
| --- | --- | --- |
| 随容器缩小，保持完整图片 | `max-width: 100%; height: auto` | 不会裁剪，也不会把小图强制放大 |
| 填满固定比例的封面框 | 固定容器比例，图片设为 `width/height: 100%` 和 `object-fit: cover` | 保持比例，但边缘可能被裁剪 |
| 完整放入固定盒子 | `object-fit: contain` | 不裁剪，比例不同时会留空 |
| 在容器中水平、垂直居中 | 容器使用 Grid 的 `place-items: center` 或 Flex | `vertical-align` 只负责行内排版，不是通用的容器居中方案 |
| 消除图片下方的基线空隙 | `display: block` | 行内图片也可以按需要使用 `vertical-align` |
| 让正文环绕图片 | `float` 配合外边距 | `shape-outside` 只对浮动元素生效，并且需要明确的形状和尺寸 |

`object-fit` 控制的是图片内容如何放进已经确定尺寸的图片盒子，不能单独让图片变成响应式图片。裁剪焦点不在中央时，可以配合 `object-position` 调整可见区域。

```html
<figure>
  <div class="cover">
    <img
      src="/images/product.jpg"
      alt="白色桌面上的无线耳机"
      width="1200"
      height="800"
    >
  </div>
  <figcaption>无线耳机产品图</figcaption>
</figure>

<style>
  .cover {
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .cover img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
```

### 本地预览、缩放、压缩与上传

上传图片的完整流程是：

1. **选择并校验：** `accept` 只提示文件选择器允许哪些类型，前端仍要检查类型和大小，服务端还要重新校验实际文件内容。
2. **本地预览：** `URL.createObjectURL(file)` 为 `File` 创建临时 Blob URL，适合直接交给 `<img>`，不需要先生成 Base64 字符串。
3. **管理预览 URL：** 更换或移除预览时回收旧 URL。不要在图片刚加载完时立即回收，否则右键保存或在新标签页打开等操作可能失效。
4. **解码并缩小：** `createImageBitmap(file)` 可以直接解码 `File`；根据最大宽高计算等比缩放尺寸，避免把超大手机照片按原始分辨率绘制到 Canvas。
5. **重新编码：** 使用 `drawImage()` 绘制目标尺寸，再用 `toBlob()` 输出。JPEG/WebP 的 `quality` 才表示有损压缩质量；需要透明通道时不要强制转成 JPEG。
6. **上传结果：** 把压缩后的 Blob 放进 `FormData`。必须处理解码失败、空 Canvas 上下文、`toBlob()` 返回 `null`、网络错误和服务端错误。

下面是一个完整实例。为保持行为明确，它只接受 JPEG 和 PNG：JPEG 在缩小后以 `0.82` 质量重新编码，PNG 保持 PNG 以保留透明通道。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片预览与压缩上传</title>
</head>
<body>
  <form id="upload-form">
    <label for="image-input">选择 JPEG 或 PNG 图片</label>
    <input id="image-input" type="file" accept="image/jpeg,image/png" required>
    <img
      id="preview"
      alt="待上传图片预览"
      style="max-width: 100%; max-height: 24rem; object-fit: contain"
      hidden
    >
    <button type="submit">压缩并上传</button>
    <button type="reset">清除</button>
    <output id="status" aria-live="polite"></output>
  </form>

  <script type="module">
    const form = document.querySelector('#upload-form');
    const input = document.querySelector('#image-input');
    const preview = document.querySelector('#preview');
    const status = document.querySelector('#status');
    const allowedTypes = new Set(['image/jpeg', 'image/png']);
    const maxFileSize = 10 * 1024 * 1024;
    const maxWidth = 1920;
    const maxHeight = 1920;

    let selectedFile = null;
    let previewUrl = null;

    function clearPreview() {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
      }
      selectedFile = null;
      preview.removeAttribute('src');
      preview.hidden = true;
      status.value = '';
    }

    input.addEventListener('change', () => {
      clearPreview();
      const file = input.files?.[0];
      if (!file) return;
      if (!allowedTypes.has(file.type) || file.size > maxFileSize) {
        input.value = '';
        status.value = '请选择不超过 10 MB 的 JPEG 或 PNG 图片。';
        return;
      }
      selectedFile = file;
      previewUrl = URL.createObjectURL(file);
      preview.src = previewUrl;
      preview.hidden = false;
      status.value = '图片已选择，可以上传。';
    });

    form.addEventListener('reset', clearPreview);

    async function compressImage(file) {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image'
      });

      try {
        const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('无法创建 Canvas 2D 上下文。');
        context.drawImage(bitmap, 0, 0, width, height);
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = outputType === 'image/jpeg' ? 0.82 : undefined;
        return await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('图片编码失败。'));
          }, outputType, quality);
        });
      } finally {
        bitmap.close();
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!selectedFile) return;
      status.value = '正在压缩并上传……';

      try {
        const blob = await compressImage(selectedFile);
        const extension = blob.type === 'image/png' ? 'png' : 'jpg';
        const body = new FormData();
        body.append('image', blob, `upload.${extension}`);
        // 替换为真实接口；不要手动设置 multipart/form-data 的 Content-Type。
        const response = await fetch('/api/images', {
          method: 'POST',
          body,
        });
        if (!response.ok) throw new Error(`上传失败：${response.status}`);
        status.value = `上传成功，文件大小为 ${blob.size} 字节。`;
      } catch (error) {
        status.value = error instanceof Error ? error.message : '图片处理失败。';
      }
    });
  </script>
</body>
</html>
```

Canvas 压缩主要做两件事：**减少像素数量**和**重新编码**。只调整 `quality` 而保持原始宽高，通常不能解决超大图片的内存与分辨率问题。对于大量图片或超大图片，可以进一步考虑在 Worker 中使用 `createImageBitmap()` 和 `OffscreenCanvas`，避免长时间占用主线程。

### DOM 转图片

DOM 转图片不是单一方案，应按目标选择：

| 目标 | 适合方案 | 主要限制 |
| --- | --- | --- |
| 导出自己控制的海报、卡片或报表节点 | `html-to-image`、`html2canvas` 等客户端库 | 是重新构造渲染结果，不保证与浏览器截图逐像素一致 |
| 获取高还原度、稳定的网页截图 | 服务端 Playwright、Puppeteer 等无头浏览器 | 需要服务端资源和页面访问权限 |
| 捕获用户选择的标签页、窗口或屏幕 | `getDisplayMedia()` | 每次都需要用户操作和授权，不能静默执行 |

以 `html-to-image` 为例，库通常会克隆目标节点、复制计算样式、内联字体与图片，将节点包装进 SVG `<foreignObject>`，最后按需绘制到 Canvas。它仍可能受以下因素影响：

- 跨域图片或字体没有正确配置 CORS，导致资源无法内联或 Canvas 被污染。
- `<iframe>`、视频当前帧、浏览器专属样式和部分复杂 CSS 无法稳定复现。
- 超大 DOM 会触发 Canvas 尺寸、Data URL 长度或内存限制。
- `pixelRatio` 越高，输出越清晰，但像素数量和内存消耗会按面积增长。

客户端库的调用应等待字体完成加载，并处理空结果和异常：

```js
import { toBlob } from 'html-to-image';

async function exportCard(node) {
  await document.fonts.ready;

  const blob = await toBlob(node, {
    backgroundColor: '#fff',
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    cacheBust: true,
  });

  if (!blob) throw new Error('DOM 转图片失败。');
  return blob;
}
```

## 参考来源

- [MDN: Styling replaced elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Images/Replaced_element_properties)
- [MDN: `object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit)
- [MDN: Blob URL memory management](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob#memory_management)
- [MDN: `accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)
- [MDN: `createImageBitmap()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap)
- [MDN: Canvas `drawImage()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [MDN: Canvas `toBlob()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [MDN: `getDisplayMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [`html-to-image`: How it works](https://github.com/bubkoo/html-to-image#how-it-works)
