# Promise 与 async/await

## 概览

### 理解路径

Promise 解决的是异步结果的状态表达、回调注册、链式组合和错误传播问题；事件循环解决的是这些回调何时被调度执行。回答 Promise 题时先讲状态和值，再讲 `then` 返回值、微任务调度、错误传播、静态组合 API 和 async/await 的语法封装。

### 异步编程的实现方式有哪些？

JavaScript 中的异步机制：

1. **回调函数**：最基础的方式，缺点是多层嵌套导致"回调地狱"，代码可读性差。
2. **Promise**：将嵌套回调改为链式 `.then()` 调用，解决回调地狱，但多个 `then` 也有阅读负担。
3. **Generator**：通过 `yield` 暂停和恢复函数执行，配合 co 等库可以以同步方式写异步代码。
4. **async/await**：Generator + Promise 的语法糖，内置执行器，让异步代码看起来像同步代码，目前最推荐。

## Promise 基础

### Promise 是什么？

#### 概述

Promise 是异步编程的一种解决方案。它可以理解成一个保存未来异步结果的容器：异步操作还没结束时处于等待状态，结束后要么带着成功值完成，要么带着失败原因结束。

相对传统回调，Promise 的价值主要有三点：

1. 指定回调的时机更灵活：可以在异步操作启动前注册，也可以在异步操作已经完成后再注册。
2. 链式调用能缓解多层嵌套回调。
3. 错误可以沿 Promise 链向后传播，集中处理。

```js
const promise = fetchUser()

promise.then(onSuccess, onFailure)

setTimeout(() => {
  promise.then(onSuccessAgain, onFailureAgain)
}, 3000)
```

#### 状态

Promise 有三种状态：

1. `pending`：尚未完成。
2. `fulfilled`：成功完成，并带有 fulfillment value。
3. `rejected`：失败完成，并带有 rejection reason。

状态一旦从 `pending` 变成 fulfilled 或 rejected，就不可再改变。

### 如何改变 Promise 的状态？

Promise 状态只能从 `pending` 变成 fulfilled 或 rejected，常见改变方式有三种：

1. 调用 `resolve(value)`：通常把状态改成 fulfilled。
2. 调用 `reject(reason)`：把状态改成 rejected。
3. 执行器或回调中抛出异常：把对应 Promise 改成 rejected。

```js
const fulfilled = new Promise((resolve) => {
  resolve('ok')
})

const rejected = new Promise((resolve, reject) => {
  reject(new Error('failed'))
})

const thrown = new Promise(() => {
  throw new Error('boom')
})
```

注意两个边界：

1. 状态只会改变一次，后续再次 `resolve()` 或 `reject()` 都不会生效。
2. 如果 `resolve()` 接收的是 Promise 或 thenable，当前 Promise 会跟随它的最终状态。

### Promise 状态改变和 `then` 回调注册谁先谁后？

两种顺序都可能发生：

1. 先注册 `then` 回调，再改变状态。
2. 先改变状态，再注册 `then` 回调。

区别只在于"什么时候满足执行条件"，不在于"是否同步执行"。`then` 回调即使注册在一个已经 settled 的 Promise 上，也不会立刻同步执行，而是进入微任务队列。

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => resolve('p1 ok'), 1000)
})

p1.then((value) => {
  console.log(value)
})
```

```js
const p2 = Promise.resolve('p2 ok')

setTimeout(() => {
  p2.then((value) => {
    console.log(value)
  })
}, 3000)
```

第一段是先注册回调，后改变状态；第二段是先改变状态，后注册回调。两者最终都会拿到结果。

### Promise 构造函数是同步还是异步执行？`then` 呢？

`new Promise(executor)` 中的 executor 会立即同步执行；`then`、`catch`、`finally` 注册的回调会异步执行，进入微任务队列。

```js
console.log('start')

new Promise((resolve) => {
  console.log('executor')
  resolve()
}).then(() => {
  console.log('then')
})

