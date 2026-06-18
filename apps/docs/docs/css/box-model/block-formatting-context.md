# BFC 块级格式化上下文

## 问题

BFC 是什么？它能解决哪些布局问题？

## 结论

### 理解路径

1. 页面布局不是只计算单个元素的位置，还要处理元素之间的相互影响，例如块盒排列、浮动避让、内部浮动高度计算和 margin 折叠。
2. CSS 2.1 / CSS 2.2 的视觉格式化模型把这些相互影响抽象为 formatting context。
3. 常见 formatting context 包括 BFC（Block Formatting Context，块级格式化上下文）和 IFC（Inline Formatting Context，行内格式化上下文）。
4. BFC 负责一类块级布局规则，核心影响块级盒排列、浮动参与高度计算、外部浮动避让和垂直 margin 折叠。
5. 因此 BFC 常被用来解释清除浮动、两栏布局和 margin 折叠隔离。

### 定义

CSS 布局不是只有一套规则。浏览器会根据盒子的类型、`display`、定位、浮动等条件，把元素放进不同的 formatting context 中；每种 formatting context 都有自己的布局规则，用来决定内部盒子如何排列，以及它们如何和浮动、margin 等布局关系相互影响。

BFC 是 Block Formatting Context，块级格式化上下文，是 formatting context 的一种。它可以理解成一块按块布局规则计算的独立布局区域，不是某个 CSS 属性。

BFC 主要影响三类布局关系：

- <ConceptNote label="建立 BFC 的容器计算自动高度时，会包含其内部浮动元素。" title="释义：为什么 BFC 能包含内部浮动" :sections="[{ title: '直观理解', body: '浮动元素会脱离普通块布局对父元素高度的撑开效果，所以父元素只包着浮动子元素时，容易出现高度塌陷。' }, { title: '建立 BFC 后', body: '父元素计算自动高度时会把内部浮动元素也算进去，这个效果常被称为清除内部浮动或包含浮动。' }, { title: '推荐写法', code: '.container {\\n  display: flow-root;\\n}', body: 'overflow: hidden 也有效，但它还会裁剪溢出内容。' }]" />
- <ConceptNote label="正常流中建立 BFC 的块盒，会避开同一上下文中的浮动盒。" title="释义：BFC 如何避开外部浮动" :sections="[{ title: '直观场景', body: '左侧头像设置 float: left，后面跟着一块正文内容。' }, { title: '没有建立 BFC', body: '正文块本身仍按普通块布局贴着包含块左边界，正文里的文字会围绕头像排布。' }, { title: '右侧内容建立 BFC 后', body: '右侧内容的 border box 会从浮动盒旁边开始，不会压到浮动盒下面。', code: '.avatar {\\n  float: left;\\n}\\n\\n.content {\\n  display: flow-root;\\n}' }, { title: '边界', body: '这个规则只描述普通流中的 BFC 与同一上下文里的浮动盒关系，不代表 BFC 能避免所有重叠。' }]" />
- <ConceptNote label="新的 BFC 容器可以隔离部分垂直 margin 折叠。" title="释义：为什么是“部分” margin 折叠" :sections="[{ title: '全局分类', items: ['相邻兄弟块盒之间的垂直 margin 折叠。', '父元素与第一个或最后一个普通流子元素之间的垂直 margin 折叠。', '空块自身的 margin-top 和 margin-bottom 折叠。'] }, { title: 'BFC 能处理的部分', body: 'BFC 能影响跨 BFC 边界的 margin 折叠。例如把其中一个段落包进 display: flow-root 容器后，外部段落的 margin 不会直接和容器内部段落的 margin 折叠。' }, { title: 'BFC 不能处理的部分', body: 'BFC 不会取消同一个 BFC 内部普通流相邻块盒之间的 margin 折叠。' }]" />

### 创建 BFC 的情况

常见会创建 BFC 的情况包括：

- 根元素 `<html>`。
- 浮动元素：`float` 不是 `none`。
- 绝对定位或固定定位元素：`position: absolute` / `fixed`。
- `display: inline-block`。
- 表格相关盒：`table-cell`、`table-caption`，以及由 `display: table` 等隐式创建的匿名表格盒。
- 块级盒设置 `overflow`，且值不是 `visible` 或 `clip`。
- `display: flow-root`。
- `contain: layout`、`contain: content`、`contain: paint`。
- flex item：`display: flex` / `inline-flex` 容器的直接子元素，且该子元素本身不是 flex、grid 或 table 容器。
- grid item：`display: grid` / `inline-grid` 容器的直接子元素，且该子元素本身不是 flex、grid 或 table 容器。
- 多列容器：`column-count` 或 `column-width` 不是 `auto`，包括 `column-count: 1`。
- `column-span: all`。

`display: flex` / `display: grid` 建立的是 flex / grid formatting context，不应直接说成“这个元素创建 BFC”。但 flex item、grid item 在满足条件时会创建 BFC。

### 布局规则

