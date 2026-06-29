# 移动端视口案例

本页沉淀 HTML 移动端主题下的视口、缩放、安全区和反例案例。CSS 布局、单位和响应式策略的完整案例见 [响应式适配案例](/css/responsive/responsive-adaptation-cases)。

## 问题

如何验证 `meta viewport` 是否让页面按移动端宽度布局？如何读取布局视口、视觉视口和 DPR？安全区页面模板、禁用缩放和按 DPR 修改 viewport 缩放分别应该怎么写、怎么判断边界？

## 结论

`meta viewport` 只负责给移动端浏览器一个布局基准。它能让页面按设备 CSS 像素宽度参与布局，但不会自动修复固定宽度、图片资源、字体缩放、`1px` 边框或安全区遮挡等问题。

生产页面通常先写：

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

如果页面需要延伸到刘海屏、圆角屏或底部手势区域，再加入 `viewport-fit=cover`，并在 CSS 里用 `env(safe-area-inset-*)` 留出安全区域。

## Demo

### 视口指标验证

这个 Demo 读取当前浏览器的真实 API 值，并提供一个固定宽度溢出实验：把容器宽度调到小于 `680px`，观察固定宽度元素如何产生横向溢出。

<DemoFrame
  src="/demos/meta-viewport/index.html"
  title="meta viewport 视口指标验证"
  height="760"
/>

关键读数来自这些 API：

```js
const layoutWidth = document.documentElement.clientWidth
const visualWidth = window.visualViewport?.width
const visualScale = window.visualViewport?.scale
const dpr = window.devicePixelRatio
```

读数含义：

| 指标 | 说明 |
| --- | --- |
| `document.documentElement.clientWidth` | 布局视口宽度，CSS 布局和媒体查询主要依赖它 |
| `window.visualViewport?.width` | 当前可见区域宽度，缩放、软键盘和浏览器 UI 变化时可能变化 |
| `window.visualViewport?.scale` | 视觉视口相对布局视口的缩放比例 |
| `window.devicePixelRatio` | CSS 像素和物理像素之间的比例 |

### 移动端基础模板

普通响应式页面优先使用这个模板：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>移动端页面</title>
  </head>
  <body>
    <main class="page">
      页面内容
    </main>
  </body>
</html>
```

配套 CSS 不要假设页面宽度永远等于某个设计稿宽度：

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

img,
video {
  max-width: 100%;
  height: auto;
}

.page {
  width: min(100%, 72rem);
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 32px);
}
```

这个模板只解决基础入口：页面按移动端宽度布局、盒模型可控、图片不会默认撑破容器。具体布局策略仍应交给 CSS 响应式方案。

### 安全区页面模板

需要让背景铺满刘海屏或底部手势区域时，才使用 `viewport-fit=cover`：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
>
```

然后在关键容器或固定操作栏上补安全区：

```css
.app-shell {
  min-height: 100dvh;
  padding-top: max(16px, env(safe-area-inset-top));
  padding-right: max(16px, env(safe-area-inset-right));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
}

.bottom-action {
  position: sticky;
  inset-block-end: 0;
  padding: 12px 16px;
  padding-block-end: max(12px, env(safe-area-inset-bottom));
}
```

`viewport-fit=cover` 不是通用“移动端优化开关”。如果页面不需要内容延伸到安全区外，保持默认行为通常更简单。

### 反例：默认禁用缩放

不要把下面写法当作移动端默认模板：

```html
<!-- 不推荐作为默认模板 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
>
```

它会限制用户放大页面，影响低视力用户阅读，也可能被现代移动浏览器基于可访问性策略忽略。布局问题应该通过响应式布局、字号策略和内容约束解决，而不是禁止用户缩放。

### 反例：按 DPR 修改 viewport 缩放

早期移动端适配里有一种写法：按 DPR 动态设置 `initial-scale = 1 / devicePixelRatio`。

```js
const scale = 1 / window.devicePixelRatio
let viewport = document.querySelector('meta[name="viewport"]')

if (!viewport) {
  viewport = document.createElement('meta')
  viewport.setAttribute('name', 'viewport')
  document.head.appendChild(viewport)
}

viewport.setAttribute(
  'content',
  `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`
)
```

这种方式会改变整个页面的缩放基准，常见于早期 `rem` / 物理 `1px` 方案。现代项目通常不把它作为通用方案；更稳的做法是保持正常 viewport，再用响应式布局、`srcset`、`clamp()`、安全区变量和视觉 `1px` 方案分别处理具体问题。

## 参考来源

- [MDN: `<meta name="viewport">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts)
- [MDN: Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)
- [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)