console.log('end')
```

输出顺序是：

```text
start
executor
end
then
```

所以"Promise 是异步的"这句话容易误导。更准确的说法是：Promise 构造器里的同步代码立即执行，状态变更后的反应回调由微任务调度。

### `then` 返回什么？

`promise.then(onFulfilled, onRejected)` 总是返回一个新的 Promise。新 Promise 的状态由回调返回值决定：

| 回调结果 | 新 Promise 状态 |
| --- | --- |
| 返回普通值 | fulfilled，值为该普通值 |
| 返回 Promise 或 thenable | 跟随该对象最终状态 |
| 抛出异常 | rejected，原因为异常 |
| 没有对应回调 | 状态和值继续穿透 |

简单说，`then()` 返回的新 Promise 的结果由 `then()` 指定回调的执行结果决定。

```js
Promise.resolve(1)
  .then((value) => value + 1)
  .then((value) => Promise.resolve(value + 1))
  .then(console.log) // 3
```

### `Promise.resolve(obj)` 会如何处理不同值？

`Promise.resolve(value)` 会把任意输入归一化成 Promise，但不同输入的处理规则不同：

| 输入 | 返回结果 |
| --- | --- |
| 普通值 | 返回 fulfilled Promise，值为该普通值 |
| 原生 Promise | 通常直接返回这个 Promise 本身 |
| thenable 对象 | 读取并调用它的 `then`，采用它最终给出的状态和值 |
| 抛错的 thenable | 返回 rejected Promise，reason 为抛出的错误 |

```js
const p = Promise.resolve(1)

console.log(Promise.resolve(p) === p) // true

Promise.resolve({
  then(resolve) {
    resolve('thenable value')
  }
}).then(console.log) // 'thenable value'
```

这个规则叫 thenable 同化。它也是 `await`、`Promise.all()` 等 API 能同时接收普通值、Promise 和 thenable 的基础。

### Promise 的基本用法

```js
// 创建 Promise
const p = new Promise((resolve, reject) => {
  // 异步操作成功调用 resolve，失败调用 reject
  setTimeout(() => resolve('ok'), 1000)
})

// 使用 then/catch
p.then(value => console.log(value))
 .catch(err => console.error(err))
 .finally(() => console.log('done'))

// Promise.resolve / Promise.reject 快捷创建
Promise.resolve(42).then(v => console.log(v))
Promise.reject(new Error('fail')).catch(e => console.error(e))

// Promise.all：全部成功才 resolve，任一失败立即 reject
Promise.all([p1, p2, p3]).then(([r1, r2, r3]) => {})

// Promise.race：最快的那个决定结果
Promise.race([p1, timeoutPromise(5000)]).then(res => {})

// Promise.allSettled：等所有完成，不管成功失败
Promise.allSettled([p1, p2]).then(results => {})
```

### Promise 解决了什么问题

Promise 解决了**回调地狱**问题。在 Promise 出现之前，多个异步操作依赖时需要层层嵌套回调：

```js
// 回调地狱
fs.readFile('./a.txt', 'utf8', function(err, data) {
  fs.readFile(data, 'utf8', function(err, data) {
    fs.readFile(data, 'utf8', function(err, data) {
      console.log(data) // 深层嵌套，可读性极差
    })
  })
})

// Promise 链式调用，清晰易读
read('./a.txt')
  .then(data => read(data))
  .then(data => read(data))
  .then(data => console.log(data))
```

## Promise 错误处理

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

这就是 Promise 的异常穿透：前面任意环节出错，如果中间没有 rejection 处理器拦截，就会一直传到后面的失败回调。

### `catch` 后面还能继续执行 `then` 吗？

可以。`catch()` 本身也会返回一个新的 Promise，它的后续链路由 catch 回调的返回值决定。

```js
Promise.reject('1')
  .catch((error) => {
    console.log(1)
    return 'recovered'
  })
  .then((value) => {
    console.log(2)
    console.log(value)
  })
