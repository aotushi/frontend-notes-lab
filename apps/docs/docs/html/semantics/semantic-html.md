# HTML 语义化

## 问题

如何理解 HTML 语义化？它对可访问性、SEO、可维护性有什么作用？实际开发中应该怎么做？

## 结论

HTML 语义化就是用能表达内容含义和结构的元素来组织页面，而不是只用 `div`、`span` 加样式拼视觉效果。它的核心不是“语义标签越多越好”，而是让浏览器、辅助技术、搜索引擎和维护者都更容易判断一段内容是什么。

语义化主要解决三件事：

- 内容结构：标题、段落、列表、表格、引用、图片说明等应该用对应元素表达。
- 页面区域：`header`、`nav`、`main`、`aside`、`footer` 等地标元素帮助识别页面结构。
- 交互职责：跳转用 `a[href]`，动作用 `button`，输入用表单控件，不用无语义元素伪装。

语义化和可访问性高度相关，但不是同一个主题。语义化提供正确结构和默认语义；可访问性还要继续处理可访问名称、键盘操作、焦点管理、颜色对比、ARIA、错误提示等细节。比如 `label`、`alt`、键盘焦点属于语义化的延伸价值，但更适合放到 [HTML 可访问性基础](/html/accessibility/html-accessibility-basics) 中系统整理。

SEO 方面也要谨慎表达：语义化不是“用了 `article`、`section` 就一定提升排名”。更准确的说法是，语义化让内容结构更清晰；对搜索更有价值的是有意义的标题、可抓取的 `a[href]` 链接、图片替代文本、页面标题、结构化数据和真实高质量内容。

常见语义元素可以按用途理解：

| 类型 | 常见元素 | 使用要点 |
| --- | --- | --- |
| 页面地标 | `header`、`nav`、`main`、`aside`、`footer` | `main` 表示页面主内容，通常一个页面只有一个可见 `main`；`nav` 用于主要导航 |
| 内容分区 | `section`、`article` | `article` 表示可独立分发的内容；`section` 表示有主题的一组内容，通常应该有标题 |
| 文本结构 | `h1`-`h6`、`p`、`ul`、`ol`、`li`、`blockquote`、`figure`、`figcaption`、`time` | 标题用于表达层级，不要只为了字号使用；列表、引用、图片说明应使用对应元素 |
| 表格数据 | `table`、`caption`、`thead`、`tbody`、`th`、`td` | 表格用于二维数据，不要用表格做布局 |
| 交互控件 | `a[href]`、`button`、`form`、`input`、`select`、`textarea` | 优先使用原生控件，避免用 `div`/`span` 模拟 |

标题相关问题不要只背默认样式。`h1`-`h6` 的默认字号来自浏览器默认样式表，不是 HTML 语义本身；不同浏览器、用户样式、项目 reset/normalize 后都可能变化。面试更应该回答标题的语义作用：表达内容层级、形成可导航结构、辅助用户和工具快速理解页面。

实践原则：

- 先写出不依赖 CSS 也能读懂结构的 HTML，再用 CSS 做视觉布局。
- 用标题组织信息层级。页面主标题通常是 `h1`，后续标题按内容层级递进，不要为了视觉大小乱选标题。
- 能用原生元素就优先用原生元素。ARIA 是补充语义的工具，不会自动补齐键盘行为，也不会改变视觉和交互。
- `section` 不要滥用。如果只是为了包一层样式，`div` 更合适；如果这块内容有明确主题并适合出现在文档大纲中，才考虑 `section`。
- `article` 用于独立内容单元。比如一篇博客、一个新闻条目、一条评论、一个商品卡片。
- 链接跳转用 `a[href]`，动作触发用 `button`。
- 表格只用于表格数据；布局交给 CSS。

反例：

```html
<div class="btn" onclick="submitForm()">提交</div>
<div class="title">商品列表</div>
<div class="item" onclick="location.href='/p/1'">查看商品</div>
```

更好的写法：

```html
<section aria-labelledby="products-title">
  <h2 id="products-title">商品列表</h2>
  <article>
    <h3>机械键盘</h3>
    <a href="/p/1">查看商品</a>
  </article>
  <button type="submit">提交</button>
</section>
```

面试回答：

> HTML 语义化是用合适的 HTML 元素表达内容的结构和含义。它能让无样式页面仍然有清晰结构，让浏览器、辅助技术、搜索引擎和维护者更容易理解页面。SEO 上不要夸大成“语义标签直接提升排名”，更准确的是语义化让标题、链接、内容层级、图片说明等信号更清晰。实际开发中我会优先使用原生元素，如 `main`、`nav`、`article`、`section`、`button`、`table`，只有原生 HTML 无法表达时才补充 ARIA。

## Demo

这个案例对比两段视觉上相似的结构：一段只用 `div`，另一段使用语义化元素。下方脚本会统计可检查信号，帮助验证语义化带来的结构差异。

<DemoFrame
  src="/demos/semantic-html/index.html"
  title="HTML 语义化结构对比"
  height="820"
/>

## 参考来源

- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN: HTML content categories](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Content_categories)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [web.dev: Semantic HTML](https://web.dev/learn/html/semantic-html)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central: SEO link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
