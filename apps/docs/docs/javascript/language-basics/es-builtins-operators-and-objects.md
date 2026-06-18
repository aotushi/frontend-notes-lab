# ES 基础、内置对象与常见表达式题

## 问题

`Symbol`、`Map`、`Set`、`WeakMap`、`WeakSet`、Iterator、Generator、数组方法、`Object.assign`、JSON、RegExp、ArrayBuffer、TypedArray、相等运算、可选链、空值合并和常见表达式题应该如何归类和回答？为什么有些题看起来像手写题，本质却在考内置对象语义？

## 结论

### 理解路径

内置对象题不要只背 API。先判断它解决的是唯一标识、集合、键值映射、迭代协议、序列化、文本匹配、二进制数据、数值计算还是表达式求值，再说明和普通对象、数组、手写实现之间的边界。

### `Symbol` 是什么？适合解决什么问题？

`Symbol` 是一种原始类型，每次调用 `Symbol()` 都会创建唯一值。它常用于避免对象属性名冲突、<ConceptNote label="定义协议钩子" title="Symbol 如何定义协议钩子" :sections="[{ title: '直观理解', body: '有些 Symbol 是 JavaScript 语言预留的入口。对象实现这些 Symbol 属性后，语言内部操作会在特定时机主动调用它们。' }, { title: '示例', body: '对象实现 Symbol.toPrimitive 后，JavaScript 在需要把它转成原始值时会调用这个方法。', code: `const price = {\n  amount: 99,\n  currency: 'CNY',\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') {\n      return this.amount\n    }\n\n    return this.amount + ' ' + this.currency\n  }\n}\n\n+price // 99\nString(price) // '99 CNY'` }, { title: '边界', body: '这不是普通业务字段名，而是语言协议的一部分。常见协议入口还包括 Symbol.iterator、Symbol.toStringTag、Symbol.hasInstance 等。' }]" /> 和 <ConceptNote label="实现非字符串 key" title="Symbol 和非字符串 key" :sections="[{ title: '直观理解', body: '普通对象的属性名只能是字符串或 Symbol。Symbol key 不会和同名字符串属性冲突，也不会被 Object.keys() 这类常规枚举直接列出。' }, { title: '对象 key 的边界', body: '如果 key 本身是对象，普通对象会把它转成字符串，容易出现 [object Object] 冲突；这类动态映射应该用 Map 保留 key 的原始身份。' }, { title: '示例', code: `const domKey = { id: 'app' }\nconst stateByNode = new Map()\n\nstateByNode.set(domKey, { mounted: true })\nstateByNode.get(domKey) // { mounted: true }\n\nconst objectStore = {}\nobjectStore[domKey] = 'value'\n\nObject.keys(objectStore) // ['[object Object]']` }]" />。

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
| 原型属性干扰 | 默认继承 `toString`、`constructor` 等原型属性 | 只保存你放进去的键值对 |
| 数量 | 没有内置数量属性，需要自己维护计数或临时用 `Object.keys()` 统计 | `size` 直接返回当前条数 |
| 迭代顺序 | 整数索引键会先按升序排，其它字符串键再按创建顺序排 | 谁先 `set`，谁就先被迭代 |
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

`Set` 判断相等使用 <ConceptNote label="SameValueZero" title="SameValueZero 是什么" :sections="[{ title: '直观理解', body: 'SameValueZero 是 ECMAScript 规范里的抽象比较算法，不是 JavaScript 暴露出来的函数，代码里不能调用 SameValueZero()。' }, { title: '记忆方式', body: '它的大部分行为接近 ===，但 NaN 会被视为相等；同时 +0 和 -0 也视为同一个值。' }, { title: '近似伪实现', code: `function sameValueZero(a, b) {\n  return a === b || (Number.isNaN(a) && Number.isNaN(b))\n}` }]" />，不是 `Object.is()`，也不是单纯的 `===`。可以把它记成：大部分行为接近 `===`，但 `NaN` 会被视为相等；同时 `+0` 和 `-0` 也视为同一个值。

| 比较点 | `===` | `Object.is()` | `Set` / SameValueZero |
| --- | --- | --- | --- |
| `NaN` 和 `NaN` | 不相等 | 相等 | 相等 |
| `+0` 和 `-0` | 相等 | 不相等 | 相等 |
| 两个不同对象字面量 | 不相等 | 不相等 | 不相等 |

对象、数组和函数仍然按引用身份判断，不会做结构深比较：

