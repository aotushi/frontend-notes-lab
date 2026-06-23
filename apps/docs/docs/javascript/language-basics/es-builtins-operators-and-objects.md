# ES 基础、内置对象与常见表达式题

## 概览

### 理解路径

内置对象题不要只背 API。先判断它解决的是唯一标识、集合、键值映射、迭代协议、序列化、文本匹配、二进制数据、数值计算还是表达式求值，再说明和普通对象、数组、手写实现之间的边界。

### JavaScript 有哪些内置对象？

- **值属性**：`Infinity`、`NaN`、`undefined`
- **函数属性**：`parseInt()`、`parseFloat()`、`isNaN()`
- **基本对象**：`Object`、`Function`、`Boolean`、`Symbol`、`Error`
- **数字和日期**：`Number`、`Math`、`Date`、`BigInt`
- **字符串**：`String`、`RegExp`
- **集合**：`Array`、`Map`、`Set`、`WeakMap`、`WeakSet`
- **结构化数据**：`JSON`、`ArrayBuffer`
- **控制抽象**：`Promise`、`Generator`、`GeneratorFunction`、`AsyncFunction`
- **反射**：`Reflect`、`Proxy`

### 强类型语言和弱类型语言的区别

- **强类型语言**：变量类型严格，不能隐式转换，类型不匹配会报错。如 Java、C++。
- **弱类型语言**：允许隐式类型转换，类型检查宽松。如 JavaScript（`'1' + 1` 结果是 `'11'`）。

JavaScript 是弱类型语言，提供灵活性但也容易产生隐式转换 Bug，TypeScript 通过类型注解弥补这一缺陷。

### 解释性语言和编译型语言的区别

- **解释型语言**：运行时逐行解释执行，跨平台性好，但每次运行都需要解释，效率相对低。如 JavaScript、Python。
- **编译型语言**：先一次性编译成机器码文件，运行时直接执行，速度快，但与平台相关。如 C、C++。

JavaScript 是解释型语言，但现代 JS 引擎（V8）采用 JIT（即时编译）技术，结合了两者优点。

## 集合与内置对象

### `Symbol` 是什么？适合解决什么问题？

`Symbol` 是一种原始类型，每次调用 `Symbol()` 都会创建唯一值。它常用于避免对象属性名冲突、<ConceptNote label="定义协议钩子" title="Symbol 如何定义协议钩子" :sections="[{ title: '直观理解', body: '有些 Symbol 是 JavaScript 语言预留的入口。对象实现这些 Symbol 属性后，语言内部操作会在特定时机主动调用它们。' }, { title: '示例', body: '对象实现 Symbol.toPrimitive 后，JavaScript 在需要把它转成原始值时会调用这个方法。', code: `const price = {\n  amount: 99,\n  currency: 'CNY',\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') {\n      return this.amount\n    }\n\n    return this.amount + ' ' + this.currency\n  }\n}\n\n+price // 99\nString(price) // '99 CNY'` }, { title: '边界', body: '这不是普通业务字段名，而是语言协议的一部分。常见协议入口还包括 Symbol.iterator、Symbol.toStringTag、Symbol.hasInstance 等。' }]" /> 和 <ConceptNote label="作为非字符串属性 key" title="Symbol 作为对象属性键" :sections="[{ title: '直观理解', body: '对象属性键只有两类：字符串和 Symbol。这里和 Symbol 的关系是：Symbol 值可以直接放在 obj[symbol] 这个属性位置，不会被转成同名字符串。' }, { title: '示例', code: `const internalId = Symbol('id')\n\nconst user = {\n  id: 'public-1',\n  name: 'Ada',\n  [internalId]: 1001\n}\n\nuser.id // 'public-1'\nuser[internalId] // 1001\nObject.keys(user) // ['id', 'name']\nReflect.ownKeys(user) // ['id', 'name', Symbol(id)]` }, { title: '边界', body: 'Symbol 不是"任意值都能当 key"。它仍然只是对象属性键的一种。如果要用对象、DOM 节点或函数本身作为 key，应该用 Map；Map 是这里的边界对比，不是 Symbol 的例子。' }]" />。

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

### `Map` 保留插入顺序

```js
const scores = new Map()
scores.set({ id: 1 }, 90)
scores.set('total', 1)

for (const [key, value] of scores) {
  console.log(key, value)
}
```

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

### 大整数超过安全范围怎么办？`BigInt` 解决什么问题？

