# SVG、WebGL 与 Canvas 取舍

## 问题

什么是 SVG？SVG 如何在 HTML 中使用？SVG 和 Canvas 怎么选？WebGL 又适合什么场景？

## 结论

SVG 是基于 XML 的矢量图形。它可以直接写在 HTML 中，也可以作为图片资源通过 `img`、`object`、CSS 背景等方式引用。inline SVG 会进入 DOM，适合图标、可交互图形、可访问矢量图和可缩放插画。

Canvas 是位图绘图表面，适合高频重绘、大量粒子、游戏、图像处理。SVG 是矢量和 DOM 节点，适合少量元素、可交互、可样式化、可访问的图形。WebGL 基于 GPU 渲染，适合 3D、大规模图形、复杂视觉效果。

| 维度 | SVG | Canvas | WebGL |
| --- | --- | --- | --- |
| 图形类型 | 矢量 | 位图 | GPU 图形 |
| DOM 可访问 | 可以 | 不可以 | 不可以 |
| 大量对象高频更新 | 一般 | 较适合 | 很适合 |
| 图标和简单图表 | 适合 | 可用但不优先 | 不适合 |
| 游戏/粒子/图像处理 | 不优先 | 适合 | 复杂场景适合 |

## Demo

inline SVG：

```html
<svg viewBox="0 0 120 120" role="img" aria-labelledby="heartTitle">
  <title id="heartTitle">爱心图形</title>
  <path
    d="M60 104 C20 70 12 48 24 30 C36 12 54 24 60 38 C66 24 84 12 96 30 C108 48 100 70 60 104 Z"
    fill="#e11d48"
  />
</svg>
```

基础图形：

```html
<svg viewBox="0 0 200 120">
  <rect x="20" y="20" width="80" height="50" rx="6" fill="#2563eb" />
  <polygon points="130,20 180,100 80,100" fill="#16a34a" />
  <polyline points="10,110 60,80 100,96 150,40 190,60" fill="none" stroke="#111827" />
</svg>
```

SVG 转 PNG 的常见做法是把 SVG 序列化成 Blob URL，加载成图片后绘制到 Canvas，再 `toBlob()` 导出。注意：外部图片、字体和跨源资源同样可能触发 Canvas 污染。

面试回答：

> SVG 是矢量、可缩放、可进 DOM 的图形，适合图标、简单图表和可访问交互图形。Canvas 是位图画布，适合高频重绘和大量像素处理。WebGL 使用 GPU，适合 3D 和复杂视觉。选择依据是元素数量、是否需要 DOM/可访问性、是否高频更新和是否需要 GPU 能力。

## 参考来源

- [MDN: SVG in HTML](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML)
- [MDN: SVG tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch)
- [MDN: WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
