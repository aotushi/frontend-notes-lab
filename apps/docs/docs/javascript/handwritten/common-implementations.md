# 常见手写题

## 概览

### 理解路径

手写题不是背代码，而是验证你是否理解语言机制、边界和工程取舍。回答时先说明目标语义，再写核心实现，最后补充边界：`this`、原型、错误处理、异步顺序、循环引用、Symbol、不可枚举属性等。

### 手写题怎么分类？

| 类别 | 典型题 | 核心考点 |
| --- | --- | --- |
| 函数能力 | `call`、`apply`、`bind`、柯里化、compose | `this`、参数、返回函数 |
| 对象模型 | `new`、`instanceof`、继承 | 原型链、构造调用 |
| 异步能力 | `Promise.all`、`race`、并发池 | Promise 状态和调度 |
| 数据处理 | 深拷贝、数组去重、扁平化 | 引用、递归、循环引用 |
| 事件控制 | 防抖、节流、EventBus | 闭包、计时器、订阅 |

## 函数与对象模型

### 手写 `call`

```js
Function.prototype.myCall = function myCall(context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('myCall must be called on a function')
  }

  const target = context == null ? globalThis : Object(context)
  const key = Symbol('fn')

  target[key] = this
  try {
    return target[key](...args)
  } finally {
    delete target[key]
  }
}
```

### 手写 `apply`

和 `call` 同理，区别是参数以数组形式传入。

```js
Function.prototype.myApply = function (context, args = []) {
  if (typeof this !== 'function') {
    throw new TypeError('myApply must be called on a function')
  }

  const target = context == null ? globalThis : Object(context)
  const key = Symbol('fn')

  target[key] = this
  try {
    return target[key](...args)
  } finally {
    delete target[key]
  }
}
```

### 手写 `bind`

```js
Function.prototype.myBind = function myBind(context, ...boundArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('myBind must be called on a function')
  }

  const fn = this

  function bound(...args) {
    const isNew = this instanceof bound
    return fn.apply(isNew ? this : context, [...boundArgs, ...args])
  }

  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype)
    Object.defineProperty(bound.prototype, 'constructor', {
      value: bound,
      configurable: true,
      writable: true
    })
  }

  return bound
}
```

### 手写 `new`

```js
function myNew(Ctor, ...args) {
  if (typeof Ctor !== 'function') {
    throw new TypeError('Ctor must be a function')
  }

  const instance = Object.create(Ctor.prototype)
  const result = Ctor.apply(instance, args)

  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : instance
}
```

### 手写 `instanceof`

```js
function myInstanceof(value, Ctor) {
  if (value == null || (typeof value !== 'object' && typeof value !== 'function')) {
    return false
  }

  let proto = Object.getPrototypeOf(value)

  while (proto) {
    if (proto === Ctor.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }

  return false
}
```

### 手写 `Object.create`

用一个空构造函数把传入对象作为新对象的原型，可选地定义自有属性。

```js
function objectCreate(proto, propertiesObject) {
  if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null')
  }

  function F() {}
  F.prototype = proto
  const obj = new F()

  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject)
  }

  return obj
}
```

### 手写 `Object.assign`

```js
Object.myAssign = function(target, ...sources) {
  if (target == null) throw new TypeError('Cannot convert undefined or null to object')
  const ret = Object(target)
  sources.forEach(source => {
    if (source != null) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          ret[key] = source[key]
        }
      }
    }
  })
  return ret
}
```

只复制自身可枚举属性，不复制原型链上的属性。

### 六种继承方式

```js
// 1. 原型链继承：子类原型指向父类实例（引用属性被所有实例共享）
function Child1() {}
Child1.prototype = new Parent()

// 2. 借用构造函数：子类构造里调用父类（无法继承父类原型方法）
function Child2(...args) {
  Parent.call(this, ...args)
}

// 3. 组合继承：构造函数 + 原型链（父类被调用两次）
function Child3(...args) {
  Parent.call(this, ...args)
}
Child3.prototype = new Parent()
Child3.prototype.constructor = Child3

// 4. 原型式继承：基于已有对象创建（Object.create 的原理）
const child4 = Object.create(parentObj)

// 5. 寄生式继承：在原型式基础上增强对象
function createChild5(original) {
  const clone = Object.create(original)
  clone.extra = () => {}
  return clone
}

// 6. 寄生组合继承（最优）：用 Object.create 避免父类被调用两次
function Child6(...args) {
  Parent.call(this, ...args)
}
Child6.prototype = Object.create(Parent.prototype)
Child6.prototype.constructor = Child6
```

### 手写柯里化

```js
function curry(fn, ...preset) {
  return function curried(...args) {
    const allArgs = [...preset, ...args]

    if (allArgs.length >= fn.length) {
      return fn.apply(this, allArgs)
    }

    return curry(fn, ...allArgs)
  }
}
```

### 偏函数

固定函数的部分参数，返回一个接收剩余参数的新函数。

```js
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn.call(this, ...presetArgs, ...laterArgs)
  }
}
```

### 实现链式调用

每个方法返回 `this`，让调用可以连续书写。

```js
class Calculator {
  constructor(value = 0) {
    this.value = value
  }

  add(n) {
    this.value += n
    return this
  }

  multiply(n) {
    this.value *= n
    return this
  }

  result() {
    return this.value
  }
}

new Calculator(1).add(2).multiply(3).result() // 9
```

### 实现 add(1)(2)(3)

粗暴版（固定三个参数）：

```js
function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(add(1)(2)(3)); // 6
```

参数长度不固定版：

```js
function add(...args) {
  return args.reduce((a, b) => a + b);
}
function currying(fn) {
  let args = [];
  return function temp(...newArgs) {
    if (newArgs.length) {
      args = [...args, ...newArgs];
      return temp;
    } else {
      let val = fn.apply(this, args);
      args = []; // 保证再次调用时清空
      return val;
    }
  };
}
let addCurry = currying(add);
console.log(addCurry(1)(2)(3)(4, 5)()); // 15
```

## 异步与 Promise

### 手写 Promise（Promise/A+ 核心）

实现 `pending / fulfilled / rejected` 三态、异步回调队列和 `then` 链式调用。

