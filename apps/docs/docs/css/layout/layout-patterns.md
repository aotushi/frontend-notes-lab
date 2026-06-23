# 瀑布流、居中和经典布局案例

## 问题

如何实现瀑布流、水平垂直居中、两栏/三栏布局、上下固定中间滚动、圣杯布局和双飞翼布局？这些题在现代项目里应该优先用什么方案，哪些旧方案只需要理解原理？

## 结论

### 理解路径

1. 经典布局题先判断布局维度：一维分布优先 Flex，二维骨架优先 Grid，文本或卡片流式排布才考虑多列布局。
2. 现代项目不要默认使用远程 iframe 示例、浮动 hack 或表格布局；它们可以作为历史方案理解，但主答案应能落到可维护的本地 CSS。
3. 居中题要先问“居中对象是什么”：单行文本、块级盒子、未知宽高弹窗、绝对定位元素、浮动元素，对应答案不同。
4. 圣杯布局和双飞翼布局的本质是“中间内容优先渲染 + 两侧固定 + 中间自适应”的旧浮动方案；现在实现同类布局优先 Flex 或 Grid。
5. 瀑布流要说明视觉效果和顺序代价：CSS 多列布局简单，但按列填充；严格按行顺序和精确高度排布通常需要 JavaScript 或专门布局算法。

### 瀑布流怎么答

纯 CSS 常见方案是多列布局：

```css
.masonry {
  column-count: 3;
  column-gap: 16px;
}

.card {
  break-inside: avoid;
  margin-block-end: 16px;
}
```

这个方案适合图片墙、卡片流、资料列表等“视觉上像瀑布”的场景。`column-count` 负责把内容分成多列，`break-inside: avoid` 尽量避免单张卡片被拆到两列。

它的边界也要说明：多列布局是按列填充，不是按行从左到右填充；如果业务要求“第 1、2、3 张必须在第一行从左到右出现”，多列布局就不合适。需要严格顺序、虚拟列表、动态测量或拖拽排序时，通常用 JavaScript 计算列高，或使用成熟组件。

### 居中怎么答

居中题不要直接背一个万能答案，先判断“居中的对象”和“是否已知尺寸”：

实际项目里要先分清楚两类父元素：

- 局部居中：例如空状态、卡片图标、表格局部 loading，通常复用当前模块里最近的局部容器；如果这个容器还承担列表、表单、页面骨架等职责，就新建一层很薄的 wrapper 专门承载居中关系。
- 全局浮层：例如 Dialog、Drawer、MessageBox、全屏 Loading，通常由 UI 框架通过 Portal/Teleport 挂到 `body` 或指定容器下，再用 `position: fixed; inset: 0` 形成遮罩层。此时“父元素”不是业务组件最近的 DOM 父级，而是框架创建的浮层容器。

所以，Flex/Grid 通常不是加在 `body` 或整个应用根节点上，而是加在“负责这次居中关系的容器”上。这个容器可能是局部 wrapper，也可能是全局遮罩层。

判断顺序可以这样记：

1. 只是文本或行内内容：优先 `text-align`、`line-height`。
2. 只是块级元素水平居中：优先固定/约束宽度 + `margin-inline: auto`。
3. 需要把一个子元素放到模块区域正中：给最近的局部容器设置 Flex 或 Grid。
4. 元素需要脱离普通文档流，例如弹窗、抽屉、全屏浮层：通常挂到 `body` 或指定容器，并用 `position: fixed` 覆盖视口。
5. 元素只需要相对某个卡片、按钮或局部面板定位，例如角标、tooltip 箭头：才让最近的业务父元素 `position: relative`，子元素 `position: absolute`。
6. 不要为了居中把页面根布局、列表容器、表单容器强行改成 Grid/Flex；那会影响它下面所有直接子元素的布局语义。

