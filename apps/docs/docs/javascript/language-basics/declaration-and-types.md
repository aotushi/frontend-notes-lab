# 变量声明与基础类型

## 概览

### 理解路径

这类题要分三层回答：先说明声明如何创建绑定，再说明值有哪些类型，最后说明表达式比较和类型转换如何发生。不要把"变量存在栈里、对象存在堆里"当成唯一答案，真正影响代码行为的是绑定、引用和值转换规则。

## 变量声明

### 声明变量有哪些方式？

常见声明形式包括 `var`、`let`、`const`、函数声明、类声明和模块 `import`。它们都会创建标识符绑定，但作用域、初始化时机和是否可重新赋值不同。`import` 创建的是模块实时绑定，不是把导出值复制一份。

### `var`、`let`、`const` 有什么区别？

| 维度 | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 作用域 | 函数或全局作用域 | 块级作用域 | 块级作用域 |
| 声明前访问 | `undefined` | 暂时性死区错误 | 暂时性死区错误 |
| 重复声明 | 同一作用域允许 | 同一作用域不允许 | 同一作用域不允许 |
| 全局声明 | 脚本中会成为全局对象属性 | 不会成为全局对象属性 | 不会成为全局对象属性 |
| 重新赋值 | 可以 | 可以 | 绑定不可重新赋值 |

`const` 限制的是绑定不能改，不是对象内容不能改。

```js
const user = { name: 'Ada' }
user.name = 'Grace' // 可以
user = {}           // TypeError
```

### 暂时性死区是什么？

在块级作用域中，`let`、`const`、`class` 绑定从作用域开始就存在，但在执行到声明语句之前不能访问。这个不可访问区间称为暂时性死区。

```js
{
  console.log(count) // ReferenceError
  let count = 1
}
```

### 暂时性死区和 `var` 提升

```js
console.log(a) // undefined
var a = 1

console.log(b) // ReferenceError
let b = 2
```

### `const` 绑定和对象可变性

```js
const list = []
list.push(1)

// list = [2] // TypeError
```

### 严格模式有什么作用？

严格模式让一部分历史上的静默错误变成显式错误，减少动态作用域和意外全局变量带来的不确定性。ES 模块天然是严格模式。常见影响包括：禁止意外创建全局变量、默认调用的 `this` 不再自动指向全局对象、禁止 `with`、限制重复参数名、让只读属性赋值直接抛错。

## 类型系统

### JavaScript 有哪些类型？

ECMAScript 语言类型包括 7 种原始类型和对象类型：

| 类型 | 示例 | 关键点 |
| --- | --- | --- |
| `undefined` | `undefined` | 变量已声明但未赋值、缺失返回值等 |
| `null` | `null` | 表示刻意置空；`typeof null` 是历史遗留的 `'object'` |
| `boolean` | `true` | 条件判断中的布尔值 |
| `number` | `1`, `NaN`, `Infinity` | 双精度浮点数，包含 `NaN` 和无穷值 |
| `bigint` | `1n` | 任意精度整数，不能和普通 number 直接混算 |
| `string` | `'text'` | 不可变字符串 |
| `symbol` | `Symbol('id')` | 唯一标识，常用于对象 key 和协议扩展 |
| object | `{}`, `[]`, `fn` | 引用类型，函数也是对象 |

### null 和 undefined 的区别

- `undefined`：变量声明但未赋值，或函数无返回值时的默认值。
- `null`：显式赋值，表示"空对象"，通常用于初始化将来会赋对象值的变量。
- `typeof undefined` 返回 `"undefined"`，`typeof null` 返回 `"object"`（历史遗留问题）。
- `null == undefined` 为 `true`，`null === undefined` 为 `false`。

### typeof null 的结果是什么，为什么？

`typeof null` 结果是 `"object"`。这是 JS 最初实现时的历史遗留 Bug：JS 第一版中所有值以 32 位存储，前 3 位是类型标签，`000` 表示对象，而 `null` 的机器码全为 0，因此前 3 位也是 `000`，被误判为对象类型。

### typeof NaN 的结果是什么？

```js
typeof NaN // "number"
```

`NaN`（Not a Number）是一个特殊的数值，表示运算失败的结果。它是唯一一个不满足自反性的值：`NaN !== NaN` 为 `true`。

### 如何获取安全的 undefined 值？