```js
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(executor) {
    this.status = MyPromise.PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCbs = []
    this.onRejectedCbs = []

    const resolve = (value) => {
      if (this.status !== MyPromise.PENDING) return
      this.status = MyPromise.FULFILLED
      this.value = value
      this.onFulfilledCbs.forEach((fn) => fn())
    }

    const reject = (reason) => {
      if (this.status !== MyPromise.PENDING) return
      this.status = MyPromise.REJECTED
      this.reason = reason
      this.onRejectedCbs.forEach((fn) => fn())
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
    onRejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e }

    return new MyPromise((resolve, reject) => {
      const handle = (fn, arg) => {
        queueMicrotask(() => {
          try {
            resolve(fn(arg))
          } catch (err) {
            reject(err)
          }
        })
      }

      if (this.status === MyPromise.FULFILLED) handle(onFulfilled, this.value)
      else if (this.status === MyPromise.REJECTED) handle(onRejected, this.reason)
      else {
        this.onFulfilledCbs.push(() => handle(onFulfilled, this.value))
        this.onRejectedCbs.push(() => handle(onRejected, this.reason))
      }
    })
  }
}
```

### 手写 Promise.then

`then` 方法返回一个新的 `Promise` 实例。为了在 promise 状态改变时再执行回调，用 `callbacks` 数组暂存传给 then 的函数，状态改变后依次调用。

**如何保证后一个 `then` 在前一个 `then`（可能是异步）结束后再执行？**

将传给 `then` 的函数和新 promise 的 `resolve` 一起 push 到前一个 promise 的 callbacks 里：
- 承前：前一个 promise 完成后调用 resolve，依次触发 callbacks 里的回调
- 启后：回调执行完返回结果，若是普通值则直接 resolve 新 promise；若是 promise，则等其完成后再 resolve

```js
then(onFulfilled, onReject) {
  const self = this;
  return new MyPromise((resolve, reject) => {
    let fulfilled = () => {
      try {
        const result = onFulfilled(self.value); // 承前
        return result instanceof MyPromise
          ? result.then(resolve, reject)
          : resolve(result); // 启后
      } catch (err) {
        reject(err);
      }
    };
    let rejected = () => {
      try {
        const result = onReject(self.reason);
        return result instanceof MyPromise
          ? result.then(resolve, reject)
          : reject(result);
      } catch (err) {
        reject(err);
      }
    };
    switch (self.status) {
      case PENDING:
        self.onFulfilledCallbacks.push(fulfilled);
        self.onRejectedCallbacks.push(rejected);
        break;
      case FULFILLED:
        fulfilled();
        break;
      case REJECT:
        rejected();
        break;
    }
  });
}
```

### 手写 `Promise.resolve` / `Promise.reject`

```js
Promise.myResolve = function (value) {
  if (value instanceof Promise) return value
  return new Promise((resolve) => resolve(value))
}

Promise.myReject = function (reason) {
  return new Promise((_, reject) => reject(reason))
}
```