```js
new Set([NaN, NaN]).size // 1
new Set([+0, -0]).size // 1
Object.is(+0, -0) // false

const a = { id: 1 }
const b = { id: 1 }

new Set([a, b, a]).size // 2
```

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

### 数组解构为什么要求可迭代对象？

数组解构走的是迭代协议，而不是按属性名读取。右侧值必须是 iterable，也就是有 `Symbol.iterator` 方法并能返回 iterator。

```js
const source = { a: 1, b: 2 }

const [a, b] = source
// TypeError: source is not iterable
```

如果确实要让普通对象支持数组解构，可以给它实现 `Symbol.iterator`：

```js
const source = {
  a: 1,
  b: 2,
  *[Symbol.iterator]() {
    yield this.a
    yield this.b
  }
}

const [a, b] = source
// a = 1, b = 2
```

实际业务里更常见也更清晰的是对象解构：

```js
const { a, b } = source
```

### `==` 和 `===` 有什么区别？

`===` 是严格相等，比较时不做类型转换；`==` 是宽松相等，会先按抽象相等比较规则做类型转换，再比较结果。日常代码优先使用 `===`，因为它更容易预测。

```js
0 == false // true
0 === false // false

'' == false // true
'' === false // false

null == undefined // true
null === undefined // false
```

`NaN` 不等于自身，`+0` 和 `-0` 在 `===` 下相等。需要处理这些边界时使用 `Object.is()` 更明确：

```js
NaN === NaN // false
Object.is(NaN, NaN) // true

+0 === -0 // true
Object.is(+0, -0) // false
```

`x == null` 是少数有明确语义的宽松相等用法，它只同时匹配 `null` 和 `undefined`。如果团队规范禁止 `==`，也可以显式写成 `x === null || x === undefined`。

### 可选链、空值合并和逻辑赋值有什么边界？

可选链 `?.` 只在左侧为 `null` 或 `undefined` 时短路，不会把 `0`、`''`、`false` 当成缺失值。空值合并 `??` 也只在左侧为 `null` 或 `undefined` 时使用默认值。

```js
const user = { profile: { age: 0, name: '' } }

user.profile?.age ?? 18 // 0
user.profile?.name ?? 'Anonymous' // ''
user.settings?.theme ?? 'light' // 'light'
```

逻辑赋值运算符是短路逻辑和赋值的组合：

```js
options.timeout ||= 3000 // 左侧 falsy 时赋值
options.count ??= 0 // 左侧是 null 或 undefined 时赋值
options.enabled &&= normalize(options.enabled) // 左侧 truthy 时赋值
```

`||=` 会把 `0`、`''`、`false` 当成需要覆盖的值；如果这些值是有效业务值，应使用 `??=`。

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

### `0.1 + 0.2 === 0.3` 为什么是 `false`？

JavaScript 的 `Number` 使用 IEEE 754 双精度浮点数。很多十进制小数无法用二进制浮点数精确表示，`0.1 + 0.2` 的结果是一个接近 `0.3` 的值，而不是精确的 `0.3`。

```js
0.1 + 0.2 // 0.30000000000000004
0.1 + 0.2 === 0.3 // false
```

比较小数时不要直接用严格相等判断，可以用误差范围：

```js
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true
```

如果涉及金额，优先用整数最小单位、定点数方案或专门的 decimal 库，避免直接用浮点数累加。

### 数组去重有哪些常见方式？

数组去重题不要只背一个 API。面试里常问“写出多种方式”，但实际回答要同时说明相等规则、是否改变原数组、是否保留顺序、是否支持对象和是否会破坏类型。