`Number` 用 IEEE 754 双精度存储，能精确表示的整数上限是 `Number.MAX_SAFE_INTEGER`（`2 ** 53 - 1`）。超过这个范围，相邻整数之间会出现间隙，运算结果开始丢精度。

```js
Number.MAX_SAFE_INTEGER // 9007199254740991
9007199254740991 + 2 // 9007199254740992，本应是 ...993，已丢精度
```

`BigInt` 是表示任意精度整数的原始类型。字面量在数字后加 `n`，或用 `BigInt()` 构造，运算结果保持精确。

```js
const big = 9007199254740991n
big + 2n // 9007199254740993n，精确

BigInt(9007199254740991) // 9007199254740991n
typeof 10n // 'bigint'
```

使用时要注意几条边界：

1. 不能和 `Number` 直接做算术混合运算，会抛 `TypeError`，需要先显式转同一类型。
2. 只表示整数，没有小数；做除法会向零取整。
3. 不能用 `Math` 系列方法；`JSON.stringify(10n)` 直接抛错。
4. 比较和宽松相等可以跨类型，但严格相等要求类型相同。

```js
10n + 1 // TypeError: Cannot mix BigInt and other types
10n + BigInt(1) // 11n
7n / 2n // 3n，向零取整

10n > 5 // true
10n == 10 // true
10n === 10 // false，类型不同
```

最常见的实战场景是后端返回的雪花 ID、大额订单号等大整数。直接 `JSON.parse` 会把它们读成 `Number` 而丢精度，稳妥做法是后端用字符串传输，前端需要计算时再转 `BigInt`；只做展示和透传时保持字符串即可。

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

### 对 JSON 的理解

JSON 是一种轻量级的数据交换格式，基于 JS 对象语法，但不等于 JS 对象：

- JSON 的 key 必须是双引号字符串
- 值不能是函数、`undefined`、`Symbol`、`NaN`、`Infinity`
- 不支持注释

JS 提供两个转换方法：

- `JSON.stringify(obj)`：JS 数据结构 → JSON 字符串（不符合规范的值会被处理或忽略）
- `JSON.parse(str)`：JSON 字符串 → JS 数据结构（非合法 JSON 会抛出错误）

### `JSON.stringify()` 有哪些边界？

`JSON.stringify` 只支持 JSON 数据模型。`undefined`、函数、Symbol 在对象属性中会被忽略，在数组中会变成 `null`；`BigInt` 默认会抛错；循环引用会抛错；`Date` 通常会序列化为 ISO 字符串。

```js
JSON.stringify({ a: undefined, b: () => {}, c: Symbol('x') }) // '{}'
JSON.stringify([undefined, () => {}]) // '[null,null]'
```

用 `JSON.stringify(JSON.parse(...))` 做深拷贝会丢失原型、方法、`undefined`、Symbol、BigInt、Map、Set、RegExp、循环引用等信息。现代浏览器和 Node.js 中优先考虑 `structuredClone()` 或成熟库。

### `JSON.stringify` 的丢失项

```js
const data = {
  name: 'Ada',
  empty: undefined,
  run() {}
}

JSON.stringify(data) // '{"name":"Ada"}'
```

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

### 常用的正则表达式有哪些？

```js
// 匹配 16 进制颜色值
const hexColor = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g

// 匹配日期 yyyy-mm-dd
const dateReg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

// 手机号码
const phone = /^1[34578]\d{9}$/g

// 用户名（字母开头，4-16位）
const username = /^[a-zA-Z$][a-zA-Z0-9_$]{4,16}$/

// 邮箱
const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
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

### Unicode、UTF-8、UTF-16、UTF-32 的区别

- **Unicode**：字符集（编号系统），为每个字符分配唯一码点，如"马"是 U+9A6C。
- **UTF-8**：变长编码（1-4字节），兼容 ASCII，英文节省空间，网络传输最常用。
- **UTF-16**：变长编码（2或4字节），基本平面字符用2字节，辅助平面用4字节（代理对），JS 内部字符串使用 UTF-16。
- **UTF-32**：定长4字节，简单但占空间最大。

总结：Unicode 是字符集，UTF-8/16/32 是具体的编码规则（实现方式）。

## 迭代、Generator 与函数

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

### Generator 的中断和恢复机制是怎样的？

Generator 的暂停 / 恢复不只是「往下走一步」，`next` / `return` / `throw` 三个方法共同构成它和外部双向通信、可被中断的控制流。

`it.next(value)` 恢复执行，并把 `value` 作为**上一个 `yield` 表达式的返回值**送回函数体，所以信息可以双向流动。第一次 `next()` 的参数会被忽略，因为此时还没有等待结果的 `yield`。

```js
function* dialogue() {
  const name = yield '你叫什么？'
  const age = yield `你好 ${name}，几岁？`
  return `${name} ${age} 岁`
}

