# `meta viewport` 有什么作用？

## 问题

为什么移动端页面通常要写 `<meta name="viewport" content="width=device-width, initial-scale=1">`？`width`、`initial-scale`、`user-scalable`、`viewport-fit` 分别影响什么？

## 结论

移动端浏览器为了兼容早期桌面网页，可能会先用一个较宽的布局视口渲染页面，再把页面整体缩小到手机屏幕里。`meta viewport` 的作用是给浏览器一个视口尺寸和初始缩放的提示，让页面按移动端宽度参与布局。

现代移动端最常见、最推荐的写法是：

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

它表达两件事：

- `width=device-width`：布局视口宽度按设备的 CSS 像素宽度计算，而不是按一个桌面网页宽度缩小显示。
- `initial-scale=1`：页面初始缩放为 1，通常表示 1 个 CSS 像素按正常比例映射到视口像素。

面试里要把三个概念讲清楚：

| 概念 | 含义 | 常见获取方式 |
| --- | --- | --- |
| 布局视口 layout viewport | CSS 布局、媒体查询、`position: fixed` 默认依赖的视口 | `document.documentElement.clientWidth` |
| 视觉视口 visual viewport | 用户当前真正看见的区域；软键盘弹出、地址栏变化、 pinch zoom 时可能变小 | `window.visualViewport?.width` |
| DPR | 设备像素比，表示 CSS 像素和物理像素之间的比例关系 | `window.devicePixelRatio` |

不要把 `viewport` 和 DPR 混为一谈。`width=device-width` 设置的是 CSS 布局视口，不是物理像素宽度；高 DPR 设备上，一个 CSS 像素会由多个物理像素绘制。

`user-scalable=no`、`maximum-scale=1`、`minimum-scale=1` 不应作为默认写法。它们会限制用户缩放，影响低视力用户阅读，也经常被移动浏览器基于可访问性策略忽略。除非有非常明确、可替代的无障碍方案，否则不要禁用缩放。

常见参数：

| 参数 | 推荐程度 | 说明 |
| --- | --- | --- |
| `width=device-width` | 推荐 | 移动端响应式页面的基础设置 |
| `initial-scale=1` | 推荐 | 设置初始缩放；通常和 `width=device-width` 一起写 |
| `height=device-height` | 很少用 | 移动端动态工具栏、软键盘会让高度更复杂，通常不用它控制布局 |
| `minimum-scale` / `maximum-scale` | 不推荐默认使用 | 容易限制用户缩放 |
| `user-scalable=no` | 不推荐 | 可访问性风险高 |
| `viewport-fit=cover` | 特定场景使用 | 允许内容延伸到刘海屏、安全区域，需要配合 `env(safe-area-inset-*)` |

带安全区域的全屏页面可以这样写：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

并在 CSS 中处理安全区域：

```css
.app-shell {
  min-height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```

`100vh` 在移动端也要谨慎。地址栏、底部工具栏、软键盘可能改变用户真实可见区域。现代 CSS 可以根据场景使用 `svh`、`lvh`、`dvh`：`svh` 偏稳定，适合避免被浏览器 UI 遮挡；`dvh` 跟随动态可见区域变化，适合需要贴合当前视口高度的界面。

## Demo

这个 Demo 直接读取当前浏览器 API，不再模拟视口。布局视口和视觉视口不是 HTML 源码中的某个块元素，而是浏览器用于布局和显示的坐标空间；它们只能通过 `document.documentElement.clientWidth`、`window.visualViewport` 等 API 读取。Demo 还提供一个真实 DOM 容器实验：把容器宽度调到小于 `680px`，观察固定宽度元素如何产生横向溢出。

<DemoFrame
  src="/demos/meta-viewport/index.html"
  title="meta viewport 视口指标验证"
  height="760"
/>

关键代码：

```js
const layoutWidth = document.documentElement.clientWidth
const visualWidth = window.visualViewport?.width
const visualScale = window.visualViewport?.scale
const dpr = window.devicePixelRatio
```

一个常见错误是把移动端适配写成禁用缩放：

```html
<!-- 不推荐作为默认模板 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
>
```

另一个过时写法是根据 DPR 动态修改 `initial-scale = 1 / devicePixelRatio`。这种方式来自早期 rem / 1px 边框适配方案，现在通常不建议作为通用移动端方案；优先使用响应式布局、媒体查询、现代 viewport 单位和高清资源处理。

## 面试回答

`meta viewport` 是移动端响应式页面的基础配置。移动浏览器为了兼容桌面网页，可能默认用较宽的布局视口渲染再缩小显示；`width=device-width, initial-scale=1` 告诉浏览器按设备 CSS 像素宽度作为布局视口，并以正常比例初始显示。回答时要区分布局视口、视觉视口和 DPR：布局视口影响 CSS 布局和媒体查询，视觉视口是用户当前可见区域，DPR 是 CSS 像素到物理像素的比例。现代项目不要默认写 `user-scalable=no` 或 `maximum-scale=1`，这会损害可访问性。全屏沉浸式页面可用 `viewport-fit=cover`，但必须配合安全区域变量。

## 参考来源

- [MDN: `<meta name="viewport">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts)
- [MDN: Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)
- [web.dev: Learn CSS sizing](https://web.dev/learn/css/sizing)
- [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)