| 排序 | 方式 | 复杂度 / 成本 | 适合场景 | 边界 |
| --- | --- | --- | --- | --- |
| 1 | `Set` | 平均 O(n)，空间 O(n) | 常规值去重默认首选，保留首次出现顺序 | 对象、数组、函数按引用去重，不做结构比较 |
| 2 | `Map` 自定义 key | 平均 O(n)，空间 O(n)，另有 key 计算成本 | 对象数组按业务字段去重 | key 冲突时需明确保留第一个还是最后一个 |
| 3 | 对象键值表 | 平均 O(n)，空间 O(n)，另有字符串化成本 | 旧题里用于模拟哈希表 | key 构造容易丢信息，复杂值风险高 |
| 4 | 排序 + 相邻比较 | O(n log n)，空间 O(n) | 可接受排序后的简单数组 | 不保留原始顺序；默认 `sort()` 按字符串排序 |
| 5 | 排序 + 快慢指针 | O(n log n)，空间 O(n)；若原地排序可降到 O(1) 额外空间 | 数字数组、算法题 | 不保留原始顺序；比较函数必须正确 |
| 6 | `for` + `includes` | O(n²)，空间 O(n) | 小数组、强调可读性 | 数据量大时慢 |
| 7 | `reduce` + `includes` / `indexOf` | O(n²)，空间 O(n)，`concat` 会产生中间数组 | 函数式写法展示 | `indexOf` 不能识别 `NaN` |
| 8 | `filter` + `indexOf` | O(n²)，空间 O(n) | 旧题常见写法 | 会漏掉 `NaN` |
| 9 | 双循环 + 新数组 | O(n²)，空间 O(n) | 理解朴素算法 | `===` 不能识别重复 `NaN` |
| 10 | 双循环 + `splice` | O(n²)，且删除会移动元素 | 原地删除思路 | 修改数组，重复项多时移动成本明显 |

1. `Set`

```js
const uniqueBySet = (list) => [...new Set(list)]

uniqueBySet([1, 1, NaN, NaN, +0, -0])
// [1, NaN, 0]
```

点评：现代项目默认优先用它表达“唯一集合”。它能去掉 `NaN`，但对象、数组、函数仍按引用身份判断。

2. `Map` 键值表 / 自定义 key

```js
function uniqueBy(list, getKey) {
  const seen = new Map()
  const result = []

  for (const item of list) {
    const key = getKey(item)

    if (!seen.has(key)) {
      seen.set(key, true)
      result.push(item)
    }
  }

  return result
}

uniqueBy(
  [
    { id: 1, name: 'Ada' },
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Linus' }
  ],
  (item) => item.id
)
// [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }]
```

点评：`Map` 版本平均复杂度接近 O(n)，适合对象数组按业务字段去重；这个写法保留首次出现项，如果想保留最后出现项，可以用 `new Map(list.map(...)).values()`。

3. 对象键值表

```js
function uniqueByObjectKey(list) {
  const seen = Object.create(null)

  return list.filter((item) => {
    const key = `${typeof item}:${JSON.stringify(item)}`

    if (Object.hasOwn(seen, key)) {
      return false
    }

    seen[key] = true
    return true
  })
}
```

点评：哈希表思路平均复杂度接近 O(n)，比反复线性查找更适合大数组；缺点是 key 构造质量决定正确性，`JSON.stringify(/a/)` 得到 `{}`，函数和 `undefined` 也会丢信息，遇到循环引用还会抛错。普通对象可以调用 `obj.hasOwnProperty(key)`；但 `Object.create(null)` 创建的是无原型对象，没有这个方法，来自外部的数据对象也可能覆盖同名属性，因此更稳的写法是 `Object.hasOwn(seen, key)` 或 `Object.prototype.hasOwnProperty.call(seen, key)`。

4. 排序 + 相邻比较

```js
function uniqueBySortedNeighbor(list) {
  return [...list]
    .sort()
    .filter((item, index, array) => index === 0 || item !== array[index - 1])
}
```

点评：它会改变顺序；默认 `sort()` 按字符串排序，`[1, 10, 2]` 会排成 `[1, 10, 2]`，不是数值升序。数字数组应传比较函数。

5. 排序 + 快慢指针

```js
function uniqueBySortedPointers(list) {
  const result = [...list].sort((a, b) => a - b)

  if (result.length === 0) {
    return result
  }

  let slow = 0

  for (let fast = 1; fast < result.length; fast += 1) {
    if (result[fast] !== result[slow]) {
      slow += 1
      result[slow] = result[fast]
    }
  }

  return result.slice(0, slow + 1)
}
```

点评：适合算法题里的数字数组；排序已经破坏原始顺序，不适合需要保留首次出现顺序的业务数据。

6. `for` + `includes`

```js
function uniqueByIncludes(list) {
  const result = []

  for (const item of list) {
    if (!result.includes(item)) {
      result.push(item)
    }
  }

  return result
}
```

点评：`includes` 使用 SameValueZero，因此能识别重复的 `NaN`。缺点是每次都要在结果数组里查找，复杂度仍是 O(n²)。

7. `reduce` + `includes` / `indexOf`