const it = dialogue()
it.next() // { value: '你叫什么？', done: false }，传参会被忽略
it.next('Ada') // { value: '你好 Ada，几岁？', done: false }
it.next(30) // { value: 'Ada 30 岁', done: true }
```

`it.return(value)` 提前结束：generator 立即变为 `done: true`，并把 `value` 作为返回值；如果暂停点在 `try` 里，`finally` 仍会执行，可用于释放资源。

```js
function* withCleanup() {
  try {
    yield 1
    yield 2
  } finally {
    console.log('清理资源')
  }
}

const g = withCleanup()
g.next() // { value: 1, done: false }
g.return('stop') // 打印「清理资源」，返回 { value: 'stop', done: true }
```

`it.throw(error)` 在当前暂停的 `yield` 处抛出错误。如果函数体内有 `try/catch` 捕获，generator 不会终止，还能继续往下产出；没有捕获则向外抛出并结束。

```js
function* robust() {
  try {
    yield 1
  } catch (err) {
    yield `已捕获 ${err.message}` // 错误被内部消化，仍可继续
  }
}

const r = robust()
r.next() // { value: 1, done: false }
r.throw(new Error('boom')) // { value: '已捕获 boom', done: false }
```

正是这套「外部送值进来、外部要求中断、外部注入错误」的机制，让 `async` / `await` 能用执行器把 `await` 当作 `yield`：Promise resolve 后调 `next(结果)` 恢复，reject 后调 `throw(原因)` 让 `try/catch` 捕获。

### 数组解构为什么要求可迭代对象？

数组解构和对象解构的取值机制不同：数组解构走的是迭代协议，按 iterator 产出的顺序取值；对象解构走的是属性读取，按属性名从右侧对象上取值。

因此数组解构右侧值必须是 iterable，也就是有 `Symbol.iterator` 方法并能返回 iterator。普通对象默认不是 iterable，所以不能直接用数组解构：

```js
const plainObject = { a: 1, b: 2 }

const [first, second] = plainObject
// TypeError: plainObject is not iterable
```

但同一个普通对象可以做对象解构，因为对象解构读取的是属性名，不要求右侧值可迭代：

```js
const plainObject = { a: 1, b: 2 }

const { a, b } = plainObject
// a = 1, b = 2
```

如果确实要让普通对象支持数组解构，需要给它实现 `Symbol.iterator`，并明确产出顺序：

```js
const iterableObject = {
  a: 1,
  b: 2,
  *[Symbol.iterator]() {
    yield this.a
    yield this.b
  }
}

const [first, second] = iterableObject
// first = 1, second = 2
```

实际业务里，如果数据本来就是具名字段，优先使用对象解构；只有数据本身表达的是顺序集合，或者对象显式实现了迭代协议，才适合使用数组解构。

### 箭头函数与普通函数的区别

1. **语法更简洁**：单参数可省括号，单行返回可省 `{}`。
2. **没有自己的 `this`**：箭头函数的 `this` 继承自定义时所在的外层作用域，无法通过 `call/apply/bind` 改变。
3. **没有 `arguments` 对象**：访问 `arguments` 实际获取外层函数的 `arguments`。
4. **不能用作构造函数**：没有 `[[Construct]]`，`new` 箭头函数会报错。
5. **没有 `prototype` 属性**。
6. **不能用作 Generator 函数**：不能使用 `yield`。

```js
var id = 'GLOBAL'
var obj = {
  id: 'OBJ',
  a: function() { console.log(this.id) },
  b: () => { console.log(this.id) }
}
obj.a()   // 'OBJ'（普通函数，this 是 obj）
obj.b()   // 'GLOBAL'（箭头函数，this 是外层全局）
```

### 箭头函数的 this 指向哪里？

箭头函数没有自己的 `this`，它在定义时捕获所在上下文的 `this`，并且不会被 `call/apply/bind` 改变。可以用 Babel 转译理解：箭头函数等价于在外层作用域保存 `var _this = this`，然后在箭头函数内使用 `_this`。

### 对 rest 参数的理解

`...rest` 用在函数形参最后位置，将剩余参数收集为数组，替代 `arguments` 的使用：

```js
function sum(...args) {
  return args.reduce((acc, val) => acc + val, 0)
}
sum(1, 2, 3, 4) // 10
```

`rest` 参数只能放在最后，且 `rest` 是真数组，可以直接使用数组方法。

### 为什么 arguments 是类数组而不是数组？如何遍历类数组？

`arguments` 是一个拥有 `length` 和数字索引属性的对象，但没有数组原型方法，所以是类数组。遍历类数组的三种方式：

```js
// 1. 借用数组方法
Array.prototype.forEach.call(arguments, a => console.log(a))

