# 响应式与条件规则

本分类回答 CSS 侧的响应式问题：页面如何随视口变化，组件如何随容器变化，单位如何选择，新 CSS 特性如何渐进增强，以及移动端 `1px`、安全区、动态视口高度、图片资源如何处理。

如果还没有建立移动端视口概念，先读 [meta viewport](/html/viewport/meta-viewport)；本页默认布局视口已经被正确校准，重点讨论 CSS 如何基于这个宽度做适配。

## 阅读顺序

| 顺序 | 问题 | 解决什么 |
| --- | --- | --- |
| 1 | 响应式设计和自适应设计有什么区别？ | 先分清整体策略，不把所有适配都等同于断点 |
| 2 | 响应式布局应该按什么顺序规划？ | 建立内容、布局、组件、资源的规划顺序 |
| 3 | 媒体查询怎么写？断点怎么选？ | 处理页面级布局变化 |
| 4 | 容器查询解决什么问题？和媒体查询怎么分工？ | 处理组件在不同容器中的复用 |
| 5 | `@supports` 有什么用途？ | 处理新 CSS 能力的渐进增强 |
| 6 | `rem`、`vw`、`vh`、`svh`、`lvh`、`dvh` 如何取舍？ | 选择尺寸单位和视口高度单位 |
| 7 | `meta viewport` 和 CSS 响应式如何分工？ | 分清 HTML 视口声明与 CSS 布局适配的边界 |
| 8 | 移动端 `1px`、安全区、等比缩放和图片适配怎么处理？ | 处理移动端常见工程问题 |

## 响应式设计和自适应设计有什么区别？

响应式设计通常用同一套文档和样式体系，根据视口、容器、设备能力和用户偏好连续或分段调整布局。核心手段包括流式尺寸、Flex/Grid、媒体查询、容器查询、响应式图片和条件化 CSS。

自适应设计更偏向为若干设备或断点准备相对固定的布局方案，例如手机、平板、桌面各一套宽度。它对目标尺寸更容易精确控制，但断点之外的中间状态可能不够自然。

| 维度 | 响应式设计 | 自适应设计 |
| --- | --- | --- |
| 调整方式 | 连续伸缩 + 必要断点 | 多套固定或半固定方案 |
| 主要依据 | 内容、容器、视口、能力特征 | 预设设备或断点 |
| 优点 | 覆盖尺寸范围更连续，维护同一套内容 | 对目标设备控制更强 |
| 风险 | 需要更系统的布局约束 | 容易遗漏中间尺寸和新设备 |

更推荐的理解是：现代页面通常以响应式为主，必要时在关键尺寸上加入自适应式的布局方案。

## 响应式布局应该按什么顺序规划？

规划顺序是“内容优先、局部优先、断点后置”。

1. 先确定内容的最小可读宽度、最大舒适宽度和关键操作区，而不是先套手机、平板、桌面三个断点。
2. 页面骨架用 Grid 或 Flex 处理主栏、侧栏、导航、列表密度。
3. 组件内部尽量由自身可用空间决定形态，而不是完全依赖全局视口宽度。
4. 尺寸优先用 `max-width`、`minmax()`、`clamp()`、百分比、`fr`、`auto-fit` 等流式约束，让布局自然伸缩。
5. 当内容在某个宽度开始拥挤、错位或信息层级需要改变时，再设置断点。
6. 图片、视频、图表等替换内容要同时处理宽高比、裁剪策略和资源大小。
7. 触屏、鼠标、减少动画、深色模式、打印等能力或偏好，用对应媒体特性或条件规则处理。

断点不应只来自设备型号。更稳的做法是根据内容和布局断裂点命名，例如 `compact`、`comfortable`、`wide`，再把具体值收敛到设计 token 或 CSS 自定义属性里。

## 媒体查询怎么写？断点怎么选？

媒体查询用于根据媒体类型或媒体特性应用 CSS。常见条件包括视口宽高、方向、分辨率、指针能力、悬停能力、用户是否偏好减少动画等。

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

## 容器查询解决什么问题？和媒体查询怎么分工？

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

分工可以这样记：

| 判断点 | 优先方案 |
| --- | --- |
| 页面骨架、导航折叠、整体列数变化 | 媒体查询 |
| 卡片、表单项、工具栏、侧栏模块等可复用组件 | 容器查询 |
| 组件既受页面结构影响，也受自身容器影响 | 两者组合 |

不要让组件内部只依赖全局断点，否则组件一换位置就容易失效。

## `@supports` 有什么用途？

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

## `rem`、`vw`、`vh`、`svh`、`lvh`、`dvh` 如何取舍？

单位选择要看参考对象。

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

## `meta viewport` 和 CSS 响应式如何分工？

`meta viewport` 属于 HTML 移动端基础，它负责让移动浏览器按设备屏幕的 CSS 像素宽度建立布局视口。没有这一步，媒体查询、`vw`、固定定位和流式布局可能会基于一个过宽的兼容视口计算。

CSS 响应式负责的是下一层问题：在正确的布局视口上，如何分栏、折行、控制字号、选择单位、处理图片、安全区、动态视口高度和视觉 `1px`。

| 层次 | 负责什么 | 继续阅读 |
| --- | --- | --- |
| HTML 移动端基础 | 声明视口、解释布局视口 / 视觉视口 / 理想视口、DPR | [meta viewport](/html/viewport/meta-viewport) |
| HTML 移动端案例 | 读取视口指标、安全区模板、错误 viewport 反例 | [移动端视口案例](/html/viewport/mobile-viewport-cases) |
| CSS 响应式适配 | 布局、断点、容器查询、单位、图片、安全区、视觉 `1px` | 本页和 [响应式适配案例](/css/responsive/responsive-adaptation-cases) |

不建议默认写 `user-scalable=no`、`maximum-scale=1`。禁用缩放会影响低视力用户放大页面，通常也不是修复布局问题的正确方式。

## 移动端 `1px`、安全区、等比缩放和图片适配怎么处理？

这些问题都属于移动端响应式的工程边界，但处理对象不同。

| 问题 | 处理对象 | 推荐方向 |
| --- | --- | --- |
| 视觉 `1px` | 分隔线、边框的视觉粗细 | 伪元素、浅色线、阴影或按 DPR 缩放，不把改 viewport 当通用方案 |
| 安全区 | 刘海屏、圆角屏、底部手势区域 | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| 等比缩放 | 图片、视频、卡片媒体区域比例 | `aspect-ratio` + `object-fit` |
| 响应式图片 | 下载哪一张图片资源 | HTML 的 `srcset` / `sizes` / `<picture>` |

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

安全区只在需要内容延伸到刘海屏、圆角屏或底部手势区域时处理：

```css
.bottom-bar {
  position: sticky;
  inset-block-end: 0;
  padding: 12px 16px;
  padding-block-end: max(12px, env(safe-area-inset-bottom));
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

## 案例入口

具体代码集中在 [响应式适配案例](/css/responsive/responsive-adaptation-cases)：

- 页面级断点 + 组件级容器查询。
- 移动端底部操作栏与安全区。
- `svh` / `dvh` 视口高度单位。
- 视觉 `0.5px` / `1px` 边框。
- `vw + clamp()` 流式字号。
- `srcset` / `sizes` 响应式图片。

这些 CSS 案例默认页面已经正确设置 `meta viewport`。如果需要先理解布局视口、视觉视口、DPR 和安全区入口，见 [移动端视口案例](/html/viewport/mobile-viewport-cases)。

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
