# 常见手写题

## 问题

前端 JavaScript 手写题应该如何分类？`debounce`、`throttle`、`deepClone`、`call` / `apply` / `bind`、`new`、`instanceof`、`Promise.all`、`Promise.race`、发布订阅、柯里化、数组去重和扁平化分别考察什么？

## 结论

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

### 手写深拷贝

```js
function deepClone(value, cache = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value

  if (cache.has(value)) return cache.get(value)

  if (value instanceof Date) return new Date(value)
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)

  const result = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  cache.set(value, result)

  for (const key of Reflect.ownKeys(value)) {
    result[key] = deepClone(value[key], cache)
  }

  return result
}
```

生产环境优先考虑 `structuredClone()` 或成熟库。面试实现要说明不完整边界，例如属性描述符、Map、Set、TypedArray、DOM 节点和函数。

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

### 数组去重和扁平化

```js
const unique = (list) => [...new Set(list)]

function flatten(list) {
  return list.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}
```

## Demo

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

### 组合函数

```js
const compose = (...fns) => {
  return (value) => fns.reduceRight((result, fn) => fn(result), value)
}
```

## 参考来源

- [MDN: Function.prototype.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN: Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
- [MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
