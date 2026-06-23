# 执行上下文、作用域、闭包与 this


### 理解路径

先区分“代码在哪里声明”和“代码怎么被调用”。词法环境和作用域链由声明位置决定，闭包来自函数保留外层词法环境；`this` 多数情况下由调用方式决定，箭头函数则从外层词法环境捕获。

### 执行上下文是什么？

执行上下文是 JavaScript 代码运行时的环境记录。全局代码、函数调用和模块代码都会创建对应上下文。一个上下文至少包含：

1. 词法环境：保存 `let`、`const`、`class` 以及块级作用域绑定。
2. 变量环境：保存 `var` 和函数声明等旧式绑定。
3. `this` 绑定：决定当前代码里的 `this` 值。
4. 外部环境引用：让当前作用域可以沿作用域链查找外层变量。

函数每调用一次都会产生新的执行上下文，并压入调用栈；函数返回或抛错后，对应上下文从调用栈弹出。

### 变量提升到底提升了什么？

“提升”不是把代码移动到文件顶部，而是在执行前的环境创建阶段先登记绑定。

| 声明 | 作用域 | 初始化时机 | 声明前读取 |
| --- | --- | --- | --- |
| `var` | 函数或全局 | 创建阶段初始化为 `undefined` | 得到 `undefined` |
| `let` / `const` | 块级 | 执行到声明语句时初始化 | 抛出暂时性死区错误 |
| `function` 声明 | 函数、全局或块级 | 创建阶段绑定函数对象 | 通常可调用 |
| `class` | 块级 | 执行到声明语句时初始化 | 抛出暂时性死区错误 |
| `import` | 模块级 | 模块链接阶段创建实时绑定 | 可引用，但受模块初始化顺序约束 |

块级函数声明在浏览器非严格脚本里有兼容性遗留行为。正式回答时应优先按严格模式和模块语义理解，不把浏览器旧行为当成通用规则。

### 作用域链如何查找变量？

#### 产生背景

变量引入程序后，会带来两个基本问题：变量存储在哪里？程序需要变量时如何找到它？作用域就是解决这两个问题的规则系统。

#### 是什么

作用域是存储变量和查找变量的规则。JavaScript 主要使用词法作用域：变量查找由代码书写位置决定，而不是由函数调用位置决定。

#### 变量查找案例

以 `var a = 2` 为例，可以拆成“声明”和“赋值”两个阶段理解：

1. 编译 / 环境创建阶段遇到 `var a`，会检查当前作用域里是否已经有同名绑定。
2. 如果已经存在同名绑定，这个声明不会重复创建绑定。
3. 如果不存在，就在当前作用域创建名为 `a` 的绑定。
4. 运行阶段执行 `a = 2`，引擎会先在当前作用域查找 `a`。
5. 找到就赋值；找不到就沿外层作用域继续查找。
6. 一直找不到时，非严格模式可能创建全局属性，严格模式会抛 `ReferenceError`。

```js
function demo() {
  var a = 2
  return a
}

demo() // 2
```

#### 引擎查找变量的两套规则

变量查找可以分成两类：

| 查询类型 | 关注点 | 示例 |
| --- | --- | --- |
| RHS 查询 | 取值：谁是值的来源 | `console.log(a)` 需要读取 `a` 的值 |
| LHS 查询 | 赋值：谁是赋值目标 | `a = 2` 需要找到可以被赋值的 `a` |

“左侧 / 右侧”不是简单看代码字符位置，而是看当前操作是在读取值，还是在寻找赋值目标。

#### 查询未声明变量的处理过程

当变量在任何作用域中都找不到时，读值和赋值的结果不同：

```js
console.log(missingValue)
// ReferenceError: missingValue is not defined
```

RHS 查询找不到变量，通常抛 `ReferenceError`。`typeof missingValue` 是一个特殊例外，它会返回 `'undefined'`。

```js
missingTarget = 1
```

LHS 查询找不到变量时：

1. 非严格脚本中，赋值可能在全局对象上创建同名属性。
2. 严格模式和 ES 模块中，会抛 `ReferenceError`。

如果变量找到了，但后续操作不合法，会抛 `TypeError`：

```js
const value = null

value.name
// TypeError: Cannot read properties of null
```

可以这样区分：`ReferenceError` 更接近“作用域查找失败”；`TypeError` 表示“找到了值，但对这个值做了不合法操作”。

