# DOCTYPE 与渲染模式

## 问题

`DOCTYPE` 有什么作用？为什么 HTML5 只需要写 `<!doctype html>`？标准模式、怪异模式有什么区别？

## 结论

`DOCTYPE` 是文档类型声明，必须出现在 HTML 文档最前面。现代 HTML 中写：

```html
<!doctype html>
```

它的核心作用不是“引入某个库”，而是告诉浏览器用标准模式解析和渲染页面，避免进入兼容旧网页的怪异模式。

浏览器常见渲染模式可以简化为：

| 模式 | `document.compatMode` | 含义 |
| --- | --- | --- |
| 标准模式 | `CSS1Compat` | 尽量按现代 HTML/CSS 标准渲染 |
| 怪异模式 | `BackCompat` | 模拟旧浏览器行为，兼容历史页面 |

怪异模式会影响布局和 CSS 解释，典型差异包括盒模型计算、表格/图片布局、根元素和 body 高度行为等。面试中不需要背所有差异，重点是知道：缺少或错误的 `DOCTYPE` 会让页面进入怪异模式，导致同一套 CSS 在不同模式下表现不一致。

HTML5 只需要 `<!doctype html>`，是因为现代 HTML 不再要求通过复杂 DTD URL 来声明具体文档类型。旧式 HTML4/XHTML doctype 很长，主要是历史包袱；今天写新页面直接使用 HTML5 doctype。

如果不写 `<!doctype html>`，页面不一定完全不能工作，但浏览器可能进入怪异模式。实际项目中应始终写在第一行。

## Demo

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>标准模式</title>
  </head>
  <body>
    <script>
      console.log(document.compatMode); // CSS1Compat
    </script>
  </body>
</html>
```

去掉第一行后再观察：

```js
console.log(document.compatMode); // 很可能是 BackCompat
```

面试回答：

> `DOCTYPE` 用来触发浏览器的标准模式。现代页面应写 `<!doctype html>`，并放在文档第一行。没有 doctype 或 doctype 错误时，浏览器可能进入怪异模式，用兼容旧网页的方式解释 CSS 和布局，导致盒模型、根元素高度等表现和标准模式不同。HTML5 的 doctype 很短，因为它不再需要引用 HTML4 那种 DTD。

## 参考来源

- [MDN: Understanding quirks and standards modes](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode)
- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
