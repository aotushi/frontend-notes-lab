# script async / defer / module 区别

## 问题

`<script>`、`<script async>`、`<script defer>` 和 `<script type="module">` 有什么区别？为什么有时 `async` 写在前面，日志反而在 `defer` 后面打印？

## 结论

`async` 和 `defer` 主要影响外链脚本。内联普通脚本没有下载阶段，浏览器遇到就执行，不能用来验证二者差异。

无属性外链脚本会阻塞 HTML 解析：浏览器遇到脚本后会获取并执行，执行完再继续解析。`async` 外链脚本并行下载，下载完成后尽快执行，不保证标签顺序，也不等待 DOM 解析完成。`defer` 外链脚本并行下载，等 HTML 解析完成后、`DOMContentLoaded` 之前按文档顺序执行。

`type="module"` 脚本默认按延迟脚本处理：模块会延迟到文档解析后执行，也会在 `DOMContentLoaded` 之前完成。模块脚本天然使用严格模式，并支持 `import` / `export`。

如果 `async` 脚本写在前面却在 `defer` 后打印，常见原因是这个 `async` 脚本下载得更慢。`async` 的执行时间由下载完成时机决定；只要它晚于 DOM 解析和 `defer` 队列完成，就会晚于 `defer` 打印。

## Demo

这个案例故意让 `async slow` 标签写在 `async fast` 前面，但通过本地 Demo API 延迟它的响应。观察日志可以看到 `async fast` 先执行；`defer A` 响应比 `defer B` 慢，但仍然按文档顺序执行。

<DemoFrame
  src="/demos/script-async-defer/index.html"
  title="script async / defer 执行顺序验证"
  height="620"
/>

关键代码：

```html
<script src="/api/demos/script-async-defer/normal-blocking.js"></script>

<script src="/api/demos/script-async-defer/async-slow.js?delay=900" async></script>
<script src="/api/demos/script-async-defer/async-fast.js?delay=0" async></script>

<script src="/api/demos/script-async-defer/defer-a.js?delay=600" defer></script>
<script src="/api/demos/script-async-defer/defer-b.js?delay=0" defer></script>
```

典型顺序：

```text
inline head script
normal external script
inline body script
async fast
defer A
defer B
DOMContentLoaded
async slow
window load
```

不要用下面这种内联写法验证：

```html
<script async>
  console.log('async');
</script>
<script defer>
  console.log('defer');
</script>
```

这两个都是内联普通脚本，没有外链下载阶段，`async` 和 `defer` 不会产生可观察的加载差异。

## 参考来源

- [MDN：`<script>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
- [MDN：DOMContentLoaded 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
