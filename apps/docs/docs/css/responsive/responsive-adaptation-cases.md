# 响应式适配案例

本页沉淀 CSS 响应式与条件规则主题下的可复用案例。所有案例默认页面已经正确设置移动端基础视口；视口、DPR、安全区和反例见 [移动端视口案例](/html/viewport/mobile-viewport-cases)。

## 问题

响应式页面如何把媒体查询、容器查询、视口单位、安全区、动态视口高度和视觉 `1px` 组合成可落地的代码？哪些代码适合长期业务页面，哪些只适合活动页或特殊场景？

## 结论

生产适配不要从“按设计稿缩放整页”开始，而应先让内容自然流动，再在布局断裂点使用媒体查询或容器查询。单位策略也应按场景选择：内容型和业务型页面优先使用流式布局、`rem`、`clamp()`、Flex/Grid 和少量断点；强视觉还原页面可以使用更高比例的 `vw`；大屏看板才考虑整体 `scale`。

## 案例

### 页面级断点 + 组件级容器查询

页面是否出现侧栏由视口决定；卡片内部横排还是竖排由卡片容器宽度决定。

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

适合场景：

| 判断点 | 方案 |
| --- | --- |
| 页面骨架随视口变化 | 用媒体查询 |
| 组件在主栏、侧栏、弹窗中复用 | 用容器查询 |
| 组件内部只依赖全局断点 | 容易在换位置后失效 |

### 移动端底部操作栏

这个示例同时处理底部安全区和触屏命中高度。页面仍要保留用户缩放能力，不要用 `user-scalable=no` 规避布局问题。

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

### 视口高度单位

移动端地址栏、底部工具栏和软键盘会影响用户真正看到的高度。基础外壳可以偏保守，弹层和抽屉可以按当前动态视口限制高度。

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

`100svh` 适合做不被移动端浏览器 UI 遮挡的基础高度；`dvh` 适合需要跟随当前可见视口变化的浮层。

### 画一条 0.5px 的线

移动端 Retina 屏上，CSS 的 `1px` 对应多个物理像素，导致边框看起来偏粗。优先使用视觉方案，不要为了所有边框都强行追求物理 1 像素。

**方式一：transform: scale**

```css
.line {
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: top;
}
```

**方式二：伪元素缩放**

```css
.border-bottom {
  position: relative;
}

.border-bottom::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: bottom;
  pointer-events: none;
}

@media (resolution >= 3dppx) {
  .border-bottom::after {
    transform: scaleY(0.3333);
  }
}
```

**不推荐作为通用方案：修改 viewport 缩放**

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5"
>
```

这种做法会影响整页文字、图片、命中区域和缩放行为，现代项目通常不把它作为通用移动端适配方案。

### `vw + clamp()` 流式字号

流式字号需要上下界，避免小屏过小、大屏过大。

```css
:root {
  font-size: clamp(16px, calc(14px + 0.5vw), 20px);
}

.hero-title {
  font-size: clamp(1.75rem, 6vw, 4rem);
  line-height: 1.1;
}

.article {
  width: min(100%, 68rem);
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 32px);
}
```

长期内容页和业务页不建议所有尺寸都改成 `vw`。`vw` 更适合海报、活动页或强视觉还原模块；常规页面要保留内容宽度、可读字号和组件边界。

### 响应式图片

CSS 只能控制图片显示尺寸和裁剪，不能减少已经下载的图片体积。内容图片优先用 `srcset` / `sizes` 让浏览器选择资源。

```html
<img
  src="/images/card-800.jpg"
  srcset="/images/card-400.jpg 400w, /images/card-800.jpg 800w, /images/card-1200.jpg 1200w"
  sizes="(width < 48rem) 100vw, 33vw"
  alt="示例图片"
>
```

```css
.media-card img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

## 参考来源

- [MDN: Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN: Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using)
- [MDN: CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [MDN: CSS values and units - length](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)
- [MDN: `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
