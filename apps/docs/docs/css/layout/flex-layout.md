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

| 写法 | 展开 | 含义 |
| --- | --- | --- |
| `flex: initial` | `0 1 auto` | 默认行为：不放大，可以缩小，基准尺寸按自身尺寸。 |
| `flex: auto` | `1 1 auto` | 先按自身尺寸参与计算，再吸收剩余空间，也可以缩小。 |
| `flex: none` | `0 0 auto` | 不放大、不缩小，按自身尺寸占位，空间不足时可能溢出。 |
| `flex: 1` | 浏览器通常按 `1 1 0%` 处理 | 忽略自身基准尺寸，按增长因子分配空间。 |
| `flex: 0 0 100px` | `0 0 100px` | 固定基准尺寸，不参与放大和缩小。 |

`flex: 1` 和 `flex: auto` 的关键差别在 `flex-basis`：`flex: 1` 从 0 基准开始分配空间，更容易得到等分列；`flex: auto` 先保留项目自身内容或宽高，再分配剩余空间，不一定等宽。

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

旧写法会在最后一行追加不可见占位元素来修正 `space-between` 的分布。现代写法更推荐用 `gap` 加固定 `flex-basis` 控制列宽和间距：

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

如果需求是严格的二维网格、每行每列都要对齐，Grid 通常比 Flex 更直接。

#### Flex 和 Grid 怎么选

- 内容主要沿一条轴分布，或者项目数量和尺寸不固定：优先 Flex。
- 需要同时控制行和列、网格轨道、二维对齐：优先 Grid。
- 导航栏、按钮组、工具栏、卡片横排、左右分布：Flex 更自然。
- 仪表盘、相册网格、复杂页面骨架：Grid 更自然。

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
