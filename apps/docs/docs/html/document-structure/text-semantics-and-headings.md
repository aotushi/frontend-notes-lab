# title、h1、strong、em 的区别

## 问题

`title` 与 `h1` 有什么区别？`b` 与 `strong`、`i` 与 `em` 有什么区别？H 标签在页面结构中有什么作用？

## 结论

`title` 和 `h1` 都常被翻译成“标题”，但层级不同：

- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title#:~:text=defines%20the%20document%27s%20title%20that%20is%20shown%20in%20a%20browser%27s%20title%20bar%20or%20a%20page%27s%20tab" target="_blank" rel="noopener noreferrer"><code>&lt;title&gt;</code> 是文档元数据，显示在浏览器标签页、收藏夹、搜索结果标题等位置。</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements#:~:text=%3Ch1%3E%20is%20the%20highest%20section%20level%20and%20%3Ch6%3E%20is%20the%20lowest" target="_blank" rel="noopener noreferrer"><code>&lt;h1&gt;</code> 是页面正文里的一级标题，表达当前页面或当前内容区域的最高层级标题。</a>

`b` 与 `strong` 的区别：

- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/b#:~:text=draw%20the%20reader%27s%20attention%20to%20the%20element%27s%20contents%2C%20which%20are%20not%20otherwise%20granted%20special%20importance" target="_blank" rel="noopener noreferrer"><code>&lt;b&gt;</code> 表示出于展示或文本惯例需要让内容显著，但不强调重要性。</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/strong#:~:text=strong%20importance%2C%20seriousness%2C%20or%20urgency" target="_blank" rel="noopener noreferrer"><code>&lt;strong&gt;</code> 表示内容重要性、严重性或紧急性。</a>

`i` 与 `em` 的区别：

- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/i#:~:text=Alternative%20voice%20or%20mood,Technical%20terms" target="_blank" rel="noopener noreferrer"><code>&lt;i&gt;</code> 表示另一种语调、术语、外文、作品名等文本惯例。</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em#:~:text=affects%20the%20meaning%20of%20the%20sentence%20itself" target="_blank" rel="noopener noreferrer"><code>&lt;em&gt;</code> 表示重读强调，强调位置改变可能改变句子含义。</a>

<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements#:~:text=Do%20not%20use%20heading%20elements%20to%20resize%20text" target="_blank" rel="noopener noreferrer">H 标签的重点不是默认字号，而是文档结构。</a>浏览器默认样式可以被 CSS 重置，不能把“字号大”当成 H 标签的本质。<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements#:~:text=quickly%20jump%20from%20heading%20to%20heading%20in%20order%20to%20determine%20the%20content%20of%20the%20page" target="_blank" rel="noopener noreferrer">好的标题层级能帮助用户快速浏览，也能帮助辅助技术和搜索引擎理解内容层级。</a>

## Demo

```html
<head>
  <title>订单详情 - Frontend Notes Lab</title>
</head>
<body>
  <main>
    <h1>订单详情</h1>
    <p><strong>支付失败：</strong>请在 15 分钟内重新支付。</p>
    <p>这个术语来自 <i lang="en">render tree</i>。</p>
    <p>我<em>现在</em>需要处理这个问题。</p>
  </main>
</body>
```

面试回答：

> `title` 是文档级元数据，主要影响浏览器标签页和搜索展示；`h1` 是正文结构标题。`strong` 表示重要性，`b` 更多是视觉或文本惯例；`em` 表示重读强调，`i` 表示另一种语调或术语。标题元素应该按内容层级使用，而不是为了字号。

## 参考来源

- [MDN: `<title>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title)
- [MDN: Heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)
- [MDN: `<b>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/b)
- [MDN: `<strong>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/strong)
- [MDN: `<i>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/i)
- [MDN: `<em>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em)
