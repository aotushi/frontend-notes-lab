# HTML 语义化

## 问题

什么是 HTML 语义化？它主要解决哪些问题？对可访问性、SEO 和可维护性有什么作用？实际开发中应该如何选择元素？

## 结论

HTML 语义化是用合适的 HTML 元素表达内容的含义、页面的组成和交互的职责，而不是只用 `div`、`span` 配合样式还原视觉效果。

它的核心不是“语义元素越多越好”，而是让浏览器、辅助技术、搜索引擎和维护者不依赖 CSS 也能判断：**这段内容是什么、它属于页面哪一部分、用户可以对它做什么。**

语义化主要解决三件事：

- **内容类型**：标题、段落、列表、表格、引用、代码、时间、图片说明等使用对应元素表达。
- **页面结构**：用 `header`、`nav`、`main`、`article`、`section`、`aside`、`footer` 说明不同区域之间的关系。
- **交互职责**：跳转使用 `a[href]`，执行动作使用 `button`，输入数据使用原生表单控件。

### 语义化带来什么？

| 作用对象 | 具体价值 | 边界 |
| --- | --- | --- |
| 浏览器与辅助技术 | 暴露标题、列表、表格、地标、链接和控件等结构与角色 | 正确元素只是基础，还要处理名称、键盘、焦点和状态等可访问性细节 |
| 搜索引擎 | 更容易识别标题层级、正文、链接、图片说明和内容关系 | 不能把使用 `article`、`section` 简化成“直接提高排名” |
| 开发与维护 | 源码能够表达意图，减少依赖类名猜测结构 | `div`、`span` 并非错误；没有更合适语义时就应该使用它们 |
| 浏览器默认能力 | 原生链接、按钮、表单、列表等自带一部分行为和键盘支持 | ARIA 只能补充语义，不会自动补齐行为和视觉效果 |

语义化和可访问性高度相关，但不是同一个主题。语义化提供正确的内容结构、元素角色和默认行为；可访问性还要继续处理可访问名称、替代文本、表单关联、键盘操作、焦点管理、颜色对比和错误提示。相关完整实践见 [HTML 可访问性基础](/html/accessibility/html-accessibility-basics)。

SEO 也应谨慎表达。语义化能够让内容关系更清楚，但搜索结果更依赖可抓取的 `a[href]`、准确的页面标题与标题层级、图片替代文本、结构化数据和真实高质量内容，而不是语义元素的数量。

### 常见元素如何分类？

| 类型 | 常见元素 | 选择规则 |
| --- | --- | --- |
| 页面与内容分区 | `header`、`nav`、`main`、`article`、`section`、`aside`、`footer`、`search` | 先判断区域承担什么职责，再判断它属于整个页面还是某个内容单元 |
| 标题与文本 | `h1`–`h6`、`p`、`strong`、`em`、`blockquote`、`code`、`pre`、`time` | 根据内容含义选择，不根据默认字号、粗体或缩进效果选择 |
| 内容集合 | `ul`、`ol`、`li`、`dl`、`dt`、`dd` | 无顺序集合用 `ul`，有顺序步骤用 `ol`，术语与说明用 `dl` |
| 图片与说明 | `figure`、`figcaption`、`img` | 可以独立引用的图片、图表或代码与其说明组成 `figure` |
| 表格数据 | `table`、`caption`、`thead`、`tbody`、`th`、`td` | 只用于二维表格数据，不用于页面布局；表头用 `th` 表明关系 |
| 原生交互 | `a[href]`、`button`、`details`、`summary`、`form`、`input`、`select`、`textarea` | 优先复用原生语义和行为，不用 `div`、`span` 模拟控件 |
| 通用容器 | `div`、`span` | 没有合适语义元素，或只需要布局、样式、脚本挂载点时使用 |

### 元素选择顺序

选择元素时可以按下面的顺序判断：

1. **是否已经有职责准确的原生元素？** 例如导航用 `nav`，按钮用 `button`，表格数据用 `table`。
2. **内容是否能独立存在或复用？** 可以独立分发的文章、评论、论坛帖子、商品卡片等可以使用 `article`。
3. **是否是有明确主题、但没有更具体元素的内容分区？** 通常有标题时可以使用 `section`。
4. **是否只是为了布局、样式或脚本分组？** 使用 `div` 或 `span`，不要为了“看起来语义化”强行套 `section`。
5. **原生 HTML 是否真的无法表达？** 只有这时才考虑补充 ARIA，并同时实现所需的键盘与状态行为。

