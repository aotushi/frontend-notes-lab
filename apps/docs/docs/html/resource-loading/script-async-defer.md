# script async / defer / module 区别

## 问题

`<script>`、`<script async>`、`<script defer>` 和 `<script type="module">` 有什么区别？`script` 放在 `head` 里怎么避免加载阻塞？为什么有时 `async` 写在前面，日志反而在 `defer` 后面打印？

## 结论

- **普通经典脚本**：没有 `async`、`defer` 或 `type="module"` 时，浏览器获取并立即执行脚本，完成后才继续解析 HTML。
- **`async` 经典脚本**：与 HTML 解析并行下载，下载完成后尽快执行，执行时仍可能暂停 HTML 解析。多个 `async` 脚本不保证标签顺序，`DOMContentLoaded` 也不会等待它们。
- **`defer` 经典脚本**：与 HTML 解析并行下载，等文档解析完成后、`DOMContentLoaded` 前按标签顺序执行。`defer` 只对带 `src` 的经典脚本有效。
- **模块脚本**：`type="module"` 默认延迟执行，并会获取它依赖的其它模块，不需要再写 `defer`；添加 `async` 后则改为模块及其依赖准备好就执行。
- **内联经典脚本**：没有下载阶段，`async` 和 `defer` 对它都不起作用。`async` 与 `defer` 同时用于外链经典脚本时，按 `async` 处理。
- **执行先后**：`defer` 保证标签顺序，`async` 只看何时准备完成。因此，写在前面的 `async` 脚本完全可能晚于 `defer` 脚本执行。
- **实际选择**：模块项目使用 `type="module"`；需要保持顺序的经典业务脚本使用 `defer`；统计等无依赖脚本才使用 `async`。

下面的完整页面采用经典脚本作为主方案，同时在注释中给出模块脚本和普通同步脚本的替代位置：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>商品列表</title>

    <link rel="stylesheet" href="/assets/main.css">

    <!--
      方案 A：经典业务脚本。
      两个文件并行下载，但执行顺序始终是 vendor.js → app.js。
      app.js 可以安全访问完整 DOM，也会等 vendor.js 先执行。
    -->
    <script src="/assets/vendor.js" defer></script>
    <script src="/assets/app.js" defer></script>

    <!--
      方案 B：模块项目使用这一行替代方案 A。
      模块脚本默认延迟执行，不需要再添加 defer。
    -->
    <!-- <script type="module" src="/assets/main.js"></script> -->

    <!--
      独立第三方脚本才使用 async。
      它可能早于或晚于方案 A / B 执行，业务代码不能依赖它的顺序。
    -->
    <script src="https://analytics.example.com/analytics.js" async></script>
  </head>

  <body>
    <header>
      <h1>商品列表</h1>
    </header>

    <main id="app">
      <p>商品数据加载中……</p>
    </main>

    <!--
      如果某个经典脚本必须同步执行，又不能改成 defer 或模块脚本，
      可以放在 body 末尾；浏览器解析到这里时仍会暂停并执行它。
    -->
    <!-- <script src="/assets/legacy.js"></script> -->
  </body>
</html>
```

这份代码中，`vendor.js` 一定先于 `app.js` 执行；`analytics.js` 与业务脚本之间没有固定先后。方案 A 和方案 B 是二选一关系，不应同时加载同一份业务逻辑。

## 参考来源

- [MDN：`<script>` 的 `async` 与 `defer`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#async_and_defer)
- [MDN：DOMContentLoaded 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
- [WHATWG HTML：脚本的加载与执行模式](https://html.spec.whatwg.org/dev/scripting.html#the-script-element)