#### 作用域的两种工作模型

作用域有两种常见模型：

| 模型 | 查找依据 | 说明 |
| --- | --- | --- |
| 词法作用域 | 函数和块写在哪里 | JavaScript 采用这种模型，作用域在代码编写 / 解析阶段就能确定 |
| 动态作用域 | 函数从哪里调用 | Bash 等语言中可以见到；JavaScript 的普通变量查找不使用动态作用域 |

```js
const name = 'global'

function printName() {
  return name
}

function run() {
  const name = 'local'
  return printName()
}

run() // 'global'
```

`printName` 在全局位置声明，所以它读取全局 `name`；它从 `run` 里调用，并不会改成读取 `run` 里的 `name`。

#### JavaScript 中的作用域类型

JavaScript 常见作用域包括：

1. 全局作用域：全局脚本或模块顶层所在的作用域。
2. 函数作用域：函数调用时创建，保存函数参数、`var`、函数声明等绑定。
3. 块级作用域：由 `{}`、`if`、`for`、`try...catch` 等块配合 `let`、`const`、`class` 创建。
4. 模块作用域：ES 模块顶层绑定不会自动挂到全局对象上。

#### 函数作用域的特点

1. 函数的作用域由函数定义位置决定，和调用位置无关。
2. 函数每次调用都会创建新的函数执行上下文和词法环境。
3. 函数作用域之间相互独立。
4. 函数内声明的局部变量只能在函数内部访问。
5. `var` 和函数声明会在函数作用域创建阶段登记绑定。
6. 省略声明直接赋值在非严格模式下可能创建全局属性；严格模式下会抛错，不应依赖这种行为。

```js
function createCounter() {
  var count = 0

  return function countUp() {
    count += 1
    return count
  }
}

const counterA = createCounter()
const counterB = createCounter()

counterA() // 1
counterA() // 2
counterB() // 1
```

每次调用 `createCounter()` 都会创建独立的函数作用域，所以 `counterA` 和 `counterB` 互不影响。

#### 块级作用域

`let`、`const` 和 `class` 会把绑定放在最近的块级作用域中。`var` 不会被普通 `{}` 限制，它仍然属于函数或全局作用域。

```js
{
  let blockValue = 1
  const fixedValue = 2
  var functionOrGlobalValue = 3
}

typeof blockValue // 'undefined' 之外的直接读取会抛 ReferenceError
typeof fixedValue // 'undefined'
functionOrGlobalValue // 3
```

`try...catch` 的 `catch` 参数也有自己的作用域：

```js
try {
  throw new Error('boom')
} catch (error) {
  console.log(error.message)
}

// error 在 catch 外不可访问
```

`with` 会临时改变标识符解析对象，但它不属于现代推荐的块级作用域实践，并且严格模式禁止使用。

#### 块级作用域的作用

块级作用域能让临时变量的可达范围更小，帮助减少命名冲突，也让不再需要的数据更早脱离引用关系：

```js
function render(data) {
  {
    const normalized = normalize(data)
    paint(normalized)
  }

  // normalized 在这里不可访问
}
```

`for` 循环头部使用 `let` 时，每次迭代都会创建新的绑定，这是循环闭包问题的常见解决方式：

```js
const tasks = []

for (let i = 0; i < 3; i += 1) {
  tasks.push(function readI() {
    return i
  })
}

tasks[0]() // 0
tasks[1]() // 1
tasks[2]() // 2
```

#### 作用域嵌套

当一个函数或块写在另一个函数或块内部时，就发生了作用域嵌套。变量查找从当前作用域开始，找不到就向外层继续查找，直到全局作用域；无论找到还是没找到，查找都会在最外层停止。

```js
const level = 'global'

function outer() {
  const level = 'outer'

  function inner() {
    const local = 'inner'
    return [local, level]
  }

  return inner()
}

outer() // ['inner', 'outer']
```

`inner` 先找到自己的 `local`，再向外找到 `outer` 作用域里的 `level`，不会读取全局的 `level`。

#### 作用域链

作用域链是当前词法环境和一层层外部词法环境连接起来形成的查找链。旧资料里常把它描述为“多个变量对象构成的链表”；按现代规范理解，更准确的是词法环境通过外部环境引用串联起来。

