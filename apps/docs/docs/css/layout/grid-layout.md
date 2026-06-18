# Grid 布局

## 问题

Grid 是什么？它和 Flex 有什么区别？Grid 的核心概念、轨道尺寸、命名线、命名区域、对齐、`minmax()`、`subgrid` 和九宫格类布局应该怎么答？

## 结论

### 理解路径

1. Grid 是二维布局模型：先定义行和列组成的网格，再把项目放到网格线、单元格或区域里。
2. 开启 Grid 的是容器：`display: grid` 或 `display: inline-grid` 会让直接子元素成为 grid item。
3. Grid 的核心是轨道、网格线、单元格、区域和自动放置算法；属性要分清“容器属性”和“项目属性”。
4. 面试里的 Grid 题通常不是背属性，而是解释：二维布局能力、轨道尺寸函数、自动生成轨道、与 Flex 的取舍、典型布局写法。
5. “Grid 兼容性不太好”已经不是现代浏览器下的通用结论；基础 Grid 能力已广泛可用，但 `subgrid`、`masonry` 等新特性仍要按目标浏览器单独确认。

### Grid 是什么

CSS Grid Layout 是 CSS 的二维网格布局模型。它把容器划分为行和列，并允许元素按网格线、单元格或命名区域定位。和 Flex 相比，Grid 更适合同时控制横向和纵向关系，例如页面骨架、相册、仪表盘、固定列数卡片、九宫格和复杂表单。

`display: grid` 只会让容器的直接子元素参与这一层 Grid 布局。更深层的后代如果也要参与网格，需要自己成为 grid container，或者在合适场景下使用 `subgrid` 继承父网格某个轴上的轨道。

### 核心概念

<GridConceptDiagram />

这张图先解决“Grid 在画面上是什么”的问题：用同一张 3 列 2 行网格分别高亮 grid line、grid track、grid cell 和 grid area，避免把多个概念叠在一起造成误解。

| 概念 | 含义 | 面试回答重点 |
| --- | --- | --- |
| grid container | 设置了 `display: grid` 或 `inline-grid` 的元素 | 容器定义网格结构和自动放置规则。 |
| grid item | grid container 的直接子元素 | 项目可以指定起止网格线、区域和自身对齐。 |
| grid line | 划分行列的线 | 可用数字或命名线定位项目。 |
| grid track | 两条相邻网格线之间的空间，即一行或一列 | 由 `grid-template-rows`、`grid-template-columns`、`grid-auto-*` 决定尺寸。 |
| grid cell | 一行和一列交叉形成的单元格 | 是 Grid 中最小的放置单元。 |
| grid area | 一个或多个单元格组成的矩形区域 | 可用 `grid-template-areas` 和 `grid-area` 命名布局。 |
| explicit grid | 显式声明的行列 | 来自 `grid-template-*`。 |
| implicit grid | 自动补出来的行列 | 项目超出显式网格或自动放置需要新增轨道时产生。 |
| gutter | 轨道之间的间距 | 用 `gap`、`row-gap`、`column-gap` 控制。 |

### 轨道尺寸怎么答

`grid-template-columns` 和 `grid-template-rows` 定义的是显式轨道列表。轨道尺寸既可以是固定值，也可以是弹性值、内容尺寸关键字或尺寸函数。

```css
.grid {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 240px;
  gap: 16px;
}
```

常见写法：

| 写法 | 含义 | 场景 |
| --- | --- | --- |
| `100px`、`20rem`、`30%` | 固定或相对尺寸轨道 | 固定侧栏、固定列宽。 |
| `1fr`、`2fr` | 按比例分配剩余空间 | 自适应主内容区、等分列。 |
| `auto` | 内容参与决定轨道尺寸，通常接近内容最小到最大尺寸之间的范围 | 内容宽度不确定的导航、按钮列。 |
| `min-content` | 按内容可压缩到的最小贡献确定轨道 | 避免长词或最小内容被过度压缩。 |
| `max-content` | 按内容不换行时的最大贡献确定轨道 | 让某列完整容纳内容。 |
| `minmax(min, max)` | 给轨道设置最小值和最大值 | 响应式卡片、主内容区防溢出。 |
| `repeat(3, 1fr)` | 重复同一段轨道定义 | 固定列数。 |
| `repeat(auto-fit, minmax(160px, 1fr))` | 根据容器宽度自动折行，并让可用列填满 | 响应式卡片列表。 |

