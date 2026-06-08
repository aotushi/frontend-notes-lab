# html、body 与表格结构

## 问题

`html` 标签有什么作用？`html, body { height: 100%; }` 和只写 `body { height: 100%; }` 有什么区别？表格固定表头应该怎么理解？

## 结论

`html` 元素是 HTML 文档的根元素，`head` 和 `body` 都是它的子元素。`head` 放元数据，`body` 放页面主体内容。虽然浏览器对缺失标签有容错能力，但实际项目应写出清晰完整的文档骨架。

<ConceptNote label="height: 100% 是相对于包含块高度计算的。" title="手工释义：height: 100% 的计算基准">

<HeightPercentDiagram />

`height: 100%` 不是“自动撑满屏幕”，而是“等于包含块的已确定高度”。这里的关键字是 <strong>已确定</strong>：浏览器要先知道父级到底有多高，才能算出子级的 100% 是多少。

如果父级高度是 `auto`，父级高度通常由内容撑开；这时子级再写 `height: 100%`，就像在问“我要等于一个还没明确算出来的高度”。所以只给 `body` 写 `height: 100%` 容易不符合预期。

全屏应用常把高度基准一层层传下来：视口决定 `html`，`html` 决定 `body`，`body` 决定 `#app`。单独写 `#app { height: 100%; }` 不够，因为它仍然要向父级 `body` 要高度；如果 `body` 没有明确高度，`#app` 的 100% 也没有稳定基准。如果只是希望页面至少撑满一屏、内容多了还能继续向下增长，优先考虑 `min-height: 100vh` 或 `min-height: 100%`。

</ConceptNote>
只给 <code>body</code> 设置 <code>height: 100%</code> 时，如果 <code>html</code> 没有明确高度，<code>body</code> 的百分比高度可能没有你预期的视口参考。因此常见全屏布局会写：

```css
html,
body {
  min-height: 100%;
}
```

如果应用根节点也需要撑满父级，要把高度基准从 `html`、`body` 一直传到 `#app`。只写 `#app { height: 100%; }` 不够：

```css
html,
body,
#app {
  height: 100%;
}
```

如果只是希望应用至少占满一屏，并且内容变多时页面可以继续向下增长，通常更直接的写法是：

```css
#app {
  min-height: 100vh;
}
```

表格结构上，`thead`、`tbody`、`tfoot` 用来表达表格区域。固定表头本质是 CSS 布局问题，常见方案是 `position: sticky`：

```css
th {
  position: sticky;
  top: 0;
  background: white;
}
```

不要为了固定表头破坏表格语义。能保留 `table`、`thead`、`tbody` 的情况下优先保留。

## Demo

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>页面骨架</title>
  </head>
  <body>
    <main>页面主体</main>
  </body>
</html>
```

面试回答：

> `html` 是文档根元素，包含 `head` 和 `body`。百分比高度依赖父级高度，想让 body 或应用根节点撑满视口，通常需要同时处理 `html`、`body` 和应用根节点。表格固定表头是 CSS 问题，但结构上仍应保留 `thead`、`tbody` 等语义。

## 参考来源

- [MDN: `<html>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html)
- [MDN: `<body>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body)
- [MDN: `<thead>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead)