```js
const label = 'global'

function createReader() {
  const label = 'outer'
  return function read() {
    return label
  }
}

const read = createReader()
read() // 'outer'
```

`read` 在全局调用，但它声明在 `createReader` 内部，所以读取的是外层函数里的 `label`。

### 闭包是什么？

#### 定义

闭包是一个函数以及其周围状态，也就是词法环境引用的组合。简单说，闭包让函数可以访问它被创建时所在作用域里的变量，即使这个函数后来在原作用域之外执行。

#### 形成原因

闭包形成的核心原因是：函数保留了对上级词法作用域的引用。当函数可以记住并访问所在的词法作用域时，就产生了闭包。

```js
function checkScope() {
  const scope = 'local scope'

  function readScope() {
    return scope
  }

  return readScope
}

const read = checkScope()

read() // 'local scope'
```

`checkScope()` 执行结束后，它的函数执行上下文会从调用栈弹出；但 `readScope` 仍然引用着创建时的词法环境，所以 `scope` 仍然可达。

#### 如何创建

最典型的闭包写法是：外层函数里创建内部函数，内部函数引用外层变量，然后外层函数把这个内部函数返回出去或交给异步 / 事件系统稍后执行。

```js
function createCounter() {
  let count = 0

  return function countUp() {
    count += 1
    return count
  }
}

const countUp = createCounter()

countUp() // 1
countUp() // 2
```

#### 优点

1. 保护私有变量，避免外部直接改写内部状态。
2. 把数据和操作它的函数关联起来，形成类似对象私有状态的结构。
3. 支持函数工厂，让函数根据创建时的参数生成不同行为。
4. 支持模块化，把内部实现隐藏在函数作用域里，只暴露必要接口。

#### 缺点

闭包会让被引用的外层变量继续保持可达，因此要注意内存占用。闭包本身不是内存泄漏；泄漏通常来自长期存活的闭包持有了不再需要的大对象、DOM 节点、定时器或订阅回调。

内存泄漏和内存溢出也要区分：

| 概念 | 含义 |
| --- | --- |
| 内存泄漏 | 不再需要的对象仍然被引用，垃圾回收无法释放 |
| 内存溢出 | 程序需要的内存超过运行环境可提供的上限 |

#### 使用场景

闭包常见于数据私有化、函数工厂、模块化、回调和异步任务。不是“所有回调都一定是闭包”，更准确地说：当回调函数捕获并使用外层变量时，它就在使用闭包。

##### 回调

闭包可以把一些数据和操作它的函数关联起来。定时器、事件监听器、Ajax / fetch 回调、跨窗口通信、Web Worker 消息处理等场景中，回调经常需要读取创建它时的变量。

```js
function registerClickLogger(button, label) {
  button.addEventListener('click', function handleClick() {
    console.log(label)
  })
}
```

`handleClick` 被浏览器事件系统稍后调用，但它仍然能读取 `label`。

##### 模拟私有方法

闭包可以限制内部状态的访问范围，避免把非核心方法和内部数据暴露到公共接口上。

```js
function createUser(name) {
  let loginCount = 0

  return {
    login() {
      loginCount += 1
    },
    getLoginCount() {
      return loginCount
    },
    getName() {
      return name
    }
  }
}

const user = createUser('Ada')

user.login()
user.getLoginCount() // 1
user.loginCount // undefined
```

#### 闭包实例

##### 函数执行过程

```js
const scope = 'global scope'

function checkScope() {
  const scope = 'local scope'

  function readScope() {
    return scope
  }

  return readScope
}

const read = checkScope()

read() // 'local scope'
```

执行过程可以这样理解：

1. 进入全局代码，创建全局执行上下文并压入调用栈。
2. 调用 `checkScope()`，创建它的函数执行上下文并压入调用栈。
3. `checkScope` 创建局部变量 `scope` 和内部函数 `readScope`。
4. `checkScope` 返回 `readScope` 后执行结束，函数执行上下文从调用栈弹出。
5. `readScope` 仍然保留对 `checkScope` 词法环境的引用。
6. 调用 `read()` 时创建 `readScope` 的执行上下文，并沿作用域链读取到外层的 `scope`。

关键点是：调用栈里的执行上下文弹出了，不代表被闭包引用的词法环境一定被释放。

##### 实现一个只能执行三次的函数

