# Promise 与 async/await

## 问题

Promise 的状态、链式调用、错误传播和静态方法如何工作？`then` 返回值如何决定下一个 Promise？`async` / `await` 和 Promise 的关系是什么？`Promise.all`、`allSettled`、`race`、`any` 该怎么比较？

## 结论

### 理解路径

Promise 解决的是异步结果的状态表达和组合问题；事件循环解决的是回调何时被调度执行。回答 Promise 题时先讲状态和值，再讲 thenable 同化、微任务调度、错误传播和组合 API。

### Promise 是什么？

Promise 表示一个未来才会 settle 的异步结果。它有三种状态：

1. `pending`：尚未完成。
2. `fulfilled`：成功完成，并带有 fulfillment value。
3. `rejected`：失败完成，并带有 rejection reason。

状态一旦从 `pending` 变成 fulfilled 或 rejected，就不可再改变。

### `then` 返回什么？

`promise.then(onFulfilled, onRejected)` 总是返回一个新的 Promise。新 Promise 的状态由回调返回值决定：

| 回调结果 | 新 Promise 状态 |
| --- | --- |
| 返回普通值 | fulfilled，值为该普通值 |
| 返回 Promise 或 thenable | 跟随该对象最终状态 |
| 抛出异常 | rejected，原因为异常 |
| 没有对应回调 | 状态和值继续穿透 |

```js
Promise.resolve(1)
  .then((value) => value + 1)
  .then((value) => Promise.resolve(value + 1))
  .then(console.log) // 3
```

### Promise 错误如何传播？

链上任意回调抛错或返回 rejected Promise，都会进入后续最近的 rejection 处理器。`catch(fn)` 等价于 `then(undefined, fn)`；`finally(fn)` 不接收成功值或失败原因，通常用于清理资源。

```js
fetch('/api/user')
  .then((res) => {
    if (!res.ok) throw new Error('request failed')
    return res.json()
  })
  .catch((error) => {
    console.error(error)
  })
```

### Promise 静态方法怎么比较？

| 方法 | 成功条件 | 失败条件 | 返回值特点 |
| --- | --- | --- | --- |
| `Promise.all()` | 全部 fulfilled | 任意一个 rejected | 成功值按输入顺序组成数组 |
| `Promise.allSettled()` | 所有输入都 settled | 不会因单个 rejected 失败 | 每项包含 `status` 和值/原因 |
| `Promise.race()` | 第一个 settled 决定结果 | 第一个 settled 可能是 rejected | 只关心最快 settle |
| `Promise.any()` | 任意一个 fulfilled | 全部 rejected | 失败时抛 `AggregateError` |

`all` 适合强依赖并发请求，`allSettled` 适合收集批量任务结果，`race` 适合超时竞争，`any` 适合多个备选源取最快成功。

### `async` / `await` 和 Promise 的关系是什么？

`async` 函数总是返回 Promise。函数返回普通值会包装为 fulfilled Promise，抛错会变成 rejected Promise。`await` 会等待右侧值被 Promise.resolve 处理后的结果，并把后续代码放到异步延续中执行。

```js
async function loadUser() {
  const res = await fetch('/api/user')
  if (!res.ok) throw new Error('request failed')
  return res.json()
}
```

`await` 不会阻塞整个线程，只会暂停当前 async 函数的后续执行。

### `try/catch` 如何捕获 async 错误？

`await` 一个 rejected Promise 会在当前位置抛出异常，因此可以用 `try/catch` 捕获。

```js
async function run() {
  try {
    await Promise.reject(new Error('failed'))
  } catch (error) {
    console.log(error.message)
  }
}
```

没有 `await` 的 Promise 链错误不会被同层 `try/catch` 捕获，仍需要返回或等待它。

### 如何实现 Promise 超时？

```js
function withTimeout(task, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), ms)
  })

  return Promise.race([task, timeout])
}
```

真实请求还应配合 `AbortController` 取消底层网络任务，否则只是让外层 Promise 更早失败。

### 如何做异步并发控制？

并发控制的目标是限制同时运行的任务数量，而不是把所有任务串行化。

```js
async function asyncPool(limit, items, worker) {
  const results = []
  const executing = new Set()

  for (const item of items) {
    const task = Promise.resolve()
      .then(() => worker(item))
      .then((result) => {
        results.push(result)
      })
      .finally(() => {
        executing.delete(task)
      })

    executing.add(task)

    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
  return results
}
```

如果需要保持结果顺序，应把结果写回原索引，而不是用 `push`。

## Demo

### Promise 链错误穿透

```js
Promise.resolve()
  .then(() => {
    throw new Error('boom')
  })
  .then(() => 'skipped')
  .catch((error) => error.message)
  .then(console.log) // 'boom'
```

### `await` 的顺序

```js
async function demo() {
  console.log(1)
  await null
  console.log(3)
}

demo()
console.log(2)
// 1, 2, 3
```

## 参考来源

- [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [MDN: Promise concurrency](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency)