```

输出是：

```text
1
2
recovered
```

原因是 `catch` 捕获了前面的 rejected，并返回普通值 `'recovered'`，所以 `catch()` 返回的新 Promise 变成 fulfilled，后面的 `then` 成功回调会继续执行。如果 `catch` 里继续抛错或返回 rejected Promise，后续才会进入失败分支。

### 如何中断 Promise 链条？

"中断"要先分清目标：是不再进入后面的成功分支、跳过某段业务逻辑，还是取消底层异步任务。常见做法有四类。

#### 返回 rejected Promise

```js
Promise.resolve()
  .then(() => {
    return Promise.reject(new Error('stop'))
  })
  .then(() => {
    console.log('不会执行')
  })
  .catch((error) => {
    console.log(error.message) // 'stop'
  })
```

这种方式会跳过后续最近的成功回调，进入失败分支。它适合"后续流程不能继续，且需要统一错误处理"的场景。

#### 在分支中提前 return

```js
function loadUser(shouldLoad) {
  return Promise.resolve()
    .then(() => {
      if (!shouldLoad) {
        return null
      }

      return fetch('/api/user').then((res) => res.json())
    })
    .then((user) => {
      if (user === null) {
        return
      }

      renderUser(user)
    })
}
```

这种方式不是让 Promise 链停止，而是让链继续向后传递一个明确的空结果。它适合"这是正常分支，不应该当成异常"的场景。

#### 返回永远 pending 的 Promise

```js
Promise.resolve()
  .then(() => {
    return new Promise(() => {})
  })
  .then(() => {
    console.log('不会执行')
  })
```

这种方式能解释链条调度机制：后续 `then` 要等前一个 Promise settle，而这个 Promise 永远不 settle，所以后续回调不会执行。工程里要谨慎使用，因为长期悬挂的 pending Promise 可能让资源清理、loading 状态和错误收敛变得困难。

#### 取消底层异步任务

如果目标是取消网络请求，只中断外层 Promise 链还不够，应取消底层任务：

```js
const controller = new AbortController()

fetch('/api/user', {
  signal: controller.signal
}).catch((error) => {
  if (error.name === 'AbortError') {
    return
  }

  throw error
})

controller.abort()
```

`AbortController` 适合取消 `fetch` 这类支持 abort signal 的异步任务。它解决的是"任务本身不再继续"，不是只让后续 `.then()` 不执行。

### `finally` 是怎么实现的？

`finally(cb)` 的特点是：回调不接收值，也不改变链上的 value / reason，只是「无论成败都执行一次」再透传结果。实现要点是在 `then` 的两个分支里都执行 `cb`，成功分支执行后返回原值、失败分支执行后重新抛出原因：

```js
Promise.prototype.myFinally = function (callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (reason) =>
      Promise.resolve(callback()).then(() => {
        throw reason
      })
  )
}
```

用 `Promise.resolve(callback())` 包一层，是为了等待 callback 自身可能返回的 Promise（例如 finally 里做异步清理）后，再透传原来的结果。

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

## Promise 静态方法

### Promise 静态方法怎么比较？

| 方法 | 成功条件 | 失败条件 | 返回值特点 |
| --- | --- | --- | --- |
| `Promise.all()` | 全部 fulfilled | 任意一个 rejected | 成功值按输入顺序组成数组 |
| `Promise.allSettled()` | 所有输入都 settled | 不会因单个 rejected 失败 | 每项包含 `status` 和值/原因 |
| `Promise.race()` | 第一个 settled 决定结果 | 第一个 settled 可能是 rejected | 只关心最快 settle |
| `Promise.any()` | 任意一个 fulfilled | 全部 rejected | 失败时抛 `AggregateError` |

`all` 适合强依赖并发请求，`allSettled` 适合收集批量任务结果，`race` 适合超时竞争，`any` 适合多个备选源取最快成功。空迭代对象也要注意：`Promise.all([])` 和 `Promise.allSettled([])` 会 fulfilled，`Promise.any([])` 会 rejected。

### 如何手写 Promise 静态方法？

#### Promise.all

`Promise.all()` 的关键点是：按输入顺序保存成功值；任意一个 rejected 就立刻 reject；空输入直接 fulfilled 为 `[]`。

```js
function promiseAll(iterable) {
  const items = Array.from(iterable)

  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      resolve([])
      return
    }

    const results = new Array(items.length)
    let fulfilledCount = 0

    items.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        results[index] = value
        fulfilledCount += 1

        if (fulfilledCount === items.length) {
          resolve(results)
        }
      }, reject)
    })
  })
}
```

#### Promise.allSettled

`Promise.allSettled()` 不会因为单个任务失败而失败，它要等所有输入都 settled，并为每一项记录 `status`。

```js
function promiseAllSettled(iterable) {
  const items = Array.from(iterable)

  return new Promise((resolve) => {
    if (items.length === 0) {
      resolve([])
      return
    }

    const results = new Array(items.length)
    let settledCount = 0

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = {
            status: 'fulfilled',
            value
          }
        },
        (reason) => {
          results[index] = {
            status: 'rejected',
            reason
          }
        }
      ).finally(() => {
        settledCount += 1

        if (settledCount === items.length) {
          resolve(results)
        }
      })
    })
  })
}
```

#### Promise.any

`Promise.any()` 的关键点是：第一个 fulfilled 直接 resolve；只有全部 rejected 才 reject，并带上所有失败原因。

```js
function promiseAny(iterable) {
  const items = Array.from(iterable)

  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'))
      return
    }

    const errors = new Array(items.length)
    let rejectedCount = 0

    items.forEach((item, index) => {
      Promise.resolve(item).then(resolve, (reason) => {
        errors[index] = reason
        rejectedCount += 1

        if (rejectedCount === items.length) {
          reject(new AggregateError(errors, 'All promises were rejected'))
        }
      })
    })
  })
}
```

#### Promise.race

`Promise.race()` 只关心第一个 settled 的输入。第一个 fulfilled 就 fulfilled，第一个 rejected 就 rejected。

```js
function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      Promise.resolve(item).then(resolve, reject)
    }
  })
}
```

### Promise.all 如何保存所有 Promise 的状态？

`Promise.all()` 默认遇到第一个 rejected 就失败。如果希望"所有请求都执行完，并保留每个请求状态"，有两种常见方式：

1. 直接使用 `Promise.allSettled()`。
2. 把每个 Promise 自己包装成永远 fulfilled 的结果对象，再交给 `Promise.all()`。

```js
function settle(promise) {
  return Promise.resolve(promise).then(
    (value) => ({
      status: 'fulfilled',
      value
    }),
    (reason) => ({
      status: 'rejected',
      reason
    })
  )
}