```js
function sayHi() {
  console.log('hi')
}

function threeTimes(fn) {
  let times = 0

  return function limitedFn(...args) {
    if (times >= 3) {
      return
    }

    times += 1
    return fn(...args)
  }
}

const newFn = threeTimes(sayHi)

newFn()
newFn()
newFn()
newFn() // 不再执行
```

`times` 是 `threeTimes` 的局部变量，但返回的 `limitedFn` 一直引用它，所以能记录函数已经执行了几次。

##### 实现 `add(a)(b)` 和 `add(a, b)`

```js
function add(a, b) {
  if (b === undefined) {
    return function addNext(next) {
      return a + next
    }
  }

  return a + b
}

add(1, 2) // 3
add(1)(2) // 3
```

`add(1)` 返回的 `addNext` 捕获了外层参数 `a`，所以第二次调用时还能使用第一次调用传入的值。

#### 闭包面试题

##### `for` 循环里的闭包

```js
const data = []

for (var i = 0; i < 3; i += 1) {
  data[i] = function readI() {
    console.log(i)
  }
}

data[0]() // 3
data[1]() // 3
data[2]() // 3
```

`var` 是函数作用域或全局作用域，三个函数共享同一个 `i`。循环结束时 `i` 已经变成 `3`，所以三个函数都会输出 `3`。

可以用 IIFE 为每次循环创建独立参数：

```js
const data = []

for (var i = 0; i < 3; i += 1) {
  data[i] = (function createReader(j) {
    return function readJ() {
      console.log(j)
    }
  })(i)
}

data[0]() // 0
data[1]() // 1
data[2]() // 2
```

也可以直接用 `let` 创建每轮循环独立绑定：

```js
const data = []

for (let i = 0; i < 3; i += 1) {
  data[i] = function readI() {
    console.log(i)
  }
}

data[0]() // 0
data[1]() // 1
data[2]() // 2
```

#### 其它

##### IIFE 是闭包吗？

```js
const a = 2

(function IIFE() {
  console.log(a)
})()
```

这段代码能读取 `a`，但它只是立即在当前词法作用域内执行。面试里讨论的“典型闭包”通常强调：函数在创建它的词法作用域之外执行，仍然能访问创建时的变量。

如果 IIFE 返回函数，或者在 IIFE 里注册稍后执行的回调，就会形成更典型的闭包场景：

```js
const read = (function createReader() {
  const a = 2

  return function readA() {
    return a
  }
})()

read() // 2
```

##### 循环和闭包

