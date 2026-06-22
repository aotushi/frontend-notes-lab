# 原型链与继承

## 问题

JavaScript 的原型、原型链、构造函数、`new`、`class`、继承和 `instanceof` 分别是什么？ES5 组合继承、寄生组合继承和 ES6 `class extends` 有什么关系？

## 结论

### 理解路径

JavaScript 对象复用的基础是原型委托。对象本身没有某个属性时，会沿 `[[Prototype]]` 链继续查找。构造函数、`new` 和 `class` 都是在这套原型机制之上的语法和约定。

### 原型和原型链是什么？

#### 是什么

原型链就是由多个 `[[Prototype]]` 引用连接起来的链状结构。读取属性时，如果对象自身没有该属性，JavaScript 引擎会继续去它的原型上找，再去原型的原型上找，直到链尾。

#### 原型对象

除 `null` 外，JavaScript 中的对象在创建时通常会关联另一个对象，这个被关联的对象就是它的原型。对象可以通过原型复用属性和方法，但这种“继承”不是复制，而是读取属性时发生的委托查找。

```js
const parent = { role: 'admin' }
const child = Object.create(parent)

child.name = 'Ada'
child.role // 'admin'
```

#### 原型链查找规则概述

读取对象属性时，JavaScript 引擎会按下面的顺序查找：

1. 先在对象自身属性中寻找。
2. 如果自身有这个属性，直接使用。
3. 如果自身没有这个属性，就去对象的原型中寻找。
4. 如果原型上找到了就使用；如果没有，就继续去原型的原型上寻找。
5. 以此类推，直到查到原型链末端；如果仍然没有找到，就返回 `undefined`。

```js
const base = {
  role: 'member',
  permissions: ['read']
}

const user = Object.create(base)
user.name = 'Ada'

console.log(user.name) // 'Ada'，来自自身
console.log(user.role) // 'member'，来自原型
console.log(user.missing) // undefined，查到链尾仍未找到
```

#### 原型链图例

原型与原型链结构可以参考下图：

![原型与原型链结构图](/images/javascript/object-model/prototype-chain.png)

如果自身属性和原型属性同名，自身属性会遮蔽原型属性。读取时先命中自身属性，就不会继续向原型链上查。

#### 边界说明

常见普通对象的原型链尾部通常是 `Object.prototype`，而 `Object.prototype` 自身的 `[[Prototype]]` 是 `null`。但 `Object.create(null)` 可以创建没有原型的对象，所以不能把“所有对象最终都到 `Object.prototype`”说成绝对规则。

判断一个属性是不是对象自身拥有时，不能只用 `obj.key !== undefined`，应使用 `Object.hasOwn(obj, key)` 或 `Object.prototype.hasOwnProperty.call(obj, key)`。

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

JavaScript 继承方式常见可以按下面 6 类理解：

1. 原型链继承。
2. 借用构造函数，也叫经典继承。
3. 组合继承。
4. 原型式继承。
5. 寄生式继承。
6. 寄生组合式继承。

| 方式 | 核心写法 | 优点 | 主要问题 |
| --- | --- | --- | --- |
| 原型链继承 | `Child.prototype = new Parent()` | 可以继承父类原型方法 | 引用属性共享，子类创建实例时不能向父类传参 |
| 借用构造函数 | `Parent.call(this, ...args)` | 实例属性独立，可以向父类传参 | 不能继承父类原型方法，方法写在构造函数里会重复创建 |
| 组合继承 | 借用构造函数 + 原型链继承 | 实例属性独立，原型方法可复用 | 父构造函数会调用两次，子类原型上有冗余属性 |
| 原型式继承 | `Object.create(parentLikeObject)` | 适合基于已有对象创建新对象 | 本质是浅委托，引用属性仍共享，不能走构造函数传参 |
| 寄生式继承 | 创建对象后再增强对象 | 可以封装增强过程 | 每次创建对象都会重新创建增强方法 |
| 寄生组合式继承 | `Object.create(Parent.prototype)` + `Parent.call(this)` | ES5 中较完整，只调用一次父构造函数 | 写法比 `class extends` 繁琐 |

#### 原型链继承

原型链继承的核心是让子类原型等于父类实例：

```js
Child.prototype = new Parent()
```

每个构造函数都有一个 `prototype` 对象，实例内部有一个指向原型对象的 `[[Prototype]]` 指针。实例通过这个内部指针访问原型对象，原型对象又通过 `constructor` 指回构造函数。

```js
function Parent() {
  this.name = 'kevin'
}

Parent.prototype.getName = function getName() {
  return this.name
}

Parent.prototype.stringVal = 'parentA'

function Child() {}

Child.prototype = new Parent()
Child.prototype.constructor = Child

const child = new Child()

console.log(child.getName()) // 'kevin'
console.log(child.stringVal) // 'parentA'
```

原型链继承的主要缺点：

