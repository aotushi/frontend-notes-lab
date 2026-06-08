# 行内元素、块级元素与行内块

## 问题

行内元素、块级元素、行内块元素有什么区别？如何相互转换？

## 结论

先分清两个层面：

- HTML 层面：讨论元素的语义和内容模型，例如 flow content、phrasing content、interactive content。
- CSS 层面：讨论盒子的外部显示类型和内部布局方式，主要由 `display` 决定。

面试里说“行内元素/块级元素”时，通常是在问 CSS 视觉布局表现，不是在问 HTML 标准分类。

不要把“行内元素不能放块级元素”当成绝对规则。能否嵌套某类元素要看 HTML 内容模型；元素在页面上表现为行内、块级还是行内块，主要看最终的 CSS `display`。

| 特性 | `display: inline` | `display: block` | `display: inline-block` |
| --- | --- | --- | --- |
| 是否独占一行 | 否，和其它行内级盒在同一行排列 | 是，通常从新行开始并占据可用宽度 | 否，像行内级盒一样参与当前行 |
| 默认宽度 | 内容宽度 | 包含块可用宽度 | 内容宽度 |
| `width` / `height` | 对普通行内盒无效 | 有效 | 有效 |
| 水平 `margin` / `padding` | 参与水平方向布局 | 有效 | 有效 |
| 垂直 `margin` | 通常不影响行盒布局 | 有效 | 有效 |
| 垂直 `padding` / `border` | 能绘制出来，但通常不撑开上下行 | 有效 | 有效 |
| 常见用途 | 文本片段、链接、强调文本 | 文档结构、段落、容器 | 按行排列但又需要设置宽高的项 |

常见例子：

- 常见默认行内表现：`span`、`a`、`strong`、`em`。
- 常见默认块级表现：`div`、`p`、`h1`-`h6`、`ul`、`li`、`section`、`article`。
- 常见默认行内级但可设置尺寸的替换元素：`img`、`input`、`textarea`、`select`、`button`。它们不能简单套进“普通 inline 不能设置宽高”的规则里。

面试时不建议背完整元素列表。旧资料里常见的 `acronym`、`big`、`tt` 等元素已经不适合作为现代答案重点，掌握判断方法比背列表更可靠。

元素之间的转换靠 CSS：

```css
.as-inline {
  display: inline;
}

.as-block {
  display: block;
}

.as-inline-block {
  display: inline-block;
}
```

`inline-block` 的空白间隙来自 HTML 源码里的空白字符。两个 `inline-block` 元素之间如果有换行、空格或 tab，浏览器会按文本空白处理，视觉上就会出现间距。常见处理方式是：

- 删除元素之间的空白字符。
- 父元素设置 `font-size: 0`，子元素再恢复字体大小。
- 改用 `flex` 或 `grid` 做现代布局。
- 使用负 `margin`、`letter-spacing`、`word-spacing` 等方式不够稳健，面试中可以提，但业务里不优先。

面试回答：

> `inline` 不独占一行，宽高对普通行内盒无效，主要用于文本流中的片段；`block` 独占一行，默认撑满父容器宽度，可以设置宽高和四个方向的盒模型属性；`inline-block` 外部像行内盒一样参与一行排列，内部像块盒一样可以设置宽高。是否能嵌套某类元素要看 HTML 内容模型，不要只按“行内/块级”判断。实际开发中要关注元素最终的 computed `display`，也要注意替换元素和 `inline-block` 空白间隙。

## Demo

下面的案例可以直接验证：

- `inline` 设置 `width`/`height` 后不会按指定尺寸布局。
- `block` 会换行并默认占据整行。
- `inline-block` 可以一行排列，也可以设置宽高。
- `inline-block` 元素之间的源码换行会产生可见空隙。
- `getComputedStyle(...).display` 只能说明最终 CSS 显示值，不能代替 HTML 内容模型判断。

<DemoFrame
  src="/demos/inline-block-elements/index.html"
  title="inline、block、inline-block 可验证差异"
  height="760"
/>

## 参考来源

- [MDN: Block and inline layout in normal flow](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Block_and_inline_layout)
- [MDN: display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [MDN: HTML content categories](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Content_categories)
