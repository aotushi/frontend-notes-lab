# 原型链与继承

## 问题

JavaScript 的原型、原型链、构造函数、`new`、`class`、继承和 `instanceof` 分别是什么？ES5 组合继承、寄生组合继承和 ES6 `class extends` 有什么关系？

## 结论

### 理解路径

JavaScript 对象复用的基础是原型委托。对象本身没有某个属性时，会沿 `[[Prototype]]` 链继续查找。构造函数、`new` 和 `class` 都是在这套原型机制之上的语法和约定。

### 原型和原型链是什么？

每个普通对象都有一个内部 `[[Prototype]]` 指向另一个对象或 `null`。读取属性时，如果对象自身没有该属性，引擎会沿 `[[Prototype]]` 查找，这条链就是原型链。

```js
const parent = { role: 'admin' }
const child = Object.create(parent)

child.name = 'Ada'
child.role // 'admin'
```

### 构造函数、`prototype` 和 `__proto__` 怎么区分？

1. 函数的 `prototype` 属性用于给通过 `new` 创建的实例指定原型。
2. 实例的内部 `[[Prototype]]` 指向构造函数的 `prototype`。
3. `__proto__` 是访问内部原型的历史访问器，正式代码优先用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()`。

```js
function User(name) {
  this.name = name
}

User.prototype.say = function say() {
  return this.name
}

const user = new User('Ada')
Object.getPrototypeOf(user) === User.prototype // true
```

### `new` 操作符做了什么？

`new Fn(...args)` 主要做四件事：

1. 创建一个新对象。
2. 把新对象的 `[[Prototype]]` 指向 `Fn.prototype`。
3. 以新对象作为 `this` 调用 `Fn`。
4. 如果构造函数显式返回对象，则返回该对象；否则返回新对象。

### `class` 是什么？

`class` 是基于原型的语法糖，但不只是简单替换构造函数。类声明有暂时性死区，类体默认严格模式，类方法不可枚举，必须用 `new` 调用构造器。

```js
class User {
  constructor(name) {
    this.name = name
  }

  say() {
    return this.name
  }
}
```

### 常见继承方式怎么评价？

| 方式 | 特点 | 主要问题 |
| --- | --- | --- |
| 原型链继承 | 子类型原型指向父类型实例 | 引用属性共享，难传参 |
| 构造函数继承 | 在子构造函数中调用父构造函数 | 不能复用父原型方法 |
| 组合继承 | 构造函数继承 + 原型链继承 | 父构造函数调用两次 |
| 寄生组合继承 | 用 `Object.create` 连接原型 | ES5 中较完整 |
| `class extends` | 标准语法，支持 `super` | 本质仍是原型委托 |

### `instanceof` 的内部逻辑是什么？

`obj instanceof Ctor` 会检查 `Ctor.prototype` 是否出现在 `obj` 的原型链上。

```js
function myInstanceof(value, ctor) {
  if (value == null || (typeof value !== 'object' && typeof value !== 'function')) {
    return false
  }

  let proto = Object.getPrototypeOf(value)
  const target = ctor.prototype

  while (proto) {
    if (proto === target) return true
    proto = Object.getPrototypeOf(proto)
  }

  return false
}
```

跨 realm 或构造函数自定义 `Symbol.hasInstance` 时，`instanceof` 结果可能变化。

### 面向对象三特征在 JavaScript 中怎么理解？

封装可以通过闭包、模块、私有字段和对象边界实现；继承主要通过原型委托和 `class extends` 实现；多态来自动态派发，即不同对象暴露同名方法并在运行时调用。

## Demo

### 寄生组合继承

```js
function Parent(name) {
  this.name = name
}

Parent.prototype.say = function say() {
  return this.name
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```

### `class extends`

```js
class Parent {
  constructor(name) {
    this.name = name
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
```

## 参考来源

- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)
- [MDN: new operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN: instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