function allWithStatus(promises) {
  return Promise.all(promises.map(settle))
}
```

业务请求里也常用同样思路：每个子请求内部 `try/catch`，失败时返回一个明确的失败标记，让外层 `Promise.all()` 能拿到完整结果。

```js
async function loadActivityConfig(api) {
  try {
    const { contracts, hasEnded } = await api.post()

    return {
      ok: true,
      contracts: contracts || [],
      hasEnded
    }
  } catch (error) {
    return {
      ok: false,
      error
    }
  }
}
```

## async/await

### `async` / `await` 和 Promise 的关系是什么？

`async` 函数总是返回 Promise。函数返回普通值会包装为 fulfilled Promise，抛错会变成 rejected Promise，返回另一个 Promise 时会跟随这个 Promise 的状态和值。

```js
async function loadUser() {
  const res = await fetch('/api/user')
  if (!res.ok) throw new Error('request failed')
  return res.json()
}
```

`await` 右侧通常是 Promise，但也可以是普通值。它会把右侧表达式交给 `Promise.resolve()` 处理：如果结果 fulfilled，`await` 表达式得到成功值；如果结果 rejected，`await` 会在当前位置抛出异常。

`await` 不会阻塞整个线程，只会暂停当前 async 函数的后续执行。可以把 `await` 后面的代码理解成放进 Promise 成功回调里的异步延续。

### Callback、Promise 和 async/await 有什么区别？

三者是 JavaScript 异步写法的逐步演进：

| 写法 | 核心特点 | 主要问题 |
| --- | --- | --- |
| Callback | 把后续逻辑作为函数传进去 | 容易嵌套，错误处理分散，控制反转明显 |
| Promise | 用对象表达异步状态和值，支持链式组合 | 链很长时仍需要理解 then 返回值和错误传播 |
| async/await | 用同步风格书写 Promise 链 | 需要注意并发关系，错误仍来自 rejected Promise |

Promise 和 async/await 并不互斥。async/await 是基于 Promise 的语法封装，适合写依赖前一步结果的异步流程；Promise 静态方法更适合表达并发、竞争和批量收集。

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

### await 到底在等啥？

`await` 等待的是一个**表达式的结果**，不只是 async 函数：

- 如果 `await` 后面是普通值，直接返回该值。
- 如果 `await` 后面是 Promise，会暂停 async 函数执行，等 Promise resolve 后继续，得到 resolve 的值。

```js
async function test() {
  const v1 = await 'hello'            // 直接得到 'hello'
  const v2 = await Promise.resolve(42) // 等 Promise resolve，得到 42
  console.log(v1, v2) // 'hello' 42
}
```

`await` 会阻塞当前 async 函数内的后续代码（转为微任务），但不会阻塞外部代码执行。

### async/await 的优势

当有多个步骤依赖上一步结果时，async/await 比 Promise 链更清晰：

```js
// Promise 链（需要读取中间值时很麻烦）
function doItPromise() {
  return step1(300)
    .then(time2 => step2(time2))
    .then(time3 => step3(time3))
}

