# flex 弹性布局

## 问题

Flex 是什么？容器属性和项目属性分别控制什么？`flex: 1`、`flex: auto`、`flex: none` 有什么区别？`align-items` 和 `align-content` 为什么经常被混淆？

## 结论

### 理解路径

1. Flexbox 是一维布局模型：一次主要处理一条主轴上的空间分配，再处理交叉轴上的对齐和换行后的行间分布。
2. 开启 Flex 布局的是容器：`display: flex` 或 `display: inline-flex` 会让容器的直接子元素成为 flex item。
3. 容器属性决定主轴方向、是否换行、整体对齐；项目属性决定单个项目的顺序、放大、缩小、基准尺寸和自身对齐。
4. `flex` 简写本质上控制的是 `flex-grow`、`flex-shrink`、`flex-basis`。多数“为什么宽度没按预期分配”的问题都要回到这三个值。
5. Flex 适合一维分布、导航栏、工具栏、卡片行、等高列和简单居中；需要同时严格控制行和列时，优先考虑 Grid。

### Flex 是什么

Flexbox，全称 Flexible Box Layout，是 CSS 的弹性盒布局模型。它适合在一个方向上分配空间，并在项目尺寸未知或容器尺寸变化时保持稳定对齐。

Flex 的“一维”不是说页面只能横向或纵向排布，而是说一次布局主要沿一个主轴工作。主轴由 `flex-direction` 决定，交叉轴与主轴垂直。`flex-wrap` 允许项目换到多行，但每一行仍按主轴独立分配空间；如果要同时控制行和列的网格关系，Grid 更合适。

### 容器属性

| 属性 | 作用 | 常见值 |
| --- | --- | --- |
| `flex-direction` | 决定主轴方向 | `row`、`row-reverse`、`column`、`column-reverse` |
| `flex-wrap` | 决定项目是否换行 | `nowrap`、`wrap`、`wrap-reverse` |
| `flex-flow` | `flex-direction` 和 `flex-wrap` 的简写 | `row wrap` |
| `justify-content` | 沿主轴分配项目和剩余空间 | `flex-start`、`center`、`space-between`、`space-around`、`space-evenly` |
| `align-items` | 控制每一行内项目在交叉轴上的默认对齐 | `stretch`、`flex-start`、`center`、`flex-end`、`baseline` |
| `align-content` | 多行时控制各行在交叉轴上的空间分布 | `stretch`、`center`、`space-between`、`space-around` |

`align-items` 和 `align-content` 的区别是高频面试点：`align-items` 管单行内每个项目如何在交叉轴对齐；`align-content` 管多条 flex line 之间如何分布。单行容器或 `flex-wrap: nowrap` 时，`align-content` 没有效果。

### 项目属性

| 属性 | 作用 |
| --- | --- |
| `order` | 改变项目的视觉排列顺序，数值越小越靠前。不要用它改变真实阅读或键盘顺序。 |
| `flex-grow` | 有剩余空间时，按增长因子分配正空间，初始值是 `0`。 |
| `flex-shrink` | 空间不足时，按收缩因子和基准尺寸分摊负空间，初始值是 `1`，负值无效。 |
| `flex-basis` | 项目参与弹性计算前的主轴初始尺寸，初始值是 `auto`。 |
| `flex` | `flex-grow`、`flex-shrink`、`flex-basis` 的简写。 |
| `align-self` | 覆盖单个项目的交叉轴对齐方式。 |

把元素设为 flex 容器后，直接子元素变成 flex item。对 flex item 来说，`float` 和 `clear` 不会让它浮动或清除浮动，也不会让它脱离 flex 布局；`vertical-align` 对 flex item 没有效果。需要把某个项目推到右侧时，通常用 `margin-left: auto` 或调整主轴分布，而不是 `float: right`。

### `flex` 简写怎么答

`flex` 的三个组成部分是：

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

常见写法可以这样理解：

| 写法 | 展开 | 含义 | 场景 |
| --- | --- | --- | --- |
| `flex: initial` | `0 1 auto` | 默认行为：不放大，可以缩小，基准尺寸按自身尺寸。 | 保留默认弹性行为，通常不用显式写。 |
| `flex: auto` | `1 1 auto` | 先按内容宽度、`width` 或自身主轴尺寸占位，再把剩余空间分给可增长项目。它更尊重内容宽度，所以不一定等宽。 | 自适应内容。 |
| `flex: none` | `0 0 auto` | 按自身尺寸占位，不放大也不缩小。 | 固定尺寸。 |
| `flex: 1` | 浏览器通常按 `1 1 0%` 处理 | 不先按内容占位，而是把基准尺寸当作 0，再按增长因子抢同一份剩余空间。多个项目都写 `flex: 1` 时，最容易得到等分效果。 | 等分布局。 |
| `flex: 0 0 200px` | `0 0 200px` | 基准尺寸固定为 200px，不参与放大和缩小。 | 固定宽度。 |

