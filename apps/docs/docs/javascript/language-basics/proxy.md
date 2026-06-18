# Proxy 是什么？

## 问题

`Proxy` 和 `Reflect` 分别解决什么问题？`get`、`set`、`has`、`deleteProperty`、`ownKeys`、`apply`、`construct` 等 trap 可以拦截哪些操作？它和 `Object.defineProperty` 的区别是什么？为什么 Vue 3 会用 `Proxy` 重写响应式系统？

## 结论

### 理解路径

`Proxy` 不是“监听对象变化”的专用 API，而是为对象基本操作提供一层代理。它拦截的是语言层面的对象内部方法，`Reflect` 则提供和这些内部方法对应的默认操作。理解这组 API 要抓住三点：代理对象身份、trap 与默认行为、对象不变量。

### `Proxy` 是什么？有什么作用？

`Proxy` 用来创建一个代理对象。外部对代理对象的读取、写入、删除、属性检查、枚举、函数调用、构造调用等操作，可以被 handler 中的 trap 拦截。

```js
const state = { count: 0 }

const proxy = new Proxy(state, {
  get(target, key, receiver) {
    console.log('read', key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('write', key, value)
    return Reflect.set(target, key, value, receiver)
  }
})

proxy.count += 1
```

常见用途包括数据校验、日志记录、权限控制、默认值、负索引数组、响应式依赖收集和函数调用代理。

### `Proxy` 代理的是原对象吗？

`Proxy` 返回的是一个新对象，代理对象和原对象不是同一个引用。只有操作代理对象才会触发 trap，直接操作原对象不会触发。

```js
const target = { count: 0 }
const proxy = new Proxy(target, {
  set(target, key, value) {
    console.log('set', key)
    target[key] = value
    return true
  }
})

proxy.count = 1 // 触发 set
target.count = 2 // 不触发 set

proxy === target // false
```

这也是使用 `Proxy` 做响应式时必须统一暴露代理对象的原因。

### `Reflect` 是什么？为什么常和 `Proxy` 一起用？

`Reflect` 提供对象基本操作的函数形式，方法名和很多 Proxy trap 一一对应。它常用于在 trap 里调用默认行为，避免手写 `target[key]`、`target[key] = value` 带来的边界问题。

```js
const proxy = new Proxy({}, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver)
  }
})
```

`receiver` 尤其重要。访问原型链上的 getter 时，`Reflect.get(target, key, receiver)` 可以把 getter 中的 `this` 绑定到最初的接收者，而不是固定成当前 `target`。

### 常见 trap 有哪些？

| trap | 拦截操作 |
| --- | --- |
| `get` | 读取属性 |
| `set` | 写入属性 |
| `has` | `in` 操作符 |
| `deleteProperty` | `delete obj.key` |
| `ownKeys` | `Object.keys`、`Reflect.ownKeys`、对象展开等枚举相关操作 |
| `getOwnPropertyDescriptor` | 获取属性描述符 |
| `defineProperty` | 定义属性 |
| `getPrototypeOf` | 读取原型 |
| `setPrototypeOf` | 设置原型 |
| `isExtensible` | 判断是否可扩展 |
| `preventExtensions` | 阻止扩展 |
| `apply` | 函数调用 |
| `construct` | `new` 调用 |

不是每个业务场景都要实现所有 trap。多数响应式、校验和日志场景只需要 `get`、`set`、`deleteProperty`、`has`、`ownKeys` 中的一部分。

### `Proxy` 和 `Object.defineProperty` 有什么区别？

| 维度 | `Object.defineProperty` | `Proxy` |
| --- | --- | --- |
| 拦截方式 | 给已有属性定义 getter/setter | 代理对象整体的基本操作 |
| 新属性 | 需要重新定义或额外 API | 可以天然拦截 |
| 删除属性 | 不能直接拦截 `delete` | 可用 `deleteProperty` |
| `in` / 枚举 | 不能统一拦截 | 可用 `has`、`ownKeys` |
| 数组索引和长度 | 需要额外重写数组方法或补丁 | 能拦截数组索引和 `length` 变化 |
| 嵌套对象 | 需要递归遍历属性 | 仍需按需代理嵌套对象 |
| 兼容性 | 更老浏览器可用 | 不支持 IE，且无法用 polyfill 完整模拟 |

