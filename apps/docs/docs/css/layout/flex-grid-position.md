# display 与布局总览

## 问题

`display` 为什么是 CSS 布局的入口？常见属性值分别做什么？外部显示类型和内部显示类型又决定什么？

## 结论

### 理解路径

1. 页面布局先把元素生成盒子，盒子再参与正常流、浮动、定位、Flex、Grid 等布局规则。
2. `display` 是连接元素和布局规则的入口：它决定元素自己如何参与外部布局，也决定它的子元素如何布局。
3. CSS Display Level 3 把 `display` 拆成两个维度：外部显示类型（outer display type）和内部显示类型（inner display type）。
4. 旧写法常把两个维度合成一个关键词，例如 `inline-block`、`inline-flex`；新语法可以把两个维度拆开写，例如 `inline flow-root`、`inline flex`。
5. 理解 `display` 后，Flex、Grid、BFC、正常流和定位之间的边界会更清楚。

### 外部显示类型

外部显示类型决定**元素自身如何参与父级布局**。最常见的是：

- `block`：生成块级盒，通常在正常流中独占一行。
- `inline`：生成行内级盒，参与行内排版。

例如 `display: flex` 的外部显示类型默认是 `block`，所以它本身像块级盒一样参与父级布局；`display: inline-flex` 的外部显示类型是 `inline`，所以它本身像行内级盒一样参与父级布局。

### 内部显示类型

内部显示类型决定**元素的子元素如何布局**。常见值包括：

- `flow`：普通流布局。
- `flow-root`：建立新的 BFC。
- `flex`：建立 flex formatting context。
- `grid`：建立 grid formatting context。
- `table`：建立表格布局上下文。

例如：

```css
.box {
  display: flex;
}
```

这表示 `.box` 自己作为块级盒参与父级布局，同时它的子元素进入 flex 布局。

### 单关键词与多关键词写法

早期常见写法把外部显示类型和内部显示类型压缩在一个关键词里：

```css
.a {
  display: inline-block;
}

.b {
  display: inline-flex;
}
```

在 CSS Display Level 3 的多关键词语法里，可以把这两个维度拆开：

```css
.a {
  display: inline flow-root;
}

.b {
  display: inline flex;
}
```

它们的含义分别是：

- `inline-block` ≈ `inline flow-root`：自己像行内级盒一样参与外部排版，内部建立一个新的 BFC。
- `inline-flex` ≈ `inline flex`：自己像行内级盒一样参与外部排版，内部子元素使用 Flex 布局。
- `flex` ≈ `block flex`：自己像块级盒一样参与外部排版，内部子元素使用 Flex 布局。
- `grid` ≈ `block grid`：自己像块级盒一样参与外部排版，内部子元素使用 Grid 布局。

实际项目里，`display: flex`、`inline-flex`、`grid`、`inline-grid` 这些单关键词写法仍然很常见，也更容易被团队快速识别。多关键词语法的价值主要在于帮助理解：`display` 同时回答了“这个盒子在外面是什么角色”和“它的子元素在里面怎么排版”两个问题。

### 常见值如何理解

| 写法 | 外部显示类型 | 内部显示类型 | 含义 |
| --- | --- | --- | --- |
| `display: block` | `block` | `flow` | 自己是块级盒，子元素走普通流 |
| `display: inline` | `inline` | `flow` | 自己是行内级盒，内容走行内/普通流规则 |
| `display: inline-block` | `inline` | `flow-root` | 自己参与行内排版，内部形成可设置尺寸的独立格式化根 |
| `display: flow-root` | `block` | `flow-root` | 自己是块级盒，并建立 BFC |
| `display: flex` | `block` | `flex` | 自己是块级盒，子元素走 Flex |
| `display: inline-flex` | `inline` | `flex` | 自己是行内级盒，子元素走 Flex |
| `display: grid` | `block` | `grid` | 自己是块级盒，子元素走 Grid |
| `display: inline-grid` | `inline` | `grid` | 自己是行内级盒，子元素走 Grid |
| `display: table` | `block` | `table` | 自己表现为表格盒，内部按表格格式化规则布局 |
| `display: list-item` | 通常为 `block` | 通常为 `flow` | 除主体盒外还会生成列表标记盒 |
| `display: contents` | 不生成自身主盒 | 由子元素决定 | 元素自己的盒子被跳过，子元素直接参与外层布局；使用前要验证语义和可访问性支持 |
| `display: none` | 不生成盒 | 不生成盒 | 元素及其后代不参与布局，也通常不会进入可访问性树 |

`inherit`、`initial`、`unset`、`revert`、`revert-layer` 是可以用于 `display` 的 **CSS 全局关键字**，但它们不是新的布局模式。例如 `display: inherit` 表示使用父元素的 `display` 计算值。

`block`、`inline` 和 `inline-block` 在换行、宽高、margin 与 padding 上的完整比较，见 [行内、块级与行内块](/html/document-structure/inline-block-elements)。HTML 的内容模型决定元素能否合理嵌套，`display` 只决定生成什么盒以及如何布局，不能用其中一个替代另一个。

### 与布局章节的关系

- Flex 解决一维空间分配和对齐问题。
- Grid 解决二维行列布局问题。
- `position` 解决元素相对正常位置、包含块或视口的偏移问题。
- BFC 解决块级格式化上下文中的浮动、margin 折叠和布局隔离问题。
- 多列、居中、圣杯布局、双飞翼布局等属于具体布局模式或案例。

## Demo

```html
<span class="inline-flex-box">
  <span>A</span>
  <span>B</span>
</span>

<div class="block-flex-box">
  <span>A</span>
  <span>B</span>
</div>
```

```css
.inline-flex-box {
  display: inline-flex;
  gap: 8px;
}

.block-flex-box {
  display: flex;
  gap: 8px;
}
```

两者内部子元素都走 Flex 布局；区别在于容器自身：`inline-flex` 像行内级盒参与外部排版，`flex` 像块级盒参与外部排版。

## 参考来源

- [MDN: display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [MDN: Using the multi-keyword syntax with CSS display](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Multi-keyword_syntax)
- [MDN: `<display-outside>`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/display-outside)
- [MDN: `<display-inside>`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/display-inside)
- [MDN: `<display-listitem>`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/display-listitem)
- [MDN: CSS-wide values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Value_processing#css-wide_keywords)