// async/await（像同步代码一样直观）
async function doIt() {
  const time2 = await step1(300)
  const time3 = await step2(time2)
  const result = await step3(time3)
  return result
}
```

### async/await 对比 Promise 的优势

- **代码更易读**：几乎像同步代码，减少 `.then()` 的链式阅读负担。
- **中间值传递更方便**：Promise 传递中间值需要层层 return，async/await 直接用变量。
- **错误处理更友好**：可以用成熟的 `try/catch`，而不是 `.catch()` 穿插在链式调用里。
- **调试更友好**：可以在 `await` 行设置断点，调试器能正常步进；Promise 链中的箭头函数无法步进调试。

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

## 事件循环与调度

### Promise 与定时器的打印顺序如何分析？

分析这类题时按三步走：先执行同步代码，再清空本轮宏任务产生的微任务，最后进入下一个宏任务。

```js
setTimeout(() => {
  console.log('0')
}, 0)

new Promise((resolve) => {
  console.log('1')
  resolve()
})
  .then(() => {
    console.log('2')

    new Promise((resolve) => {
      console.log('3')
      resolve()
    })
      .then(() => {
        console.log('4')
      })
      .then(() => {
        console.log('5')
      })
  })
  .then(() => {
    console.log('6')
  })

new Promise((resolve) => {
  console.log('7')
  resolve()
}).then(() => {
  console.log('8')
})
```

输出顺序是：

```text
1
7
2
3
8
4
6
5
0
```

`1` 和 `7` 来自 Promise 执行器，是同步输出；`2`、`8`、`4`、`6`、`5` 来自微任务；`0` 来自下一轮宏任务中的定时器。

### Promise 和 setTimeout 有什么区别？

`Promise` 和 `setTimeout` 都常出现在异步题里，但它们不是同一类东西：

| 对比点 | Promise | setTimeout |
| --- | --- | --- |
| 角色 | 表达一个异步结果的状态和值 | 注册一个定时器任务 |
| 队列 | `then` 回调进入微任务队列 | 回调进入宏任务队列 |
| 执行时机 | 当前同步代码结束后，通常先于下一个宏任务 | 至少等到指定延迟后进入后续宏任务 |
| 能力 | 支持链式调用、错误传播、组合 API | 只负责延迟调度一个回调 |

```js
setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('sync')
```

输出顺序是：

```text
sync
promise
timeout
```

### setTimeout、Promise、Async/Await 的区别

三者执行顺序体现了事件循环机制：

```js
// setTimeout 回调进入宏任务队列
console.log('script start')
setTimeout(() => console.log('settimeout'), 0)
console.log('script end')
// 输出：script start -> script end -> settimeout

// Promise 的 then 回调进入微任务队列（比宏任务先执行）
console.log('start')
Promise.resolve().then(() => console.log('promise'))
setTimeout(() => console.log('setTimeout'), 0)
console.log('end')
// 输出：start -> end -> promise -> setTimeout