### 容易混淆的边界

#### `main` 不是普通内容容器

`main` 表示当前文档的主内容。一个文档不能同时存在多个未设置 `hidden` 的 `main`；站点导航、版权信息、公共侧栏等在多页之间重复出现的内容通常不属于 `main`。

#### `header` 和 `footer` 取决于所在位置

直接服务于整个页面的 `header`、`footer` 通常分别形成页面级 `banner`、`contentinfo` 地标；放进 `article`、`section` 等内容分区后，它们只表示该内容单元的头部和尾部，不再是页面级地标。因此，一个页面可以合理地拥有多个 `header` 和 `footer`。

#### `section` 不是更高级的 `div`

`section` 表示没有更具体元素可用的独立主题分区，在文档型内容中通常应该有标题。但这不是简单的语法强制规则，少数应用工具栏等场景可以没有可见标题。

普通 `section` 不会因为内部存在标题就自动成为 `region` 地标；只有获得可访问名称时才会暴露为 `region`。不要给每个 `section` 机械添加 `aria-label` 或 `aria-labelledby`，过多地标同样会增加导航噪声。

#### `article` 的判断标准是“能否独立存在”

一篇文章、一条评论、一个论坛帖子或一个能够独立复用的商品卡片都可以是 `article`。普通布局卡片如果离开当前页面就失去完整含义，继续使用 `div` 往往更准确。

#### 标题层级不能依赖默认样式

`h1`–`h6` 表达内容层级，字号由 CSS 决定。页面通常保留一个清晰的主 `h1`，子主题依次使用 `h2`、`h3`，不要为了文字大小跳过层级，也不要假设进入 `section` 后标题级别会自动重置。

#### 链接和按钮按结果区分

- 点击后前往另一个 URL 或页面位置：使用 `<a href="...">`。
- 点击后提交表单、打开弹层、切换状态或执行命令：使用 `<button>`。
- 没有 `href` 的 `a` 不具备正常链接语义；带 `tabindex` 和点击事件的 `div` 也不会自动获得按钮的键盘与状态行为。

### 常见反例

```html
<!-- 只描述样式，没有表达标题、链接和按钮的职责。 -->
<div class="title">商品列表</div>
<div class="item" onclick="location.href='/products/keyboard'">查看商品</div>
<div class="button" tabindex="0" onclick="addToCart()">加入购物车</div>
```

```html
<!-- 标题、跳转和动作分别使用对应的原生元素。 -->
<section>
  <h2>商品列表</h2>

  <article>
    <h3>机械键盘</h3>
    <a href="/products/keyboard">查看商品</a>
    <button type="button">加入购物车</button>
  </article>
</section>
```

### 完整语义 HTML 实例

