# 异步编程基础

### 理解路径

异步编程回答"耗时任务如何不阻塞主线程"；事件循环回答"异步任务完成后，后续回调按什么顺序回到主线程执行"；Promise 和 async/await 回答"如何表达、组合和消费异步结果"。

### 异步编程解决什么问题？

#### 为什么需要异步

JavaScript 主线程一次只能执行一段同步代码，但页面需要同时处理网络请求、计时器、用户事件、图片加载、文件读取等耗时任务。如果主线程一直等待这些任务完成，页面就会卡住，后面的脚本、交互和渲染都无法继续。

异步编程的核心目标是：把耗时任务交给宿主环境处理，JavaScript 主线程继续执行后面的代码；等任务完成后，再通过回调、Promise 或 async/await 处理结果。

#### 异步不是新开一个 JS 主线程

浏览器或 Node.js 这类宿主环境可以处理计时器、网络、文件、事件等能力。JavaScript 主线程负责执行代码，宿主环境负责等待外部结果并把后续任务放回任务队列。

所以异步不是"JavaScript 同时执行多段代码"，而是"主线程不原地等待，后续逻辑等结果可用后再调度执行"。

### 事件循环在异步里负责什么？

#### 为什么需要事件循环

异步任务一多，JavaScript 就需要知道哪些后续逻辑先执行、哪些后执行。任务队列可以理解成待办事项列表，事件循环负责不断从队列中取出任务，让同步代码、异步回调和页面渲染形成稳定顺序。

#### 事件循环是什么

事件循环是 JavaScript 和宿主环境协作的任务调度机制。它不断取出任务执行，并在任务之间处理微任务，确保同步任务和异步任务都能按规则推进。

一个简化的浏览器模型是：

1. 执行当前宏任务，例如初始脚本、计时器回调、用户事件回调。
2. 执行过程中产生的 Promise reaction、`queueMicrotask`、MutationObserver 回调进入微任务队列。
3. 当前宏任务结束后，清空微任务队列；微任务里新增的微任务也会继续执行，直到队列为空。
4. 浏览器在合适时机进行渲染更新。
5. 取出下一个宏任务，重复以上过程。

完整的宏任务、微任务、渲染和 Worker 细节见 [事件循环、并发控制与 Web Worker](/javascript/async/event-loop-workers-and-concurrency)。

### 宏任务和微任务怎么区分？

常见面试题里可以按来源先粗分：

| 类型 | 常见来源 | 调度特点 |
| --- | --- | --- |
| 宏任务 | 初始脚本、`setTimeout`、`setInterval`、用户事件、网络事件 | 一次事件循环取一个宏任务执行 |
| 微任务 | Promise reaction、`queueMicrotask`、MutationObserver、`await` 后续逻辑 | 当前宏任务结束后、下一个宏任务前清空 |

要注意，`Promise` 的执行器是同步执行的；进入微任务队列的是 `then`、`catch`、`finally` 这类 reaction 回调。`async/await` 也没有开新线程，`await` 后面的代码本质上是 Promise 的异步延续。

### 异步加载 JS 脚本有哪些方式？

异步加载脚本解决的是 HTML 解析、脚本下载和脚本执行之间的阻塞关系。它和 Promise 异步编程不是同一层问题，但都属于前端异步模型里常见的面试点。

#### 使用 defer

`defer` 脚本会并行下载，不阻塞 HTML 解析；等 HTML 解析完成后，按文档顺序执行，并且会在 `DOMContentLoaded` 之前执行完。

```html
<script src="/app.js" defer></script>
```

它适合依赖 DOM、需要保持多个脚本执行顺序的业务脚本。

#### 使用 async

`async` 脚本会并行下载，下载完成后尽快执行。它不保证多个脚本之间的执行顺序，也可能在 HTML 解析完成前执行。

```html
<script src="/analytics.js" async></script>
```

它适合统计、广告、监控等相对独立、不依赖其它脚本顺序的脚本。

#### 动态创建 script

动态创建 `script` 元素时，设置 `src` 还不一定开始加载；通常要插入文档后才会发起请求。

```js
const script = document.createElement('script')

script.src = '/feature.js'
script.async = true
document.body.append(script)
```

动态脚本适合按需加载功能模块。需要注意脚本执行时机：如果脚本要操作 DOM，应确保目标 DOM 已经存在。

#### XHR 脚本注入

可以先用 XHR 获取脚本文本，再创建脚本执行：

```js
const xhr = new XMLHttpRequest()

xhr.open('GET', '/feature.js', true)
xhr.onreadystatechange = () => {
  if (xhr.readyState !== 4) return

  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    const script = document.createElement('script')

    script.text = xhr.responseText
    document.body.append(script)
  }
}
xhr.send(null)
```

这种方式受同源策略、CSP 和安全审查影响，现代工程里通常优先使用 `defer`、`async`、动态 `import()` 或打包工具的按需加载。

### 并发控制和并行有什么区别？

#### 概念区分

| 概念 | 含义 |
| --- | --- |
| 并发 | 同一时间段内多个任务都在推进，但不一定真正同时执行 |
| 并行 | 多个任务在同一时刻真正同时执行，通常依赖多核能力 |
| 并发控制 | 限制同时进行的异步任务数量，任务完成后继续补位 |
| 切片控制 | 一批任务全部完成后再启动下一批，效率通常低于完成一个补一个 |

在请求场景中，并发控制的关键是：先启动不超过上限的任务；任意一个任务完成后，立即启动下一个等待任务。

#### Promise.race 方案

```js
function asyncPool(limit, items, worker) {
  const results = []
  const executing = []
  let index = 0

  function enqueue() {
    if (index >= items.length) {
      return Promise.resolve()
    }

    const currentIndex = index
    const item = items[index]

    index += 1

    const task = Promise.resolve()
      .then(() => worker(item, currentIndex))
      .then((result) => {
        results[currentIndex] = result
      })

    results[currentIndex] = task

    const running = task.finally(() => {
      executing.splice(executing.indexOf(running), 1)
    })

    executing.push(running)

    let ready = Promise.resolve()

    if (executing.length >= limit) {
      ready = Promise.race(executing)
    }

    return ready.then(() => enqueue())
  }

  return enqueue().then(() => Promise.all(results))
}
```

核心是维护一个正在执行的池子，池子达到上限时用 `Promise.race()` 等任意一个任务完成，再补下一个任务。

### Promise 微任务与定时器

```js
setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('sync')
// sync, promise, timeout
```

### 并发控制

```js
const timeout = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(ms)
      resolve(ms)
    }, ms)
  })

asyncPool(2, [1000, 5000, 3000, 2000], timeout).then((results) => {
  console.log(results)
})
```

## 参考来源

- [MDN: Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [MDN: Microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [MDN: script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)
- [HTML Standard: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