| # | 方案 | 适用场景 | 边界 |
| --- | --- | --- | --- |
| 1 | `text-align: center` | 行内内容、文本、`inline-block` 子元素水平居中 | 只影响行内级内容，不会让普通块级元素自己居中。 |
| 2 | `line-height` 等于容器高度 | 单行文本垂直居中 | 只适合单行；多行文本会互相挤压。 |
| 3 | 定宽块 + `margin-inline: auto` | 块级元素水平居中 | 元素需要有可计算宽度。 |
| 4 | Flex：`justify-content: center; align-items: center` | 常规水平垂直居中 | 现代项目首选，适合容器内一个或多个项目。 |
| 5 | Grid：`place-items: center` | 单个项目或二维区域内居中 | 写法短，适合弹窗壳、空状态、图标按钮等。 |
| 6 | 绝对定位 + `transform` | 未知宽高的绝对定位元素居中 | 会创建变换上下文，极少数场景可能出现亚像素渲染。 |
| 7 | 绝对定位 + 负 `margin` | 已知宽高的绝对定位元素居中 | 必须知道元素宽高，尺寸变化就要同步改负 margin。 |
| 8 | 绝对定位 + `inset: 0; margin: auto` | 已知宽高的绝对定位元素居中 | 需要明确宽高，并且父元素要能形成定位包含块。 |
| 9 | `display: table-cell; vertical-align: middle` | 旧项目、多行内容垂直居中 | 视觉布局可用，但不应为了布局滥用语义表格。 |
| 10 | `inline-block` + 伪元素撑满高度 + `vertical-align: middle` | 兼容旧环境的未知高度内容垂直居中 | 写法绕，现代项目通常用 Flex/Grid 替代。 |

现代项目最常用的是 Flex、Grid、绝对定位加 `transform`。下面这些历史方案在面试里仍然可能出现，要能说清楚它们为什么成立：

```css
/* 1. 单行文本水平 + 垂直居中 */
.text-center {
  height: 48px;
  line-height: 48px;
  text-align: center;
}

/* 2. 块级元素水平居中 */
.block-center {
  width: 320px;
  margin-inline: auto;
}

/* 3. Flex 水平垂直居中 */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 4. Grid 水平垂直居中 */
.grid-center {
  display: grid;
  place-items: center;
}

/* 5. 未知宽高：绝对定位 + transform */
.absolute-transform-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 6. 已知宽高：绝对定位 + 负 margin */
.absolute-negative-margin-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 120px;
  margin-left: -100px;
  margin-top: -60px;
}

/* 7. 已知宽高：四边为 0 + auto margin */
.absolute-inset-center {
  position: absolute;
  inset: 0;
  width: 200px;
  height: 120px;
  margin: auto;
}

/* 8. table-cell 垂直居中 */
.table-cell-center {
  display: table-cell;
  width: 320px;
  height: 180px;
  text-align: center;
  vertical-align: middle;
}

.table-cell-center > .content {
  display: inline-block;
}

/* 9. inline-block + 伪元素辅助垂直居中 */
.pseudo-middle {
  height: 180px;
  text-align: center;
}

.pseudo-middle::before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.pseudo-middle > .content {
  display: inline-block;
  vertical-align: middle;
}
```

如果题目问“浮动元素怎么居中”，可以回答历史写法：给浮动元素一个明确宽度，再通过相对定位、`left: 50%` 和负 margin 拉回一半宽度。但这属于旧布局技巧，现代项目不应为了居中引入 float。

### 两栏和三栏布局怎么答

左侧固定、右侧自适应：

```css
.layout {
  display: flex;
}

.aside {
  flex: 0 0 240px;
}

.main {
  min-width: 0;
  flex: 1;
}
```

同一道「左固定右自适应」题，面试常要求说出多种实现，理解每种成立的原理：

```css
/* 1. Flex：最常用，右栏 flex: 1 吃掉剩余空间 */
.flex .main { min-width: 0; flex: 1; }

/* 2. Grid：左列定宽，右列 minmax(0, 1fr) */
.grid {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
}

/* 3. float + BFC：左栏浮动，右栏 overflow 触发 BFC 不与浮动重叠 */
.float .aside { float: left; width: 200px; }
.float .main { overflow: hidden; }

/* 4. 绝对定位：左栏 absolute，右栏 margin-left 留出空间 */
.absolute { position: relative; }
.absolute .aside { position: absolute; left: 0; width: 200px; }
.absolute .main { margin-left: 200px; }

/* 5. table：容器 table，两栏 table-cell，右栏自动撑满 */
.table { display: table; width: 100%; }
.table .aside { display: table-cell; width: 200px; }
.table .main { display: table-cell; }
```

现代项目优先 Flex 或 Grid；float + BFC、绝对定位、`table` 属于历史方案，了解原理即可。

两边固定、中间自适应：

```css
.layout {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) 200px;
  gap: 16px;
}
```