### 手写 `Promise.all`

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable)
    const results = new Array(items.length)
    let fulfilledCount = 0

    if (items.length === 0) {
      resolve([])
      return
    }

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value
          fulfilledCount += 1
          if (fulfilledCount === items.length) resolve(results)
        },
        reject
      )
    })
  })
}
```

### 手写 `Promise.race`

返回第一个落定（成功或失败）的 Promise 的结果。

```js
function race(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      Promise.resolve(item).then(resolve, reject)
    }
  })
}
```

### 手写 `Promise.any`

返回第一个成功的 Promise；全部失败时以 `AggregateError` reject。

```js
function any(iterable) {
  const items = Array.from(iterable)

  return new Promise((resolve, reject) => {
    let rejectedCount = 0

    if (items.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'))
      return
    }

    items.forEach((item) => {
      Promise.resolve(item).then(resolve, () => {
        if (++rejectedCount === items.length) {
          reject(new AggregateError([], 'All promises were rejected'))
        }
      })
    })
  })
}
```

### 手写 `Promise.allSettled`

等待所有 Promise 都落定（无论成功失败），返回每项的 `{ status, value }` 或 `{ status, reason }`，永不 reject。

```js
function allSettled(iterable) {
  const items = Array.from(iterable)

  return new Promise((resolve) => {
    const results = new Array(items.length)
    let settledCount = 0

    if (items.length === 0) {
      resolve([])
      return
    }

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = { status: 'fulfilled', value }
          if (++settledCount === items.length) resolve(results)
        },
        (reason) => {
          results[index] = { status: 'rejected', reason }
          if (++settledCount === items.length) resolve(results)
        }
      )
    })
  })
}
```

### 手写 `Promise.finally`

无论 Promise 成功还是失败，回调都会执行，且不改变原始的 value / reason。

```js
Promise.prototype.myFinally = function myFinally(callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (reason) =>
      Promise.resolve(callback()).then(() => {
        throw reason
      })
  )
}
```

### 串行执行多个 Promise

用 `reduce` 把任务串成链，前一个落定后再启动下一个，依次收集结果。

```js
function runSerial(tasks) {
  return tasks.reduce(
    (chain, task) => chain.then((results) => task().then((res) => [...results, res])),
    Promise.resolve([])
  )
}
```

### 并发池

```js
async function pool(limit, items, worker) {
  const ret = []
  const executing = new Set()

  for (const item of items) {
    const task = Promise.resolve()
      .then(() => worker(item))
      .then((value) => ret.push(value))
      .finally(() => executing.delete(task))

    executing.add(task)

    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
  return ret
}
```

### 并发限制调度器（Scheduler）

与并发池 `pool` 函数相比，Scheduler 提供按需 `add` 的 class 接口，每次 `add` 返回一个 Promise：

```js
class Scheduler {
  constructor(maxCount = 2) {
    this.maxCount = maxCount
    this.queue = []
    this.running = 0
  }

  add(promiseCreator) {
    return new Promise((resolve) => {
      this.queue.push(() => promiseCreator().then(resolve))
      this.run()
    })
  }

  run() {
    while (this.running < this.maxCount && this.queue.length) {
      const task = this.queue.shift()
      this.running++
      task().finally(() => {
        this.running--
        this.run()
      })
    }
  }
}

// 使用
const scheduler = new Scheduler(2)
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

scheduler.add(() => delay(1000).then(() => console.log(1)))
scheduler.add(() => delay(500).then(() => console.log(2)))
scheduler.add(() => delay(300).then(() => console.log(3)))
// 最多同时执行 2 个
```

### 手写 `sleep`

用 Promise 包装 `setTimeout`，配合 `await` 实现延时。

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

await sleep(1000)
```

### createRepeat：每隔 n 秒输出，共 m 次

用 `setInterval` 计数到 m 次后清除：

```js
function createRepeat(content, times, delay) {
  let count = 0
  const timer = setInterval(() => {
    if (count >= times) {
      clearInterval(timer)
      return
    }
    count++
    console.log(content)
  }, delay * 1000)
}

createRepeat('hi', 3, 1) // 每隔 1 秒输出一次 hi，共 3 次
```

如果要求第一次立即输出，可以先手动执行一次再启动定时器；要求间隔更精确则改用递归 `setTimeout`。

### fetchWithRetry：失败自动重试

请求失败自动重试，最多 n 次，任意一次成功即返回；全部失败抛出最后一次错误：

```js
function fetchWithRetry(url, options = {}, retries = 3) {
  return fetch(url, options).catch((err) => {
    if (retries <= 0) throw err
    return fetchWithRetry(url, options, retries - 1)
  })
}
```

如果要「重试间隔递增」，在 `catch` 里 `await sleep(backoff)` 再递归即可。

### 循环打印红黄绿

红灯 3s、绿灯 1s、黄灯 2s，不断循环，用三种方式实现。

**callback 版（递归尾调用）：**

```js
const task = (timer, light, callback) => {
  setTimeout(() => {
    console.log(light)
    callback()
  }, timer)
}
const step = () => {
  task(3000, 'red', () =>
    task(1000, 'green', () =>
      task(2000, 'yellow', step)))
}
step()
```

**Promise 版：**

```js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const step = () =>
  delay(3000).then(() => { console.log('red') })
    .then(() => delay(1000)).then(() => { console.log('green') })
    .then(() => delay(2000)).then(() => { console.log('yellow') })
    .then(step)
step()
```

**async/await 版（最直观）：**

```js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
async function run() {
  while (true) {
    await delay(3000); console.log('red')
    await delay(1000); console.log('green')
    await delay(2000); console.log('yellow')
  }
}
run()
```

### 实现 ajax

用 `XMLHttpRequest` 包装成 Promise。

```js
function ajax({ url, method = 'GET', dataType = 'json', async = true }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, async)
    xhr.responseType = dataType
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      if (/^[23]\d{2}$/.test(xhr.status)) {
        resolve(xhr.response)
      } else {
        reject(new Error(`request failed with status ${xhr.status}`))
      }
    }
    xhr.onerror = (err) => reject(err)
    xhr.send()
  })
}
```

### 使用 Promise 封装 AJAX 请求

```js
function getJSON(url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    xhr.onerror = function () {
      reject(new Error(this.statusText));
    };
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(null);
  });
}
```

### 封装异步的 fetch（async/await 方式）

```js
class HttpRequestUtil {
  async get(url) {
    const res = await fetch(url);
    return res.json();
  }
  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async put(url, data) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async delete(url, data) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
}
```

### 用 Promise 实现图片的异步加载

```js
let imageAsync = url => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      console.log('图片请求成功');
      resolve(img);
    };
    img.onerror = err => {
      console.log('加载失败');
      reject(err);
    };
  });
};

imageAsync('url')
  .then(() => {
    console.log('加载成功');
  })
  .catch(error => {
    console.log('加载失败');
  });
```

## 数据结构与算法

### 手写深拷贝

**基础版**（处理普通对象/数组/Date/RegExp/循环引用）：

```js
function deepClone(value, cache = new WeakMap()) {
  // 基本类型和 null 直接返回
  if (value === null || typeof value !== 'object') return value

  // 循环引用：已拷贝过的对象直接返回缓存
  if (cache.has(value)) return cache.get(value)

  if (value instanceof Date) return new Date(value)
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)

  // 保留原型链（Array、自定义类都能正确继承）
  const result = Object.create(Object.getPrototypeOf(value))
  cache.set(value, result)

  // Reflect.ownKeys 能拿到 Symbol key
  for (const key of Reflect.ownKeys(value)) {
    result[key] = deepClone(value[key], cache)
  }

  return result
}
```

**完整版**（额外支持 Map / Set / 包装类型，面试高分写法）：

```js
const getType = val => Object.prototype.toString.call(val)

// 需要递归克隆内部值的类型
const TRAVERSABLE = new Set([
  '[object Map]', '[object Set]',
  '[object Array]', '[object Object]', '[object Arguments]'
])

function deepClone(target, map = new WeakMap()) {
  if (target === null || typeof target !== 'object') return target

  const type = getType(target)

  // 不可遍历类型单独处理
  if (!TRAVERSABLE.has(type)) return cloneOther(target, type)

  // 循环引用检测
  if (map.has(target)) return map.get(target)

  // 用原构造函数创建实例，保留原型
  const clone = new target.constructor()
  map.set(target, clone)

  if (type === '[object Map]') {
    target.forEach((val, key) => {
      clone.set(deepClone(key, map), deepClone(val, map))
    })
    return clone
  }

  if (type === '[object Set]') {
    target.forEach(val => clone.add(deepClone(val, map)))
    return clone
  }

  // 普通对象 / 数组（含 Symbol key）
  for (const key of Reflect.ownKeys(target)) {
    clone[key] = deepClone(target[key], map)
  }
  return clone
}

// 处理包装对象、Date、RegExp、Error、函数
function cloneOther(target, type) {
  const Ctor = target.constructor
  switch (type) {
    case '[object Boolean]':
      return new Object(Boolean.prototype.valueOf.call(target))
    case '[object Number]':
      return new Object(Number.prototype.valueOf.call(target))
    case '[object String]':
      return new Object(String.prototype.valueOf.call(target))
    case '[object Symbol]':
      return new Object(Symbol.prototype.valueOf.call(target))
    case '[object Date]':
    case '[object Error]':
      return new Ctor(target)
    case '[object RegExp]':
      return new Ctor(target.source, target.flags)
    case '[object Function]':
      return target  // 函数不克隆，直接返回引用
    default:
      return new Ctor(target)
  }
}
```

**各方案对比**：

| 方案 | 循环引用 | Map/Set | Symbol key | 包装类型 | 函数 |
| --- | --- | --- | --- | --- | --- |
| `JSON.parse(JSON.stringify())` | ❌ 报错 | ❌ | ❌ | ❌ | ❌ 丢失 |
| 基础版 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 完整版 | ✅ | ✅ | ✅ | ✅ | 返回引用 |
| `structuredClone()` | ✅ | ✅ | ✅ | ✅ | ❌ 报错 |

生产环境优先用 `structuredClone()`（浏览器/Node 18+ 原生支持）或 `lodash.cloneDeep`，面试写完整版即可。

### 浅拷贝 5 种方式

```js
const obj = { a: 1, b: { c: 2 } }

// 1. 手动遍历（只拷贝自身可枚举属性）
function shallowCopy(source) {
  const result = {}
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = source[key]
    }
  }
  return result
}

// 2. Object.assign（常用）
const copy2 = Object.assign({}, obj)

// 3. 展开运算符（ES2018+，推荐）
const copy3 = { ...obj }

// 4. 数组：Array.prototype.slice / concat
const arrCopy = [1, 2, 3].slice()
const arrCopy2 = [].concat([1, 2, 3])

// 5. 数组展开
const arrCopy3 = [...[1, 2, 3]]
```

> 以上均为浅拷贝，嵌套对象 `b.c` 仍然共享引用。深层修改仍然互相影响。

### 判断对象是否存在循环引用

```js
function isCyclic(obj, seen = new WeakSet()) {
  if (typeof obj !== 'object' || obj === null) return false
  if (seen.has(obj)) return true
  seen.add(obj)
  return Object.values(obj).some(val => isCyclic(val, seen))
}

const a = { x: 1 }
a.self = a
isCyclic(a) // true

const b = { x: 1, y: { z: 2 } }
isCyclic(b) // false
```

用 `WeakSet` 追踪已访问对象，递归检查每个属性值。

### 数组去重和扁平化

```js
const unique = (list) => [...new Set(list)]

function flatten(list) {
  return list.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}
```

### 数组去重的其他解法

除 `[...new Set(list)]` 外，常见写法还有：

```js
// 双重循环 + splice（原地删除，会改原数组）
function uniqueByLoop(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        j--
      }
    }
  }
  return arr
}

// includes / indexOf 判断新数组里是否已存在
function uniqueByIncludes(arr) {
  const result = []
  for (const item of arr) {
    if (!result.includes(item)) result.push(item)
  }
  return result
}

// 先排序，再用快慢指针去掉相邻重复
function uniqueBySort(arr) {
  if (arr.length === 0) return []
  const sorted = [...arr].sort((a, b) => a - b)
  let slow = 0
  for (let fast = 1; fast < sorted.length; fast++) {
    if (sorted[fast] !== sorted[slow]) sorted[++slow] = sorted[fast]
  }
  sorted.length = slow + 1
  return sorted
}

// Map 哈希表记录是否出现过
function uniqueByMap(arr) {
  const seen = new Map()
  const result = []
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.set(item, true)
      result.push(item)
    }
  }
  return result
}

// filter + indexOf：只保留首次出现的位置
function uniqueByFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index)
}

// reduce + includes
function uniqueByReduce(arr) {
  return arr.reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), [])
}
```

### 手写数组遍历方法

`forEach` / `map` / `filter` / `reduce` / `some` / `every` / `find` 的核心都是遍历加回调，区别在返回值和中断逻辑。

```js
Array.prototype.myForEach = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this) callback.call(thisArg, this[i], i, this)
  }
}

Array.prototype.myMap = function (callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback.call(thisArg, this[i], i, this)
  }
  return result
}

Array.prototype.myFilter = function (callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) result.push(this[i])
  }
  return result
}

Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue
  let start = 0
  if (arguments.length < 2) {
    acc = this[0]
    start = 1
  }
  for (let i = start; i < this.length; i++) {
    acc = callback(acc, this[i], i, this)
  }
  return acc
}

Array.prototype.mySome = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) return true
  }
  return false
}

Array.prototype.myEvery = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && !callback.call(thisArg, this[i], i, this)) return false
  }
  return true
}

Array.prototype.myFind = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) return this[i]
  }
  return undefined
}
```

### 手写 `push` / `pop`

```js
Array.prototype.myPush = function (...items) {
  for (let i = 0; i < items.length; i++) {
    this[this.length] = items[i]
  }
  return this.length
}

Array.prototype.myPop = function () {
  if (this.length === 0) return undefined
  const last = this[this.length - 1]
  this.length -= 1
  return last
}
```

### 手写 `splice`

```js
Array.prototype.mySplice = function (start, deleteCount, ...items) {
  const len = this.length
  if (start < 0) start = Math.max(len + start, 0)
  else start = Math.min(start, len)
  if (deleteCount === undefined) deleteCount = len - start
  deleteCount = Math.min(Math.max(deleteCount, 0), len - start)

  // 收集被删除的元素
  const removed = []
  for (let i = start; i < start + deleteCount; i++) removed.push(this[i])

  const diff = items.length - deleteCount
  if (diff > 0) {
    // 需要扩展：从后往前移
    for (let i = len - 1; i >= start + deleteCount; i--) this[i + diff] = this[i]
  } else if (diff < 0) {
    // 需要收缩：从前往后移
    for (let i = start + deleteCount; i < len; i++) this[i + diff] = this[i]
  }

  for (let i = 0; i < items.length; i++) this[start + i] = items[i]
  this.length = len + diff

  return removed
}
```

### 手写 `sort`（V8 思路）

V8 引擎的排序策略：元素 ≤ 10 用插入排序（小常数），> 10 用快速排序（三数取中选基准）：

```js
Array.prototype.mySort = function (compareFn) {
  if (typeof compareFn !== 'function') {
    compareFn = (a, b) => String(a).localeCompare(String(b))
  }

  function insertion(arr, lo, hi) {
    for (let i = lo + 1; i <= hi; i++) {
      const cur = arr[i]
      let j = i - 1
      while (j >= lo && compareFn(arr[j], cur) > 0) {
        arr[j + 1] = arr[j--]
      }
      arr[j + 1] = cur
    }
  }

  function partition(arr, lo, hi) {
    const pivot = arr[hi]
    let p = lo
    for (let i = lo; i < hi; i++) {
      if (compareFn(arr[i], pivot) <= 0) {
        ;[arr[i], arr[p]] = [arr[p], arr[i]]
        p++
      }
    }
    ;[arr[p], arr[hi]] = [arr[hi], arr[p]]
    return p
  }

  function quick(arr, lo, hi) {
    if (hi <= lo) return
    if (hi - lo < 10) {
      insertion(arr, lo, hi)
      return
    }
    const p = partition(arr, lo, hi)
    quick(arr, lo, p - 1)
    quick(arr, p + 1, hi)
  }

  quick(this, 0, this.length - 1)
  return this
}
```

### 手写 `Set`

用对象的键保证元素唯一。

```js
class MySet {
  constructor() {
    this.items = Object.create(null)
    this.size = 0
  }

  has(value) {
    return value in this.items
  }

  add(value) {
    if (!this.has(value)) {
      this.items[value] = value
      this.size++
    }
    return this
  }

  delete(value) {
    if (this.has(value)) {
      delete this.items[value]
      this.size--
    }
    return this
  }

  values() {
    return Object.values(this.items)
  }
}
```

### 手写 `Map`

对象的键只能是字符串，所以对复杂 key 先做序列化。

```js
class MyMap {
  #items = Object.create(null)
  size = 0

  #toKey(key) {
    if (key === null) return 'null'
    if (key === undefined) return 'undefined'
    if (typeof key === 'object') return JSON.stringify(key)
    return String(key)
  }

  has(key) {
    return this.#toKey(key) in this.#items
  }

  set(key, value) {
    if (!this.has(key)) this.size++
    this.#items[this.#toKey(key)] = value
    return this
  }

  get(key) {
    return this.#items[this.#toKey(key)]
  }

  delete(key) {
    if (this.has(key)) {
      delete this.#items[this.#toKey(key)]
      this.size--
    }
    return this
  }
}
```

### LRU 缓存

最近最少使用缓存利用 `Map`「插入即最新、迭代顺序即访问新旧」的特性：读写时把 key 移到最后，超容量时淘汰最旧的（`Map` 的第一个 key）。

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key) {
    if (!this.cache.has(key)) return -1
    const value = this.cache.get(key)
    // 访问后变成最新：先删再插
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key)
    this.cache.set(key, value)
    if (this.cache.size > this.capacity) {
      // Map.keys().next().value 是最旧的 key
      this.cache.delete(this.cache.keys().next().value)
    }
  }
}
```

### 数组转树

```js
function arrayToTree(items, rootId = null) {
  const map = new Map()
  const roots = []

  items.forEach((item) => map.set(item.id, { ...item, children: [] }))

  items.forEach((item) => {
    const node = map.get(item.id)
    if (item.parentId === rootId) {
      roots.push(node)
    } else {
      map.get(item.parentId)?.children.push(node)
    }
  })

  return roots
}
```

### 树结构的新增 / 删除节点

在 `arrayToTree` 得到的树上增删节点，用深度优先递归找到目标父节点或目标节点：

```js
// 在 parentId 节点的 children 里新增一个节点
function insertNode(tree, parentId, node) {
  for (const item of tree) {
    if (item.id === parentId) {
      item.children = item.children ?? []
      item.children.push({ ...node, children: [] })
      return true
    }
    if (item.children && insertNode(item.children, parentId, node)) return true
  }
  return false
}