// 2. Array.from 转换
const arr = Array.from(arguments)

// 3. 扩展运算符
const arr2 = [...arguments]
```

箭头函数没有 `arguments`，推荐用 rest 参数代替：`function foo(...args) {}`

### 什么是尾调用，有什么好处？

尾调用指函数的最后一步是调用另一个函数（且不做任何操作）。尾调用优化（TCO）允许 JS 引擎复用当前栈帧而非新建，从而节省内存、避免栈溢出。

```js
// 尾调用：返回结果直接是 g 的调用
function f(x) { return g(x) }

// 不是尾调用：还需要做加法
function h(x) { return g(x) + 1 }
```

ES6 严格模式下支持尾调用优化，但实际浏览器支持有限。

## 数组方法与算法题

### 数组方法怎么分类？

| 类别 | 常见方法 | 是否改变原数组 |
| --- | --- | --- |
| 遍历/转换 | `map`、`filter`、`reduce`、`flatMap` | 否 |
| 查找 | `find`、`findIndex`、`includes`、`some`、`every` | 否 |
| 增删改 | `push`、`pop`、`shift`、`unshift`、`splice` | 是 |
| 排序/反转 | `sort`、`reverse` | 是 |
| 复制/拼接 | `slice`、`concat` | 否 |
| 复制式新方法 | `toSorted`、`toReversed`、`toSpliced` | 否 |

原页面这里把旧数组方法概括成"多不改"不够准确：`splice`、`sort`、`reverse` 会改变原数组，而 `slice`、`concat`、`map`、`filter` 不会。

### `map`、`forEach`、`filter`、`reduce` 有什么区别？

| 方法 | 返回值 | 用途 |
| --- | --- | --- |
| `forEach` | `undefined` | 只做遍历和副作用 |
| `map` | 新数组 | 一对一转换 |
| `filter` | 新数组 | 按条件筛选 |
| `reduce` | 任意累积结果 | 汇总、分组、转换结构 |

需要转换数组时用 `map`，需要副作用时用 `forEach`，需要汇总结果时用 `reduce`。不要为了遍历副作用滥用 `map`，也不要为了可读性很差的"一行代码"滥用 `reduce`。

### `slice` 和 `splice` 有什么区别？

`slice(start, end)` 读取一段元素并返回新数组，不改变原数组。`splice(start, deleteCount, ...items)` 会删除或插入元素，改变原数组，并返回被删除的元素。

```js
const list = [1, 2, 3, 4]

list.slice(1, 3) // [2, 3]
list // [1, 2, 3, 4]

list.splice(1, 2, 'x') // [2, 3]
list // [1, 'x', 4]
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

### `sort()` 默认按什么排序？

`sort()` 默认把元素转成字符串后按 UTF-16 码元顺序排序，所以数字排序必须传比较函数。

```js
[10, 2, 1].sort() // [1, 10, 2]
[10, 2, 1].sort((a, b) => a - b) // [1, 2, 10]
```

比较函数返回负数表示 `a` 排在 `b` 前，返回正数表示 `a` 排在 `b` 后，返回 `0` 表示顺序相等。现代规范要求 `Array.prototype.sort` 是稳定排序。

### 数组去重有哪些常见方式？

数组去重题不要只背一个 API。面试里常问"写出多种方式"，但实际回答要同时说明相等规则、是否改变原数组、是否保留顺序、是否支持对象和是否会破坏类型。

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

点评：现代项目默认优先用它表达"唯一集合"。它能去掉 `NaN`，但对象、数组、函数仍按引用身份判断。

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

### 数组的遍历方法有哪些？

