# link 与 script 应该放在哪里？

## 问题

为什么通常建议把 CSS 的 `<link rel="stylesheet">` 放在 `<head>` 中？普通 `<script>` 为什么过去常放在 `</body>` 前？现代页面是否还能把脚本放在 `<head>`？把 `<script>` 写在 `</body>` 后浏览器会如何处理？

## 结论

CSS 链接通常放在 `<head>` 中，因为样式会影响首屏渲染。浏览器越早发现关键样式表，就越早能下载、构建 CSSOM，并减少无样式内容闪烁和重复布局。

普通外链脚本如果没有 `async`、`defer` 或 `type="module"`，会在浏览器遇到它时获取并执行，执行完成前 HTML 解析会暂停。因此旧写法常把普通脚本放在 `</body>` 前：这样脚本执行时主体 DOM 基本已经解析完，同时不会阻塞前面的主体内容构建。

现代业务脚本更推荐写在 `<head>` 中并加 `defer`，或者使用 `<script type="module">`。这样浏览器能更早发现脚本资源，又不会阻塞 HTML 解析；脚本会等 DOM 解析完成后、`DOMContentLoaded` 前执行。需要独立、无顺序依赖、晚一点执行也不影响页面的统计或广告脚本，才考虑 `async`。

<ConceptNote
  title="为什么普通脚本会等待前面的样式表？"
  label="普通脚本还会等待前面已经解析到的阻塞样式表。"
>
<p>
如果 HTML 中先出现 <code>&lt;link rel="stylesheet"&gt;</code>，后面又出现一个没有 <code>async</code> / <code>defer</code> 的普通脚本，浏览器通常会等这个样式表加载完成后再执行脚本。原因是脚本可能马上读取样式信息，例如 <code>getComputedStyle()</code>；如果脚本先执行，结果可能和最终样式不一致。所以 CSS 不直接阻塞 DOM 解析，但会通过脚本间接拖慢解析和 <code>DOMContentLoaded</code>。
</p>
<p>
校准来源：<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event#:~:text=scripts%20which%20aren't%20deferred%20or%20async%20(e.g.%2C%20%3Cscript%3E)%20will%20wait%20for%20already-parsed%20stylesheets%20to%20load" target="_blank" rel="noreferrer">MDN 对 DOMContentLoaded 的说明</a>。
</p>
</ConceptNote>

把 `<script>` 写在 `</body>` 之后不是规范结构。HTML 解析器通常会容错，把后续脚本元素重新放回 `body` 中解析，所以很多浏览器里看起来“也能执行”。面试回答不要把这种容错行为当作最佳实践；应写在 `</body>` 前，或者使用 `defer` / `type="module"`。

资源下载顺序也不是固定的 “HTML -> CSS -> JS -> 图片”。HTML 是入口资源；浏览器边解析边发现 CSS、JS、图片、字体等子资源，再根据资源类型、发现位置、优先级、连接复用、缓存、`async` / `defer`、`preload`、`fetchpriority` 等因素调度并发下载。

## Demo

这个 demo 故意让样式表延迟 700ms、图片延迟 1100ms。先看时序泳道图，再看日志，可以验证：head 中的阻塞样式表会影响后续脚本执行；普通脚本在 body 之前执行时拿不到后面的 DOM；`defer` 在 DOM 解析后、`DOMContentLoaded` 前执行；图片不会阻塞 DOM 解析，但会推迟 `window load`。

<DemoFrame
  src="/demos/link-script-position/index.html"
  title="link 与 script 位置验证"
  height="720"
/>

关键代码：

```html
<head>
  <script>
    console.log('head inline: DOM 还没解析到 body');
  </script>

  <link rel="stylesheet" href="/api/demos/link-script-position/slow-style.css?delay=700">

  <script>
    console.log('这条脚本会等待前面的 stylesheet 完成后执行');
  </script>

  <script src="/api/demos/link-script-position/blocking.js"></script>
  <script src="/api/demos/link-script-position/defer.js" defer></script>
</head>
<body>
  <main id="target">...</main>
  <img src="/api/demos/link-script-position/slow-image.svg?delay=1100">
  <script>
    console.log('body end: DOM 已经解析到 target');
  </script>
</body>
<script>
  console.log('body 后脚本会被浏览器容错处理，但不应这样写');
</script>
```

判断规则可以简化为：

- 样式会影响渲染：放在 `<head>`，尽早加载。
- 普通同步脚本会阻塞解析：旧写法放到 body 末尾；现代写法优先改成 `defer` 或模块脚本。
- 有顺序依赖、需要 DOM 的业务脚本：优先 `<script src="..." defer>` 或 `<script type="module">`。
- 独立第三方脚本：可以用 `async`，但不能依赖执行顺序，也不能假设一定在 `DOMContentLoaded` 前后。
- 写在 `</body>` 后：可能被浏览器容错执行，但不是规范结构。
- 资源下载顺序：看发现时机和优先级，不要背固定线性顺序。

面试回答：

> CSS 影响渲染，所以关键 stylesheet 应放在 head 里尽早发现。普通 script 默认会阻塞 HTML 解析，旧写法放 body 末尾是为了让主体 DOM 先解析出来；现代页面更推荐把业务脚本放 head 并加 defer，或者使用 module。script 写在 body 后面属于浏览器容错，不是规范写法。资源下载也不是固定顺序，而是浏览器根据发现顺序、资源类型和优先级并发调度。

## 参考来源

- [MDN：`<script>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)
- [MDN：DOMContentLoaded 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
- [MDN：`<link>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link)
- [MDN：`rel=preload`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload)
- [web.dev：Fetch Priority 与资源优先级](https://web.dev/articles/fetch-priority#resource_priority)