// 删除 id 命中的节点（连同其子树）
function removeNode(tree, id) {
  const index = tree.findIndex((item) => item.id === id)
  if (index > -1) {
    tree.splice(index, 1)
    return true
  }
  for (const item of tree) {
    if (item.children && removeNode(item.children, id)) return true
  }
  return false
}
```

### 排序算法

```js
// 冒泡排序 O(n²)
function bubbleSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
    }
  }
  return arr
}

// 选择排序 O(n²)
function selectionSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
  }
  return arr
}

// 插入排序 O(n²)，小数组性能好
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > cur) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = cur
  }
  return arr
}

// 快速排序 O(n log n) 平均
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr
  const pivot = arr[hi]
  let p = lo
  for (let i = lo; i < hi; i++) {
    if (arr[i] <= pivot) {
      ;[arr[i], arr[p]] = [arr[p], arr[i]]
      p++
    }
  }
  ;[arr[p], arr[hi]] = [arr[hi], arr[p]]
  quickSort(arr, lo, p - 1)
  quickSort(arr, p + 1, hi)
  return arr
}

// 归并排序 O(n log n)，稳定排序
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  const result = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++])
    else result.push(right[j++])
  }
  return [...result, ...left.slice(i), ...right.slice(j)]
}
```

### 大数相加

```js
function addBigNumber(a, b) {
  const maxLen = Math.max(a.length, b.length)
  a = a.padStart(maxLen, '0')
  b = b.padStart(maxLen, '0')

  let carry = 0
  let result = ''

  for (let i = maxLen - 1; i >= 0; i--) {
    const sum = Number(a[i]) + Number(b[i]) + carry
    carry = Math.floor(sum / 10)
    result = (sum % 10) + result
  }

  if (carry) result = carry + result
  return result
}

