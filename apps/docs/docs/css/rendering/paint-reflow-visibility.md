# 重排、重绘与隐藏方式

## 问题

`display: none`、`visibility: hidden`、`opacity: 0`、`overflow: hidden` 有什么区别？页面上隐藏元素有哪些方式？浏览器渲染流程里的 style、layout、paint、composite 分别是什么？哪些操作会触发重排和重绘？为什么动画优先使用 `transform` 和 `opacity`？如何避免布局抖动和布局抖动式的性能问题？

## 结论

### 理解路径

1. 先把浏览器渲染更新拆成几个阶段：样式计算、布局、绘制、合成。不同 CSS 属性会影响不同阶段。
2. “重排 / 回流”对应 layout 重新计算；“重绘”对应 paint 重新绘制；合成只组合已有图层，通常更适合高频动画。
3. 隐藏元素不是一个问题，而是一组取舍：是否占位、是否可点击、是否可聚焦、是否仍暴露给辅助技术、是否参与动画。
4. 性能优化不要只背“减少重排”，要能说出触发原因、强制同步布局、读写分离、动画属性选择和隔离范围。
5. 视觉稳定性也属于渲染质量：没有预留图片、字体、异步内容、广告位或折叠面板空间，都会造成布局跳动。

### 浏览器一次渲染更新经历哪些阶段？

常见简化路径是：

```text
DOM / CSSOM 变化
  -> Style：计算匹配到的样式
  -> Layout：计算盒子的尺寸和位置
  -> Paint：把背景、文字、边框、阴影等绘制成像素
  -> Composite：把不同图层合成到屏幕
```

并不是每次更新都会走完整条链路：

| 变化类型 | 可能触发阶段 | 示例 |
| --- | --- | --- |
| 改变几何信息 | style -> layout -> paint -> composite | `width`、`height`、`padding`、`border-width`、`top`、`left`、字体大小、内容插入 |
| 改变外观但不改布局 | style -> paint -> composite | `color`、`background-color`、`box-shadow`、`visibility` |
| 改变可合成属性 | style -> composite | `transform`、`opacity` 的常见动画场景 |

这里的“可能”很重要。真实浏览器会根据属性、元素状态、图层、硬件、是否动画、是否隔离等因素优化；面试回答不要把任何属性绝对化成“一定只触发某一步”。但作为工程判断，几何属性最贵，绘制属性次之，合成属性更适合高频动画。

### 重排和重绘有什么区别？

重排，也常叫回流或 layout，是浏览器重新计算元素尺寸、位置和相关布局约束。只要某个变化影响盒子的几何关系，就可能触发布局计算。

重绘是元素几何关系不变，但可见外观发生变化，需要重新绘制像素。例如文字颜色、背景、阴影、边框颜色变化通常属于绘制层面的变化。

关系可以这样记：

- 重排通常会导致后续重绘和合成，因为位置尺寸变了，像素也要重新生成。
- 重绘不一定导致重排，因为外观可能变了，但盒子大小和位置没变。
- 合成更新通常不需要重新布局或重新绘制，因此 `transform` / `opacity` 常用于动画。

### 哪些操作容易触发重排？

常见触发点包括：

- 改变元素几何属性：`width`、`height`、`padding`、`margin`、`border-width`、`top`、`left`。
- 改变布局方式或结构：`display`、`position`、`float`、Flex/Grid 相关轨道或项目尺寸。
- 插入、删除、移动 DOM 节点，或修改会改变尺寸的文本内容。
- 改变字体、字号、行高、图片尺寸等影响内容测量的属性。
- 改变视口尺寸、滚动条状态或容器尺寸。
- 读取某些布局信息前，浏览器发现前面已有待处理的样式写入，于是被迫同步 layout。

最后一项就是强制同步布局。典型坏例子是读写交错：

```js
for (const item of items) {
  item.style.width = `${container.offsetWidth / 3}px`
  item.style.height = `${item.offsetWidth}px`
}
```

`style.width` 是写入，`offsetWidth` 是读取布局。循环里不断写后再读，浏览器可能被迫反复把待处理样式刷新成布局结果。

更稳的做法是先读后写：