1. 父类构造函数里的引用类型属性会被所有子类实例共享。
2. 创建子类实例时，不能向父类构造函数传参。
3. 子类原型只能直接指向一个对象，不能直接同时指向多个父类原型。
4. 给子类原型添加属性和方法，应放在替换 `Child.prototype` 之后、创建子类实例之前。

引用类型属性共享的问题最典型：

```js
function Parent() {
  this.names = ['kevin', 'daisy']
  this.year = 1010
}

function Child() {}

Child.prototype = new Parent()
Child.prototype.constructor = Child

const child1 = new Child()
child1.names.push('yayu')
child1.year = 'abab'

console.log(child1.names) // ['kevin', 'daisy', 'yayu']
console.log(child1.year) // 'abab'

const child2 = new Child()

console.log(child2.names) // ['kevin', 'daisy', 'yayu']
console.log(child2.year) // 1010
```

`names` 是共享数组，所以 `child1.names.push()` 会影响 `child2`。`year` 是原始值，`child1.year = 'abab'` 会在 `child1` 自身创建同名属性，遮蔽原型上的 `year`，不会改掉原型上的 `year`。

#### 借用构造函数，也叫经典继承

借用构造函数的核心是在子类构造函数中，通过 `call()` 或 `apply()` 调用父类构造函数：

```js
function Parent(name, age) {
  this.name = name
  this.age = age
  this.sayHello = function sayHello() {
    return `hello, 大家好，我是 ${this.name}`
  }
}

function Child(name, age) {
  Parent.call(this, name, age)
}

const child = new Child('孙悟空', 18)

console.log(child.name) // '孙悟空'
console.log(child.sayHello()) // 'hello, 大家好，我是 孙悟空'
```

这种方式的核心是用父类构造函数增强子类实例，相当于把父类实例属性复制到子类实例上，没有用到父类原型链。

优点：

1. 避免原型链继承中引用类型属性被所有实例共享。
2. 可以在子类中向父类构造函数传参。

缺点：

1. 如果方法定义在构造函数中，每次创建实例都会重新创建一遍方法。
2. 只能继承父类构造函数内的实例属性和方法，不能继承父类原型上的属性和方法。

把方法提到全局函数可以避免重复创建函数对象，但会带来命名空间污染，并且每次实例化仍然要给实例赋值一次方法引用：

```js
function globalSayHello() {
  return `hello, 大家好，我是 ${this.name}`
}

function Parent(name, age) {
  this.name = name
  this.age = age
  this.sayHello = globalSayHello
}

function Child(name, age) {
  Parent.call(this, name, age)
}

const child1 = new Child('孙悟空', 18)
const child2 = new Child('猪八戒', 18)

console.log(child1.sayHello === child2.sayHello) // true
```

更好的复用位置通常是原型，这也是组合继承要解决的问题。

#### 组合继承

组合继承综合原型链继承和借用构造函数。它通过借用构造函数继承实例属性，通过原型链继承原型方法。

实现步骤：

1. 在子类构造函数中调用父类构造函数：`Parent.call(this, name)`。
2. 让子类原型等于父类实例：`Child.prototype = new Parent()`。
3. 把子类原型的 `constructor` 指回子类：`Child.prototype.constructor = Child`。

```js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function getName() {
  return this.name
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

const child1 = new Child('kevin', 18)
child1.colors.push('black')

console.log(child1.name) // 'kevin'
console.log(child1.age) // 18
console.log(child1.colors) // ['red', 'blue', 'green', 'black']
console.log(child1.getName()) // 'kevin'

const child2 = new Child('daisy', 20)

console.log(child2.name) // 'daisy'
console.log(child2.age) // 20
console.log(child2.colors) // ['red', 'blue', 'green']
```

组合继承的优点是同时解决了实例属性独立和原型方法复用的问题。缺点是父类构造函数会执行两次：

1. 设置子类原型时，`Child.prototype = new Parent()` 执行一次。
2. 创建子类实例时，`Parent.call(this, name)` 再执行一次。

第二次调用得到的是每个实例自己的属性；第一次调用会在 `Child.prototype` 上留下冗余的实例属性。

`class extends` 可以写出更直观的继承：

```js
class Parent {
  constructor(name) {
    this.name = name
    this.colors = ['red', 'blue', 'green']
  }

  getName() {
    return this.name
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}

const child1 = new Child('Alice', 10)
child1.colors.push('black')

const child2 = new Child('Bob', 12)

console.log(child1.getName()) // 'Alice'
console.log(child2.colors) // ['red', 'blue', 'green']
console.log(child1 instanceof Parent) // true
```

`extends` 会建立子类原型到父类原型的连接，`super()` 会执行父类构造函数完成实例初始化。它保留了原型方法复用和实例属性独立这两个目标，同时避免传统组合继承中“设置子类原型时调用一次父构造函数”的冗余。

#### 原型式继承

