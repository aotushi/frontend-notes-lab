# 打印、字体与布局兼容

## 问题

打印分页、字体渲染、字体图标小方块、页面缩放不乱、float、进度条和 CSS 兼容性问题怎么回答？

## 结论

CSS 兼容题应分成打印、字体、布局、旧浏览器四类。

打印样式使用 `@media print` 和分页属性：

```css
@media print {
  .page-break {
    break-before: page;
  }

  .no-print {
    display: none;
  }
}
```

字体图标显示小方块，常见原因：

- 字体文件路径错误或跨域失败。
- `font-family` 没有正确应用。
- Unicode 码点不匹配。
- 字体文件未加载完成。
- CSP 或 MIME 类型阻止字体加载。

浮动元素会脱离普通文档流，但仍影响文本环绕；需要清除浮动或用现代 flex/grid 替代布局。

页面缩放后布局不乱，核心是避免写死过多绝对像素，使用响应式容器、弹性布局、合理换行和最小宽度策略。

## Demo

纯 HTML 进度条优先用原生元素：

```html
<progress value="65" max="100">65%</progress>
```

面试回答：

> CSS 兼容题要按场景回答。打印用 `@media print` 和分页属性；字体图标小方块多半是字体文件、码点、跨域、MIME 或 CSP 问题；float 会脱离普通流但产生文字环绕；现代布局优先 flex/grid，旧兼容题只在目标浏览器要求时讨论。

## 参考来源

- [MDN: Printing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing)
- [MDN: `break-before`](https://developer.mozilla.org/en-US/docs/Web/CSS/break-before)
- [MDN: `@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
