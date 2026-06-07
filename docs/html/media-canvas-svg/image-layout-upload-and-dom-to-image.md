# 图片布局、预览、压缩与 DOM 转图片

## 问题

如何让图片自适应容器、垂直居中、文字环绕图片？图片上传预览、压缩上传、DOM 转图片、GIF 重新播放怎么处理？

## 结论

图片布局优先用 CSS，不要把图片尺寸和对齐逻辑写死在 HTML 属性里。

常见处理：

| 场景 | 方案 |
| --- | --- |
| 图片适应容器 | `max-width: 100%` 或 `object-fit` |
| 图片铺满固定容器 | `width/height: 100%; object-fit: cover` |
| 垂直居中 | flex/grid，或图片作为 inline 时设置 `vertical-align` |
| 图片底部缝隙 | `img` 默认是行内替换元素，受基线影响；可设 `display: block` |
| 文字环绕图片 | `float`，复杂形状可用 `shape-outside` |
| 圆形点击区域 | CSS 圆形按钮、SVG、或 `area shape="circle"` |

图片上传本地预览通常用 `URL.createObjectURL(file)`，比 `FileReader.readAsDataURL` 更节省内存；用完后调用 `URL.revokeObjectURL()`。压缩上传通常把图片绘制到 Canvas，再用 `canvas.toBlob()` 生成压缩后的 Blob。

DOM 转图片没有原生“一键 API”。常见库会克隆 DOM、计算样式、内联资源，再转成 SVG/Canvas。跨域图片、字体、视频帧、伪元素、滤镜和复杂 CSS 都可能失败。

## Demo

图片布局：

```html
<figure class="media">
  <img src="/cover.jpg" alt="封面图">
</figure>
```

```css
.media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
```

本地预览与压缩：

```js
const file = input.files[0];
const previewUrl = URL.createObjectURL(file);
preview.src = previewUrl;
preview.onload = () => URL.revokeObjectURL(previewUrl);

async function compressImage(image, quality = 0.82) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext('2d').drawImage(image, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });
}
```

GIF 重新播放可以通过重新设置 `src` 触发资源重新加载，但这会受缓存影响。更可控的做法是用视频、CSS 动画或精灵图。

移动端长按保存动态二维码图片时，通常要先在服务端或 Canvas 生成最终图片，再用普通 `<img>` 展示。长按保存是否出现取决于容器策略，不能完全由 Web 标准强制。微信文章里“点击图片查看答案”本质是用图片、折叠内容或交互层做状态切换，不要把答案放在 `alt` 或不可访问的位置。

面试回答：

> 图片自适应一般用 `max-width`、`object-fit`、稳定宽高和 `display:block`。本地预览用 `URL.createObjectURL`，压缩上传用 Canvas `drawImage` 后 `toBlob`。DOM 转图片依赖克隆 DOM 和资源内联，跨域图片和复杂样式是主要坑点，业务上要提前兜底。

## 参考来源

- [MDN: `object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
- [MDN: `URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN: Canvas `toBlob()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
