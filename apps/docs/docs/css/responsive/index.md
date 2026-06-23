# 响应式与条件规则

本分类收录条件化样式能力：媒体查询、容器查询、`@supports`、响应式单位、视口相关 CSS、断点策略和组件级适配。

## 已整理问题

- 响应式设计和自适应设计有什么区别？
- 响应式布局应该如何规划？
- 媒体查询怎么写？断点应该怎么选？
- `meta viewport` 解决什么问题？为什么不建议禁用缩放？
- `rem`、`vw`、`vh`、`svh`、`lvh`、`dvh` 如何取舍？
- 容器查询解决了什么问题？和媒体查询怎么分工？
- `@supports` 有什么用途？
- 移动端 `1px`、安全区、等比缩放和图片适配怎么处理？

## 问题

响应式布局有哪些策略？如何选择媒体查询、流式布局、容器查询、`rem`、`vw` / `vh`、`dvh`、`@supports`？移动端 `meta viewport`、`1px` 边框、安全区和等比缩放分别应该怎么答？

## 结论

### 理解路径

1. 响应式不是“写几个断点”，而是让同一份内容在不同视口、输入方式、像素密度、用户偏好和组件容器中保持可读、可用、可维护。
2. 页面级布局先从流式布局、Flex、Grid、`min()` / `max()` / `clamp()` 和合理的内容宽度开始；断点只处理布局确实需要变形的位置。
3. 组件级布局优先考虑容器查询，因为同一个组件可能出现在主栏、侧栏、弹窗或卡片中，组件可用宽度不一定等于视口宽度。
4. 移动端适配要先校准视口，再选择单位策略；不要把设计稿像素机械换成 `rem` 或 `vw`。
5. 新 CSS 特性应使用 `@supports` 做增强，而不是把兼容性判断散落到 JavaScript 或用户代理嗅探里。

### 响应式设计和自适应设计有什么区别？

响应式设计通常用同一套文档和样式体系，根据视口、容器、设备能力和用户偏好连续或分段调整布局。核心是流式尺寸、弹性布局、媒体查询、容器查询、响应式图片和条件化 CSS。

自适应设计更偏向为若干设备或断点准备相对固定的布局方案，例如手机、平板、桌面各一套宽度。它可以更容易控制某几个目标尺寸，但断点之外的中间状态可能不如响应式自然。

面试中可以这样区分：

| 维度 | 响应式设计 | 自适应设计 |
| --- | --- | --- |
| 调整方式 | 连续伸缩 + 必要断点 | 多套固定或半固定方案 |
| 主要依据 | 内容、容器、视口、能力特征 | 预设设备或断点 |
| 优点 | 覆盖尺寸范围更连续，维护同一套内容 | 对目标设备控制更强 |
| 风险 | 需要更系统的布局约束 | 容易遗漏中间尺寸和新设备 |

### 响应式布局应该如何规划？

规划顺序是“内容优先、局部优先、断点后置”：

1. 先确定内容的最小可读宽度、最大舒适宽度和关键操作区，而不是先套手机、平板、桌面三个断点。
2. 全局骨架用 Grid 或 Flex 处理主栏、侧栏、导航、列表密度；组件内部用自身的可用空间决定形态。
3. 尺寸优先用 `max-width`、`minmax()`、`clamp()`、百分比、`fr`、`auto-fit` 等流式约束，让布局自然伸缩。
4. 当内容在某个宽度开始拥挤、错位或信息层级改变时，再设置断点。
5. 图片、视频、图表等替换内容要同时处理宽高比、裁剪策略和资源大小。
6. 对触屏、鼠标、减少动画、深色模式、打印等能力或偏好，用对应媒体特性或条件规则处理。

断点不应只来自设备型号。更稳的做法是根据内容和布局断裂点命名，例如 `compact`、`comfortable`、`wide`，再把具体像素值收敛到设计 token 或 CSS 自定义属性里。

### 媒体查询怎么写？断点怎么选？

媒体查询用于根据媒体类型或媒体特性条件应用 CSS。常见条件包括视口宽高、方向、分辨率、指针能力、悬停能力、用户是否偏好减少动画等。

现代写法优先使用范围语法，语义比大量 `min-width` / `max-width` 更清楚：