`flex: 1` 和 `flex: auto` 的关键差别在 `flex-basis`，也就是“分配剩余空间之前，项目先占多少位置”。

- `flex: 1` → `1 1 0%`：每个项目都先当作 0 宽，再一起按 `flex-grow` 抢剩余空间。三个元素都写 `flex: 1`，通常就是各占容器的三分之一。
- `flex: auto` → `1 1 auto`：每个项目先按内容宽度、`width` 或自身主轴尺寸占位，再一起分配剩余空间。内容长的项目起点更大，所以最终宽度可能更大。

可以这样记：想等分，用 `flex: 1`；想保留内容差异、再自适应剩余空间，用 `flex: auto`。

### 常见应用和边界

#### 水平垂直居中

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

这只会对 `.box` 的直接子元素生效。要看到垂直居中效果，容器在交叉轴方向上必须有可分配空间，例如有明确高度、`min-height` 或来自父容器的高度。

#### 等高列

默认 `align-items: stretch` 会让同一行 flex items 在交叉轴上拉伸，因此常用于等高列。注意这不是让内容文字等量，也不是让多行之间的所有卡片都等高。

#### 固定列数和最后一行

这个问题通常出现在这种写法里：

```css
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
```

`space-between` 会把**每一行自己的剩余空间**都分散到项目之间。当前面几行刚好排满时，看起来很整齐；但最后一行如果只有 2 个项目，它们也会被推到这一行的两端，中间空出很大一块。

更稳定的思路是：不要让 `space-between` 负责列间距，而是用 `gap` 固定间距，再用 `flex-basis` 固定每个项目的列宽。这样最后一行项目会自然从左往右排列，不会被强行拉到两端。

```css
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.item {
  flex: 0 0 calc((100% - 36px) / 4);
}
```

这里的 `36px` 来自 4 列之间的 3 个间隙：`12px * 3`。所以每个项目宽度是：

```text
(容器宽度 - 三个间隙) / 4
```

旧方案会在最后一行后面追加不可见占位元素，让最后一行“假装排满”。这种方案能工作，但会污染 DOM，也要根据每行列数计算占位数量。除非要兼容很旧的布局环境，否则优先用 `gap + flex-basis`。

如果需求是严格的二维网格、每行每列都要对齐，Grid 通常比 Flex 更直接。

#### Flex 和 Grid 怎么选

- 内容主要沿一条轴分布，或者项目数量和尺寸不固定：优先 Flex。
- 需要同时控制行和列、网格轨道、二维对齐：优先 Grid。
- 导航栏、按钮组、工具栏、卡片横排、左右分布：Flex 更自然。
- 仪表盘、相册网格、复杂页面骨架：Grid 更自然。

#### 如何用 Flex 实现“四合院”布局

“四合院”布局通常指上、下、左、右围绕中间内容的结构。Flex 可以通过外层纵向排列、内层横向排列实现：

```html
<section class="courtyard">
  <header class="courtyard__top">top</header>
  <div class="courtyard__middle">
    <aside class="courtyard__left">left</aside>
    <main class="courtyard__center">center</main>
    <aside class="courtyard__right">right</aside>
  </div>
  <footer class="courtyard__bottom">bottom</footer>
</section>
```

```css
.courtyard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.courtyard__top,
.courtyard__bottom {
  flex: 0 0 64px;
}

.courtyard__middle {
  min-height: 0;
  flex: 1;
  display: flex;
}

.courtyard__left,
.courtyard__right {
  flex: 0 0 200px;
}

.courtyard__center {
  min-width: 0;
  flex: 1;
}
```

如果布局需要严格控制二维网格、区域命名和响应式重排，Grid 的 `grid-template-areas` 会比嵌套 Flex 更直接。Flex 方案适合简单页面骨架或兼容旧代码。

## Demo

<FlexPlayground />

这个组件覆盖三类常见面试题：

- 切换 `flex-direction`、`justify-content`、`align-items`、`align-content`，观察主轴和交叉轴如何变化。
- 横向拖拽 `flex` 简写案例，比较 `initial`、`auto`、`none`、`1`。
- 用 `gap` 和 `flex-basis` 实现固定列数的多行布局，避免最后一行被 `space-between` 拉开。

## 参考来源

- [MDN: Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts)
- [MDN: flex](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex)
- [MDN: Aligning items in a flex container](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Aligning_items)
- [MDN: align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-content)
- [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/)
- [CSS Box Alignment Module Level 3](https://www.w3.org/TR/css-align-3/)