`minmax(0, 1fr)` 比简单的 `auto` 更稳：中间列会吃掉剩余空间，并允许长内容在空间不足时收缩。Flex 也能做三栏布局，但 Grid 对页面骨架更直观。

### 上下固定、中间滚动怎么答

页面或面板常见结构是头部固定高度、底部固定高度，中间内容区域填满并滚动：

```css
.shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.content {
  min-height: 0;
  overflow: auto;
}
```

关键是中间行写成 `minmax(0, 1fr)`，滚动容器写 `min-height: 0; overflow: auto`。否则内容可能把容器撑开，导致滚动发生在整个页面，而不是中间区域。

### 圣杯布局和双飞翼布局怎么答

圣杯布局和双飞翼布局都是旧时代的三栏浮动方案，目标是：

- DOM 中主内容写在前面，优先渲染。
- 左右两栏固定宽度，中间栏自适应。
- 通过浮动、负 margin 和额外位移把三栏摆回视觉位置。

区别：

| 布局 | 预留侧栏空间的位置 | 侧栏归位方式 | DOM 额外结构 |
| --- | --- | --- | --- |
| 圣杯布局 | 在外层容器上用左右 `padding` 预留空间 | 左右栏用负 margin 加 `position: relative` 位移 | 不需要额外包一层主内容 |
| 双飞翼布局 | 在主内容内部用左右 `margin` 预留空间 | 左右栏主要用负 margin 归位 | 主内容通常多包一层 |

现代答题可以先说明历史原理，再给现代实现。偏一维三栏时用 Flex：

```css
.layout {
  display: flex;
  gap: 16px;
}

.aside {
  flex: 0 0 200px;
}

.main {
  min-width: 0;
  flex: 1;
}
```

偏页面骨架时用 Grid：

```css
.layout {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) 200px;
}

.main {
  grid-column: 2;
}
```

如果面试官明确要求“写圣杯/双飞翼代码”，再写浮动版；如果只是问“如何实现三栏布局”，优先 Flex 或 Grid。

### 等高列怎么答

等高列不必再用很重的 hack。常见方案：

- Flex 同一行默认 `align-items: stretch`，适合卡片列表等高列。
- Grid 同一行网格项也能天然拉伸到同一行高度。
- 表格布局能等高，但不应为了布局滥用语义表格。
- 旧方案里的超大 padding + 负 margin、假背景图等只需要知道历史原因，不建议作为现代首选。

### 实现"品"字布局

"品"字布局：上方一个元素居中，下方两个元素并排居中。

**Flex 实现（推荐）：**

```html
<div class="pin">
  <div class="pin__top">1</div>
  <div class="pin__row">
    <div>2</div>
    <div>3</div>
  </div>
</div>
```

```css
.pin {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pin__top {
  width: 100px;
  height: 100px;
}

.pin__row {
  display: flex;
  gap: 0;
}

.pin__row > div {
  width: 100px;
  height: 100px;
}
```

**浮动实现（旧方案，了解原理）：**

```css
/* 上方第一个块水平居中 */
.div1 { margin: 0 auto; width: 100px; height: 100px; }
/* 下方两个向左浮动，利用负 margin 控制位置 */
.div2 { float: left; margin-left: 50%; }
.div3 { float: left; margin-left: -200px; }
```

### 实现九宫格布局

**Grid 实现（推荐）：**

```html
<div class="grid9">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
  <div>7</div><div>8</div><div>9</div>
</div>
```

```css
.grid9 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.grid9 > div {
  aspect-ratio: 1;
  background: skyblue;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Flex 实现：**

```css
.grid9 {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.grid9 > div {
  /* (100% - 2*gap) / 3，这里用固定宽度示例 */
  width: calc((100% - 16px) / 3);
  aspect-ratio: 1;
  background: skyblue;
}
```

## Demo

<LayoutPatternsPlayground />

## 参考来源

- [MDN: Basic concepts of multi-column layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout/Basic_concepts)
- [MDN: Handling content breaks in multi-column layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout/Handling_content_breaks)
- [MDN: flex](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex)
- [MDN: grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns)
- [MDN: align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-items)
- [MDN: justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content)
- [CSS Multi-column Layout Module Level 1](https://www.w3.org/TR/css-multicol-1/)
- [Element Plus: Dialog](https://element-plus.org/en-US/component/dialog)
- [Element Plus: Loading](https://element-plus.org/en-US/component/loading)
