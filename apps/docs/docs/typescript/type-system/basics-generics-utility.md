# 类型基础、泛型与工具类型

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- TypeScript面试题
- 常规问题
- 类型声明和类型推断的区别
- 接口是什么, 作用,使用场景?和类型别名的区别
- 泛型是什么, 如何创建泛型函数和泛型类, 实际用途
- 枚举是什么? 作用及案例.
- 如何处理可空类型（nullable types）和undefined类型，如何正确处理这些类型以避免潜在错误
- 联合类型和交叉类型, 类型断言
- 命名空间和模块
- TS内置数据类型又那些?
- any类型介绍

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 常规问题
#### 类型声明和类型推断的区别
* 类型声明是显式地为变量或函数指定类型
* 类型推断是TypeScript根据赋值语句右侧的值自动推断变量的类型
```ts
// 类型声明
let x: number;
x = 10;
// 类型推断
let y = 20; // TypeScript会自动推断y的类型为number

```

#### 接口是什么, 作用,使用场景?和类型别名的区别
##### 是什么
> 接口是用于描述对象的形状的结构化类型。它定义了对象应该包含哪些属性和方法。

##### 区别
* 接口定义了一个契约，描述了对象的形状（属性和方法），以便在多个地方共享。它可以被类、对象和函数实现。
* 类型别名给一个类型起了一个新名字，便于在多处使用。它可以用于原始值、联合类型、交叉类型等。与接口不同，**类型别名可以用于原始类型、联合类型、交叉类型等，而且还可以为任意类型指定名字**


#### 泛型是什么, 如何创建泛型函数和泛型类, 实际用途
##### 是什么


#### 枚举是什么? 作用及案例.
##### 是什么
> 枚举是一种对数字值集合进行命名的方式。它们可以增加代码的可读性，并提供一种便捷的方式来使用一组有意义的常量。

```ts
enum Color {
 red,
 green,
 blue
}

let selectedColor: Color = Color.red
```

##### 枚举和常量枚举区别
* 枚举可以包含计算得出的值，而常量枚举则在编译阶段被删除，并且不能包含计算得出的值，它只能包含常量成员。
* 常量枚举在编译后会被删除，而普通枚举会生成真实的对象。
```ts
const enum Direction {
    Up,
    Down,
    Left,
    Right
}

function move(direction: Direction) {
    switch (direction) {
        case Direction.Up: //编译之后, 只会保留值
            console.log('向上移动');
            break;
        case Direction.Down:
            console.log('向下移动');
            break;
        case Direction.Left:
            console.log('向左移动');
            break;
        case Direction.Right:
            console.log('向右移动');
            break;
    }
}

move(Direction.Up); 

```

#### 如何处理可空类型（nullable types）和undefined类型，如何正确处理这些类型以避免潜在错误


在TypeScript中，可空类型是指一个变量可以存储特定类型的值，也可以存储`null`或`undefined`。（通过使用可空类型，开发者可以明确表达一个变量可能包含特定类型的值，也可能不包含值（即为`null`或`undefined`）

为了声明一个可空类型，可以使用联合类型（Union Types），例如 `number | null` 或 `string | undefined`。 例如：


#### 联合类型和交叉类型, 类型断言

#### 命名空间和模块

`模块`提供了一种组织代码的方式，使得我们可以轻松地在多个文件中共享代码，

`命名空间`则提供了一种在全局范围内组织代码的方式，防止命名冲突
模块示例:


```ts
//模块
// greeter.ts
export function sayHello(name: string) {
  return `Hello, ${name}!`;
}
// app.ts
import { sayHello } from './greeter';
console.log(sayHello('John'));


// 命名空间
// greeter.ts
namespace Greetings {
  export function sayHello(name: string) {
    return `Hello, ${name}!`;
  }
}
// app.ts
<reference path="greeter.ts" />
console.log(Greetings.sayHello('John'));


```

### 常规问题

##### 初始化CSS原因? 
- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。
- 最简单的初始化方法： `* { padding: 0; margin: 0; }` （强烈不建议）
- 使用 `normalize.css`
##### min-width, max-width,width的包含关系(优先级)是什么?
**属性的含义：**
- `min-width` 限制元素的最小宽度
- `max-width` 限制元素的最大宽度
- `width` 元素的宽度
**三者之间的优先级：**
`min-width` 和 `max-width` 的优先级都高于 `width`。即使 `width` 后面加上 `!important`。
- 当浏览器缩小导致元素宽度小于 `min-width` 时，元素的 `width` 就会被 `min-width` 的值取代，浏览器出现滚动条来容纳元素。
- 当浏览器放大导致元素的宽度大于 `max-width` 时，元素的 `width` 就会被 `max-width` 值取代。
- 当 `min-width` 值大于 `max-width` 时，则以 `min-width` 值为准。
**所以三者优先级排序： min-width > max-width > width**

### 类型声明和类型推断的区别

* 类型声明是显式地为变量或函数指定类型
* 类型推断是TypeScript根据赋值语句右侧的值自动推断变量的类型
```ts
// 类型声明
let x: number;
x = 10;
// 类型推断
let y = 20; // TypeScript会自动推断y的类型为number

```

### 接口是什么, 作用,使用场景?和类型别名的区别

##### 是什么
> 接口是用于描述对象的形状的结构化类型。它定义了对象应该包含哪些属性和方法。