`Object.defineProperty` 更像“改造属性”，`Proxy` 更像“在对象外包一层操作边界”。

### 为什么 Vue 3 会使用 `Proxy`？

Vue 2 的响应式主要基于 `Object.defineProperty`，需要初始化时遍历对象属性并转换 getter/setter。它对新增属性、删除属性、数组索引和 `length` 等变化支持不自然，需要 `Vue.set`、数组方法重写等补充机制。

Vue 3 使用 `Proxy` 后，可以拦截对象级别的读取、写入、删除、`in` 检查和枚举操作，更适合动态对象和数组。它仍然不是“自动深代理所有对象”：通常在读取嵌套对象时按需把嵌套对象转为响应式代理。

```js
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)

      if (oldValue !== value) {
        trigger(target, key)
      }

      return result
    }
  })
}
```

上面只是最小模型。真实响应式系统还要处理嵌套代理、数组方法、集合类型、只读代理、调度队列和依赖清理。

### trap 必须遵守哪些不变量？

Proxy 不能随意伪造会破坏对象基本规则的结果。比如目标对象上有一个不可配置、不可写的数据属性，`get` trap 不能对这个属性返回不同的值；目标对象不可扩展时，`ownKeys` 不能凭空返回不存在的 key。

```js
const target = {}
Object.defineProperty(target, 'id', {
  value: 1,
  writable: false,
  configurable: false
})

const proxy = new Proxy(target, {
  get() {
    return 2
  }
})

proxy.id // TypeError
```

这些限制称为 Proxy invariants。它们保证代理不会破坏 JavaScript 对象模型的基本一致性。

### `Proxy.revocable()` 有什么用？

`Proxy.revocable()` 会返回代理对象和撤销函数。撤销后再访问代理会抛出 `TypeError`，适合临时授权、资源生命周期管理和沙箱边界。

```js
const { proxy, revoke } = Proxy.revocable({ token: 'secret' }, {})

proxy.token // 'secret'
revoke()
proxy.token // TypeError
```

### 如何用 `Proxy` 代理函数调用？

当目标是函数时，可以用 `apply` 拦截普通调用，用 `construct` 拦截 `new` 调用。

```js
function sum(a, b) {
  return a + b
}

const loggedSum = new Proxy(sum, {
  apply(target, thisArg, args) {
    console.log('call with', args)
    return Reflect.apply(target, thisArg, args)
  }
})

loggedSum(1, 2) // 3
```

这类模式可以用于埋点、调试、权限校验和函数参数规范化。

### 使用 `Proxy` 有哪些边界？

1. 必须操作代理对象才会触发 trap，直接操作原对象不会触发。
2. 代理身份和原对象不同，`proxy === target` 为 `false`。
3. trap 必须遵守对象不变量。
4. 深层对象不会自动代理，需要递归或按需代理。
5. 私有字段、内部插槽和部分内建对象方法不一定能被普通转发透明代理。
6. 性能敏感路径中应避免过度代理。

## Demo

### 参数校验代理

```js
function createTypedObject(schema) {
  return new Proxy({}, {
    set(target, key, value, receiver) {
      const type = schema[key]

      if (type && typeof value !== type) {
        throw new TypeError(`${String(key)} should be ${type}`)
      }

      return Reflect.set(target, key, value, receiver)
    }
  })
}

const user = createTypedObject({ name: 'string', age: 'number' })
user.name = 'Ada'
user.age = 30
```

### 默认值代理

```js
function withDefault(target, fallback) {
  return new Proxy(target, {
    get(target, key, receiver) {
      if (Reflect.has(target, key)) {
        return Reflect.get(target, key, receiver)
      }

      return fallback
    }
  })
}

const config = withDefault({ theme: 'dark' }, 'unset')
config.theme // 'dark'
config.locale // 'unset'
```

## 参考来源

- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [MDN: Proxy.revocable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable)
- [ECMAScript: Proxy Objects](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)