```css
.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (width >= 48rem) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width >= 72rem) {
  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

断点选择要看内容是否需要改变结构。例如卡片列表从单列变双列，不是因为“768px 是平板”，而是因为卡片在这个宽度以上能保持文本、图片和操作按钮都不拥挤。

`<link media="...">` 和 `@media` 都能写媒体查询，但它们解决的问题不同：

```html
<link rel="stylesheet" href="/print.css" media="print" />
```

```css
@media print {
  .site-nav,
  .toolbar {
    display: none;
  }
}
```

带 `media` 条件的样式表即使当前不匹配，也可能被浏览器下载，只是不会在不匹配时应用；不要把它当成绝对的网络加载开关。

### `meta viewport` 解决什么问题？

移动浏览器为了兼容早期桌面网页，可能会使用比屏幕更宽的布局视口再缩放显示。`meta viewport` 用来告诉浏览器按设备的 CSS 像素宽度建立视口，让媒体查询、`vw`、流式布局按移动设备的真实可用宽度工作。

现代移动页面常用：

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

不建议默认写 `user-scalable=no`、`maximum-scale=1`。禁用缩放会影响低视力用户放大页面，通常也不是修复布局问题的正确方式。需要适配刘海屏或底部安全区时，再显式加入 `viewport-fit=cover`，并用 `env()` 给安全区域留白：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

```css
.bottom-bar {
  padding-block-end: max(16px, env(safe-area-inset-bottom));
}
```

`screen.width` 不适合作为响应式布局的主要依据。CSS 布局关心的是当前视口和容器，而不是设备屏幕出厂物理尺寸；桌面窗口、分屏、多窗口、浏览器缩放和移动端地址栏都会让“屏幕宽度”与实际布局空间脱节。

### `rem`、`vw`、`vh`、`dvh` 如何取舍？

单位选择要看参考对象：

| 单位 | 参考对象 | 适合场景 | 注意点 |
| --- | --- | --- | --- |
| `rem` | 根元素字体尺寸 | 字号、间距、组件尺度跟随全站基准 | 不要为了还原设计稿无限改根字号，用户字号偏好也要考虑 |
| `vw` / `vh` | 视口宽高的 1% | 全屏区块、流式字号、运营页等视口相关尺寸 | 移动端浏览器 UI 会影响高度类单位的直觉 |
| `svh` | 小视口高度的 1% | 不希望被地址栏展开时遮挡的首屏安全布局 | 可能比可见空间保守 |
| `lvh` | 大视口高度的 1% | 地址栏收起后的沉浸式高度 | 地址栏展开时内容可能被遮挡 |
| `dvh` | 动态视口高度的 1% | 需要跟随浏览器 UI 展开/收起的面板 | 视口变化时可能触发布局变化 |
| `vmin` / `vmax` | 视口宽高中较小/较大者的 1% | 正方形、海报、沉浸式视觉比例 | 仍然是视口相关，不适合组件局部尺寸 |

移动端长期维护项目不建议“所有尺寸都换成 `vw`”。纯 `vw` 适合活动页、海报页或强视觉还原页面；业务系统和内容型页面更适合用流式布局、`rem`、`clamp()`、Grid/Flex 和少量断点组合。

流式字号可以用 `clamp()` 限定上下界：

```css
:root {
  font-size: clamp(16px, 1.6vw, 20px);
}

.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

`rem` 适配的本质是“改变根字号，再让使用 `rem` 的尺寸跟着缩放”。它的边界是：边框、图标、命中区域、富文本和第三方组件未必都应该一起缩放；用户调整默认字体后，过度依赖根字号也可能导致布局错位。

### 容器查询解决了什么问题？

媒体查询看的是视口或设备特征；容器查询看的是祖先容器的尺寸、样式或滚动状态。它解决的是组件复用问题：同一个商品卡片在三栏主内容区可以横排，在窄侧栏应该竖排，即使当前视口宽度完全一样。

```css
.product-card-shell {
  container-type: inline-size;
  container-name: product-card;
}

.product-card {
  display: grid;
  gap: 12px;
}

@container product-card (width >= 32rem) {
  .product-card {
    grid-template-columns: 160px minmax(0, 1fr);
    align-items: center;
  }
}
```

分工可以这样答：

- 页面骨架、导航折叠、整体列数变化：优先媒体查询。
- 卡片、表单项、工具栏、侧栏模块等可复用组件：优先容器查询。
- 两者可以同时存在，但不要让组件内部只依赖全局断点，否则组件一换位置就容易失效。

### `@supports` 有什么用途？