##### 区别
* 接口定义了一个契约，描述了对象的形状（属性和方法），以便在多个地方共享。它可以被类、对象和函数实现。
* 类型别名给一个类型起了一个新名字，便于在多处使用。它可以用于原始值、联合类型、交叉类型等。与接口不同，**类型别名可以用于原始类型、联合类型、交叉类型等，而且还可以为任意类型指定名字**

### 泛型是什么, 如何创建泛型函数和泛型类, 实际用途

##### 是什么

### 枚举是什么? 作用及案例.

##### 是什么
> 枚举是一种对数字值集合进行命名的方式。它们可以增加代码的可读性，并提供一种便捷的方式来使用一组有意义的常量。

```ts
enum Color {
 red,
 green,
 blue
}

let selectedColor: Color = Color.red
```

##### 枚举和常量枚举区别
* 枚举可以包含计算得出的值，而常量枚举则在编译阶段被删除，并且不能包含计算得出的值，它只能包含常量成员。
* 常量枚举在编译后会被删除，而普通枚举会生成真实的对象。
```ts
const enum Direction {
    Up,
    Down,
    Left,
    Right
}

function move(direction: Direction) {
    switch (direction) {
        case Direction.Up: //编译之后, 只会保留值
            console.log('向上移动');
            break;
        case Direction.Down:
            console.log('向下移动');
            break;
        case Direction.Left:
            console.log('向左移动');
            break;
        case Direction.Right:
            console.log('向右移动');
            break;
    }
}

move(Direction.Up); 

```

### 如何处理可空类型（nullable types）和undefined类型，如何正确处理这些类型以避免潜在错误

在TypeScript中，可空类型是指一个变量可以存储特定类型的值，也可以存储`null`或`undefined`。（通过使用可空类型，开发者可以明确表达一个变量可能包含特定类型的值，也可能不包含值（即为`null`或`undefined`）

为了声明一个可空类型，可以使用联合类型（Union Types），例如 `number | null` 或 `string | undefined`。 例如：

### 联合类型和交叉类型, 类型断言

### 命名空间和模块

`模块`提供了一种组织代码的方式，使得我们可以轻松地在多个文件中共享代码，

`命名空间`则提供了一种在全局范围内组织代码的方式，防止命名冲突
模块示例:


```ts
//模块
// greeter.ts
export function sayHello(name: string) {
  return `Hello, ${name}!`;
}
// app.ts
import { sayHello } from './greeter';
console.log(sayHello('John'));


// 命名空间
// greeter.ts
namespace Greetings {
  export function sayHello(name: string) {
    return `Hello, ${name}!`;
  }
}
// app.ts
<reference path="greeter.ts" />
console.log(Greetings.sayHello('John'));


```

### TS内置数据类型又那些?

```js
boolean（布尔类型）

number（数字类型）

string（字符串类型）

null 和 undefined 类型

array（数组类型）object 对象类型

tuple（元组类型）：允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

enum（枚举类型）：`enum`类型是对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字

any（任意类型）

never 类型

void 类型
```

### any类型介绍

#### 作用
**作用:**
为编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来**自用户输入或第三方代码库**（不确定用户输入值的类型，第三方代码库是如何工作的）。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。

**any的问题**

1. 类型污染：any`类型的对象会导致后续的属性类型都会变成`any
2. 使用不存在的属性或方法而不报错

#### any和泛型的区别？

泛型有类型推论，编译器会根据传入的参数自动地帮助我们确定T的类型

any则是不检验

#### any和unknown有什么区别？
unknown 和 any 的主要区别是 unknown 类型会更加严格：在对 unknown 类型的值执行大多数操作之前，我们必须进行某种形式的检查。而在对 any 类型的值执行操作之前，我们不必进行任何检查。


#### any和泛型的比较
泛型有类型推论，编译器会根据传入的参数自动地帮助我们确定T的类型

any则是不检验


#### TypeScript 中 any、never、unknown、null & undefined 和 void 有什么区别？

- `any`: 动态的变量类型（失去了类型检查的作用）。
- `never`: 永不存在的值的类型。例如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
- `unknown`: 任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。
- `null & undefined`: 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给 number 类型的变量。当你指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。
- `void`: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为void。

## Demo

待补充：提供一组 TypeScript Playground 示例，对比 `any`、`unknown`、泛型、联合类型和交叉类型的类型检查结果。

## 表单校验与性能

### 问题

在项目中如何用 TypeScript 做表单验证？泛型和性能优化有什么关系？

### 结论

TypeScript 不能替代表单运行时校验。它负责在编译期约束数据结构；用户输入、接口响应和 URL 参数仍然需要运行时校验。常见做法是定义表单模型类型，再用校验函数或 schema 库把 `unknown` 收窄成可信类型。

```ts
type LoginForm = {
  username: string
  password: string
}

function validateLoginForm(value: unknown): value is LoginForm {
  if (typeof value !== 'object' || value === null) return false

  const form = value as Record<string, unknown>

  return typeof form.username === 'string'
    && typeof form.password === 'string'
    && form.password.length >= 8
}
```

泛型本身不会提升运行时性能，因为 TypeScript 类型会在编译后擦除。它的性能价值主要是减少错误、复用类型安全的数据结构、避免因为类型不清导致的额外转换和防御性代码。

面试回答：

> TS 做表单验证时，类型只保证编译期，真实用户输入仍要运行时校验。可以把表单模型定义成类型，再用类型守卫或 schema 校验把 `unknown` 收窄。泛型不会直接提升运行时性能，它的价值是让函数和组件在复用时保持类型安全，减少错误和无意义转换。
