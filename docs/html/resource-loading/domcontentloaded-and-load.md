# DOMContentLoaded 与 load 哪个先执行？

## 问题

`DOMContentLoaded` 和 `window.onload` 有什么区别？哪个先执行？

## 结论

通常 `DOMContentLoaded` 先执行，`window.load` 后执行。

`DOMContentLoaded` 表示 HTML 已经完成解析，DOM 树已经可用，并且 `defer` 脚本和模块脚本已经下载并执行完成。它不会等待图片、iframe、异步脚本等所有页面依赖资源都完成。

`window.load` 表示整个页面及其依赖资源已经加载完成，包括样式表、脚本、图片、iframe 等。因此它一般比 `DOMContentLoaded` 晚。

例外不是顺序反转，而是注册时机问题：如果脚本运行时事件已经触发，再去 `addEventListener` 就不会补发这个事件。动态加载或异步脚本中经常需要先检查 `document.readyState`。

## Demo

```js
function onDomReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
}

onDomReady(() => {
  console.log('DOM 已解析，可以查询和操作 DOM');
});

window.addEventListener('load', () => {
  console.log('页面依赖资源加载完成');
});
```

面试回答可以压缩为：`DOMContentLoaded` 关注 DOM 是否构建完成，`load` 关注页面所有依赖资源是否完成；所以一般先触发 `DOMContentLoaded`，再触发 `load`。

## 参考来源

- [MDN：DOMContentLoaded 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
- [MDN：Window load 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)
