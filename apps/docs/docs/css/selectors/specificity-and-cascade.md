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

常见选择器可以按“选中条件”分类记忆：

| 类型 | 示例 | 说明 |
| --- | --- | --- |
| 类型选择器 | `button` | 按元素名选择 |
| 类选择器 | `.primary` | 按 `class` 选择 |
| ID 选择器 | `#app` | 按 `id` 选择 |
| 通配选择器 | `*` | 匹配任意元素 |
| 属性选择器 | `[disabled]`、`[type="email"]` | 按属性存在或属性值选择 |
| 后代组合器 | `.card p` | 匹配某个祖先内部的后代 |
| 子代组合器 | `.menu > li` | 只匹配直接子元素 |
| 相邻兄弟组合器 | `h2 + p` | 匹配紧接在前一个元素后的兄弟 |
| 通用兄弟组合器 | `h2 ~ p` | 匹配后续同级兄弟 |
| 伪类 | `:hover`、`:focus-visible`、`:nth-child(2n)` | 匹配状态或结构 |
| 伪元素 | `::before`、`::after`、`::marker` | 匹配元素的一部分或生成内容 |

面试时不要只背名字，还要能说明它们对优先级的影响：ID 权重高于类、属性和伪类；类、属性和伪类高于元素和伪元素；通配符和组合器本身不增加权重。

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
- [MDN: `:nth-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-child)
- [MDN: `:nth-last-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-last-child)