`fr` 表示参与分配剩余空间的弹性因子。`1fr 2fr` 不是绝对的 1:2 宽度，而是在扣除固定轨道、内容约束和间距后，对可分配空间按比例分配。

`minmax(0, 1fr)` 是面试中很实用的细节：当中间列里有长内容时，`1fr` 轨道可能受到内容最小尺寸影响而撑开；把最小值写成 `0`，再配合子元素 `min-width: 0`，更容易得到真正可收缩的自适应列。

### Grid 和 Flex 怎么选

| 对比点 | Grid | Flex |
| --- | --- | --- |
| 布局维度 | 二维，行和列同时控制 | 一维，主要沿主轴分配空间 |
| 布局思路 | 先定义容器轨道，再放置项目 | 主要由项目内容和主轴空间分配驱动 |
| 适合场景 | 页面骨架、仪表盘、相册、九宫格、复杂表单、固定行列关系 | 导航栏、工具栏、按钮组、卡片横排、左右分布、简单居中 |
| 换行行为 | 行列关系更稳定，列宽和行高可明确声明 | 每条 flex line 独立分配空间，最后一行常需要额外处理 |
| 重叠能力 | 项目可以放入同一区域并用 `z-index` 分层 | 不是主要能力 |

简单判断：只关心一条轴上的分布，用 Flex；同时关心行和列，用 Grid。

### 常见题怎么写

#### 三列布局：左右固定，中间自适应

```css
.layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 300px;
  gap: 16px;
}
```

这里比 `300px auto 300px` 更稳的是 `minmax(0, 1fr)`：中间列负责吃掉剩余空间，并允许在空间不足时收缩。

#### 九宫格布局

```css
.grid-9 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.grid-9 > div {
  aspect-ratio: 1;
}
```

九宫格的关键不是写 9 个元素，而是明确三列轨道和正方形单元格。`aspect-ratio: 1` 比用固定高度更适合响应式容器。

