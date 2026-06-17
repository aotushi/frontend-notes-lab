# 事件循环、并发控制与 Web Worker

## 问题

JavaScript 单线程为什么还能处理异步任务？宏任务、微任务、渲染、`setTimeout`、Promise、`requestAnimationFrame`、`requestIdleCallback`、Web Worker 和并发控制之间是什么关系？

## 结论

### 理解路径

JavaScript 执行线程一次只能执行一段同步代码；异步能力来自宿主环境。宿主负责计时器、网络、事件、渲染和 Worker 等能力，JavaScript 引擎通过事件循环不断取任务执行，并在任务之间清空微任务队列。

### 浏览器事件循环的基本顺序是什么？

一个简化但实用的浏览器事件循环模型：

1. 执行一个 task，例如初始脚本、计时器回调、用户事件回调。
2. 执行期间产生的 Promise reaction、`queueMicrotask`、MutationObserver 回调进入 microtask queue。
3. 当前 task 结束后，清空 microtask queue；微任务产生的新微任务也会继续执行，直到队列为空。
4. 浏览器在合适时机更新渲染。
5. 进入下一个 task。

微任务优先级高不是“永远先于宏任务”，而是在当前 task 结束后、下一个 task 之前执行。

### `Promise` 和 `setTimeout(fn, 0)` 谁先执行？

在同一个 task 中创建时，Promise 的 reaction 属于微任务，`setTimeout` 回调属于后续 task，所以 Promise 回调通常先执行。

```js
setTimeout(() => console.log('timeout'), 0)

Promise.resolve().then(() => console.log('promise'))

console.log('sync')
// sync, promise, timeout
```

`setTimeout(fn, 0)` 也不是立即执行，它只是尽快把回调排入计时器任务队列，仍要等当前调用栈和微任务清空。

### `requestAnimationFrame` 和 `requestIdleCallback` 怎么选？

| API | 适合场景 | 关键点 |
| --- | --- | --- |
| `requestAnimationFrame` | 下一帧前执行视觉更新 | 适合动画、读写布局前的帧同步 |
| `requestIdleCallback` | 浏览器空闲时执行低优先级任务 | 不适合必须准时完成的业务逻辑 |
| `setTimeout` | 粗粒度延迟或兜底 | 不和渲染帧对齐 |
| 微任务 | 当前任务后的状态衔接 | 过多微任务会推迟渲染 |

### 为什么微任务过多会卡页面？

浏览器通常要等微任务队列清空后才有机会渲染。如果一个微任务不断追加新微任务，就可能长时间占用主线程，让用户输入和渲染都得不到处理。

### 如何回答 JavaScript 并发模型？

JavaScript 主线程是单线程执行模型，但浏览器是多线程/多进程宿主环境。网络、计时器、用户事件、渲染流水线和 Worker 可以并行或异步工作；JavaScript 通过任务队列、微任务队列和事件循环接收回调。

### Web Worker 解决什么问题？

Web Worker 让脚本在独立线程中运行，适合 CPU 密集型计算、数据解析、压缩、加密、图像处理等不需要直接操作 DOM 的任务。主线程和 Worker 通过 `postMessage` 传递消息，可以使用 structured clone，也可以转移 `ArrayBuffer` 等 transferable 对象减少复制成本。

Worker 不能直接访问 DOM，也不共享主线程的调用栈。

### 如何实现批量请求并发控制？

并发控制应限制同一时刻执行的 Promise 数量。核心做法是维护运行中任务集合，达到上限时等待最快完成的任务，再启动下一个。

```js
async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await mapper(items[index], index)
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => run()
  )

  await Promise.all(workers)
  return results
}
```

### 事件循环题常见误区

1. 不要把所有异步都叫宏任务。Promise reaction 是微任务。
2. 不要说 `async/await` 开了新线程，它只是 Promise 语法。
3. 不要说微任务一定比所有计时器先执行，要说明它在当前 task 结束后清空。
4. 不要把 Node.js 事件循环阶段直接套到浏览器题上。

## Demo

### 执行顺序

```js
console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'))

queueMicrotask(() => console.log('E'))

console.log('F')
// A, F, C, E, D, B
```

`C` 先入微任务队列，`E` 随后入队；`C` 执行后追加 `D`，所以顺序是 `C`、`E`、`D`。

### Worker 通信

```js
// main.js
const worker = new Worker('/worker.js')

worker.postMessage({ type: 'sum', payload: [1, 2, 3] })
worker.onmessage = (event) => {
  console.log(event.data)
}

// worker.js
self.onmessage = (event) => {
  if (event.data.type === 'sum') {
    const result = event.data.payload.reduce((a, b) => a + b, 0)
    self.postMessage(result)
  }
}
```

## 参考来源

- [MDN: Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [MDN: Microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN: requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [HTML Standard: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