```js
function uniqueByReduceIncludes(list) {
  return list.reduce((result, item) => {
    return result.includes(item) ? result : result.concat(item)
  }, [])
}

function uniqueByReduceIndexOf(list) {
  return list.reduce((result, item) => {
    return result.indexOf(item) === -1 ? result.concat(item) : result
  }, [])
}
```

点评：`includes` 版本更接近 `Set` 的相等规则；`indexOf` 版本不能识别 `NaN`，只适合解释旧写法。

8. `filter` + `indexOf`

```js
function uniqueByFilterIndexOf(list) {
  return list.filter((item, index, array) => array.indexOf(item) === index)
}
```

点评：这是常见老答案，但会丢掉 `NaN`，因为 `indexOf(NaN)` 永远是 `-1`。

9. 双循环 + 新数组

```js
function uniqueByDoubleLoop(list) {
  const result = []

  for (const item of list) {
    let duplicated = false

    for (const current of result) {
      if (item === current) {
        duplicated = true
        break
      }
    }

    if (!duplicated) {
      result.push(item)
    }
  }

  return result
}
```

点评：比 `splice` 版本安全，不改原数组；缺点仍是 O(n²)，并且 `===` 不会把 `NaN` 和 `NaN` 判断为相等。

10. 双循环 + `splice`

```js
function uniqueBySplice(list) {
  const result = [...list]

  for (let i = 0; i < result.length; i += 1) {
    for (let j = i + 1; j < result.length; j += 1) {
      if (result[j] === result[i]) {
        result.splice(j, 1)
        j -= 1
      }
    }
  }

  return result
}
```

点评：这种写法能保留首次出现顺序，但 `splice` 每次删除都会移动后续元素，重复项多时开销明显；它使用 `===`，所以不能去掉重复的 `NaN`。

### 数组扁平化有哪些常见方式？

数组扁平化题不要只背 `flat()`。面试里常要求同时说出原生 API、递归、非递归和字符串类 hack；回答时要说明展开深度、类型保留、递归栈和中间数组开销。

| 排序 | 方式 | 复杂度 / 成本 | 适合场景 | 边界 |
| --- | --- | --- | --- | --- |
| 1 | `flat(depth)` / `flat(Infinity)` | O(n)，空间 O(n)，n 为访问到的元素数 | 现代环境默认首选 | 只做数组展开；深度要明确 |
| 2 | `flatMap()` | O(n + m)，m 为映射后展开的一层元素数 | 先映射，再展开一层 | 只展开一层，不等于深度扁平化 |
| 3 | 递归 + `for...of` | O(n)，空间 O(n)，另有递归栈 O(depth) | 手写 `flat`、完全拍平 | 嵌套过深可能调用栈溢出 |
| 4 | 带深度递归 | O(n)，空间 O(n)，另有递归栈 O(depth) | 手写 `flat(depth)` | 深度很大时可能栈溢出 |
| 5 | 显式栈迭代 | O(n)，空间 O(n) | 避免递归栈溢出 | 代码更长，需要反转或维护顺序 |
| 6 | `reduce` + 递归 | 通常高于 O(n)，`concat` 会反复复制 | 函数式写法展示 | 大数组性能差，仍有递归栈问题 |
| 7 | `while` + `some` + 展开 | 约 O(n × depth)，多次扫描和复制 | 不写递归的面试写法 | 层数多时代价明显 |
| 8 | `JSON.stringify` + 替换 + `split` | O(n) 序列化 + 字符串替换 + 拆分成本 | 旧题 hack | 返回字符串数组，类型信息丢失 |
| 9 | `JSON.stringify` + 替换 + `JSON.parse` | O(n) 序列化 + 字符串替换 + 解析成本 | 只处理简单 JSON 值的旧题 hack | 受 JSON 序列化限制，复杂值不可用 |
| 10 | `toString` + `split` | O(n) 字符串化成本 | 只适合演示为什么不推荐 | 会把所有值变成字符串，复杂值不可用 |

1. `flat()` / `flat(Infinity)`

```js
function flattenByFlat(list, depth = 1) {
  return list.flat(depth)
}

flattenByFlat([1, [2, [3]]], 2) // [1, 2, 3]
flattenByFlat([1, [2, [3]]], Infinity) // [1, 2, 3]
```

点评：现代环境首选。`flat()` 默认只展开一层；完全拍平用 `Infinity`，但仍要注意数据规模。

2. `flatMap()`

```js
function duplicateAndFlattenOneLevel(list) {
  return list.flatMap((value) => [value, value * 2])
}

duplicateAndFlattenOneLevel([1, 2]) // [1, 2, 2, 4]
```