`undefined` 不是保留字，可以被覆盖赋值。使用 `void 0` 或 `void expression` 可以安全地获得 `undefined` 值，因为 `void` 运算符始终返回 `undefined`。

### 什么是 JavaScript 中的包装类型？

基本类型（string、number、boolean）本身没有属性和方法，但在访问其属性时，JS 会临时将其包装成对应的包装对象（`String`、`Number`、`Boolean`），调用完后立即销毁。

```js
'abc'.length      // 3（临时包装成 String 对象访问 length）
Object('abc')     // String {"abc"}（显式包装）
Object('abc').valueOf() // 'abc'（转回基本类型）
```

注意：`new Boolean(false)` 是对象，对象总是真值。

## 类型检测

### `typeof` 和 `instanceof` 有什么区别？

`typeof` 适合判断原始类型和函数，`instanceof` 判断对象原型链上是否能找到构造函数的 `prototype`。

```js
typeof 1          // 'number'
typeof undefined  // 'undefined'
typeof null       // 'object'
typeof (() => {}) // 'function'

[] instanceof Array // true
```

跨 iframe、不同 realm、手动改原型链时，`instanceof` 的结果可能不符合"业务类型"直觉。数组优先用 `Array.isArray()`。

`instanceof` 的核心实现就是沿着左侧值的原型链，查找右侧构造函数的 `prototype`：

```js
function myInstanceof(left, right) {
  // 1. instanceof 右边必须是函数
  // 例如：obj instanceof Person
  // Person 通常是构造函数
  if (typeof right !== 'function') {
    throw new TypeError('Right-hand side of instanceof is not callable')
  }

  // 2. 原始值不可能有原型链
  // 例如：123 instanceof Number -> false
  // 注意：函数也是对象，所以 function 要保留
  if (left === null || (typeof left !== 'object' && typeof left !== 'function')) {
    return false
  }

  // 3. 取出右边构造函数的 prototype
  // 例如：Person.prototype
  const targetPrototype = right.prototype

  // 4. 从 left 的原型开始往上找
  // 例如：
  // obj -> Person.prototype -> Object.prototype -> null
  let currentPrototype = Object.getPrototypeOf(left)

  // 5. 一直沿着原型链向上查找
  while (currentPrototype !== null) {
    // 如果某一层原型正好等于 right.prototype
    // 说明 left 是 right 的实例
    if (currentPrototype === targetPrototype) {
      return true
    }

    // 继续向上一层原型查找
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }

  // 6. 找到原型链顶端 null 都没找到
  // 说明 left 不是 right 的实例
  return false
}

function Person(name) {
  this.name = name
}

const p = new Person('Tom')

console.log(myInstanceof(p, Person)) // true
console.log(myInstanceof(p, Object)) // true
console.log(myInstanceof(p, Array)) // false
console.log(myInstanceof(123, Number)) // false
```

### 数据类型检测的方式有哪些？

- **typeof**：可以判断基本类型，但 `typeof null` 返回 `"object"`，数组和对象都返回 `"object"`。
- **instanceof**：通过原型链判断引用类型，不能判断基本类型。
- **constructor**：通过 `.constructor` 属性判断，但如果原型被重写会失效。
- **Object.prototype.toString.call()**：最准确，能判断所有类型，返回 `"[object Array]"` 等形式。

```js
Object.prototype.toString.call([])        // "[object Array]"
Object.prototype.toString.call(null)      // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
```

### 判断数组的方式有哪些？

```js
// 1. Array.isArray（推荐）
Array.isArray([]) // true

// 2. instanceof
[] instanceof Array // true

// 3. Object.prototype.toString
Object.prototype.toString.call([]).slice(8, -1) === 'Array' // true

// 4. 原型链
[].__proto__ === Array.prototype // true

// 5. Array.prototype.isPrototypeOf
Array.prototype.isPrototypeOf([]) // true
```

### isNaN 和 Number.isNaN 的区别

- `isNaN(value)`：先将参数转换为数字，再判断是否为 NaN，因此 `isNaN("abc")` 返回 `true`（因为 `Number("abc")` 是 NaN）。
- `Number.isNaN(value)`：不做类型转换，只有值本身是 NaN 时才返回 `true`，更精确。

```js
isNaN('abc')        // true（因为隐式转换后是 NaN）
Number.isNaN('abc') // false（'abc' 不是 NaN，它是字符串）
Number.isNaN(NaN)   // true
```

## 类型转换与比较

### `==`、`===`、`Object.is()` 怎么选？

