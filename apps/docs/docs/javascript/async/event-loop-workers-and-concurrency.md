# 事件循环、并发控制与 Web Worker

## 问题

Event Loop、Promise、async/await、并发请求、超时中断、Web Worker、SWR 和长任务优化怎么回答？

## 结论

JavaScript 主线程一次只能执行一个任务，但浏览器提供任务队列、微任务队列、网络、定时器、Worker 等机制来协调异步工作。

常见归类：

| 主题 | 重点 |
| --- | --- |
| Event Loop | 宏任务、微任务、渲染时机 |
| Promise | 状态流转、链式调用、错误穿透 |
| async/await | Promise 的语法糖，`await` 后续进入微任务 |
| 并发控制 | 限制同时请求数量，避免乱序覆盖 |
| 超时中断 | `AbortController` |
| Web Worker | 把 CPU 密集任务移出主线程 |
| SWR | stale-while-revalidate，先用缓存再后台刷新 |

## Demo

请求乱序保护：

```js
let requestVersion = 0;

async function loadTab(tabId) {
  const version = ++requestVersion;
  const data = await fetch(`/api/tabs/${tabId}`).then((res) => res.json());

  if (version === requestVersion) {
    render(data);
  }
}
```

并发池：

```js
async function runWithLimit(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const promise = Promise.resolve().then(task);
    results.push(promise);
    executing.add(promise);
    promise.finally(() => executing.delete(promise));

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.allSettled(results);
}
```

超时中断：

```js
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
```

Web Worker：

```js
const worker = new Worker('/worker.js', { type: 'module' });
worker.postMessage({ type: 'calculate', payload: largeData });
worker.onmessage = (event) => render(event.data);
```

面试回答：

> Event Loop 负责协调同步代码、任务、微任务和渲染。Promise 回调属于微任务，`async/await` 是 Promise 的语法糖。频繁切 tab 或搜索请求要处理乱序，可以用版本号或 AbortController；大量请求要限流；CPU 密集任务适合 Web Worker，但 Worker 不能直接操作 DOM，只能通过消息通信。

## 参考来源

- [MDN: Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
