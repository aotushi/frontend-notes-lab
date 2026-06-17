# Proxy 是什么？

## 问题

`Proxy` 和 `Reflect` 分别解决什么问题？`get`、`set`、`has`、`deleteProperty`、`apply`、`construct` 这些 trap 可以拦截哪些操作？它和 `Object.defineProperty` 的区别是什么？

## 结论

### 理解路径

`Proxy` 不是“监听对象变化”的专用 API，而是为对象基本操作提供一层代理。它拦截的是语言层面的对象内部方法，`Reflect` 则提供和这些内部方法对应的默认操作。

### `Proxy` 是什么？

`Proxy` 用来创建一个代理对象。外部对代理对象的读取、写入、删除、属性检查、函数调用、构造调用等操作，可以被 handler 中的 trap 拦截。

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

### `Reflect` 有什么作用？

`Reflect` 提供对象基本操作的函数形式，常用于在 trap 里调用默认行为。它能减少手写 `target[key]` 带来的边界问题，例如 getter 中的 `this`、原型链赋值、返回布尔值等。

### 常见 trap 有哪些？

| trap | 拦截操作 |
| --- | --- |
| `get` | 读取属性 |
| `set` | 写入属性 |
| `has` | `in` 操作符 |
| `deleteProperty` | `delete obj.key` |
| `ownKeys` | `Object.keys`、`Reflect.ownKeys` 等 |
| `getOwnPropertyDescriptor` | 获取属性描述符 |
| `defineProperty` | 定义属性 |
| `apply` | 函数调用 |
| `construct` | `new` 调用 |

### `Proxy` 和 `Object.defineProperty` 有什么区别？

| 维度 | `Object.defineProperty` | `Proxy` |
| --- | --- | --- |
| 拦截方式 | 给已有属性定义 getter/setter | 代理对象整体的基本操作 |
| 新属性 | 需要逐个定义 | 可以天然拦截 |
| 数组索引和长度 | 需要额外处理 | 能拦截数组操作 |
| 操作范围 | 主要是属性读写 | 覆盖读写、删除、枚举、调用、构造等 |
| 兼容性 | 更老浏览器可用 | 不支持 IE，且无法用 polyfill 完整模拟 |

### 使用 `Proxy` 有哪些边界？

1. 必须操作代理对象才会触发 trap，直接操作原对象不会触发。
2. trap 必须遵守对象不变量，例如不能把不可配置属性伪装成不存在。
3. 代理身份和原对象不同，`proxy === target` 为 `false`。
4. 深层对象不会自动代理，需要递归或按需代理。
5. 性能敏感路径中应避免过度代理。

## Demo

### 参数校验代理

```js
function createTypedObject(schema) {
  return new Proxy({}, {
    set(target, key, value) {
      const type = schema[key]
      if (type && typeof value !== type) {
        throw new TypeError(`${String(key)} should be ${type}`)
      }
      target[key] = value
      return true
    }
  })
}

const user = createTypedObject({ name: 'string', age: 'number' })
user.name = 'Ada'
user.age = 30
```

## 参考来源

- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [ECMAScript: Proxy Objects](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)
