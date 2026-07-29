# `href`、`src` 和 `<link>` 分别负责什么？

## 问题

`href`、`src` 和 `<link>` 有什么区别？`href=""` 或 `src=""` 会发生什么？

## 结论

首先要区分概念层级：**`href` 和 `src` 是属性，`<link>` 是元素**，三者不能直接并列为同一种东西。

| 名称 | 类型 | 常见位置 | 核心作用 |
| --- | --- | --- | --- |
| `href` | URL 属性 | `<a>`、`<area>`、`<base>`、`<link>` | 提供目标 URL；具体行为由所在元素决定 |
| `src` | URL 属性 | `<img>`、`<script>`、`<iframe>`、`<audio>`、`<video>` | 提供元素要加载、嵌入或处理的资源 URL |
| `<link>` | HTML 元素 | 通常位于 `<head>` | 通过 `rel` 声明关系类型，通过 `href` 提供目标 URL |

“`href` 只是引用，`src` 一定会加载并阻塞页面”只能作为粗略记忆，不能作为规则。是否请求资源、何时处理、是否阻塞，取决于**元素、属性以及 `rel` 等配置的组合**：

| 写法 | 浏览器如何处理 |
| --- | --- |
| `<a href="/docs">` | 创建超链接，通常在用户激活后导航 |
| `<link rel="stylesheet" href="/app.css">` | 获取并应用样式表，通常会影响页面渲染 |
| `<link rel="preload" href="/hero.jpg" as="image">` | 提前获取图片，但不会因此直接把图片显示到页面 |
| `<img src="/logo.png" alt="站点 Logo">` | 获取并显示图片 |
| `<script src="/app.js" defer></script>` | 并行获取脚本，文档解析完成后按文档顺序执行 |
| `<iframe src="/preview" title="内容预览"></iframe>` | 创建嵌套页面并导航到目标 URL |

因此，`href` 并不意味着“只建立关系而不下载”：样式表和预加载资源都使用 `href`，浏览器仍会主动获取它们。`src` 也不等于“必然阻塞”：脚本是否阻塞还要看 `defer`、`async` 和 `type="module"` 等属性。

### 空值行为必须按元素判断

不能笼统地说空 `href` 或空 `src` 都会请求当前页面：

| 写法 | 当前规范下的行为 | 推荐做法 |
| --- | --- | --- |
| `<a href="">` | 空相对 URL 会解析为当前文档地址，激活后可能重新导航当前页面 | 有真实导航目标时再写 URL；触发页面动作使用 `<button>` |
| `<link href="">` | `<link>` 的 `href` 必须是非空 URL，这种写法不符合规范 | 没有目标资源时移除整个 `<link>` |
| `<img src="">` | 图片表示为空，进入加载失败状态；不能再解释为“必然请求当前页面” | 没有图片时不渲染 `<img>`，或提供真实占位图 |
| `<script src=""></script>` | 触发 `error`，不会正常获取或执行脚本 | 没有脚本地址时移除整个 `<script>` |
| `<iframe src="">` | 使用 `about:blank` 作为空白页面 | 如果确实需要空白页，明确写 `src="about:blank"` |

下面的完整实例展示了相同 URL 属性在不同元素中的职责：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>href、src 与 link 实例</title>

    <!-- rel 说明“是什么关系”，href 提供“目标在哪里” -->
    <link rel="stylesheet" href="/styles/app.css">
    <link rel="icon" href="/favicon.svg">
    <link rel="canonical" href="https://example.com/docs">

    <!-- src 提供脚本地址；defer 决定脚本的执行时机和顺序 -->
    <script src="/scripts/app.js" defer></script>
  </head>

  <body>
    <header>
      <!-- a + href 创建导航链接 -->
      <a href="/docs">查看文档</a>

      <!-- 页面内动作使用 button，不用 href="" 占位 -->
      <button type="button">打开菜单</button>
    </header>

    <main>
      <!-- img + src 加载并显示图片 -->
      <img
        src="/images/dashboard.png"
        alt="产品数据仪表盘"
        width="1280"
        height="720"
      >

      <!-- iframe + src 嵌入另一个页面；title 提供可访问名称 -->
      <iframe
        src="/preview"
        title="文档预览"
        width="800"
        height="450"
      ></iframe>
    </main>
  </body>
</html>
```

需要继续判断脚本加载顺序时，参见 [`async`、`defer` 与模块脚本](/html/resource-loading/script-async-defer)；需要理解响应式图片候选时，参见 [`srcset` 与 `sizes`](/html/embedded-content/responsive-images-srcset)。

## 参考来源

- [WHATWG HTML：Links](https://html.spec.whatwg.org/multipage/links.html)
- [WHATWG HTML：`link` 元素](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element)
- [WHATWG HTML：`img` 元素](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)
- [WHATWG HTML：准备 `script` 元素](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element)
- [WHATWG HTML：`iframe` 元素](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)