原型式继承适合“已有一个对象，想基于它再创建一个新对象”的场景。它通过一个临时构造函数把传入对象放到新对象的原型链上，本质上是 `Object.create()` 的简化模拟。

```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

```js
const person = {
  name: 'kevin',
  friends: ['daisy', 'kelly']
}

const person1 = object(person)
const person2 = object(person)

person1.name = 'person1'
console.log(person2.name) // 'kevin'

person1.friends.push('taylor')
console.log(person2.friends) // ['daisy', 'kelly', 'taylor']
```

`person1.name = 'person1'` 会在 `person1` 自身创建同名属性，不会修改原型对象上的 `name`。`friends` 是原型对象上的共享数组，修改数组内容会影响其它委托到同一个原型对象的实例。

原型式继承的缺点和原型链继承类似：引用类型属性共享，也不能通过子类构造函数传参。

#### 寄生式继承

寄生式继承会创建一个仅用于封装继承过程的函数，在函数内部基于某个对象创建新对象，再增强这个新对象，最后返回它。

```js
function createObj(o) {
  const clone = Object.create(o)

  clone.sayName = function sayName() {
    return 'hi'
  }

  return clone
}

const person = { name: 'kevin' }
const person1 = createObj(person)

console.log(person1.name) // 'kevin'
console.log(person1.sayName()) // 'hi'
```

它的问题和借用构造函数类似：增强方法写在工厂函数内部时，每次创建对象都会重新创建一遍方法。

#### 寄生组合式继承

寄生组合式继承是为了解决组合继承中“父构造函数调用两次”的问题。它不使用 `Child.prototype = new Parent()`，而是让 `Child.prototype` 间接访问 `Parent.prototype`。

```js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function getName() {
  return this.name
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

const child = new Child('kevin', 18)

console.log(child.getName()) // 'kevin'
console.log(child instanceof Child) // true
console.log(child instanceof Parent) // true
console.log(Parent.prototype.isPrototypeOf(child)) // true
```

可以把连接原型的过程封装起来：

```js
function inheritPrototype(child, parent) {
  const prototype = Object.create(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

inheritPrototype(Child, Parent)
```

寄生组合式继承的特点：

1. 只在创建子类实例时调用一次父构造函数。
2. 子类原型不会带有父构造函数初始化出的冗余实例属性。
3. 原型链保持正确，`instanceof` 和 `isPrototypeOf()` 仍然可用。
4. 在 ES5 写法中，它是相对完整的引用类型继承方案。

### ES6 class 的静态成员、实例成员什么时候挂载？

按「挂在谁身上、何时赋值」区分四类成员：

| 成员 | 挂载位置 | 时机 |
| --- | --- | --- |
| 静态方法 / 静态属性 | 类（构造函数）本身 | 类定义求值时就挂上，通过 `Child.staticFn` 访问 |
| 原型方法 | `Class.prototype` | 类定义求值时挂上，所有实例共享 |
| 实例字段（class fields） | 每个实例自身 | `new` 时初始化，基类在进入 constructor 前、子类在 `super()` 返回后 |
| 构造函数里 `this.x =` | 每个实例自身 | 执行到该赋值语句时 |

```js
class Base {
  static tag = 'base' // 挂在 Base 上
  size = 1 // 每个实例各一份
  getSize() {
    return this.size
  } // 挂在 Base.prototype
}
```

关键点：静态成员和原型方法在**类声明时**就确定，不随实例创建重复挂载；实例字段每次 `new` 都重新赋值。子类的实例字段初始化发生在 `super()` 之后，所以在子类字段里能安全访问父类已初始化的状态。

### ES5 继承和 ES6 继承除了写法，还有什么区别？

不只是语法糖的差异，运行语义也不同：

1. **实例的创建主体不同**：ES5 寄生组合继承是「子类先用 `new` 建好 `this`，再 `Parent.call(this)` 把父类属性塞进来」；ES6 是「父类的 constructor 先创建实例，`super()` 把这个实例返回给子类」。所以 ES6 子类里 `super()` 之前不能用 `this`。
2. **能否继承内置类型**：ES6 `class extends Array / Error / HTMLElement` 能得到行为正确的子类；ES5 用 `Parent.call(this)` 继承内置类型通常失败（内置构造函数忽略传入的 `this`，拿不到内部插槽）。
3. **提升与调用约束**：`class` 有暂时性死区、类体强制严格模式、方法不可枚举、必须 `new` 调用；ES5 构造函数会变量提升，也可能被当普通函数误调用。
4. **`super` 机制**：ES6 通过 `[[HomeObject]]` 支持在方法里用 `super.method()` 调父类原型方法；ES5 只能 `Parent.prototype.method.call(this)` 手动转发。

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
- [冴羽：JavaScript 深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)
- [JavaScript 继承](https://slbyml.github.io/javascript/extend.html#%E7%BB%84%E5%90%88%E5%BC%8F%E7%BB%A7%E6%89%BF)