1. 在 BFC 中，普通流里的块级盒会沿 <ConceptNote label="block 方向" title="释义：block 方向是什么" :sections="[{ title: '直观理解', body: 'block 方向不是固定等于屏幕上的垂直方向，它取决于书写模式。' }, { title: '默认网页', code: 'writing-mode: horizontal-tb;', items: ['inline 方向：水平方向。', 'block 方向：从上到下的垂直方向。'] }, { title: '竖排书写', code: 'writing-mode: vertical-rl;', items: ['inline 方向：垂直方向。', 'block 方向：水平方向，通常从右向左推进。'] }]" /> 一个接一个排列。
2. 同一个 BFC 中，相邻块级盒之间的垂直距离由 margin 决定，<ConceptNote label="垂直 margin 可能发生折叠" title="释义：为什么垂直 margin 会折叠" :sections="[{ title: '原因', body: '这是 CSS 普通块布局的规则，不是浏览器 bug。同一个 BFC 中，普通流块盒在 block 方向相邻时，它们的相邻垂直 margin 会合并成一个 margin。' }, { title: '例子', body: '前一个元素 margin-bottom: 20px，后一个元素 margin-top: 30px。它们之间的距离通常不是 50px，而是折叠成 30px。' }, { title: '设计动机', body: '早期文档排版里，段落和标题会连续出现。如果每个元素的上下 margin 都直接相加，段落间距会过大。折叠后能保持更自然的文档间距。' }, { title: '边界', items: ['只发生在 block 方向的 margin。', '水平 margin 不折叠。', 'flex/grid 布局里的项目通常不会发生这种普通块布局下的 margin 折叠。', '跨 BFC 边界的 margin 通常会被隔离。'] }]" />。
3. 普通流块盒的 margin box 外边缘会与包含块的 border box 外边缘相接触；即使存在浮动，块盒本身的边界仍按包含块计算，通常是内部行盒被浮动挤开。
4. 建立 BFC 的元素在计算自动高度时，会包含其内部浮动元素。
5. 正常流中建立 BFC 的元素，其 border box 不会与同一上下文中的浮动元素 margin box 重叠。
6. BFC 可以理解成一个 <ConceptNote label="布局隔离容器" title="释义：BFC 的隔离性到底是什么" :sections="[{ title: '直观理解', body: 'BFC 像一个布局边界，它能把一部分布局影响限制在自己的边界内。' }, { title: '它能隔离什么', items: ['内部浮动会参与 BFC 容器的自动高度计算。', '外部浮动不会压到正常流中的 BFC 区域里。', '跨 BFC 边界的垂直 margin 折叠会被隔开。'] }, { title: '它不能隔离什么', body: 'BFC 不是完整的样式隔离机制。继承、定位、层叠、绘制、百分比尺寸、包含块关系等 CSS 行为仍然可能和外部有关。' }]" />。

### 应用场景

#### 包含内部浮动

父容器没有建立 BFC 时，内部浮动不会撑开父容器的自动高度；建立 BFC 后，父容器计算自动高度时会包含内部浮动。

现代写法优先使用：

```css
.container {
  display: flow-root;
}
```

`overflow: hidden` 也能创建 BFC，但会改变溢出行为，可能裁剪阴影、下拉菜单或绝对定位溢出内容。

#### 避开外部浮动

正常流中的 BFC 区域不会压到同一上下文的浮动盒下面，早期两栏布局常利用这个特性。

```css
.sidebar {
  float: left;
  width: 160px;
}

.content {
  display: flow-root;
}
```

#### 隔离 margin 折叠

相邻块级盒的垂直 margin 可能折叠。要隔离折叠，不是随便把某个 `p` 变成 BFC，而是把其中一个元素放进新的 BFC 容器。

```html
<p class="first">第一个段落</p>
<div class="bfc-wrapper">
  <p class="second">第二个段落</p>
</div>
```

```css
.first,
.second {
  margin-block: 24px;
}

.bfc-wrapper {
  display: flow-root;
}
```

#### 垂直 margin 折叠如何计算

普通块流中相邻块盒的垂直 margin 可能折叠，折叠后的距离不是简单相加。

```css
p {
  margin-block-start: 10px;
  margin-block-end: 15px;
}
```

```html
<p>AAA</p>
<p></p>
<p></p>
<p></p>
<p>BBB</p>
```

这些空段落的上下 margin 会连续折叠在一起。全部都是正 margin 时，折叠结果取最大值，所以 `AAA` 和 `BBB` 之间的间距通常是 `15px`，不是多个段落 margin 的总和。

折叠计算要注意：

- 全部为正值时，取最大正值。
- 全部为负值时，取绝对值最大的负值。
- 正负混合时，最大正值和最小负值相加。
- flex/grid 项目之间不会按普通块流规则发生这种垂直 margin 折叠。

### 常见误区

- BFC 是布局上下文，不是 CSS 属性。
- `display: flex` / `grid` 不等于创建 BFC；它们建立的是 flex / grid formatting context。
- `overflow: hidden` 可以创建 BFC，但不应只为了 BFC 默认使用它。
- BFC 只能隔离部分布局影响，不会隔离继承、定位、绘制等所有 CSS 影响。

## Demo

```html
<section class="card">
  <img class="thumb" src="/images/example.png" alt="">
  <p>内部图片设置 float 后，父容器仍需要包住它。</p>
</section>
```

```css
.card {
  display: flow-root;
  border: 1px solid #94a3b8;
}

.thumb {
  float: left;
  width: 120px;
  margin-right: 16px;
}
```

这个例子验证的是：建立 BFC 的容器在计算自动高度时会包含内部浮动。

## 参考来源

- [MDN: Block formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Block_formatting_context)
- [MDN: Introduction to formatting contexts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Formatting_contexts)
- [MDN: Mastering margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)
- [CSS 2.2: Block formatting contexts](https://www.w3.org/TR/CSS22/visuren.html#block-formatting)
- [MDN: display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
