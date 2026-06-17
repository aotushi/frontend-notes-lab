# 执行上下文、作用域、闭包与 this

## 问题

执行上下文、作用域链、闭包、变量提升和 `this` 分别解决什么问题？为什么 `var`、`let`、函数声明、箭头函数、普通函数调用、`call` / `apply` / `bind`、`new` 调用会表现出不同的绑定规则？

## 结论

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

JavaScript 使用词法作用域。变量查找从当前词法环境开始，找不到就沿外部环境引用向外层查找，直到全局环境。这个链条由代码书写位置决定，而不是由函数调用位置决定。

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

闭包是函数和它可访问的外层词法环境的组合。只要内部函数仍然可达，相关外层变量就可能继续存活。

常见用途：

1. 保存私有状态。
2. 生成函数工厂。
3. 在异步回调中保留当时的变量。
4. 缓存计算结果。
5. 实现模块作用域。

闭包本身不是内存泄漏。泄漏通常来自“长期可达的闭包持有了不再需要的大对象、DOM 节点或订阅回调”。

### `this` 由什么决定？

普通函数的 `this` 由调用方式决定，箭头函数没有自己的 `this`，会捕获外层 `this`。

| 调用方式 | 示例 | `this` |
| --- | --- | --- |
| 默认调用 | `fn()` | 严格模式为 `undefined`，非严格脚本中通常为全局对象 |
| 隐式调用 | `obj.fn()` | `obj` |
| 显式调用 | `fn.call(obj)` | 传入的第一个参数，经规则转换 |
| 构造调用 | `new Fn()` | 新创建的实例对象 |
| 箭头函数 | `() => this.x` | 外层词法环境的 `this` |
| DOM 事件监听普通函数 | `el.addEventListener('click', fn)` | 事件当前目标元素 |

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

## Demo

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