`===` 不做大多数类型转换，是日常比较的默认选择。`==` 会触发抽象相等比较，只有在刻意利用 `x == null` 同时匹配 `null` 和 `undefined` 时才建议使用。`Object.is()` 和 `===` 很像，但能区分 `+0` 与 `-0`，并认为 `NaN` 等于自身。

```js
NaN === NaN           // false
Object.is(NaN, NaN)   // true
0 === -0              // true
Object.is(0, -0)      // false
```

### 对象用 `==` / `===` 比较的是什么？

引用类型（对象、数组、函数）比较的是**内存地址**，不是内容。两个内容相同但独立创建的对象，地址不同，`==` 和 `===` 都为 `false`。

```js
const obj3 = { a: 1 }
const obj4 = { b: 2 }
obj3 == obj4  // false
obj3 === obj4 // false
```

只有把同一个引用赋值过去、两个变量指向同一地址时才相等：

```js
const obj1 = { a: 1 }
const obj2 = obj1 // 赋的是引用地址，指向同一对象
obj1 == obj2  // true
obj1 === obj2 // true
```

### 隐式类型转换如何回答？

隐式转换主要发生在运算符、比较、条件判断和对象转原始值时：

1. 条件判断会转布尔值，`false`、`0`、`-0`、`0n`、`''`、`null`、`undefined`、`NaN` 为假值。
2. `+` 同时承担数字加法和字符串拼接；只要一侧转成字符串，结果就是字符串拼接。
3. `-`、`*`、`/` 等数值运算会倾向转成数字。
4. 对象转原始值会按 `@@toPrimitive`、`valueOf`、`toString` 的规则尝试。

```js
3 + '2' - 5 // 27
```

先执行 `3 + '2'` 得到字符串 `'32'`，再执行 `'32' - 5` 转成数字计算，结果是 `27`。

### `['1', '2', '3'].map(parseInt)` 为什么不是 `[1, 2, 3]`？

`Array.prototype.map` 会给回调传入 `(element, index, array)`，而 `parseInt` 第二个参数是进制。

```js
['1', '2', '3'].map(parseInt)
// parseInt('1', 0) => 1
// parseInt('2', 1) => NaN
// parseInt('3', 2) => NaN
```

正确写法是显式只传入值：

```js
['1', '2', '3'].map((value) => parseInt(value, 10))
```

### 其他值到字符串的转换规则

- `null` → `"null"`，`undefined` → `"undefined"`
- `true` → `"true"`，`false` → `"false"`
- 数字：极大极小值使用指数形式
- Symbol：只允许显式转换，隐式转换报错
- 普通对象：调用 `toString()`，默认返回 `"[object Object]"`

### 其他值到数字的转换规则

- `undefined` → `NaN`
- `null` → `0`
- `true` → `1`，`false` → `0`
- 字符串：可解析为数字则转换，否则 `NaN`，空字符串为 `0`
- Symbol：报错
- 对象：先调用 `valueOf()`，若不返回原始值再调用 `toString()`，最后再转数字

### 其他值到布尔类型的转换规则

以下值转换为 `false`（假值）：`undefined`、`null`、`false`、`+0`、`-0`、`NaN`、`""`（空字符串）。

假值列表以外的所有值都转换为 `true`，包括 `"0"`、`[]`、`{}`。

### `||` 和 `&&` 操作符的返回值

`||` 和 `&&` 不总是返回布尔值，而是返回其中一个操作数的值：

- `||`：如果第一个操作数为真值，返回第一个；否则返回第二个。
- `&&`：如果第一个操作数为假值，返回第一个；否则返回第二个。

```js
1 || 0   // 1
0 || 'a' // 'a'
1 && 'b' // 'b'
0 && 'b' // 0
```

### `+` 操作符什么时候用于字符串拼接？

当 `+` 的任一操作数是字符串（或经 `ToPrimitive` 转换后得到字符串）时，执行字符串拼接；否则执行数字加法。对象会先调用 `valueOf()` 再调用 `toString()` 转为原始值。

```js
1 + '2'    // '12'（字符串拼接）
1 + true   // 2（数字加法）
[] + {}    // '[object Object]'
{} + []    // 0（此时 {} 被解析为空代码块）
```

## 参考来源

- [MDN: JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
- [ECMAScript: ECMAScript Language Types](https://tc39.es/ecma262/#sec-ecmascript-language-types)