// async/await 中，await 后面的代码等价于 .then() 回调（微任务）
async function main() {
  console.log('async start')
  await Promise.resolve()
  console.log('async end') // 微任务
}
main()
console.log('sync')
// 输出：async start -> sync -> async end
```

## 异步模式

### 多个 `await` 请求可以怎么优化？

如果多个异步请求互不依赖，不要连续 `await`，否则会变成串行等待。应先同时启动请求，再用 `Promise.all()` 等待结果。

```js
async function loadSerial() {
  const user = await fetchUser()
  const orders = await fetchOrders()
  return {
    user,
    orders
  }
}

async function loadParallel() {
  const userTask = fetchUser()
  const ordersTask = fetchOrders()
  const [user, orders] = await Promise.all([userTask, ordersTask])

  return {
    user,
    orders
  }
}
```

如果第二个请求依赖第一个请求的结果，就必须串行；如果只是两个独立数据源，使用并发能减少总等待时间。

### 在 `map` 和 `for` 中调用异步函数有什么区别？

`map(asyncFn)` 会立即启动一组 async 回调，返回的是 Promise 数组；它不会自动等待这些 Promise 完成。`for...of + await` 会按顺序等待每个任务完成。

```js
async function runWithMap(items) {
  const tasks = items.map(async (item) => {
    return fetchItem(item)
  })

  return Promise.all(tasks)
}

async function runWithFor(items) {
  const results = []

  for (const item of items) {
    results.push(await fetchItem(item))
  }

  return results
}
```

如果任务相互独立，`map + Promise.all` 更适合并发；如果任务必须按顺序执行，或者下一次依赖上一次结果，用 `for...of + await` 更清晰。

### async/await、Generator、Promise 三者是什么关系？

可以按「能力叠加」来理解：

- **Promise** 负责表达和组合一个异步结果的状态（pending/fulfilled/rejected），解决回调嵌套和错误传播。
- **Generator** 是可以暂停和恢复的函数：`yield` 处交出控制权，外部调用 `it.next(value)` 再把值送回、恢复执行。它本身和异步无关，只提供「中断 / 恢复」能力。
- **async/await** 本质是「Generator + 自动执行器 + Promise」的语法糖：`async` 约等于把函数体变成 Generator，`await` 约等于 `yield` 一个 Promise，由内置执行器在 Promise resolve 后自动调用 `next` 把结果送回继续执行。

所以三者不是并列的竞品，而是逐层封装：Generator 提供暂停能力，Promise 提供异步状态，async/await 把两者组合成最贴近同步写法的形态。早期 co 库就是「Generator + Promise」的手写执行器，效果等价于今天的 async/await。

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

并发控制的目标是限制同时运行的任务数量，而不是把所有任务串行化。它的关键不是"切片执行一批再执行下一批"，而是"只要某个任务完成，就立刻补上一个新任务"。

并发和并行也要区分：

| 概念 | 含义 |
| --- | --- |
| 并发 | 同一时间段内多个任务都在推进，但不一定真正同时执行 |
| 并行 | 多个任务在同一时刻真正同时执行，通常依赖多核能力 |
| 并发控制 | 限制同时进行的异步任务数量，任务完成后继续补位 |

一种实现是维护正在执行的任务池，并用 `Promise.race()` 等待任意一个任务完成：

```js
async function asyncPool(limit, items, worker) {
  const results = new Array(items.length)
  const executing = new Set()

  for (const [index, item] of items.entries()) {
    const task = Promise.resolve()
      .then(() => worker(item, index))
      .then((result) => {
        results[index] = result
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

另一种实现是启动固定数量的 worker，每个 worker 从任务队列里不断取下一个任务：

```js
async function runWithWorkers(limit, tasks) {
  const results = new Array(tasks.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await tasks[currentIndex]()
    }
  }

  const workers = Array.from(
    {
      length: Math.min(limit, tasks.length)
    },
    () => worker()
  )

  await Promise.all(workers)
  return results
}
```

`Promise.race()` 方案更贴近"有任务完成就补位"的直观模型；worker 方案代码更短，也更容易保持结果顺序。

## 参考来源

- [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [MDN: Promise concurrency](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency)
