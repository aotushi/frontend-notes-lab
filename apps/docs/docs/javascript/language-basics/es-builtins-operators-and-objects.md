# ES 基础、内置对象与常见表达式题

## 问题

`Symbol`、`Map`、`Set`、`WeakMap`、`WeakSet`、Iterator、Generator、数组方法、`Object.assign`、JSON、RegExp、ArrayBuffer、TypedArray 和常见表达式题应该如何归类和回答？为什么有些题看起来像手写题，本质却在考内置对象语义？

## 结论

### 理解路径

内置对象题不要只背 API。先判断它解决的是唯一标识、集合、键值映射、迭代协议、序列化、文本匹配、二进制数据还是时间/数学计算，再说明和普通对象、数组、手写实现之间的边界。

### `Symbol` 是什么？适合解决什么问题？

`Symbol` 是一种原始类型，每次调用 `Symbol()` 都会创建唯一值。它常用于避免对象属性名冲突、定义协议钩子和实现非字符串 key。

```js
const id = Symbol('id')
const user = {
  [id]: 1,
  name: 'Ada'
}

Object.keys(user) // ['name']
Reflect.ownKeys(user) // [ 'name', Symbol(id) ]
```

`Symbol` 属性不会被 `for...in`、`Object.keys()` 和 `JSON.stringify()` 常规枚举出来，但它不是私有属性。需要全局共享同名 Symbol 时使用 `Symbol.for()`，需要读取全局注册表中的 key 时使用 `Symbol.keyFor()`。

### `Map` 和普通对象有什么区别？

| 维度 | `Object` | `Map` |
| --- | --- | --- |
| key 类型 | 字符串或 Symbol | 任意值 |
| 原型属性干扰 | 默认有原型链 | 无业务 key 干扰 |
| 数量 | 需要手动维护或 `Object.keys()` | `size` |
| 迭代顺序 | 有属性顺序规则 | 按插入顺序迭代 |
| 使用场景 | 结构化记录 | 动态键值表 |

对象适合表达固定结构数据，`Map` 适合频繁增删、key 类型不固定或需要按插入顺序遍历的映射。

### `Map`、对象和数组如何互相转换？

`Map` 与二维键值数组可以直接互转；对象和 `Map` 互转时要注意对象 key 只能是字符串或 Symbol。

```js
const map = new Map([
  ['name', 'Ada'],
  ['age', 30]
])

const entries = [...map]
const object = Object.fromEntries(map)
const nextMap = new Map(Object.entries(object))
```

如果 `Map` 使用对象作为 key，转成普通对象会丢失 key 的对象身份。

### `Set` 适合解决什么问题？

`Set` 保存唯一值，按插入顺序迭代。它常用于去重、集合关系和存在性判断。

```js
const unique = [...new Set([1, 1, 2, 3])]
```

`Set` 判断相等使用 SameValueZero：`NaN` 视为相等，`+0` 和 `-0` 视为相等。

### `WeakMap` / `WeakSet` 与 `Map` / `Set` 的区别是什么？

`WeakMap` 和 `WeakSet` 弱持有对象 key，不阻止垃圾回收，不可枚举，也没有 `size`。它们适合对象元数据和私有状态，不适合需要遍历全部条目的业务集合。

常见场景：

1. 给 DOM 节点或业务对象保存附加状态。
2. 保存类实例私有数据。
3. 做不延长对象生命周期的缓存。

```js
const meta = new WeakMap()

function mark(node, value) {
  meta.set(node, value)
}
```

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

Generator 函数可以暂停和恢复执行，返回一个 iterator。它适合表达惰性序列、遍历器生成、可中断任务和控制流。`async` / `await` 可以理解为把 Promise 流程写成同步形态的更高层语法，不应再用 Generator 手写复杂异步流程作为现代首选。

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
| 复制/拼接 | `slice`、`concat` | 否 |
| 复制式新方法 | `toSorted`、`toReversed`、`toSpliced` | 否 |

原页面这里把旧数组方法概括成“多不改”不够准确：`splice`、`sort`、`reverse` 会改变原数组，而 `slice`、`concat`、`map`、`filter` 不会。

### `map`、`forEach`、`filter`、`reduce` 有什么区别？

| 方法 | 返回值 | 用途 |
| --- | --- | --- |
| `forEach` | `undefined` | 只做遍历和副作用 |
| `map` | 新数组 | 一对一转换 |
| `filter` | 新数组 | 按条件筛选 |
| `reduce` | 任意累积结果 | 汇总、分组、转换结构 |

需要转换数组时用 `map`，需要副作用时用 `forEach`，需要汇总结果时用 `reduce`。不要为了遍历副作用滥用 `map`，也不要为了可读性很差的“一行代码”滥用 `reduce`。

### `slice` 和 `splice` 有什么区别？

`slice(start, end)` 读取一段元素并返回新数组，不改变原数组。`splice(start, deleteCount, ...items)` 会删除或插入元素，改变原数组，并返回被删除的元素。

```js
const list = [1, 2, 3, 4]

list.slice(1, 3) // [2, 3]
list // [1, 2, 3, 4]

list.splice(1, 2, 'x') // [2, 3]
list // [1, 'x', 4]
```

### `sort()` 默认按什么排序？