| 方法 | 改变原数组 | 特点 |
|------|-----------|------|
| `forEach()` | 否 | 无返回值，不可 break |
| `map()` | 否 | 返回新数组，可链式 |
| `filter()` | 否 | 返回符合条件的元素组成的新数组 |
| `for...of` | 否 | 可 break，支持 async/await |
| `every()`/`some()` | 否 | 返回布尔值，可提前终止 |
| `find()`/`findIndex()` | 否 | 返回第一个符合条件的元素/索引 |
| `reduce()`/`reduceRight()` | 否 | 归并，返回单一结果 |

## 表达式、语法与运算符

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

### 常见的位运算符有哪些？

| 运算符 | 描述 | 规则 |
|--------|------|------|
| `&` | 按位与 | 两位都为 1 结果才为 1 |
| `\|` | 按位或 | 两位都为 0 结果才为 0 |
| `^` | 异或 | 相同为 0，相异为 1 |
| `~` | 取反 | 0 变 1，1 变 0 |
| `<<` | 左移 | 左移 n 位，右补 0，等效乘 2^n |
| `>>` | 右移 | 右移 n 位，正数左补 0，等效除 2^n |

常见用途：`n & 1` 判断奇偶（0 偶 1 奇），`~indexOf(x)` 判断是否包含（-1 取反为 0 即假）。

### for...in 和 for...of 的区别

- **for...in**：遍历对象的**可枚举属性名**（包括原型链上的），主要用于遍历对象。
- **for...of**：遍历**可迭代对象的值**（需要实现 `Symbol.iterator`），不遍历原型链，用于数组、字符串、Map、Set、Generator 等。

```js
const arr = [10, 20, 30]
for (const key in arr) console.log(key)  // '0', '1', '2'
for (const val of arr) console.log(val) // 10, 20, 30
```

### 如何使用 for...of 遍历对象？

普通对象没有 `Symbol.iterator`，直接用 `for...of` 会报错。两种解决方案：

```js
// 方案一：类数组对象，先用 Array.from 转换
const obj = { 0: 'a', 1: 'b', length: 2 }
for (const val of Array.from(obj)) console.log(val)

// 方案二：手动给对象添加 [Symbol.iterator]
const obj2 = { a: 1, b: 2, c: 3 }
obj2[Symbol.iterator] = function() {
  const keys = Object.keys(this)
  let i = 0
  return {
    next: () => i < keys.length
      ? { value: obj2[keys[i++]], done: false }
      : { done: true }
  }
}
for (const val of obj2) console.log(val) // 1, 2, 3
```

### 对对象与数组的解构的理解

**数组解构**：按位置匹配：

```js
const [a, , c] = [1, 2, 3] // a=1, c=3（中间留空跳过）
```

**对象解构**：按属性名匹配：

```js
const { name, age } = { name: 'Bob', age: 24 }
const { name: aliasName } = { name: 'Bob' } // 重命名
```

### 如何提取高度嵌套的对象里的指定属性？

使用嵌套解构，逐层展开：

```js
const school = { classes: { stu: { name: 'Bob', age: 24 } } }

// 嵌套解构一次取出
const { classes: { stu: { name } } } = school
console.log(name) // 'Bob'
```

### 扩展运算符的作用及使用场景

**对象扩展运算符**（浅拷贝）：

```js
const baz = { ...bar }        // 等价于 Object.assign({}, bar)
const merged = { ...a, ...b } // 后面的属性覆盖前面
```

**数组扩展运算符**：

```js
const arr2 = [...arr1]                // 复制数组
const merged2 = [...arr1, ...arr2]    // 合并数组
Math.max(...[9, 4, 7])                // 传参
const [first, ...rest] = [1,2,3,4,5] // 与解构结合
[...'hello']                          // ['h','e','l','l','o']
```

### ES6 中模板语法与字符串处理

模板字符串（反引号）支持多行、嵌入表达式、保留缩进换行：

```js
const name = 'css', career = 'coder'
const str = `my name is ${name}, I work as a ${career}`
```

新增字符串方法：

- `includes(sub)`：是否包含子串
- `startsWith(sub)`：是否以子串开头
- `endsWith(sub)`：是否以子串结尾
- `repeat(n)`：重复 n 次

## 对象、DOM 与网络

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

### 如何判断一个对象是空对象？

判断「没有任何自有属性」要同时考虑普通属性和 Symbol 属性，常见几种方式：

