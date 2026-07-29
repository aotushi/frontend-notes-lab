# HTML 语义化

## 问题

如何理解 HTML 语义化？它对可访问性、SEO、可维护性有什么作用？实际开发中应该怎么做？

## 结论

HTML 语义化就是用能表达内容含义和结构的元素来组织页面，而不是只用 `div`、`span` 加样式拼视觉效果。它的核心不是“语义标签越多越好”，而是让浏览器、辅助技术、搜索引擎和维护者都更容易判断一段内容是什么。

可以沿着这条路径理解它：

1. HTML 元素声明内容的职责，例如“这是主内容”“这是导航”“这是按钮”。
2. 浏览器把这些元素解析进 DOM，并通过可访问性 API 暴露相应的角色、名称、状态和默认行为。
3. 辅助技术、搜索引擎和开发工具再利用这些结构化信息理解页面；CSS 只负责改变呈现，不改变元素原本的职责。

HTML 语义主要从三个层次表达信息：

- **内容语义**：用标题、段落、列表、表格、引用、图片与说明等元素，表达内容是什么以及内容之间的关系。
- **页面结构**：用 `header`、`nav`、`main`、`aside`、`footer`、`search` 等元素，表达内容位于页面的哪个区域、承担什么整体职责。
- **交互语义**：用 `a[href]`、`button` 和表单控件表达跳转、操作与输入，让浏览器提供对应的默认行为。

语义化和可访问性高度相关，但不是同一个主题。语义化提供正确结构和默认语义；可访问性还要继续处理可访问名称、键盘操作、焦点管理、颜色对比、ARIA、错误提示等细节。比如 `label`、`alt`、键盘焦点属于语义化的延伸价值，但更适合放到 [HTML 可访问性基础](/html/accessibility/html-accessibility-basics) 中系统整理。

SEO 方面也要谨慎表达：语义化不是“用了 `article`、`section` 就一定提升排名”。更准确的说法是，语义化让内容结构更清晰；对搜索更有价值的是有意义的标题、可抓取的 `a[href]` 链接、图片替代文本、页面标题、结构化数据和真实高质量内容。

常见语义元素可以按用途理解：

| 类型       | 常见元素                                                        | 使用要点                                                                                                                                   |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 页面结构   | `header`、`nav`、`main`、`aside`、`footer`、`search`            | 一个文档只能有一个未隐藏的 `main`；`header`、`footer` 是否成为页面级地标取决于所在上下文；多个导航应使用不同名称区分                         |
| 内容分区   | `article`、`section`                                            | `article` 表示可独立分发或复用的内容；`section` 表示有主题的一组内容，通常应有标题，仅为样式包裹时使用 `div`                                |
| 文本结构   | `h1`-`h6`、`p`、`ul`、`ol`、`li`、`blockquote`、`cite`、`time` | 标题显式表达内容层级；列表、引用、出处和时间使用对应元素，不依赖默认样式判断语义                                                           |
| 媒体与数据 | `figure`、`figcaption`、`img`、`table`、`caption`、`th`、`td`   | 图注与媒体组成完整单元；表格只表达二维数据，并用标题、表头和 `scope` 建立关系                                                              |
| 交互控件   | `a[href]`、`button`、`form`、`label`、`input`、`select`         | 跳转使用链接，动作使用按钮，提交按钮放在关联表单中；优先使用自带语义、键盘行为和状态的原生控件                                             |

实践原则：

- 先写出不依赖 CSS 也能读懂结构的 HTML，再用 CSS 做视觉布局。
- 用标题组织信息层级。页面主标题通常是 `h1`，后续标题按内容层级递进；`section`、`article` 不会替你自动计算标题级别，也不要为了视觉大小乱选标题。
- 一个文档只保留一个未隐藏的 `main`，只放当前页面独有的主要内容。
- 多个 `nav`、`aside` 或其他同类地标应提供能区分用途的可访问名称。
- 能用原生元素就优先用原生元素。ARIA 是补充语义的工具，不会自动补齐键盘行为，也不会改变视觉和交互。
- `section` 不要滥用。如果只是为了包一层样式，`div` 更合适；如果这块内容有明确主题并适合出现在文档大纲中，才考虑 `section`。
- `article` 用于独立内容单元。比如一篇博客、一个新闻条目、一条评论、一个商品卡片。
- 链接跳转用 `a[href]`，动作触发用 `button`。
- 表格只用于表格数据；布局交给 CSS。

## HTML 语义化实例