```js
for (var i = 1; i <= 5; i += 1) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

定时器回调会在当前同步循环结束后执行。上面五个回调共享同一个 `i`，所以最终会连续输出五次 `6`。

IIFE 可以为每轮循环保存一个独立副本：

```js
for (var i = 1; i <= 5; i += 1) {
  (function createTimer(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}
```

`let` 可以直接为每轮循环创建新的块级绑定：

```js
for (let i = 1; i <= 5; i += 1) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

### `this` 由什么决定？

#### 介绍

`this` 是执行上下文里的一个绑定。普通函数的 `this` 在运行时由调用方式决定，和函数写在哪里无关；箭头函数没有自己的 `this`，会捕获外层词法环境里的 `this`。

#### 使用原因

`this` 的价值是把“当前操作的对象”隐式传给函数。否则每个方法都要显式传入上下文对象，API 会很啰嗦，也不利于同一个函数在不同对象之间复用。

#### 绑定规则

判断普通函数的 `this`，先看调用表达式：

| 绑定规则 | 调用方式 | 示例 | `this` |
| --- | --- | --- | --- |
| 默认绑定 | 直接调用 | `fn()` | 严格模式和 ES 模块中为 `undefined`；非严格脚本中通常为 `globalThis` |
| 隐式绑定 | 作为对象属性调用 | `obj.fn()` | 调用点最后一层属性前面的对象，即 `obj` |
| 显式绑定 | 用 `call` / `apply` / `bind` 指定 | `fn.call(obj)` | 指定的第一个参数；非严格函数会把原始值装箱，`null` / `undefined` 转成全局对象 |
| 构造绑定 | 用 `new` 调用 | `new Fn()` | 新创建的实例对象 |
| 词法绑定 | 箭头函数 | `() => this.x` | 外层作用域的 `this`，不能被 `call` / `apply` / `bind` / `new` 改写 |

优先级可以这样记：箭头函数先排除，因为它没有自己的 `this`；普通函数里，`new` 高于显式绑定，显式绑定高于隐式绑定，隐式绑定高于默认绑定。被 `bind` 固定过的函数，后续再用 `call` / `apply` 不能改 `this`；但如果把绑定函数作为构造函数使用，构造调用会让 `this` 指向新实例。

##### 默认绑定

默认绑定发生在普通函数直接调用时，也就是调用表达式里没有对象接收者、没有 `call` / `apply` / `bind`、也没有 `new`：

```js
function readName() {
  return this.name
}

readName() // 严格模式下 this 是 undefined；非严格脚本中 this 通常是 globalThis
```

ES 模块默认是严格模式，现代构建产物也经常运行在严格模式语义下，所以不要依赖“直接调用时 `this` 指向全局对象”。

##### 隐式绑定

隐式绑定要看“调用点”，不是看函数属于谁。对象只是保存了一个函数引用，函数本身并不真正属于对象：

```js
function showName() {
  return this.name
}

const user = {
  name: 'Ada',
  showName
}

user.showName() // 'Ada'，调用点是 user.showName()
```

属性引用链中只有最后一层会决定 `this`：

```js
const root = {
  name: 'root',
  child: {
    name: 'child',
    showName() {
      return this.name
    }
  }
}

root.child.showName() // 'child'，this 是 root.child，不是 root
```

##### 隐式绑定丢失

隐式绑定最常见的问题是“方法被拿出来之后丢失调用对象”，然后退回默认绑定：

```js
'use strict'

const obj = {
  a: 2,
  foo() {
    return this.a
  }
}

const foo = obj.foo

foo() // TypeError，因为 this 是 undefined
```

常见丢失方式包括三类：

1. 赋值丢失：`const foo = obj.foo; foo()`。
2. 参数传递丢失：`run(obj.foo)`，函数进入 `run` 后通常只是被 `fn()` 直接调用。
3. 回调丢失：`setTimeout(obj.foo, 0)`、`promise.then(obj.foo)`、数组遍历回调等，真正的调用方式由宿主 API 或库决定。

```js
const obj = {
  a: 2,
  foo() {
    console.log(this?.a)
  }
}

function run(fn) {
  fn()
}

run(obj.foo) // undefined
setTimeout(obj.foo, 0) // 浏览器定时器会按定时器 API 的规则调用回调，不再是 obj.foo()
```

##### 显式绑定

显式绑定用 `call`、`apply` 或 `bind` 把 `this` 指向指定对象。`call` 和 `apply` 会立即调用函数；`bind` 返回一个固定了 `this` 的新函数，更适合事件、定时器和异步回调。

```js
function readName() {
  return this.name
}

const user = { name: 'Ada' }
const boundReadName = readName.bind(user)

readName.call(user) // 'Ada'
boundReadName() // 'Ada'
```

非严格普通函数里，如果 `call` / `apply` 的第一个参数是原始值，会被装箱成对应对象；如果是 `null` 或 `undefined`，会被替换成全局对象。严格模式下会保留传入值本身。

##### `new` 绑定

构造调用会创建新对象并把它绑定给构造函数内部的 `this`。`new Fn(...args)` 的核心过程是：

1. 创建一个新对象。
2. 把新对象的原型指向 `Fn.prototype`；如果 `Fn.prototype` 不是对象，则使用 `Object.prototype`。
3. 用新对象作为 `this` 执行构造函数。
4. 如果构造函数返回对象或函数，返回这个显式返回值；否则返回新对象。

```js
function myNew(Constructor, ...args) {
  if (typeof Constructor !== 'function') {
    throw new TypeError('Constructor must be a function')
  }

  const prototype = Constructor.prototype
  const instance = Object.create(
    prototype !== null && (typeof prototype === 'object' || typeof prototype === 'function')
      ? prototype
      : Object.prototype
  )

  const result = Constructor.apply(instance, args)

  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : instance
}
```

#### 不同场景下的取值

回调场景不要统一背成“都是 `window`”。更准确的判断是：谁调用回调，谁决定 `this`。

| 场景 | 普通函数回调里的 `this` |
| --- | --- |
| `addEventListener` | 事件当前目标元素，通常等于 `event.currentTarget` |
| `setTimeout` / `setInterval` | 浏览器里通常是 `window`；不同宿主环境不要依赖这个值 |
| `Promise.then(fn)` | 回调调用时传入的 `this` 是 `undefined`；非严格普通函数内部可能被替换成 `globalThis` |
| `array.map(fn)` / `forEach(fn)` | 默认传入 `undefined`；可通过第二个 `thisArg` 指定，非严格普通函数仍可能发生默认绑定转换 |
| Vue Options API 方法和生命周期 | 框架绑定到组件实例代理 |
| Vue Composition API / React 函数组件 | 不使用组件实例 `this` |
| React class 方法 | 普通方法默认不会自动绑定，需要 `bind`、类字段箭头函数或在调用处包一层 |

#### 如何控制函数的 `this`

需要稳定控制 `this` 时，常见方式有三种：用 `bind` 固定普通函数的 `this`，用箭头函数捕获外层 `this`，或者把 `this` 保存到局部变量再给内层普通函数使用。现代代码优先用箭头函数或显式传参减少动态 `this` 的不确定性。

### `call`、`apply`、`bind` 有什么区别？

`call` 和 `apply` 会立即调用函数，只是参数传递形式不同；`bind` 返回一个永久绑定 `this` 和部分参数的新函数。

```js
function sum(a, b) {
  return this.base + a + b
}

sum.call({ base: 1 }, 2, 3)      // 6
sum.apply({ base: 1 }, [2, 3])   // 6
sum.bind({ base: 1 }, 2)(3)      // 6
```

被 `bind` 绑定后的函数再用 `call` / `apply` 改 `this` 不会生效；但如果用作构造函数，`new` 的实例绑定优先。

### 箭头函数为什么不能当构造函数？

箭头函数没有 `[[Construct]]` 内部方法，也没有自己的 `this`、`arguments`、`super` 和 `new.target` 绑定。它适合作为回调和需要继承外层 `this` 的函数，不适合定义对象方法或构造器。

### 严格模式会影响哪些绑定？

严格模式会让默认调用的 `this` 保持为 `undefined`，禁止静默创建全局变量，限制重复参数名、`with`、八进制字面量等易错语法，并让部分失败操作直接抛错。ES 模块默认使用严格模式。

### `this` 的设计缺点与指向混乱的根因

`this` 的核心争议在于：它是**动态绑定**，运行时由「函数怎么被调用」决定，而不是像普通变量那样由「函数在哪里声明」决定。好处是同一个方法能被不同对象复用；代价是无法仅凭函数定义静态推断 `this`，于是出现几类典型混乱：

1. 方法被当作值传递后丢失调用者：`const f = obj.method; f()`、`setTimeout(obj.method, 0)`、解构 `const { method } = obj` 都会让 `this` 退回默认绑定（严格模式下是 `undefined`）。
2. 嵌套的普通函数不继承外层 `this`：对象方法里再写一个普通 `function`，内层 `this` 不是外层对象。旧代码用 `const that = this` 或 `fn.bind(this)` 绕过，现在用箭头函数捕获词法 `this`。
3. 回调场景 `this` 漂移：数组方法回调、事件监听、定时器里的普通函数，`this` 各不相同。
4. 默认绑定不直观：非严格脚本里默认 `this` 是全局对象，容易意外污染全局。

可以这样总结缺点：`this` 把「词法」和「运行时」两套规则混在一起，需要同时记住默认、隐式、显式、构造、箭头几种绑定的优先级。现代实践的缓解方式是——需要稳定 `this` 的地方优先用箭头函数、`bind`、或 class 字段配合箭头方法，让 `this` 回到可预测的词法语义。

### 闭包保留词法环境

```js
function createCounter() {
  let count = 0

  return {
    inc() {
      count += 1
      return count
    },
    reset() {
      count = 0
    }
  }
}

const counter = createCounter()
counter.inc() // 1
counter.inc() // 2
```

### `this` 取值对比

```js
'use strict'

const user = {
  name: 'Ada',
  normal() {
    return this.name
  },
  arrow: () => this?.name
}

user.normal() // 'Ada'
user.arrow()  // undefined，取决于外层 this，不是 user

const fn = user.normal
fn() // TypeError 或 undefined 相关错误，因为 this 是 undefined
```

## 参考来源

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN: Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [ECMAScript: Execution Contexts](https://tc39.es/ecma262/#sec-execution-contexts)