```js
const obj = {}

JSON.stringify(obj) === '{}' // 简单，但忽略 Symbol 键和 undefined 值，且有序列化开销
Object.keys(obj).length === 0 // 最常用，只看自有可枚举的字符串键
Object.getOwnPropertyNames(obj).length === 0 // 包含不可枚举的字符串键
Reflect.ownKeys(obj).length === 0 // 最严格，字符串键加 Symbol 键都算
```

日常判断用 `Object.keys(obj).length === 0` 即可；如果对象可能挂了 Symbol 键或不可枚举属性，用 `Reflect.ownKeys`。`JSON.stringify` 版本要注意它会忽略 `undefined`、函数和 Symbol，`{ a: undefined }` 也会被判成空。

### 如何判断一个对象是否属于某个类？

```js
// 1. instanceof（检查原型链）
obj instanceof MyClass

// 2. constructor 属性（可能被改写，不够可靠）
obj.constructor === MyClass

// 3. Object.prototype.toString（对内置类型最准确）
Object.prototype.toString.call(obj) === '[object Array]'
```

### 什么是 DOM 和 BOM？

- **DOM**（Document Object Model）：文档对象模型，将网页内容表示为对象树，提供操作网页内容的方法和接口。顶层节点是 `document`。
- **BOM**（Browser Object Model）：浏览器对象模型，将浏览器窗口表示为对象，提供与浏览器交互的接口。核心是 `window` 对象，它同时也是全局对象，包含 `location`、`navigator`、`screen`、`history` 等子对象，`document` 也是 `window` 的属性。

### 常见的 DOM 操作有哪些？

```js
// 查询节点
document.getElementById('id')
document.querySelector('.class')
document.querySelectorAll('div')

// 创建和插入
const el = document.createElement('div')
el.textContent = 'hello'
parent.appendChild(el)
parent.insertBefore(newEl, refEl)

// 删除
parent.removeChild(targetEl)

// 修改属性和样式
el.setAttribute('class', 'active')
el.style.color = 'red'
el.textContent = 'new text'
```

### addEventListener() 方法的参数

```js
target.addEventListener(type, listener, options)
target.addEventListener(type, listener, useCapture)
```

- **type**：事件类型字符串，如 `'click'`
- **listener**：事件处理函数（EventListener）
- **options**（可选对象）：
  - `capture: boolean`：是否在捕获阶段触发
  - `once: boolean`：是否只触发一次后自动移除
  - `passive: boolean`：为 `true` 时表示不会调用 `preventDefault()`，可提升滚动性能
  - `signal: AbortSignal`：通过 `abort()` 移除监听
- **useCapture**（可选布尔值）：`true` 为捕获阶段，`false`（默认）为冒泡阶段

### escape、encodeURI、encodeURIComponent 的区别

- **`encodeURI`**：对整个 URI 编码，保留 URI 中有特殊含义的字符（如 `:`、`/`、`?`、`#`），用于编码完整 URL。
- **`encodeURIComponent`**：对 URI 的某个组成部分编码，会转义 URI 特殊字符，用于编码查询参数值。
- **`escape`**：已废弃，对 Unicode 字符的处理不同（在字符前加 `%u`），不推荐使用。

```js
encodeURI('http://example.com/path?a=1&b=2')   // 保留 :/?&=
encodeURIComponent('a=1&b=2')                   // 转义 &= 等
```

### 对 AJAX 的理解，实现一个 AJAX 请求

AJAX（Asynchronous JavaScript and XML）通过 XMLHttpRequest 在不刷新页面的情况下与服务器通信。

```js
function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.onreadystatechange = function() {
      if (this.readyState !== 4) return
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.onerror = () => reject(new Error(xhr.statusText))
    xhr.send(null)
  })
}
```

### ajax、axios、fetch 的区别

- **AJAX（原生 XHR）**：基于 XMLHttpRequest，API 繁琐，基于事件回调。
- **Fetch**：原生 ES6 API，基于 Promise，语法简洁。缺点：只对网络错误 reject（4xx/5xx 不 reject）、默认不带 Cookie、不支持超时和进度监听。
- **Axios**：基于 Promise 的第三方库，封装 XHR，支持请求/响应拦截、自动 JSON 转换、取消请求、超时设置，浏览器和 Node.js 均可用。

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
- [MDN: BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [MDN: Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN: RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [MDN: ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [MDN: TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