addBigNumber('9999999999999999', '1') // '10000000000000000'
```

### 数组分块（chunk）

把一维数组按固定长度切成二维数组，用 `slice` 截取，不改原数组。

```js
function chunk(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size)) // slice 返回浅拷贝，不改原数组
  }
  return result
}

chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

### 实现数组的 flat 方法

```js
function _flat(arr, depth) {
  if (!Array.isArray(arr) || depth <= 0) {
    return arr;
  }
  return arr.reduce((prev, cur) => {
    if (Array.isArray(cur)) {
      return prev.concat(_flat(cur, depth - 1));
    } else {
      return prev.concat(cur);
    }
  }, []);
}
```

### 有序二维数组查找目标值

从右上角出发：当前值大于目标则向左，小于目标则向下。

```js
var findNumberIn2DArray = function (matrix, target) {
  if (matrix == null || matrix.length === 0) {
    return false;
  }
  let row = 0;
  let column = matrix[0].length - 1;
  while (row < matrix.length && column >= 0) {
    if (matrix[row][column] === target) {
      return true;
    } else if (matrix[row][column] > target) {
      column--;
    } else {
      row++;
    }
  }
  return false;
};
```

### 二维数组斜向打印

```js
function printMatrix(arr) {
  let m = arr.length,
    n = arr[0].length;
  let res = [];

  // 左上角：从第 0 列到第 n-1 列
  for (let k = 0; k < n; k++) {
    for (let i = 0, j = k; i < m && j >= 0; i++, j--) {
      res.push(arr[i][j]);
    }
  }

  // 右下角：从第 1 行到第 m-1 行
  for (let k = 1; k < m; k++) {
    for (let i = k, j = n - 1; i < m && j >= 0; i++, j--) {
      res.push(arr[i][j]);
    }
  }
  return res;
}
```

### 实现斐波那契数列

递归版（有重复计算）：

```js
function fn(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fn(n - 2) + fn(n - 1);
}
```

数组缓存版：

```js
function fibonacci2(n) {
  const arr = [1, 1, 2];
  if (n <= arr.length) {
    return arr[n];
  }
  for (let i = arr.length; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr[arr.length - 1];
}
```

非递归迭代版：

```js
function fn(n) {
  let pre1 = 1,
    pre2 = 1,
    current = 2;
  if (n <= 2) return current;
  for (let i = 2; i < n; i++) {
    pre1 = pre2;
    pre2 = current;
    current = pre1 + pre2;
  }
  return current;
}
```