```js
const containerWidth = container.offsetWidth
const itemWidth = containerWidth / 3

for (const item of items) {
  item.style.width = `${itemWidth}px`
  item.style.height = `${itemWidth}px`
}
```

### 如何减少重排、重绘和布局抖动？

优化方向是减少范围、减少次数、避开高频 layout：

1. 合并样式变更：用 class 或 CSS 变量一次性切换，避免逐条写大量 inline style。
2. 分离布局读取和写入：先批量读取尺寸，再批量写样式，避免 layout thrashing。
3. 缓存测量结果：同一帧内不要重复读取相同布局数据。
4. 控制影响范围：复杂组件可考虑 `contain`、固定尺寸、独立滚动容器或合理的组件边界。
5. 大量 DOM 更新离线处理：使用 `DocumentFragment` 或先在内存中构建，再一次性插入。
6. 动画优先用 `transform` 和 `opacity`，避免在每一帧改 `width`、`height`、`top`、`left`。
7. 对长列表使用分页、虚拟滚动或 `content-visibility: auto`，避免一次渲染大量屏幕外内容。
8. 预留稳定空间：图片写 `width` / `height` 或 `aspect-ratio`，异步卡片、广告位、骨架屏要有接近最终尺寸的占位。

`display: none` 离线修改 DOM 是旧题里常见答案。它在某些场景能减少中间阶段的渲染，但重新显示时仍会触发布局；如果只是为了批量插入节点，优先考虑 fragment、模板拼装或框架自身的批处理。

### 为什么动画优先使用 `transform` 和 `opacity`？

`transform` 和 `opacity` 在很多浏览器实现里可以交给合成阶段处理：元素原本绘制好的图层被移动、缩放、旋转或改变透明度，不必每一帧重新计算布局，也常常不必重新绘制内容。

```css
.panel {
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}

.panel[data-state="closed"] {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
  pointer-events: none;
}
```

不要把“GPU 加速”理解成越多越好。提升为独立图层可能增加内存占用、纹理上传和合成成本。`will-change` 也不是通用性能开关，应只在确认某个元素即将发生高频变化时短时间使用：

```css
.dragging-card {
  will-change: transform;
}
```

动画结束后可以移除对应 class，让浏览器回收优化状态。

### `display: none`、`visibility: hidden`、`opacity: 0` 有什么区别？

| 属性 | 是否占布局空间 | 是否可见 | 是否可点击/聚焦 | 常见用途 |
| --- | --- | --- | --- | --- |
| `display: none` | 否 | 否 | 否 | 条件渲染、彻底移除一个区域 |
| `visibility: hidden` | 是 | 否 | 通常否 | 保留占位但隐藏内容 |
| `opacity: 0` | 是 | 否 | 仍可能是 | 淡入淡出动画、视觉透明 |

几个细节要说清楚：

- `display: none` 不生成盒子，切换它会影响周围布局，所以常伴随重排。
- `visibility: hidden` 保留盒子，元素不可见，通常也不能被指针命中或获得焦点。
- `opacity: 0` 只是透明，布局、事件命中、键盘焦点和可访问性都不会自动消失；如果只是隐藏弹层，还要配合 `pointer-events: none`、焦点管理或 `aria-hidden` / `inert` 等语义控制。
- `opacity` 小于 `1` 会创建新的 stacking context，但不等于一定“重建图层”或一定“性能更高”。

### `overflow: hidden` 和几种隐藏方式有什么区别？

`overflow: hidden` 不是“隐藏这个元素”，而是裁剪这个元素盒子之外的溢出内容。元素本身仍然存在、占位、可见，也仍可能参与事件命中。

| 写法 | 作用对象 | 是否占位 | 核心区别 |
| --- | --- | --- | --- |
| `display: none` | 元素自身 | 否 | 不生成盒子，子树也不参与布局和绘制 |
| `visibility: hidden` | 元素自身视觉 | 是 | 保留布局空间，隐藏自身和后代可见性 |
| `opacity: 0` | 元素合成结果 | 是 | 只是透明，交互和可访问性不自动移除 |
| `overflow: hidden` | 溢出内容 | 是 | 裁剪超出 padding box 的内容，不隐藏元素自身 |