点评：`flatMap()` 等于先 `map()` 再展开一层，不是深度扁平化。

3. 递归 + `for...of`

```js
function flattenByForOf(list) {
  const result = []

  for (const item of list) {
    if (Array.isArray(item)) {
      result.push(...flattenByForOf(item))
    } else {
      result.push(item)
    }
  }

  return result
}

flattenByForOf([1, [2, [3]]]) // [1, 2, 3]
```

点评：递归写法可读性强，能保留元素类型和顺序，整体会访问每个元素一次；缺点是很深的嵌套可能触发调用栈限制，且这个版本默认完全拍平。

4. 带深度的递归版

```js
function flattenWithDepth(list, depth = 1) {
  const result = []

  for (const item of list) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenWithDepth(item, depth === Infinity ? Infinity : depth - 1))
    } else {
      result.push(item)
    }
  }

  return result
}

flattenWithDepth([1, [2, [3]]], 2) // [1, 2, 3]
```

点评：这更接近手写 `Array.prototype.flat(depth)` 的核心逻辑，能控制展开层数并保留顺序；缺点仍是递归深度过大时可能栈溢出。

5. 显式栈迭代

```js
function flattenDeep(list) {
  const stack = [...list]
  const result = []

  while (stack.length) {
    const item = stack.pop()

    if (Array.isArray(item)) {
      stack.push(...item)
    } else {
      result.push(item)
    }
  }

  return result.reverse()
}
```

点评：显式栈版本避免递归调用栈过深，但代码更长。它适合非常深的嵌套数组或算法题扩展。

6. `reduce` + 递归

```js
function flattenByReduce(list) {
  return list.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flattenByReduce(item) : item)
  }, [])
}

flattenByReduce([1, [2, [3]]]) // [1, 2, 3]
```

点评：`reduce` 版本表达紧凑，但 `concat` 会不断创建新数组，大数组下性能通常不如手动 `push`；它同样有递归栈过深的问题。

7. `while` + `some` + 展开运算符

```js
function flattenBySpread(list) {
  let result = [...list]

  while (result.some(Array.isArray)) {
    result = [].concat(...result)
  }

  return result
}

flattenBySpread([1, [2, [3]]]) // [1, 2, 3]
```

点评：每轮只展开一层，所以需要循环。层数多或数组很大时，会产生较多中间数组。

8. `JSON.stringify` + 替换 + `split`

```js
function flattenByJsonSplit(list) {
  return JSON.stringify(list).replace(/\[|\]/g, '').split(',')
}

flattenByJsonSplit([1, [2, [3]]]) // ['1', '2', '3']
```

点评：返回值仍然是字符串数组；如果数组里本来有字符串、对象或特殊值，结果很容易不可靠。

9. `JSON.stringify` + 替换 + `JSON.parse`

```js
function flattenByJsonParse(list) {
  const content = JSON.stringify(list).replace(/\[|\]/g, '')
  return JSON.parse(`[${content}]`)
}

flattenByJsonParse([1, [2, [3]]]) // [1, 2, 3]
```

点评：这个版本能保留简单数字类型，但仍会受 JSON 序列化限制：`undefined`、函数、Symbol、循环引用和包含方括号的字符串都可能出问题。

10. `toString` + `split`

```js
function flattenByToString(list) {
  return String(list).split(',')
}

flattenByToString([1, [2, [3]]]) // ['1', '2', '3']
```

点评：这类写法看起来短，但质量最低；它会把数字变成字符串，也无法可靠处理对象、字符串里的逗号、稀疏数组和复杂嵌套，不适合作为正式实现。

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

### 如何写一个基础 email 正则？

email 规则比表面上复杂，完整校验通常应交给业务约束、后端校验和确认邮件流程。前端只需要做输入提示时，可以使用覆盖常见地址形态的基础正则：

```js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

emailPattern.test('ada@example.com') // true
emailPattern.test('ada@example') // false
```

不要用过度复杂的正则假装完整实现 RFC 级校验；也不要只靠前端正则决定账号、支付、权限等关键流程。

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
- [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
- [MDN: Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
- [MDN: Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [MDN: Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [MDN: Logical OR assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment)
- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Array.prototype.flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
- [MDN: Array.prototype.flatMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [MDN: Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: Number.EPSILON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON)
- [MDN: Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN: RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [MDN: ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [MDN: TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