`sort()` 默认把元素转成字符串后按 UTF-16 码元顺序排序，所以数字排序必须传比较函数。

```js
[10, 2, 1].sort() // [1, 10, 2]
[10, 2, 1].sort((a, b) => a - b) // [1, 2, 10]
```

比较函数返回负数表示 `a` 排在 `b` 前，返回正数表示 `a` 排在 `b` 后，返回 `0` 表示顺序相等。现代规范要求 `Array.prototype.sort` 是稳定排序。

### 数组去重和扁平化有哪些常见方式？

去重优先用 `Set` 表达唯一集合：

```js
const unique = (list) => [...new Set(list)]
```

扁平化优先用 `flat()`，需要自定义深度或兼容旧环境时再手写递归。

```js
[1, [2, [3]]].flat(2) // [1, 2, 3]
```

如果元素是对象，`Set` 只按引用去重；如果要按对象字段去重，需要用 `Map` 或自定义 key。

### `['1', '2', '3'].map(parseInt)` 为什么得到 `[1, NaN, NaN]`？

`map` 会给回调传入 `(element, index, array)`，而 `parseInt` 的第二个参数是进制 `radix`。

```js
['1', '2', '3'].map(parseInt)
// parseInt('1', 0) => 1
// parseInt('2', 1) => NaN
// parseInt('3', 2) => NaN
```

正确写法是显式指定进制：

```js
['1', '2', '3'].map((value) => parseInt(value, 10))
```

### `Object.assign()` 是浅拷贝还是深拷贝？

`Object.assign()` 是浅拷贝。它把源对象自身可枚举属性复制到目标对象，复制的是属性值；如果属性值是对象，复制的是引用。

```js
const source = { nested: { count: 1 } }
const target = Object.assign({}, source)

target.nested.count = 2
source.nested.count // 2
```

它还会通过普通读取和写入复制属性，因此 getter 会被执行，属性描述符不会被完整保留。需要保留描述符时可以结合 `Object.getOwnPropertyDescriptors()` 和 `Object.defineProperties()`。

### 对象属性顺序是否可靠？

现代规范定义了对象自有属性枚举顺序：整数索引键按升序，其它字符串键按创建顺序，Symbol 键按创建顺序。虽然顺序有规范，但对象仍不应被滥用为有序列表；需要稳定插入顺序的键值集合时优先用 `Map`。

### JSON 和 JavaScript 对象有什么区别？

JSON 是一种数据交换格式，JavaScript 对象是运行时值。JSON 的 key 必须用双引号，字符串也必须用双引号；JSON 不支持函数、`undefined`、Symbol、BigInt、注释、尾逗号和循环引用。

```json
{
  "name": "Ada",
  "enabled": true,
  "roles": ["admin"]
}
```

把 JSON 字符串转成对象应使用 `JSON.parse()`，不要使用 `eval()`。`eval()` 会执行代码，安全风险和语法边界都不适合作为 JSON 解析方式。

### `JSON.stringify()` 有哪些边界？

`JSON.stringify` 只支持 JSON 数据模型。`undefined`、函数、Symbol 在对象属性中会被忽略，在数组中会变成 `null`；`BigInt` 默认会抛错；循环引用会抛错；`Date` 通常会序列化为 ISO 字符串。

```js
JSON.stringify({ a: undefined, b: () => {}, c: Symbol('x') }) // '{}'
JSON.stringify([undefined, () => {}]) // '[null,null]'
```

用 `JSON.stringify(JSON.parse(...))` 做深拷贝会丢失原型、方法、`undefined`、Symbol、BigInt、Map、Set、RegExp、循环引用等信息。现代浏览器和 Node.js 中优先考虑 `structuredClone()` 或成熟库。

### 正则题应该关注什么？

正则表达式用于文本匹配、提取、替换和验证。回答时关注：

1. 字符类、量词、分组、捕获、断言。
2. `g`、`i`、`m`、`s`、`u`、`y`、`d` 等标志。
3. `test` 和 `exec` 在全局或 sticky 匹配下会受 `lastIndex` 影响。
4. 复杂 HTML、URL、嵌套语法不应只靠正则解析。

```js
/abc/i.test('ABC') // true
```

两个字面量正则对象即使模式相同，也不是同一个对象：

```js
/abc/ === /abc/ // false
```

### ArrayBuffer、TypedArray 和 DataView 有什么区别？

`ArrayBuffer` 表示一段原始二进制内存，本身不负责解释数据。TypedArray 是带元素类型的视图，例如 `Uint8Array`、`Float32Array`；`DataView` 可以在同一段 buffer 上按不同类型和字节序读写。

```js
const buffer = new ArrayBuffer(4)
const bytes = new Uint8Array(buffer)
const view = new DataView(buffer)

bytes[0] = 255
view.getUint8(0) // 255
```

二进制网络包、音视频、Canvas 像素、WebAssembly 内存和文件处理更常用这组 API。

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

### `slice` 与 `splice`

```js
const source = ['a', 'b', 'c', 'd']

const copied = source.slice(1, 3)
const removed = source.splice(1, 2, 'x')

console.log(copied) // ['b', 'c']
console.log(removed) // ['b', 'c']
console.log(source) // ['a', 'x', 'd']
```

## 参考来源

- [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN: RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [MDN: ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [MDN: TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