`@supports` 是 CSS 特性查询，用来根据浏览器是否支持某个 CSS 声明启用增强样式。它适合渐进增强：基础样式先可用，新能力可用时再升级。

```css
.media-box {
  position: relative;
  width: 100%;
}

.media-box::before {
  content: "";
  display: block;
  padding-block-start: 56.25%;
}

.media-box > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@supports (aspect-ratio: 16 / 9) {
  .media-box {
    aspect-ratio: 16 / 9;
  }

  .media-box::before {
    content: none;
  }
}
```

这个例子先用传统 padding 百分比保底，再在支持 `aspect-ratio` 的浏览器中切换到更直接的写法。`@supports` 不等于浏览器版本判断，也不能保证没有浏览器 bug；它只回答“这个声明当前是否被识别为受支持”。

### 移动端 `1px`、安全区和等比缩放怎么处理？

移动端 `1px` 问题来自 CSS 像素和物理像素不是一回事。`1px` CSS 边框在高 DPR 屏幕上可能由多个物理像素绘制，看起来偏粗。现在优先从视觉需求出发：如果只是分隔线，可以用更浅颜色、阴影、渐变或伪元素缩放；不要为了所有边框都强行做物理 1 像素。

```css
.hairline {
  position: relative;
}

.hairline::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
  pointer-events: none;
}

@media (resolution >= 3dppx) {
  .hairline::after {
    transform: scaleY(0.3333);
  }
}
```

等比缩放优先使用 `aspect-ratio`，图片或视频裁剪再配合 `object-fit`：

```css
.cover {
  aspect-ratio: 4 / 3;
  width: min(100%, 480px);
}

.cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

如果图片是内容图片，还要从 HTML 层面处理响应式资源，使用 `srcset` / `sizes` 或 `<picture>`，让浏览器按显示尺寸和设备像素密度选择合适文件；CSS 只负责展示尺寸和裁剪，不负责减少下载体积。

## Demo

### 页面级断点 + 组件级容器查询

```css
.page {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 32px);
}

@media (width >= 64rem) {
  .page {
    grid-template-columns: minmax(0, 1fr) 280px;
  }
}

.profile-card-wrap {
  container-type: inline-size;
}

.profile-card {
  display: grid;
  gap: 12px;
}

@container (width >= 28rem) {
  .profile-card {
    grid-template-columns: 96px minmax(0, 1fr);
  }
}
```

这里页面是否出现侧栏由视口决定；卡片内部横排还是竖排由卡片容器宽度决定。

### 移动端底部操作栏

```css
.mobile-action-bar {
  position: sticky;
  inset-block-end: 0;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  padding-block-end: max(12px, env(safe-area-inset-bottom));
  background: Canvas;
  border-block-start: 1px solid color-mix(in srgb, CanvasText 12%, transparent);
}

.mobile-action-bar > button {
  min-height: 44px;
  flex: 1;
}
```

这个示例同时处理底部安全区和触屏命中高度。实际页面仍要保留用户缩放能力，不要用 `user-scalable=no` 规避布局问题。

### 视口高度单位

```css
.app-shell {
  min-height: 100svh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

@supports (height: 100dvh) {
  .sheet {
    max-height: 80dvh;
  }
}
```

`100svh` 适合做不被移动端浏览器 UI 遮挡的基础高度；弹出的面板如果需要跟随可见视口变化，可以在支持时使用 `dvh`。

### 画一条 0.5px 的线

移动端 Retina 屏上，CSS 的 1px 对应多个物理像素，导致边框看起来较粗。要实现视觉上的 0.5px，常用以下方案：

**方式一：transform: scale**

```css
.line {
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: top;
}
```

**方式二：伪元素放大后缩小（兼容性好）**

```css
.border-bottom::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: bottom;
}
```

**方式三：meta viewport 缩放（影响全局，慎用）**

```html
<meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5">
```

直接把整页缩放为 0.5 倍，CSS 1px 变成半个物理像素，但文字和图片也会同比缩小，副作用大，通常不推荐。

实际项目中，`transform: scaleY(0.5)` 或伪元素方案是最常用的可靠写法。

## 参考来源

- [MDN: Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN: Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using)
- [MDN: `@media`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media)
- [MDN: CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [MDN: `@supports`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40supports)
- [MDN: CSS values and units - length](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)
- [MDN: `<meta name="viewport">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport)
- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts)
- [MDN: `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- [MDN: `object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
