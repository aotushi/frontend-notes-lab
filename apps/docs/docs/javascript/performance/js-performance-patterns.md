# JavaScript 性能模式

## 问题

如何编写高性能 JavaScript？循环、对象、数组、DOM 查询、JSON 序列化和缓存机制应该怎么回答？

## 结论

现代 JavaScript 性能优化优先级是：先减少不必要工作，再降低主线程阻塞，最后才微调语法。不要把“某种循环一定最快”“JSON.stringify 一定比遍历快”当成固定结论，真实结果取决于数据结构、引擎和场景。

常见原则：

- 缓存重复查询结果，例如 DOM 节点、正则、配置对象。
- 避免在热路径创建大量临时对象和闭包。
- 组件卸载、页面销毁或功能关闭时，清理不再需要的定时器、订阅、全局事件监听和长生命周期引用。
- 大任务拆分到多个帧，或放到 Web Worker。
- 用 `Set`/`Map` 处理去重和索引，不要在大数组里反复线性查找。
- 避免 `eval`、字符串形式 `setTimeout`。
- DOM 操作和布局读取要分批，减少同步回流。
- 性能问题先用 Performance 面板、Profiler 和基准测试确认。

## Demo

数组去重：

```js
const unique = [...new Set(list)];
```

选择器查询可以按场景封装，但不需要为了“兼容旧浏览器”牺牲现代代码：

```js
function query(selector, root = document) {
  return root.querySelectorAll(selector);
}
```

长循环分片：

```js
async function processInChunks(items, handle) {
  const chunkSize = 500;

  for (let i = 0; i < items.length; i += chunkSize) {
    items.slice(i, i + chunkSize).forEach(handle);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
```

节流适合滚动、resize、mousemove 等高频事件：

```js
function throttle(fn, wait) {
  let last = 0;
  let timer;

  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - last);

    if (remaining <= 0) {
      clearTimeout(timer);
      timer = undefined;
      last = now;
      fn.apply(this, args);
      return;
    }

    if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = undefined;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

常见内存泄漏来源：

- 全局变量或缓存长期引用大对象。
- 未清理的定时器、事件监听、订阅。
- 闭包持有已不需要的数据。
- 脱离 DOM 的节点仍被 JS 引用。
- 大量对象 URL、WebSocket、Worker 未释放。

面试回答：

> 高性能 JS 首先是减少工作量和长任务，而不是背某个语法最快。DOM 查询要缓存，数组去重用 `Set`，大任务要分片或放到 Worker，DOM 读写要分离。高频事件用节流或防抖，长生命周期副作用要清理。所有优化都应该用 Profiler 或 Performance 面板验证。

## 参考来源

- [MDN: Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)
