# 选择器、优先级与层叠

## 问题

- 浏览器如何解析 CSS 选择器的，换句话说 CSS 的匹配规则是什么？
- 常见 CSS 选择器有哪些？
- css 如何匹配前 N 个子元素及最后 N 个子元素
- 选择器优先级

## 结论

### 浏览器如何解析 CSS 选择器的，换句话说 CSS 的匹配规则是什么？

常见理解模型是：浏览器会从右向左匹配选择器。

也就是说，浏览器先根据最右侧的关键选择器找到候选元素，再向左检查这些元素是否满足父级、祖先、相邻兄弟等关系。

例如 `div p em`：

1. 先找到可能命中的 `em`。
2. 再检查这个 `em` 是否在 `p` 内。
3. 再检查这个 `p` 是否在 `div` 内。

如果从左向右匹配，浏览器可能需要先找到大量 `div`，再向下查找所有后代，候选范围会很大。右向左匹配可以先从最终要被应用样式的元素开始，减少无效查找。

再比如 `p span`：

- 先找所有可能命中的 `<span>`。
- 再向上检查它是否有 `<p>` 祖先。
- 一旦条件满足，就可以确认这个 `<span>` 匹配该选择器。

需要注意：这是常见的实现和教学模型，不是 CSS 规范要求浏览器必须这样实现。现代浏览器还会做选择器缓存、样式失效范围计算等优化。真实性能优化不要只盯着“选择器长不长”，更应该关注 DOM 规模、样式重算范围、频繁 class 切换和复杂状态变化。

### 常见 CSS 选择器有哪些？