下面是一篇公开文章页的完整 HTML。注释按照页面级结构、主要内容、文章内部结构和辅助内容说明每个元素的职责；真实项目可以按内容删减，不需要为了“显得语义化”使用所有元素。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <!-- 文档元数据不参与正文结构，但完整页面仍需声明编码、视口、标题和摘要 -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HTML 语义化实践 | Frontend Notes Lab</title>
    <meta name="description" content="用一篇完整文章页理解 HTML 语义化结构。">
    <link rel="stylesheet" href="/assets/article.css">
  </head>

  <body>
    <!-- 跳过重复导航，键盘用户可以直接到达主要内容 -->
    <a class="skip-link" href="#main-content">跳到主要内容</a>

    <!--
      页面级 header：介绍整个站点，不是单纯的视觉顶栏。
      它不在 article、section、main 等分区元素内，因此可表示页面的 banner 地标。
    -->
    <header>
      <!-- 可见文字已经能说明链接目的，不需要重复添加 aria-label -->
      <a href="/">Frontend Notes Lab</a>

      <!-- nav 只包主要导航，不必包页面上的每一组链接 -->
      <nav aria-label="主导航">
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="/html/">HTML</a></li>
          <li><a href="/css/">CSS</a></li>
        </ul>
      </nav>

      <!-- search 表示搜索或筛选区域；真正提交数据的仍然是内部 form -->
      <search>
        <form action="/search" method="get">
          <label for="site-search">站内搜索</label>
          <input id="site-search" name="q" type="search">
          <!-- 提交动作使用原生 button，并放在它要提交的表单中 -->
          <button type="submit">搜索</button>
        </form>
      </search>
    </header>

    <!--
      div 没有额外语义，这里只负责页面的主栏/侧栏布局，因此使用 div 合理。
      不要为了消灭 div，把纯布局容器全部替换成 section。
    -->
    <div class="page-layout">
      <!-- 一个文档只保留一个未隐藏的 main，表示当前页面独有的主要内容 -->
      <main id="main-content">
        <!-- article 是可以脱离当前页面独立阅读或分发的完整内容 -->
        <article aria-labelledby="article-title">
          <!--
            article 内的 header 只介绍这篇文章，不是页面级 banner。
            同一个页面可以有页面 header，也可以有文章或分区自己的 header。
          -->
          <header>
            <h1 id="article-title">如何正确使用 HTML 语义元素</h1>
            <p>
              作者：Frontend Notes Lab
              <!-- datetime 提供机器可读时间，元素正文提供用户可读文本 -->
              <time datetime="2026-07-28">2026 年 7 月 28 日</time>
            </p>
          </header>

          <p>
            HTML 语义化先确定内容职责，再选择对应元素。
            <strong>原生语义优先</strong>，只有原生 HTML 无法表达时才补充 ARIA。
          </p>

          <!-- section 表示文章中的一个明确主题；标题级别由内容层级显式决定 -->
          <section>
            <h2>语义化带来的信息</h2>
            <p>浏览器和其他工具可以从元素中获得结构、角色和默认行为。</p>
            <ul>
              <li>标题和列表帮助理解内容层级。</li>
              <li>导航和主要内容形成可跳转的页面区域。</li>
              <li>链接、按钮和表单控件提供对应的默认交互。</li>
            </ul>
          </section>

          <section>
            <h2>图片与说明</h2>
            <!-- figure 把媒体与 figcaption 组成可整体引用或移动的内容单元 -->
            <figure>
              <img
                src="/images/semantic-html-structure.png"
                alt="页面由站点页眉、主内容、相关文章和站点页脚组成"
                width="960"
                height="540"
              >
              <figcaption>一篇文章页的语义结构示意图。</figcaption>
            </figure>
          </section>

          <section>
            <h2>表格数据</h2>
            <!-- table 只表达二维数据；caption 描述表格主题，th 表示表头 -->
            <table>
              <caption>
                常见元素与职责
              </caption>
              <thead>
                <tr>
                  <th scope="col">内容职责</th>
                  <th scope="col">推荐元素</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">页面主要内容</th>
                  <td><code>main</code></td>
                </tr>
                <tr>
                  <th scope="row">独立文章</th>
                  <td><code>article</code></td>
                </tr>
                <tr>
                  <th scope="row">触发动作</th>
                  <td><code>button</code></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>引用与补充信息</h2>
            <!-- blockquote 表示块级引用；cite 标记作品或资料名称 -->
            <blockquote>
              <p>先确定内容是什么，再决定使用哪个 HTML 元素。</p>
            </blockquote>
            <p>—— <cite>Frontend Notes Lab 编辑规范</cite></p>

            <!-- details/summary 提供浏览器原生的展开与收起行为 -->
            <details>
              <summary>为什么不全部使用 div？</summary>
              <p>div 适合没有更具体含义的布局或脚本容器，但不能表达标题、导航、按钮等职责。</p>
            </details>
          </section>

          <!-- article 内的 footer 只属于文章，不是页面级 contentinfo 地标 -->
          <footer>
            <p>文章标签：</p>
            <ul>
              <li><a href="/tags/html">HTML</a></li>
              <li><a href="/tags/accessibility">可访问性</a></li>
            </ul>

            <!-- address 只放与当前文章作者或维护者相关的联系信息 -->
            <address>
              内容反馈：<a href="mailto:editor@example.com">editor@example.com</a>
            </address>
          </footer>
        </article>
      </main>

      <!--
        aside 是与主要内容相关、但可以独立存在的辅助内容。
        aria-labelledby 使用可见标题为它提供名称。
      -->
      <aside aria-labelledby="related-title">
        <h2 id="related-title">相关阅读</h2>
        <ul>
          <li><a href="/html/accessibility/html-accessibility-basics">HTML 可访问性基础</a></li>
          <li><a href="/html/document-structure/text-semantics-and-headings">标题与文本语义</a></li>
        </ul>
      </aside>
    </div>

    <!-- 页面级 footer 属于整个页面，可表示 contentinfo 地标 -->
    <footer>
      <!-- 页面已经有主导航，所以这里用不同名称区分页脚导航 -->
      <nav aria-label="页脚导航">
        <a href="/about">关于本站</a>
        <a href="/privacy">隐私说明</a>
      </nav>
      <p><small>© 2026 Frontend Notes Lab</small></p>
    </footer>
  </body>
</html>
```

完整实例不等于元素越多越好。内容没有独立主题时不需要 `section`，不是独立作品时不需要 `article`，纯布局容器继续使用 `div`；判断标准始终是元素能否准确表达内容职责。

## 参考来源

- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN: HTML content categories](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Content_categories)
- [MDN: Heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)
- [MDN: `<search>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [web.dev: Semantic HTML](https://web.dev/learn/html/semantic-html)
- [WHATWG HTML: Sections](https://html.spec.whatwg.org/multipage/sections.html)
- [W3C WAI: Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central: SEO link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
