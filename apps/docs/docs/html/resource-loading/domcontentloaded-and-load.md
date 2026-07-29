# DOMContentLoaded 与 load 哪个先执行？

## 问题

`DOMContentLoaded` 和 `window.onload` 有什么区别？哪个先执行？

## 结论

- **执行顺序**：同一次页面加载中，`DOMContentLoaded` 先触发，`window` 的 `load` 后触发。
- **`DOMContentLoaded`**：HTML 已解析完成，`defer` 脚本和模块脚本也已下载并执行；它不等待图片、iframe 和 `async` 脚本。样式表可能因延迟脚本需要等待它而间接推迟该事件。
- **`load`**：页面及其依赖资源已经完成加载，包括样式表、脚本、普通图片和 iframe；显式懒加载的资源不在等待范围内。
- **`readyState`**：`loading` 表示 HTML 仍在解析；`interactive` 表示 HTML 已解析，但延迟脚本可能仍在执行；`complete` 表示页面依赖资源已完成加载，`load` 即将或已经触发。
- **监听时机**：事件触发后不会补发。`async` 脚本、动态导入模块或动态插入的脚本可能运行得较晚，因此注册监听器前应先检查 `document.readyState`。
- **实际选择**：DOM 初始化通常使用 `DOMContentLoaded`，而 `defer` 或模块脚本可以直接操作已经解析完成的 DOM；只有必须等待图片尺寸、iframe 等外部资源时才使用 `load`。

下面的完整页面在两个事件触发前注册监听器，并用普通图片展示 `load` 的等待范围：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>页面加载事件</title>

    <script>
      function addLog(message) {
        const item = document.createElement('li');
        item.textContent = message;
        document.querySelector('#event-log').append(item);
      }

      document.addEventListener('DOMContentLoaded', () => {
        addLog('DOMContentLoaded：DOM 已解析，可以操作页面元素');
      }, { once: true });

      window.addEventListener('load', () => {
        addLog('load：普通图片等页面依赖资源已完成加载');
      }, { once: true });
    </script>
  </head>

  <body>
    <header>
      <h1>页面加载事件</h1>
    </header>

    <main>
      <!-- 普通图片会被 load 等待；loading="lazy" 的图片通常不会。 -->
      <img
        src="/assets/product.webp"
        alt="示例商品"
        width="640"
        height="360"
      >

      <h2>事件日志</h2>
      <ol id="event-log" aria-live="polite"></ol>
    </main>
  </body>
</html>
```

初次加载时，日志顺序固定为 `DOMContentLoaded` 在前、`load` 在后。如果这段脚本改为异步或动态加载，应先读取 `readyState`：非 `loading` 只说明 DOM 已可操作，并不是浏览器重新触发了 `DOMContentLoaded`。

## 参考来源

- [MDN：DOMContentLoaded 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
- [MDN：Window load 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)
- [MDN：Document.readyState](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState)
