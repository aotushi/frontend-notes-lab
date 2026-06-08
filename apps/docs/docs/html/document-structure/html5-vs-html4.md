# HTML5 与 HTML4 有什么不同？

## 问题

如何区分 HTML 和 HTML5？HTML5 新增了哪些能力？移除了哪些元素？HTML5 页面结构和 HTML4 有什么不同？

## 结论

面试里不要把 HTML5 只理解成“多了几个标签”。HTML5 更准确地代表现代 HTML 平台的一批能力：更简单的 doctype、语义化结构元素、媒体元素、增强表单、Canvas、Web Storage、History、Web Worker、WebSocket 等。

文档结构层面的重点：

- doctype 简化为 `<!doctype html>`。
- 新增或强化语义结构元素：`header`、`nav`、`main`、`article`、`section`、`aside`、`footer`。
- 媒体和图形能力：`audio`、`video`、`canvas`、`svg`。
- 表单控件增强：`email`、`url`、`date`、`search` 等输入类型。
- 本地能力和 Web API：`localStorage`、`sessionStorage`、History、Worker、WebSocket 等。

HTML5 移除了或不再推荐一批纯表现或可用性差的元素，例如 `font`、`center`、`big`、`strike`、`tt`、`frame`、`frameset`。现代页面应使用 CSS 负责表现，用语义元素负责结构。

常见被移除或不推荐作为现代答案重点的元素：

- 表现类：`font`、`center`、`big`、`strike`、`tt`。
- 框架集：`frame`、`frameset`、`noframes`。
- 旧插件能力：`applet`。
- 容易混淆或已废弃：`acronym` 等。

旧资料里常提“IE8 通过 html5shiv 支持新标签”。这是历史兼容知识，不适合作为现代面试重点。今天更重要的是：理解语义结构、渐进增强和目标浏览器兼容边界。

## Demo

HTML4 风格常见结构：

```html
<div id="header"></div>
<div id="nav"></div>
<div id="content"></div>
<div id="footer"></div>
```

HTML5 语义结构：

```html
<header>...</header>
<nav>...</nav>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

面试回答：

> HTML5 的区别包括更简单的 doctype、新的语义化结构元素、媒体和图形元素、增强表单、本地存储、History、Worker、WebSocket 等 Web API。文档结构上，HTML5 推荐用 `header`、`nav`、`main`、`article`、`section`、`footer` 表达区域，而不是全靠 `div` 和 class。纯表现元素和框架集元素已经不适合作为现代页面结构。

## 参考来源

- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN: HTML content categories](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Content_categories)
