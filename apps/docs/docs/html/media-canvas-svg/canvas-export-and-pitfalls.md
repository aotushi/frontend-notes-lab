# Canvas 图片处理、导出与坑点

## 问题

如何把图片画到 Canvas？Canvas 生成分享图、压缩图片、截图视频、导出图片会遇到哪些坑？

## 结论

图片、视频、SVG、另一个 Canvas 都可以作为 `drawImage()` 的来源。Canvas 导出图片常用 `toBlob()` 或 `toDataURL()`，业务优先 `toBlob()`，避免超大 base64 字符串占用内存。

跨域资源是最常见的导出坑：只要把未授权的跨源图片或视频画到 Canvas 上，这个 Canvas 就会被污染，随后调用 `toDataURL()`、`toBlob()`、`getImageData()` 会失败。解决方式是图片标签设置 `crossOrigin="anonymous"`，并且资源服务器返回允许的 CORS 响应头。

常见坑点：

- 没等图片 `load` 就绘制。
- Canvas 尺寸和 CSS 尺寸不一致导致模糊或变形。
- 跨域图片导致 tainted canvas。
- 字体未加载完成，分享图文字回退。
- `globalAlpha` 叠加不是简单相加。
- 频繁全量重绘导致性能问题。
- 旧 IE 不支持原生 Canvas，现代项目通常不再为 IE9 以下兼容 Canvas。

## Demo

安全绘制跨源图片：

```js
async function loadImage(src) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;

  await image.decode();
  return image;
}

const image = await loadImage('https://cdn.example.com/avatar.png');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = image.naturalWidth;
canvas.height = image.naturalHeight;
ctx.drawImage(image, 0, 0);

const blob = await new Promise((resolve) => {
  canvas.toBlob(resolve, 'image/png');
});
```

透明度叠加示例：两个半透明图形重叠区域的最终颜色由 alpha compositing 计算，不是 `0.6 + 0.2`。在默认 source-over 合成下，最终 alpha 是：

```js
const outAlpha = sourceAlpha + destinationAlpha * (1 - sourceAlpha);
```

面试回答：

> Canvas 导出图片前要确保所有图片、字体、视频帧已经加载。跨域资源必须同时设置 `crossOrigin` 和服务端 CORS，否则 Canvas 会被污染，无法导出。分享图建议用 `toBlob`，避免 `toDataURL` 产生大 base64。高 DPR、字体加载、透明度合成和性能重绘都是常见坑点。

## 参考来源

- [MDN: Use cross-origin images in a canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
- [MDN: Canvas `drawImage()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [MDN: Canvas `toBlob()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