```css
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}
```

上面这个例子里 `overflow: hidden` 的目的不是让头像消失，而是把图片裁成圆形区域。用它创建 BFC 或裁剪内容时，要注意可能会截断阴影、下拉菜单、焦点环和绝对定位溢出内容。

### 页面上隐藏元素有哪些方式？

隐藏方式要按目标选择：

| 目标 | 推荐方式 | 说明 |
| --- | --- | --- |
| 完全不展示、不占位、不交互 | `display: none` 或条件渲染 | 适合 tab 面板、折叠区域、权限不可见内容 |
| 不展示但保留占位 | `visibility: hidden` | 适合保持表格列宽、占位测量等 |
| 透明动画 | `opacity: 0` + 事件/焦点控制 | 适合 fade 动画，不要忘记交互状态 |
| 视觉隐藏但保留给屏幕阅读器 | `.visually-hidden` 模式 | 适合“跳到主内容”、图标按钮文本 |
| 裁剪内容 | `clip-path`、`overflow: hidden` | 适合视觉裁剪，不等于语义隐藏 |
| 隐藏滚动条但可滚动 | 浏览器相关滚动条样式 | 要保留键盘、触控和滚轮滚动能力 |

常用的视觉隐藏模式：

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

隐藏滚动条但保留滚动能力：

```css
.scroll-area {
  overflow: auto;
  scrollbar-width: none;
}

.scroll-area::-webkit-scrollbar {
  display: none;
}
```

这种做法要谨慎使用。滚动条本身是可发现性提示，完全隐藏可能让用户不知道区域可以滚动。

### `rgba()` 和 `opacity` 的透明效果有什么区别？

`opacity` 作用在整个元素合成结果上，包含背景、文字、边框和所有子元素：

```css
.card {
  opacity: 0.5;
}
```

`rgba()`、`rgb(... / alpha)` 或带透明度的颜色只作用于当前使用这个颜色的属性：

```css
.card {
  background: rgb(0 0 0 / 50%);
}
```

如果只想让背景半透明，而文字和按钮保持不透明，用透明颜色；如果想让整个元素一起淡入淡出，用 `opacity`。

### `display` 可以和 `opacity` 一起过渡吗？

传统回答是：`opacity` 可以连续过渡，`display` 不能像数值那样连续过渡，因为 `display` 决定元素是否生成盒子。实际项目里常用两阶段状态：先让元素参与布局或定位，再过渡透明度，动画结束后再切 `display` 或卸载节点。

```css
.dialog {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.dialog[data-leaving="true"] {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
}
```

现代 CSS 也有离散属性过渡能力，例如 `transition-behavior: allow-discrete` 和 `@starting-style`，但要按目标浏览器兼容性决定是否使用。面试中更稳的答案仍是：视觉动画交给 `opacity` / `transform`，结构移除交给状态管理或动画结束回调。

### `content-visibility`、`contain` 和 `will-change` 怎么答？

这三个能力都和“限制渲染成本”有关，但用途不同：

| 能力 | 作用 | 适合场景 | 风险 |
| --- | --- | --- | --- |
| `contain` | 告诉浏览器某个子树在布局、绘制、样式或尺寸上可被隔离 | 独立卡片、复杂列表项、局部组件 | `size` containment 会影响尺寸计算，不能随便加 |
| `content-visibility: auto` | 允许浏览器跳过屏幕外内容的布局和绘制 | 长文章、长列表、折叠下方的大区块 | 需要 `contain-intrinsic-size` 预估空间，避免滚动跳动 |
| `will-change` | 提前提示某属性即将变化 | 即将拖拽、即将播放动画的元素 | 过度使用会增加内存和合成成本 |

```css
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 480px;
}

.isolated-card {
  contain: layout paint;
}
```

这些不是默认全站加的“优化三件套”。先用性能工具定位瓶颈，再对局部热点使用。

### 旧题：Chrome 字体如何小于 12px？

