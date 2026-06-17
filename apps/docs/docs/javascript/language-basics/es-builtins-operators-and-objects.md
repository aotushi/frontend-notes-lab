# ES 基础、内置对象与常见表达式题

## 问题

数组、对象、Map、Set、WeakMap、WeakSet、Iterator、Generator、JSON、Date、RegExp 和常见表达式题应该如何归类和回答？为什么有些题看起来像手写题，本质却在考内置对象语义？

## 结论

### 理解路径

内置对象题不要只背 API。先判断它解决的是集合、键值映射、迭代协议、序列化、文本匹配还是时间处理，再说明和普通对象、数组、手写实现之间的边界。

### `Map` 和普通对象有什么区别？

| 维度 | `Object` | `Map` |
| --- | --- | --- |
| key 类型 | 字符串或 Symbol | 任意值 |
| 原型属性干扰 | 默认有原型链 | 无业务 key 干扰 |
| 数量 | 需要手动维护或 `Object.keys()` | `size` |
| 迭代顺序 | 有属性顺序规则 | 按插入顺序迭代 |
| 使用场景 | 结构化记录 | 动态键值表 |

对象适合表达固定结构数据，`Map` 适合频繁增删、key 类型不固定或需要按插入顺序遍历的映射。

### `Set` 适合解决什么问题？

`Set` 保存唯一值，按插入顺序迭代。它常用于去重、集合关系和存在性判断。

```js
const unique = [...new Set([1, 1, 2, 3])]
```

`Set` 判断相等使用 SameValueZero：`NaN` 视为相等，`+0` 和 `-0` 视为相等。

### `WeakMap` / `WeakSet` 与 `Map` / `Set` 的区别是什么？

`WeakMap` 和 `WeakSet` 弱持有对象 key，不阻止垃圾回收，不可枚举，也没有 `size`。它们适合对象元数据和私有状态，不适合需要遍历全部条目的业务集合。

### Iterator 和 Iterable 是什么？

Iterable 是实现了 `Symbol.iterator` 方法的对象；Iterator 是具有 `next()` 方法、每次返回 `{ value, done }` 的迭代器对象。

`for...of`、展开语法、数组解构、`Promise.all` 等都会消费 iterable。

```js
const range = {
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i += 1) {
      yield i
    }
  }
}

[...range] // [1, 2, 3]
```

### Generator 有什么作用？

Generator 函数可以暂停和恢复执行，返回一个 iterator。它适合表达惰性序列、异步流程的早期抽象、遍历器生成和可中断任务。

```js
function* ids() {
  let id = 1
  while (true) {
    yield id++
  }
}
```

### 数组方法怎么分类？

| 类别 | 常见方法 | 是否改变原数组 |
| --- | --- | --- |
| 遍历/转换 | `map`、`filter`、`reduce`、`flatMap` | 否 |
| 查找 | `find`、`findIndex`、`includes`、`some`、`every` | 否 |
| 增删改 | `push`、`pop`、`shift`、`unshift`、`splice` | 是 |
| 排序/反转 | `sort`、`reverse` | 是 |
| 复制/拼接 | `slice`、`concat`、`toSorted`、`toReversed`、`toSpliced` | 旧方法多不改，新 `to*` 方法不改 |

面试里要注意 `sort()` 默认按字符串排序，数字排序应传比较函数。

```js
[10, 2, 1].sort()           // [1, 10, 2]
[10, 2, 1].sort((a, b) => a - b) // [1, 2, 10]
```

### 对象属性顺序是否可靠？

现代规范定义了对象自有属性枚举顺序：整数索引键按升序，其它字符串键按创建顺序，Symbol 键按创建顺序。虽然顺序有规范，但对象仍不应被滥用为有序列表；需要稳定插入顺序的键值集合时优先用 `Map`。

### JSON 有哪些边界？

`JSON.stringify` 只支持 JSON 数据模型。`undefined`、函数、Symbol 在对象属性中会被忽略，在数组中会变成 `null`；`BigInt` 默认会抛错；循环引用会抛错；`Date` 通常会序列化为 ISO 字符串。

```js
JSON.stringify({ a: undefined, b: () => {}, c: Symbol('x') }) // '{}'
JSON.stringify([undefined, () => {}]) // '[null,null]'
```

### 正则题应该关注什么？

正则表达式用于文本匹配、提取、替换和验证。回答时关注：

1. 字符类、量词、分组、捕获、断言。
2. `g`、`i`、`m`、`s`、`u`、`y` 等标志。
3. `test` 和 `exec` 在全局匹配下会受 `lastIndex` 影响。
4. 复杂 HTML、URL、嵌套语法不应只靠正则解析。

## Demo

### `Map` 保留插入顺序

```js
const scores = new Map()
scores.set({ id: 1 }, 90)
scores.set('total', 1)

for (const [key, value] of scores) {
  console.log(key, value)
}
```

### `JSON.stringify` 的丢失项

```js
const data = {
  name: 'Ada',
  empty: undefined,
  run() {}
}

JSON.stringify(data) // '{"name":"Ada"}'
```

## 参考来源

- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