### 字符串不重复最长子串长度

滑动窗口 + Map 记录字符最新索引：

```js
var lengthOfLongestSubstring = function (s) {
  let map = new Map();
  let i = -1; // 窗口左边界
  let res = 0;
  for (let j = 0; j < s.length; j++) {
    if (map.has(s[j])) {
      // 遇到重复字符，左边界跳到该字符上次出现位置
      i = Math.max(i, map.get(s[j]));
    }
    res = Math.max(res, j - i);
    map.set(s[j], j);
  }
  return res;
};
```

### 小孩报数问题（约瑟夫环）

30 个小孩编号 1-30，围成一圈报数，数到 3 退出，求最后剩下的编号：

```js
function childNum(num, count) {
  let allplayer = [];
  for (let i = 0; i < num; i++) {
    allplayer[i] = i + 1;
  }

  let exitCount = 0; // 已离开人数
  let counter = 0;   // 当前报数
  let curIndex = 0;  // 当前下标

  while (exitCount < num - 1) {
    if (allplayer[curIndex] !== 0) counter++;

    if (counter === count) {
      allplayer[curIndex] = 0; // 标记为已退出
      counter = 0;
      exitCount++;
    }
    curIndex++;
    if (curIndex === num) {
      curIndex = 0;
    }
  }
  for (let i = 0; i < num; i++) {
    if (allplayer[i] !== 0) {
      return allplayer[i];
    }
  }
}
childNum(30, 3);
```

### 数组乱序输出（Fisher-Yates 洗牌）

