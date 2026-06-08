# Web 标准与 W3C

## 问题

如何理解 Web 标准和 W3C？如何写出符合标准的网页？怎样检测页面是否符合标准？

## 结论

Web 标准不是某一条固定规则，而是一组由标准组织、浏览器厂商和社区共同推进的规范集合。面试里提 W3C 时，可以说明它是重要的 Web 标准组织之一；同时现代 HTML 标准主要由 WHATWG 维护，浏览器实现和 MDN 文档也是校准答案的重要来源。

符合标准的网页通常具备这些特征：

- 正确的文档结构：`<!doctype html>`、`html lang`、`head`、`body`。
- 合法嵌套：元素放在符合内容模型的位置。
- 结构与表现分离：HTML 表达结构，CSS 控制样式，JS 负责行为。
- 语义清晰：标题、列表、表格、表单、链接、按钮使用合适元素。
- 可访问性基础：控件有名称，键盘可用，图片有合适替代文本。
- 渐进增强：基础内容先可用，再增强交互体验。

检测方式：

- 使用 Nu HTML Checker / W3C Validator 检查 HTML 语法和嵌套。
- 使用浏览器 DevTools 检查 DOM、可访问性树、控制台错误。
- 使用 Lighthouse 或 axe 检查性能和可访问性问题。
- 在目标浏览器和设备上做真实测试。

## Demo

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>符合基本标准的页面</title>
  </head>
  <body>
    <main>
      <h1>页面标题</h1>
      <p>主体内容。</p>
    </main>
  </body>
</html>
```

面试回答：

> Web 标准是一组关于 HTML、CSS、DOM、可访问性等的规范和实践。写标准页面不是背标签列表，而是保证文档结构正确、元素嵌套合法、结构表现行为分离、语义清晰，并用验证器、DevTools、Lighthouse、真实浏览器测试来校验。

## 参考来源

- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [W3C Markup Validation Service](https://validator.w3.org/)
- [MDN: HTML reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference)