选择器用于描述“哪些元素应该应用这条 CSS 规则”。按照 [Selectors Level 4 的结构定义](https://www.w3.org/TR/selectors-4/#structure)，可以依次从**选择条件**、**元素关系**和**完整结构**三个层次理解，而不是把所有概念放在同一张表中。

#### 1. 选择条件

##### 1.1 基础选择器

| 子项 | 示例 | 说明 |
| --- | --- | --- |
| 类型选择器 | `button` | 选择指定标签名的元素 |
| 通配选择器 | `*` | 选择任意元素 |
| 类选择器 | `.primary` | 选择 `class` 列表中包含指定类名的元素 |
| ID 选择器 | `#app` | 选择具有指定 `id` 的元素 |

##### 1.2 属性选择器

| 子项 | 示例 | 说明 |
| --- | --- | --- |
| 属性存在 | `[disabled]` | 具有该属性即可，不关心属性值 |
| 值完全相等 | `[type="email"]` | 属性值必须完全相等 |
| 单词列表包含 | `[class~="card"]` | 空格分隔的值列表中包含完整单词 |
| 值或连字符前缀 | `[lang\|="zh"]` | 匹配 `zh` 或以 `zh-` 开头的值 |
| 字符串前缀 | `[href^="https"]` | 属性值以指定字符串开头 |
| 字符串后缀 | `[href$=".pdf"]` | 属性值以指定字符串结尾 |
| 包含子字符串 | `[href*="/docs/"]` | 属性值包含指定字符串 |
| 忽略 ASCII 大小写 | `[type="email" i]` | 在结束方括号前使用 `i` 标志 |

##### 1.3 伪类

伪类使用单冒号 `:`，根据元素的状态、位置或关系进一步筛选元素。

| 分类 | 常见子项 | 用途 |
| --- | --- | --- |
| 链接与目标 | `:link`、`:visited`、`:any-link`、`:target` | 匹配链接状态或当前 URL 片段指向的元素 |
| 用户交互 | `:hover`、`:active`、`:focus`、`:focus-visible`、`:focus-within` | 匹配鼠标、键盘或焦点状态 |
| 树结构 | `:root`、`:empty`、`:first-child`、`:last-child`、`:nth-child()` | 按文档树中的位置筛选 |
| 表单状态 | `:enabled`、`:disabled`、`:checked`、`:required`、`:valid`、`:invalid`、`:user-invalid` | 匹配控件能力、选择状态或校验状态 |
| 逻辑与关系 | `:is()`、`:where()`、`:not()`、`:has()` | 合并、排除或根据相关元素进行筛选 |
| 语言与方向 | `:lang()`、`:dir()` | 按内容语言或书写方向筛选 |
| 界面状态 | `:fullscreen`、`:modal`、`:popover-open` | 匹配浏览器管理的界面状态 |

##### 1.4 伪元素

伪元素使用双冒号 `::`，表示文档树中不能直接用普通元素选择器表示的实体，例如首行、选中文本、列表标记或生成内容。

| 分类 | 常见子项 | 用途 |
| --- | --- | --- |
| 生成内容 | `::before`、`::after` | 在元素内容的开头或结尾生成伪元素 |
| 排版片段 | `::first-letter`、`::first-line` | 选择首字母或首行 |
| 文本状态 | `::selection`、`::target-text` | 选择用户选中的文本或 URL 指向的文本 |
| 表单与列表 | `::placeholder`、`::file-selector-button`、`::marker` | 选择占位文本、文件按钮或列表标记 |
| 顶层与组件 | `::backdrop`、`::part()`、`::slotted()` | 选择顶层背景或 Web Component 暴露的部分 |

::: tip
`::before` 和 `::after` 会生成类似子元素的盒子，但不能因此把所有伪元素都理解成“虚拟子元素”。例如 `::first-line` 和 `::selection` 选中的是内容片段。
:::

#### 2. 元素关系：组合器

组合器连接前后的选择条件，表达元素之间的结构关系。

| 子项 | 示例 | 说明 |
| --- | --- | --- |
| 后代组合器 | `.card p` | 选择 `.card` 内任意层级的 `p` |
| 子代组合器 | `.menu > li` | 只选择 `.menu` 的直接 `li` 子元素 |
| 相邻兄弟组合器 | `h2 + p` | 选择紧跟在 `h2` 后面的第一个同级 `p` |
| 后续兄弟组合器 | `h2 ~ p` | 选择 `h2` 后面的所有同级 `p` |

#### 3. 完整选择器结构

简单选择器组合后，还需要区分下面几种完整结构：

| 结构 | 示例 | 含义 |
| --- | --- | --- |
| 简单选择器 | `.primary` | 单一选择条件 |
| 复合选择器 | `button.primary[disabled]:hover` | 没有组合器，所有条件同时作用于同一个元素 |
| 复杂选择器 | `.dialog > form input:invalid` | 使用组合器连接多个复合选择器 |
| 选择器列表 | `h1, h2, h3` | 用逗号让多个选择器共享同一组声明 |
| 相对选择器 | `:has(> img)` 中的 `> img` | 从一个隐含的锚点元素开始描述关系，常用于 `:has()` |

`.dialog > form input:invalid` 可以拆成：

```css
.dialog > form input:invalid
/* .dialog、form、input:invalid 是三个选择器片段
   > 表示直接子代，空格表示任意层级后代 */
```

记忆优先级时再把它们归入三个权重列：ID 选择器进入 ID 列；类、属性和伪类进入 CLASS 列；类型和伪元素进入 TYPE 列。通配选择器和组合器本身不增加权重，具体规则见后文“选择器权重计算”。

### css 如何匹配前 N 个子元素及最后 N 个子元素

最直接的方式是使用结构伪类 `:nth-child()` 和 `:nth-last-child()`。

```css
/* 前 3 个子元素 */
.item:nth-child(-n + 3) {
}

/* 后 3 个子元素 */
.item:nth-last-child(-n + 3) {
}
```

补充记忆：

- `:nth-child()` 从前往后数。
- `:nth-last-child()` 从后往前数。
- 子元素索引从 `1` 开始。
- `n` 从 `0` 开始取非负整数。
- `-n + 3` 可以理解为 `3, 2, 1`，所以命中前三个或后三个。

如果要匹配“同类型元素”的前 N 个或后 N 个，可以使用 `:nth-of-type()` 和 `:nth-last-of-type()`：

```css
/* 同类型 li 中的前 3 个 */
li:nth-of-type(-n + 3) {
}

/* 同类型 li 中的后 3 个 */
li:nth-last-of-type(-n + 3) {
}
```

区别在于：

```html
<ul>
  <p>说明</p>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>
```

```css
li:nth-child(-n + 3) {
}
```

这表示“所有兄弟元素中的前 3 个，并且自己是 `li`”。上面的 `<p>` 是第 1 个子元素，所以 `li C` 是第 4 个子元素，不会命中。

```css
li:nth-of-type(-n + 3) {
}
```

这表示“所有 `li` 兄弟元素中的前 3 个”。所以上面的 `li A`、`li B`、`li C` 都会命中。

如果要反向处理“除了前 N 个之外的元素”，可以配合 `:not()`：

```css
/* 除了前 3 个以外 */
.item:not(:nth-child(-n + 3)) {
  display: none;
}

/* 除了后 3 个以外 */
.item:not(:nth-last-child(-n + 3)) {
  display: none;
}
```

如果要匹配“某个选择器集合中的前 N 个”，现代 CSS 还可以使用 `of <selector>`：

```css
/* 在所有兄弟元素中排前 3，并且自己有 .item */
.item:nth-child(-n + 3) {
}

/* 在 .item 子集合中排前 3 */
:nth-child(-n + 3 of .item) {
}
```

前者先按所有兄弟元素的位置计数，再判断元素是否有 `.item`；后者先筛出 `.item`，再在 `.item` 集合里计数。

### 完整样式优先级：继承、级联与选择器权重

CSS 最终样式优先级可以先分成两大类记忆：一类是**继承(Inheritance)**，另一类是**级联(Cascading)**。

- 继承的优先级最低。只有元素自身没有通过级联得到某个可继承属性时，才会从父元素继承。
- 在普通声明、不考虑 `!important`、动画和过渡的简化口径下，级联优先级可以这样记：
  - 开发者设置的常规 CSS 样式；
  - 开发者通过 `@layer` 分层的 CSS 样式；
  - 用户设置的 CSS 样式；
  - 浏览器内置的 CSS 样式。
- 每个级联层内部再比较选择器权重：
  - 将不同选择器分配不同数值，选择器数值越高，优先级越高，但不会超过它所在级联层的优先级。

上面的顺序来自张鑫旭《深入理解 CSS 中的级联规则》的简化记忆模型。完整浏览器级联还要考虑 `!important`、动画、过渡、不同来源和 `@layer` 内部顺序；面试回答时要说明这是“普通声明下的简化模型”。

#### 选择器权重计算

计算公式:

- 0级 通配符、组合符、调整优先级的逻辑伪类自身
- 1级 元素、伪元素
- 2级 类、属性、伪类
- 3级 ID
- 4级 行内样式

一个选择器的优先级可以说是由四个部分相加（分量），可以辅助理解成千百十个四位数：

1. **千位**：如果声明在 [`style`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-style) 属性中，则该位得一分。这样的声明没有选择器，所以它得分总是 `1000`。
2. **百位**：选择器中包含 ID 选择器则该位得一分。
3. **十位**：选择器中包含类选择器、属性选择器、伪类则该位得一分。
4. **个位**：选择器中包含元素、伪元素选择器则该位得一分。

**注**：通配符选择器 (`*`) 和组合符 (`+`, `>`, `~`, 空格) 不会影响优先级。`:not()`、`:is()`、`:has()` 这些伪类自身不增加权重，但括号里的选择器会参与计算；`:where()` 无论参数多复杂，权重都是 `0`。

### 伪元素和伪类的区别和作用

**伪类**描述元素自身的状态、位置或关系，不会创建新的可选择实体。**伪元素**表示文档树中不能直接表示的实体，可能是元素的一部分、特定状态下的文本，也可能是生成内容。

```css
button:hover {
  background: #1d4ed8;
}

input:user-invalid {
  border-color: #dc2626;
}

p::first-line {
  font-weight: 700;
}

li::marker {
  color: #2563eb;
}
```

| 对比项 | 伪类 | 伪元素 |
| --- | --- | --- |
| 语法 | 单冒号 `:` | 双冒号 `::` |
| 选择目标 | 已有元素的状态、位置或关系 | 普通文档树无法直接表示的实体或内容片段 |
| 是否创建 DOM 节点 | 不创建 | 不创建；部分伪元素会生成渲染盒 |
| 优先级 | 计入 CLASS 列 | 计入 TYPE 列 |
| 示例 | `:hover`、`:nth-child()`、`:has()` | `::before`、`::first-line`、`::selection` |

### `::before` 和 `:after` 双冒号与单冒号的区别

- 现代语法使用单冒号表示伪类，使用双冒号表示伪元素。
- 为兼容旧网页，浏览器仍接受 `:before`、`:after`、`:first-letter` 和 `:first-line` 这四种历史单冒号写法。
- 新代码应写 `::before` 和 `::after`，让伪元素与伪类一眼可分。
- `::before` 和 `::after` 会在来源元素内部生成第一个或最后一个伪元素，通常需要用 `content` 提供内容；它们不是 DOM 节点，也不适用于所有元素。

```css
.badge::after {
  content: "New";
  margin-inline-start: 0.5em;
}
```

## Demo

<DemoFrame src="/demos/css-specificity-cascade/index.html" title="选择器优先级与层叠验证" height="720" />

## a 标签伪类顺序

链接伪类常见顺序可以记为 LVHA：

```css
a:link {
  color: #1d4ed8;
}

a:visited {
  color: #7c3aed;
}

a:hover {
  color: #dc2626;
}

a:active {
  color: #ea580c;
}
```

`link` 和 `visited` 表示链接状态，`hover` 和 `active` 表示交互状态。由于它们优先级相同，后写的规则在冲突时覆盖先写的规则，所以通常按 `:link`、`:visited`、`:hover`、`:active` 书写，避免 hover/active 被前面的状态规则覆盖。

## 参考来源

- [张鑫旭：深入理解 CSS 中的级联规则](https://www.zhangxinxu.com/wordpress/2022/05/deep-in-css-cascade/)
- [MDN: Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)
- [MDN: Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity)
- [MDN: CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN: CSS selector structure](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Selector_structure)
- [MDN: Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
- [MDN: Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- [MDN: Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [W3C: Selectors Level 4 — Structure and Terminology](https://www.w3.org/TR/selectors-4/#structure)
- [MDN: `:nth-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-child)
- [MDN: `:nth-last-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-last-child)