正序遍历版：

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (var i = 0; i < arr.length; i++) {
  const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
  [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
}
console.log(arr);
```

倒序遍历版（标准 Fisher-Yates）：

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let length = arr.length;
while (length) {
  const randomIndex = Math.floor(Math.random() * length--);
  [arr[length], arr[randomIndex]] = [arr[randomIndex], arr[length]];
}
console.log(arr);
```

## 字符串与数据处理

### 判断数据类型

`Object.prototype.toString` 能区分内置类型，弥补 `typeof` 对 `null`、数组、日期等的不足。

```js
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

getType(null) // 'null'
getType([]) // 'array'
getType(/x/) // 'regexp'
```

### Object.is 实现

`Object.is` 与 `===` 的区别：`+0 !== -0`，`NaN === NaN`。

```js
function objectIs(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b // 区分 +0 和 -0
  }
  return a !== a && b !== b // NaN 判断
}

objectIs(NaN, NaN) // true
objectIs(+0, -0)  // false
```

### 千分位分隔符

用前瞻断言在每三位数字前插入分隔符，不影响小数部分。

```js
function thousandSeparator(num) {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

thousandSeparator(100000000) // '100,000,000'
```

### 下划线转小驼峰

```js
function toCamelCase(key) {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

toCamelCase('user_name') // 'userName'
```

### 日期格式化

```js
function dateFormat(date, format) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
}

dateFormat(new Date('2020-12-01'), 'yyyy/MM/dd') // '2020/12/01'
dateFormat(new Date('2020-04-01'), 'yyyy年MM月dd日') // '2020年04月01日'
```

### 解析 URL Params

```js
function parseParam(url) {
  const queryIndex = url.indexOf('?')
  const paramsStr = queryIndex >= 0 ? url.slice(queryIndex + 1) : ''
  const paramsObj = {}
  if (!paramsStr) return paramsObj
  paramsStr.split('&').forEach(param => {
    const eqIndex = param.indexOf('=')
    if (eqIndex >= 0) {
      const key = param.slice(0, eqIndex)
      let val = decodeURIComponent(param.slice(eqIndex + 1))
      val = /^\d+$/.test(val) ? Number(val) : val
      if (Object.prototype.hasOwnProperty.call(paramsObj, key)) {
        paramsObj[key] = [].concat(paramsObj[key], val)
      } else {
        paramsObj[key] = val
      }
    } else {
      paramsObj[param] = true
    }
  })
  return paramsObj
}

// parseParam('http://example.com/?user=alice&id=1&id=2&enabled')
// { user: 'alice', id: [1, 2], enabled: true }
```

### 模板字符串解析

```js
function renderTemplate(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    return key.trim().split('.').reduce((obj, k) => obj?.[k], data) ?? ''
  })
}

renderTemplate('Hello {{name}}, age: {{info.age}}', {
  name: 'Alice',
  info: { age: 25 }
})
// 'Hello Alice, age: 25'
```

### 对象 flatten（DFS）

```js
function flattenObj(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObj(value, fullKey))
    } else {
      acc[fullKey] = value
    }
    return acc
  }, {})
}

flattenObj({ a: { b: { c: 1 }, d: 2 }, e: 3 })
// { 'a.b.c': 1, 'a.d': 2, 'e': 3 }
```

### 版本号排序

```js
function sortVersions(versions) {
  return versions.sort((a, b) => {
    const partsA = a.split('.').map(Number)
    const partsB = b.split('.').map(Number)
    const maxLen = Math.max(partsA.length, partsB.length)
    for (let i = 0; i < maxLen; i++) {
      const diff = (partsA[i] || 0) - (partsB[i] || 0)
      if (diff !== 0) return diff
    }
    return 0
  })
}

sortVersions(['1.2.3', '0.10.0', '1.2.4', '2.0.0', '1.1.1'])
// ['0.10.0', '1.1.1', '1.2.3', '1.2.4', '2.0.0']
```

### 查找文章中出现频率最高的单词

```js
function findMostWord(article) {
  if (!article) return;
  article = article.trim().toLowerCase();
  let wordList = article.match(/[a-z]+/g);
  let visited = [];
  let maxNum = 0;
  let maxWord = '';
  // 在前后加空格，避免正则误匹配子串
  article = ' ' + wordList.join('  ') + ' ';
  wordList.forEach(function (item) {
    if (visited.indexOf(item) < 0) {
      visited.push(item);
      let word = new RegExp(' ' + item + ' ', 'g');
      let num = article.match(word).length;
      if (num > maxNum) {
        maxNum = num;
        maxWord = item;
      }
    }
  });
  return maxWord + '  ' + maxNum;
}
```

### 按数值找到对应的数组名 `test(num)`

给若干命名数组，输入数值返回它所属的数组名：

```js
const a = [1, 2, 3]
const b = [4, 5, 6]
const c = [7, 8, 9]

function test(num) {
  const groups = { a, b, c }
  for (const [name, arr] of Object.entries(groups)) {
    if (arr.includes(num)) return name
  }
  return null
}

test(5) // 'b'
```

如果数组表示的是连续区间（如分数段），把 `arr.includes(num)` 换成 `num >= min && num < max` 的边界判断即可。

### 实现字符串的 repeat 方法

```js
function repeat(s, n) {
  return new Array(n + 1).join(s);
}
```

递归版：

```js
function repeat(s, n) {
  return n > 0 ? s.concat(repeat(s, --n)) : '';
}
```

### 实现字符串翻转

```js
String.prototype._reverse = function (a) {
  return a.split('').reverse().join('');
};
var obj = new String();
var res = obj._reverse('hello');
console.log(res); // olleh
```

### 将手机号中间四位变成 \*

方法一：splice + split + join：

```js
const tel = '18877776666';
const ary = tel.split('');
ary.splice(3, 4, '****');
const tel1 = ary.join('');
console.log(tel1); // 188****6666
```

方法二：substr：

```js
const tel = '18877776666';
const tel1 = tel.substr(0, 3) + '****' + tel.substr(7);
console.log(tel1); // 188****6666
```

方法三：正则：

```js
const tel = '18877776666';
const tel1 = tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
console.log(tel1); // 188****6666
```

### 数组元素求和

普通数组求和：

```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = arr.reduce((total, i) => total + i, 0);
console.log(sum); // 55
```

嵌套数组求和（先展平）：

```js
let arr = [1, 2, 3, [[4, 5], 6], 7, 8, 9];
let sum = arr.toString().split(',').reduce((total, i) => total + Number(i), 0);
console.log(sum);
```

递归实现：

```js
function add(arr) {
  if (arr.length === 1) return arr[0];
  return arr[0] + add(arr.slice(1));
}
console.log(add([1, 2, 3, 4, 5, 6])); // 21
```

### 使用 reduce 求和（多场景）

普通数组：

```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.reduce((prev, cur) => prev + cur, 0); // 55
```

嵌套数组：

```js
let arr = [1, 2, 3, [[4, 5], 6], 7, 8, 9];
arr.flat(Infinity).reduce((prev, cur) => prev + cur, 0);
```

对象数组（按属性求和）：

```js
let arr = [{ a: 9, b: 3, c: 4 }, { a: 1, b: 3 }, { a: 3 }];
arr.reduce((prev, cur) => prev + cur['a'], 0); // 13
```

### 使用 ES5 和 ES6 求函数参数的和

ES5（使用 arguments）：

```js
function sum() {
  let sum = 0;
  Array.prototype.forEach.call(arguments, function (item) {
    sum += item * 1;
  });
  return sum;
}
```

ES6（使用剩余参数）：

```js
function sum(...nums) {
  let sum = 0;
  nums.forEach(function (item) {
    sum += item * 1;
  });
  return sum;
}
```

### 实现类数组转化为数组

```js
// 通过 slice
Array.prototype.slice.call(arrayLike);

// 通过 splice
Array.prototype.splice.call(arrayLike, 0);

// 通过 concat + apply
Array.prototype.concat.apply([], arrayLike);

// 通过 Array.from
Array.from(arrayLike);
```

### 交换两个变量的值（不用临时变量）

巧用加减法：

```js
a = a + b;
b = a - b;
a = a - b;
```

或用解构赋值：

```js
[a, b] = [b, a];
```

### 实现每隔一秒打印 1, 2, 3, 4

闭包版（var）：

```js
for (var i = 0; i < 5; i++) {
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  })(i);
}
```

let 块级作用域版：

```js
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

## DOM 与浏览器

### 手写防抖和节流

```js
function debounce(fn, delay) {
  let timer

  return function debounced(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

function throttle(fn, delay) {
  let lastTime = 0
  let timer

  return function throttled(...args) {
    const now = Date.now()
    const remaining = delay - (now - lastTime)

    clearTimeout(timer)

    if (remaining <= 0) {
      lastTime = now
      fn.apply(this, args)
    } else {
      timer = setTimeout(() => {
        lastTime = Date.now()
        fn.apply(this, args)
      }, remaining)
    }
  }
}
```

### 节流：可配置首次 / 尾部触发

上面的 `throttle` 默认尾部补最后一次。实际需求常要单独控制「开头是否立即执行」和「结尾是否补一次」，加 options 即可：

```js
function throttle(fn, delay, { leading = true, trailing = true } = {}) {
  let lastTime = 0
  let timer = null

  return function throttled(...args) {
    const now = Date.now()
    // leading 为 false 时，把首次触发也推迟，不立即执行
    if (!lastTime && leading === false) lastTime = now

    const remaining = delay - (now - lastTime)

    if (remaining <= 0) {
      // 到点了：立即执行，并清掉待执行的尾部任务
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      fn.apply(this, args)
    } else if (trailing && !timer) {
      // 没到点：安排一次尾部执行，保证「最后一次必执行」
      timer = setTimeout(() => {
        lastTime = leading === false ? 0 : Date.now()
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  }
}
```

`trailing: true` 时，即使最后一次触发落在时间窗内，也会在窗口结束时补上，满足「最后一次必须执行」。

### 手写 EventBus

```js
class EventBus {
  #events = new Map()

  on(type, listener) {
    const listeners = this.#events.get(type) ?? new Set()
    listeners.add(listener)
    this.#events.set(type, listeners)

    return () => this.off(type, listener)
  }

  off(type, listener) {
    this.#events.get(type)?.delete(listener)
  }

  emit(type, payload) {
    this.#events.get(type)?.forEach((listener) => {
      listener(payload)
    })
  }
}
```

### 手写 EventEmitter（发布订阅，支持 `once`）

与上面 `EventBus` 思路一致，区别是额外提供 `once`（触发一次后自动解绑）。

```js
class EventEmitter {
  constructor() {
    this.cache = new Map()
  }

  on(name, fn) {
    const fns = this.cache.get(name) ?? []
    fns.push(fn)
    this.cache.set(name, fns)
  }

  off(name, fn) {
    const fns = this.cache.get(name)
    if (fns) {
      const index = fns.indexOf(fn)
      if (index > -1) fns.splice(index, 1)
    }
  }

  emit(name, ...args) {
    const fns = this.cache.get(name)
    if (fns) {
      // 复制一份，避免回调内再注册同事件导致死循环
      fns.slice().forEach((fn) => fn(...args))
    }
  }

  once(name, fn) {
    const wrapper = (...args) => {
      fn(...args)
      this.off(name, wrapper)
    }
    this.on(name, wrapper)
  }
}
```

### 组合函数

```js
const compose = (...fns) => {
  return (value) => fns.reduceRight((result, fn) => fn(result), value)
}
```

### compose：koa 中间件洋葱模型

`compose` 是同步版。koa 的中间件 compose 要支持异步 `await next()`，形成「进入每层 → 等内层完成 → 回到外层」的洋葱顺序：

```js
function composeKoa(middlewares) {
  return function (context, next) {
    let lastIndex = -1

    function dispatch(i) {
      // 同一个中间件里多次调用 next 会让 i 回退，这里拦截报错
      if (i <= lastIndex) return Promise.reject(new Error('next() called multiple times'))
      lastIndex = i

      const fn = i === middlewares.length ? next : middlewares[i]
      if (!fn) return Promise.resolve()

      try {
        // 把「调用下一个中间件」作为 next 传进去
        return Promise.resolve(fn(context, () => dispatch(i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
```

没有 async/await 的年代，koa1 用 Generator + co 库实现同样的洋葱顺序：`yield next` 把控制权交给内层，内层迭代完再恢复外层。

### setTimeout 模拟 setInterval（带取消）

```js
function mySetInterval(fn, delay) {
  let timerId = null

  function tick() {
    fn()
    timerId = setTimeout(tick, delay)
  }

  timerId = setTimeout(tick, delay)

  return {
    cancel() {
      clearTimeout(timerId)
    }
  }
}

// 使用
const timer = mySetInterval(() => console.log('tick'), 1000)
timer.cancel()
```

### LazyMan（链式调用任务队列）

```js
class LazyManClass {
  constructor(name) {
    this.tasks = []
    console.log(`Hi! This is ${name}!`)
    setTimeout(() => this.next(), 0) // 等链式调用完成再执行队列
  }

  next() {
    const task = this.tasks.shift()
    if (task) task()
  }

  sleep(time) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log(`Wake up after ${time}s`)
        this.next()
      }, time * 1000)
    })
    return this
  }

  sleepFirst(time) {
    this.tasks.unshift(() => {
      setTimeout(() => {
        console.log(`Wake up after ${time}s`)
        this.next()
      }, time * 1000)
    })
    return this
  }

  eat(food) {
    this.tasks.push(() => {
      console.log(`Eat ${food}~`)
      this.next()
    })
    return this
  }
}

function LazyMan(name) {
  return new LazyManClass(name)
}

// LazyMan('Hank').sleep(1).eat('dinner')
// Hi! This is Hank!
// (1s 后) Wake up after 1s
// Eat dinner~
```

### DOM 转 JSON

```js
function dom2json(el) {
  const obj = {
    tag: el.tagName.toLowerCase(),
    attrs: {},
    children: []
  }

  for (const attr of el.attributes) {
    obj.attrs[attr.name] = attr.value
  }

  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim()
      if (text) obj.children.push(text)
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      obj.children.push(dom2json(child))
    }
  }

  return obj
}
```

### 虚拟 DOM 转真实 DOM

```js
function json2dom(vnode) {
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  const el = document.createElement(vnode.tag)

  if (vnode.attrs) {
    for (const [key, value] of Object.entries(vnode.attrs)) {
      el.setAttribute(key, value)
    }
  }

  if (vnode.children) {
    for (const child of vnode.children) {
      el.appendChild(json2dom(child))
    }
  }

  return el
}

// 使用
const vnode = {
  tag: 'div',
  attrs: { class: 'app' },
  children: [{ tag: 'span', attrs: {}, children: ['hello'] }]
}
document.body.appendChild(json2dom(vnode))
```

### 分片渲染大数据

用 `requestAnimationFrame` 分批插入 DOM，避免一次性操作造成页面卡顿：

```js
function renderChunks(data, container, chunkSize = 200) {
  let index = 0

  function render() {
    if (index >= data.length) return

    const fragment = document.createDocumentFragment()
    const end = Math.min(index + chunkSize, data.length)

    for (; index < end; index++) {
      const el = document.createElement('div')
      el.textContent = data[index]
      fragment.appendChild(el)
    }

    container.appendChild(fragment)
    requestAnimationFrame(render) // 下一帧继续
  }

  requestAnimationFrame(render)
}
```

### 实现双向数据绑定

使用 `Object.defineProperty` 劫持数据，实现 model → view 的同步：

```js
let obj = {};
let input = document.getElementById('input');
let span = document.getElementById('span');

Object.defineProperty(obj, 'text', {
  configurable: true,
  enumerable: true,
  get() {
    console.log('获取数据了');
  },
  set(newVal) {
    console.log('数据更新了');
    input.value = newVal;
    span.textContent = newVal; // 更新视图
  },
});

// 监听输入，实现 view → model 的同步
input.addEventListener('keyup', function (e) {
  obj.text = e.target.value;
});
```

### 实现简单 Hash 路由

```js
class Route {
  constructor() {
    this.routes = {};      // 路由存储对象
    this.currentHash = ''; // 当前 hash
    this.freshRoute = this.freshRoute.bind(this);
    window.addEventListener('load', this.freshRoute, false);
    window.addEventListener('hashchange', this.freshRoute, false);
  }
  // 注册路由
  storeRoute(path, cb) {
    this.routes[path] = cb || function () {};
  }
  // 刷新路由
  freshRoute() {
    this.currentHash = location.hash.slice(1) || '/';
    this.routes[this.currentHash]();
  }
}
```

### 实现 jsonp

动态插入 `<script>`，用全局回调接收跨域数据。

```js
function jsonp({ url, params = {}, callbackName = `jsonp_${Date.now()}` }) {
  return new Promise((resolve) => {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const script = document.createElement('script')
    script.src = `${url}?${query}&callback=${callbackName}`

    window[callbackName] = (data) => {
      resolve(data)
      document.body.removeChild(script)
      delete window[callbackName]
    }

    document.body.appendChild(script)
  })
}
```

### 找出 Element 元素的全部 Input 子元素

```js
function findAllInputElement(element) {
  const rec = function (element, arr) {
    if (element.nodeName.toUpperCase() === 'INPUT') {
      arr.push(element);
    }
    let children = element.childNodes;
    children.forEach(child => {
      rec(child, arr);
    });
    return arr;
  };
  return rec(element, []);
}
```

## 参考来源

- [MDN: Function.prototype.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN: Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
- [MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: Promise.prototype.finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)
- [MDN: Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN: Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN: Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
- [MDN: Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [MDN: Object.prototype.toString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [MDN: XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- [MDN: 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