#### 响应式卡片网格

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
```

这类写法可以少写媒体查询。每列至少 `160px`，空间足够时按 `1fr` 拉伸，空间不足时自动换到下一行。

#### 命名区域布局

```css
.page {
  display: grid;
  grid-template:
    "header header" auto
    "sidebar main" 1fr
    "footer footer" auto
    / 240px minmax(0, 1fr);
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
```

命名区域适合页面骨架，因为结构可读性强。但区域必须组成矩形，不能写成 L 形或断开的区域。

### 命名线、命名区域和对齐怎么理解

临时案例里的内容适合进入正文，但不适合原样搬整页。它们在页面中应该作为具体知识点的释义：命名线解释“如何定位到线之间”，命名区域解释“如何用 ASCII 布局图表达结构”，对齐解释“items、self、content 分别对齐谁”。

#### 命名网格线

声明轨道时可以在方括号里给网格线命名，定位项目时就不用记第几条线。

```css
.grid {
  display: grid;
  grid-template-columns: [start] 2fr [center] 1fr [end];
}

.item {
  grid-column: start / center;
}
```

这表示 `.item` 放在 `start` 和 `center` 两条网格线之间。命名线适合用于页面结构稳定、但编号不直观的布局。

同一条网格线可以有多个名字：

```css
.layout {
  display: grid;
  grid-template-columns:
    [left-start] 2fr
    [left-end right-start] 1fr
    [right-end];
}

.main {
  grid-column: left;
}
```

当存在 `left-start` 和 `left-end` 时，`grid-column: left` 会自动匹配这两条线之间的区域。这里的第二条线同时叫 `left-end` 和 `right-start`，所以它既是左侧区域的结束线，也是右侧区域的开始线。

重复命名线也可以用序号定位：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, [col] 1fr 1fr);
}

.item {
  grid-column: col 2 / span 2;
}
```

`col 2 / span 2` 表示从第 2 条名为 `col` 的网格线开始，跨越 2 个轨道。

#### 命名网格区域

`grid-template-areas` 可以直接在 CSS 里画布局。每一行字符串代表网格的一行，字符串里用空格分隔的名字代表每一列。

```css
.container {
  display: grid;
  grid-template-areas:
    "title title"
    "nav nav"
    "main aside1"
    "main aside2";
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(4, auto);
  gap: 12px;
}

header {
  grid-area: title;
}

nav {
  grid-area: nav;
}

.main {
  grid-area: main;
}

.sidebar-top {
  grid-area: aside1;
}

.sidebar-bottom {
  grid-area: aside2;
}
```

这个例子是 2 列 4 行，不是 3 列 4 行。判断列数只看每一行字符串里有几个名字：`"title title"` 有两个名字，所以这一行有 2 列；`title` 重复两次表示它横跨两列。

对应布局是：

```text
title | title
nav   | nav
main  | aside1
main  | aside2
```

命名区域有两个限制：

- 同名区域必须组成一个矩形，不能断开，也不能形成 L 型或 U 型。
- 可以用 `.` 表示空网格单元格，例如 `"left . right"`。

#### Grid 对齐

Grid 对齐先分方向，再分作用对象：

- `justify-*` 控制水平方向，`align-*` 控制垂直方向。
- `*-items` 作用在容器上，控制所有 grid item 在各自 grid area 内怎么对齐。
- `*-self` 作用在单个项目上，只覆盖这一个 grid item。
- `*-content` 作用在容器上，控制整组网格轨道在 grid container 内怎么分布。

```css
.items-demo {
  display: grid;
  grid-template-columns: repeat(2, 58px);
  grid-template-rows: repeat(2, 58px);
  justify-items: end;
  align-items: center;
}

.self-demo .target {
  justify-self: end;
  align-self: end;
}

.content-demo {
  display: grid;
  width: 100%;
  min-height: 190px;
  grid-template-columns: repeat(2, 50px);
  grid-template-rows: repeat(2, 50px);
  justify-content: end;
  align-content: center;
}
```

最短记法：`items` 管一组项目在格子里怎么放，`self` 管某一个项目，`content` 管整张网格在容器里怎么放。

### `subgrid` 怎么理解

普通嵌套 Grid 会重新定义自己的行列，子网格和父网格轨道不自动对齐。`subgrid` 允许某个 grid item 在行轴、列轴或两个轴上采用父网格对应范围内的轨道尺寸，让嵌套内容继续和父级网格对齐。

```css
.form {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 12px;
}

.row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}
```

它适合“父级控制整体列宽，内部每一行或每张卡片的子内容也要对齐”的场景，例如表单标签与控件、卡片列表中的标题/元信息/操作区。`subgrid` 属于 Grid Level 2 特性，实际项目中要按目标浏览器兼容性决定是否使用降级方案。

## Demo

<GridPlayground />

这个组件覆盖三类常见题：

- 轨道尺寸：比较 `repeat(3, 1fr)`、固定侧栏、中间自适应和响应式卡片。
- 命名区域：查看页面骨架如何用 `grid-template-areas` 表达。
- 九宫格：用三列轨道和 `aspect-ratio` 实现响应式正方形单元格。

## 参考来源

- [MDN: Basic concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)
- [MDN: grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns)
- [MDN: repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat)
- [web.dev: Grid](https://web.dev/learn/css/grid)
- [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/)
- [CSS Grid Layout Module Level 2](https://www.w3.org/TR/css-grid-2/)
