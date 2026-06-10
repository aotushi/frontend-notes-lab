# 行高、文本溢出与行内间隙

## 问题

`line-height` 怎么理解？单行/多行文本怎么居中和省略？图片或 `inline-block` 元素之间为什么会出现空隙？

## 结论

`line-height` 决定行盒高度。没有显式设置 `height` 时，单行文本所在盒子的视觉高度主要由 `line-height` 支撑，所以常见的单行垂直居中会用相同的 `height` 和 `line-height`。

单行文本垂直居中可以用 `line-height`，但多行文本不要用固定行高硬凑。多行内容更适合用 flex/grid、`display: table-cell` 或正常布局中的对齐能力。

单行省略依赖三个条件：固定可用宽度、禁止换行、隐藏溢出并使用 `text-overflow: ellipsis`。多行省略现代浏览器通常使用 `line-clamp` 或带 `-webkit-` 前缀的兼容写法。

图片底部空隙通常来自行内替换元素参与行盒排版时的基线对齐；`inline-block` 元素之间的水平空隙来自 HTML 源码里的空白字符被排版成文本空格。解决方向不是“神秘 margin”，而是改变显示类型、对齐方式或消除空白字符。

## Demo

```css
.single-line-center {
  height: 40px;
  line-height: 40px;
}

.multi-line-center {
  min-height: 120px;
  display: flex;
  align-items: center;
}
```

```css
.one-line {
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

```css
.multi-line {
  width: 240px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

```css
.image {
  display: block;
}

.image-inline {
  vertical-align: bottom;
}
```

```html
<!-- 会产生空白字符对应的间隙 -->
<li>One</li>
<li>Two</li>

<!-- 消除源码空白，或改用 flex/grid 组织列表 -->
<li>One</li><li>Two</li>
```

## 面试回答

`line-height` 是行盒高度，影响文本行之间的距离，也常用于单行文本垂直居中。多行文本居中不要靠固定行高硬凑，优先使用 flex/grid 这类布局对齐能力。单行省略要同时设置宽度、`white-space: nowrap`、`overflow: hidden` 和 `text-overflow: ellipsis`；多行省略常用 `line-clamp` 兼容写法。图片底部空隙是行内元素基线对齐导致的，可以给图片设 `display: block` 或 `vertical-align`；`inline-block` 间隙来自源码空白字符，更推荐用 flex/grid 布局或消除空白。

## 参考来源

- [MDN: `line-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)
- [MDN: `text-overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [MDN: `line-clamp`](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp)
- [MDN: Inline formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_inline_layout/Inline_formatting_context)
