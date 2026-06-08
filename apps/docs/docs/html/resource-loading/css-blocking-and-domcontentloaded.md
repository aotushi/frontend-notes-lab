# CSS 加载会阻塞 DOM 解析、渲染和 DOMContentLoaded 吗？

## 问题

CSS 加载会阻塞 DOM 树解析吗？会阻塞页面渲染吗？会影响 `DOMContentLoaded` 的触发吗？

## 结论

外链 CSS 本身通常不会阻塞 HTML 解析器继续构建 DOM。浏览器遇到 `<link rel="stylesheet">` 后会并行下载样式表，HTML 解析仍可继续。

CSS 会阻塞渲染。浏览器需要 CSSOM 和 DOM 一起生成渲染树，所以关键样式表未加载和解析完成前，浏览器通常不会绘制依赖这些样式的页面，避免先显示无样式内容再大幅重绘。

`DOMContentLoaded` 不直接等待普通样式表加载完成，但有一个重要联动：同步脚本和 `defer` 脚本在执行前可能需要等待前面已经发现的样式表，因为脚本可能读取样式信息。`DOMContentLoaded` 又要等 `defer` 脚本执行完成，所以 CSS 可能通过阻塞脚本间接推迟 `DOMContentLoaded`。

## Demo

```html
<head>
  <link rel="stylesheet" href="/slow.css">
  <script defer src="/app.js"></script>
</head>
```

如果 `/slow.css` 加载很慢：

- DOM 解析可以继续。
- 首次渲染可能被 CSS 阻塞。
- `app.js` 是 `defer` 脚本，它会在 DOM 解析完成后执行。
- 如果 `app.js` 前面的样式表还没准备好，脚本执行可能等待样式表。
- `DOMContentLoaded` 要排在 `defer` 脚本之后，因此可能被间接推迟。

更适合面试的回答：

```text
CSS 不直接阻塞 DOM 解析，但会阻塞渲染；并且当后续脚本需要按规范等待前置样式表时，CSS 会间接影响脚本执行和 DOMContentLoaded。
```

## 参考来源

- [MDN：DOMContentLoaded 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
- [web.dev：Render blocking CSS](https://web.dev/articles/critical-rendering-path/render-blocking-css)