下面是一份完整页面源码。注释重点说明每个元素为什么存在，而不是把所有语义元素机械堆进同一个页面。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- title 描述整个文档，显示在浏览器标签页和搜索结果标题等位置。 -->
    <title>HTML 语义化指南 - Frontend Notes</title>

    <meta
      name="description"
      content="通过完整页面理解 HTML 内容类型、页面结构和交互职责。"
    />
  </head>

  <body>
    <!--
      跳过链接让键盘用户可以绕过每页重复出现的导航。
      它是普通的页内链接，所以使用 a[href]。
    -->
    <a href="#main-content">跳到主要内容</a>

    <!-- body 下的页面级 header 表示整个站点或页面的介绍区域。 -->
    <header>
      <!-- 站点名称会返回首页，因此使用链接，而不是额外制造一个 h1。 -->
      <a href="/">Frontend Notes</a>

      <!-- 页面存在多个 nav 时，用可访问名称区分它们。 -->
      <nav aria-label="主导航">
        <!-- 一组同级导航链接属于无序列表。 -->
        <ul>
          <li><a href="/html/">HTML</a></li>
          <li><a href="/css/">CSS</a></li>
          <li><a href="/javascript/">JavaScript</a></li>
        </ul>
      </nav>

      <!-- search 表示搜索或筛选区域；提交搜索是一个动作，所以使用 button。 -->
      <search>
        <form action="/search" method="get">
          <label for="site-search">搜索文章</label>
          <input id="site-search" name="q" type="search" />
          <button type="submit">搜索</button>
        </form>
      </search>
    </header>

    <!-- 一个文档只能同时显示一个主内容 main。 -->
    <main id="main-content">
      <!-- article 包住可以独立阅读、分享或分发的完整文章。 -->
      <article>
        <!-- article 内的 header 只属于这篇文章，不是页面级 banner。 -->
        <header>
          <!-- 当前文档的主标题。 -->
          <h1>HTML 语义化指南</h1>

          <p>
            作者：<a rel="author" href="/authors/lin">林远</a>

            <!-- datetime 提供机器可读时间，文本提供用户可读时间。 -->
            <time datetime="2026-07-31">2026 年 7 月 31 日</time>
          </p>
        </header>

        <p>
          HTML 不只负责显示内容，还要说明内容之间的关系。
          <strong>正确元素应先表达含义，再由 CSS 决定外观。</strong>
        </p>

        <!-- figure 将可以独立引用的图片和说明组织在一起。 -->
        <figure>
          <img
            src="/images/semantic-page-structure.png"
            alt="页面由页眉、导航、主要内容、补充内容和页脚组成"
            width="960"
            height="540"
          />
          <figcaption>语义元素描述的是职责，不是页面必须采用的视觉位置。</figcaption>
        </figure>

        <!-- 有明确主题的内容分区使用 section，并通过 h2 表达标题层级。 -->
        <section>
          <h2>为什么使用语义元素？</h2>

          <p>正确结构可以帮助不同使用者理解页面：</p>

          <ul>
            <li>浏览器和辅助技术可以识别标题、地标和控件。</li>
            <li>搜索引擎可以理解标题、链接和正文之间的关系。</li>
            <li>维护者可以直接从源码判断区域职责。</li>
          </ul>

          <!-- blockquote 表示来自其他来源的块级引用。 -->
          <blockquote cite="https://html.spec.whatwg.org/">
            <p>元素的选择应该依据含义，而不是默认样式。</p>
          </blockquote>
        </section>

        <section>
          <h2>元素选择检查表</h2>

          <!-- table 用于行列之间具有明确关系的二维数据。 -->
          <table>
            <caption>常见需求与元素选择</caption>
            <thead>
              <tr>
                <!-- scope 明确表头负责的方向。 -->
                <th scope="col">需求</th>
                <th scope="col">优先元素</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">跳转到文章</th>
                <td><code>&lt;a href&gt;</code></td>
              </tr>
              <tr>
                <th scope="row">提交表单</th>
                <td><code>&lt;button type="submit"&gt;</code></td>
              </tr>
              <tr>
                <th scope="row">只有样式分组</th>
                <td><code>&lt;div&gt;</code></td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- details / summary 提供浏览器原生的展开与收起行为。 -->
        <details>
          <summary>什么时候可以使用 div？</summary>
          <p>没有更准确的语义元素，或者只需要布局、样式和脚本挂载点时。</p>
        </details>

        <!-- article 内的 footer 只描述文章尾部，不是页面级 contentinfo。 -->
        <footer>
          <p>
            标签：
            <a href="/tags/html">HTML</a>
            <a href="/tags/accessibility">可访问性</a>
          </p>
        </footer>
      </article>

      <!--
        aside 表示与主文章间接相关的补充内容。
        aria-labelledby 为这个 complementary 地标提供可区分的名称。
      -->
      <aside aria-labelledby="related-title">
        <h2 id="related-title">相关阅读</h2>
        <ul>
          <li><a href="/html/accessibility/html-accessibility-basics">HTML 可访问性基础</a></li>
          <li><a href="/html/document-structure/text-semantics-and-headings">标题与文本语义</a></li>
        </ul>
      </aside>
    </main>

    <!-- body 下的页面级 footer 表示整个文档的尾部信息。 -->
    <footer>
      <nav aria-label="页脚导航">
        <a href="/about">关于本站</a>
        <a href="/privacy">隐私说明</a>
      </nav>

      <!-- address 只用于与当前页面或文章有关的联系信息。 -->
      <address>
        联系我们：<a href="mailto:hello@example.com">hello@example.com</a>
      </address>

      <p><small>© 2026 Frontend Notes</small></p>
    </footer>
  </body>
</html>
```

## 参考来源

- [WHATWG HTML：文档分区与标题](https://html.spec.whatwg.org/multipage/sections.html)
- [MDN：HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [MDN：`main`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main)
- [MDN：`section`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section)
- [MDN：`header`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header)
- [MDN：`footer`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer)
- [MDN：`h1`–`h6`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)
- [MDN：ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [web.dev：Semantic HTML](https://web.dev/learn/html/semantic-html)
- [Google Search Central：SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central：Links crawlable](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
