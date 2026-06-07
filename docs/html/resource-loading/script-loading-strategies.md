# JS 延迟、异步和按需加载怎么做？

## 问题

JS 延迟加载、异步加载、动态加载和按需加载有哪些实现方式？`noscript` 有什么作用？

## 结论

优先从加载目标判断方案：

- 页面主业务脚本：优先 `<script src="..." defer>` 或 `<script type="module">`。
- 独立第三方脚本：可用 `async`，但不要依赖执行顺序。
- 用户触发后才需要的功能：用动态 `import()` 或按需插入 `<script>`。
- 需要兼容无脚本环境：用 `<noscript>` 提供提示或降级内容。

旧资料里常出现 “`defer` 只支持 IE” 或 “XHR 脚本注入” 这类说法，已经不适合作为现代最佳实践。现代面试中更应该回答 `defer`、`async`、ES module、动态 `import()` 和资源优先级。

## Demo

动态加载普通脚本：

```js
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.append(script);
  });
}

await loadScript('/vendor/chart.js');
```

按需加载模块：

```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});
```

无脚本降级：

```html
<noscript>
  当前页面的交互功能需要启用 JavaScript。
</noscript>
```

回答动态“同步加载 script”时要小心：动态插入脚本通常是异步获取资源；如果需要顺序执行，应该链式等待 `onload`，或者使用模块依赖，而不是强行阻塞主线程。

## 参考来源

- [MDN：`<script>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
- [MDN：`<noscript>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript)
- [MDN：动态 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