这个题来自早期浏览器限制和移动端文字自动调整语境，不适合继续背“`-webkit-text-size-adjust: none`”这种答案。`text-size-adjust` 控制的是移动浏览器文字自动放大策略，不是通用的“小于 12px 字体开关”。

如果只是徽标、角标、装饰性小字，可以用更小的 `font-size`，或在确有视觉需求时用 `transform: scale()` 做视觉缩放；但正文内容不应为了还原视觉稿而压到不可读。更好的答案是：先确认浏览器和可访问性要求，正文保持可读字号，装饰性文字才考虑缩放。

## Demo

### 隐藏方式对比

```html
<button class="ghost display-none">display none</button>
<button class="ghost visibility-hidden">visibility hidden</button>
<button class="ghost opacity-zero">opacity zero</button>
```

```css
.display-none {
  display: none;
}

.visibility-hidden {
  visibility: hidden;
}

.opacity-zero {
  opacity: 0;
}
```

这三段同时放在页面里时，`display: none` 不占位；`visibility: hidden` 占位但不可见；`opacity: 0` 占位、透明，并且如果没有额外处理仍可能被点击或聚焦。

### 读写分离

```js
const width = list.clientWidth
const columnWidth = Math.floor((width - 24) / 3)

requestAnimationFrame(() => {
  for (const item of list.children) {
    item.style.width = `${columnWidth}px`
  }
})
```

把布局读取放在写入之前，并把写入集中到同一帧，可以减少强制同步布局和布局抖动。

### 避免布局跳动

```css
.media-card {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.media-card > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

图片加载前先有稳定比例，加载后不会突然把后续内容推开。

### CSS 优化和提高性能的方法有哪些

**加载性能：**
- CSS 文件压缩打包，减小体积；
- 关键 CSS 内联到 `<style>` 标签，非关键 CSS 延迟加载；
- 使用 `<link>` 而非 `@import`，避免阻塞并行加载；
- 合理拆分 CSS，避免加载无用样式（配合代码分割）。

**选择器性能：**
- 避免过深的选择器嵌套（超过 3 层），浏览器从右向左匹配，关键选择器越简单越快；
- 避免通配符 `*{}`，开销大；
- 优先用 `class` 而非标签选择器；
- 了解哪些属性可以继承，避免重复声明。

**渲染性能：**
- 尽量减少重排（reflow）：避免频繁读写 `offsetWidth`、`clientHeight` 等触发布局的属性，改用读写分离（先读后写）；
- 尽量减少重绘（repaint）：优先用 `transform`、`opacity` 做动画，不用 `top`/`left`/`margin`；
- 去除空规则 `{}`，减少文件体积；
- 谨慎使用 `float`、`position: absolute/fixed`；
- 不滥用 Web Fonts，避免渲染阻塞；
- 使用 `will-change` 提前告知浏览器哪些元素需要硬件加速（仅对频繁变化的元素使用）。

**可维护性：**
- 相同属性抽离为复用类；
- 样式与内容分离，CSS 写在外部文件。

### 如何判断元素是否到达可视区域

常用方式：

**方式一：scrollTop + offsetTop 计算**

```js
// img.offsetTop < 可视区域底部（滚动距离 + 窗口高度）
function isInViewport(el) {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = window.innerHeight
  return el.offsetTop < scrollTop + windowHeight
}
```

**方式二：getBoundingClientRect**

```js
function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}
```

`getBoundingClientRect().top` 返回元素顶部相对于视口顶部的距离，小于视口高度且底部大于 0 时即在可视区域内。

**方式三：IntersectionObserver（推荐）**

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 元素进入可视区域
      loadImage(entry.target)
      observer.unobserve(entry.target) // 加载后取消观察
    }
  })
})

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))
```

`IntersectionObserver` 是浏览器原生 API，异步回调，性能优于滚动事件监听，是图片懒加载的现代推荐方案。

## 参考来源

- [web.dev: Rendering performance](https://web.dev/articles/rendering-performance)
- [web.dev: Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [MDN: `display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [MDN: `visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility)
- [MDN: `opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)
- [MDN: `overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [MDN: `pointer-events`](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)
- [MDN: `will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [MDN: `contain`](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
- [MDN: `content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [MDN: `text-size-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)
