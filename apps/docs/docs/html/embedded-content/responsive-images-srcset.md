# `img srcset` 和 `sizes` 如何选择响应式图片？

## 问题

`<img>` 的 `srcset` 和 `sizes` 分别解决什么问题？浏览器到底如何选择要下载的图片？

## 结论

`srcset` 告诉浏览器“有哪些候选图片”，`sizes` 告诉浏览器“这张图片在当前布局里大约会占多宽”。浏览器会结合视口、媒体条件、设备像素比 DPR、网络和缓存状态，选择一个合适的候选资源；开发者不能把它理解成固定的 `if/else` 下载规则。

`srcset` 有两种常见描述符：

| 写法 | 适合场景 | 是否需要 `sizes` | 例子 |
| --- | --- | --- | --- |
| `1x`、`2x` 密度描述符 | 图标、头像、固定 CSS 尺寸的图片 | 通常不需要 | `avatar.png 1x, avatar@2x.png 2x` |
| `400w`、`800w` 宽度描述符 | 会随视口变化的大图、内容图、封面图 | 通常需要 | `hero-400.jpg 400w, hero-800.jpg 800w` |

使用宽度描述符时，`sizes` 描述的是图片的渲染槽位宽度，也就是 CSS 像素里的显示宽度，不是图片文件真实宽度。例如：

```html
<img
  src="/images/hero-800.jpg"
  srcset="
    /images/hero-400.jpg 400w,
    /images/hero-800.jpg 800w,
    /images/hero-1200.jpg 1200w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 960px) 60vw, 640px"
  alt="产品仪表盘截图"
  width="1200"
  height="675"
>
```

浏览器的大致判断过程是：

1. 解析 `sizes`，从左到右找到第一个命中的媒体条件。
2. 得到当前图片的槽位宽度，比如 `100vw`、`60vw` 或 `640px`。
3. 用槽位宽度乘以当前 DPR，得到更接近真实显示需求的资源宽度。
4. 在 `srcset` 候选列表里选择一个合适资源。
5. 如果候选资源已经在缓存里，或者浏览器基于网络情况做优化，实际选择可能和手算结果略有差异。

如果没有写 `sizes`，并且 `srcset` 使用的是 `w` 宽度描述符，浏览器会按默认 `sizes="100vw"` 处理。这是很多页面下载过大图片的原因：图片实际只占容器一半，但浏览器以为它会占满整个视口。

`src` 仍然必须保留。它是旧浏览器和 `srcset` 解析失败时的回退地址，也是图片的基础资源地址。

`srcset/sizes` 主要解决“同一张图在不同显示尺寸下加载更合适的文件”。如果需要根据屏幕宽度切换不同裁剪、不同构图，或者按浏览器支持切换 AVIF/WebP/JPEG，更适合使用 `<picture>` 和 `<source>`。

## Demo

这个 Demo 使用本地 400w、800w、1200w 三个候选资源。打开新窗口后调整浏览器宽度，观察 `currentSrc`、视口宽度、DPR、槽位宽度和图片实际显示宽度。下调窗口后浏览器可能继续使用已缓存的大图，想重新观察选择过程可以刷新页面并查看 DevTools Network。

<DemoFrame
  src="/demos/responsive-images-srcset/index.html"
  title="img srcset 与 sizes 选择验证"
  height="760"
/>

关键代码：

```html
<img
  id="responsive-image"
  src="/demos/responsive-images-srcset/hero-800.svg"
  srcset="
    /demos/responsive-images-srcset/hero-400.svg 400w,
    /demos/responsive-images-srcset/hero-800.svg 800w,
    /demos/responsive-images-srcset/hero-1200.svg 1200w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 960px) 60vw, 640px"
  alt="响应式图片候选资源示意图"
  width="1200"
  height="675"
>
```

常见错误：

```html
<!-- 错误：用了 w 描述符，但没有写 sizes，浏览器会按 100vw 估算 -->
<img
  src="/images/card-800.jpg"
  srcset="/images/card-400.jpg 400w, /images/card-800.jpg 800w"
  alt="文章配图"
>

<!-- 错误：同一个 srcset 里不能混用 w 和 x 描述符 -->
<img
  src="/images/photo.jpg"
  srcset="/images/photo-400.jpg 400w, /images/photo@2x.jpg 2x"
  alt="照片"
>
```

性能和稳定性上还要注意：给图片写 `width` 和 `height`，让浏览器在图片下载前保留比例空间，减少布局偏移；首屏关键图可以考虑 `fetchpriority="high"`，非首屏图片通常配合 `loading="lazy"`。

## 面试回答

`srcset` 提供候选图片，`sizes` 描述图片在当前布局中的显示槽位。浏览器先根据 `sizes` 命中媒体条件，算出 CSS 像素里的槽位宽度，再结合 DPR 到 `srcset` 里挑一个合适资源。`1x/2x` 适合固定尺寸图片，`400w/800w` 适合响应式大图，并且通常要配合 `sizes`。`src` 不能省，它是回退资源。`srcset/sizes` 解决同一图片的尺寸选择；如果要换格式或换构图，应该用 `picture/source`。

## 参考来源

- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [MDN: `img` element - `srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#srcset)
- [MDN: `img` element - `sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#sizes)
- [web.dev: Responsive images](https://web.dev/learn/images/responsive-images/)
- [web.dev: Image performance](https://web.dev/learn/performance/image-performance)
