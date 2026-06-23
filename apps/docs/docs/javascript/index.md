# JavaScript

JavaScript 部分按语言本身和浏览器宿主能力分组：先掌握语法和值，再理解执行模型、对象模型、异步模型，最后进入模块、DOM/BOM、性能和常见实现题。

## 主题索引

### 语言基础

- [变量声明与基础类型](/javascript/language-basics/declaration-and-types)
- [ES 基础、内置对象与常见表达式题](/javascript/language-basics/es-builtins-operators-and-objects)
- [数组方法与迭代](/javascript/language-basics/array-and-iteration)
- [Proxy 是什么](/javascript/language-basics/proxy)

### 执行模型

- [执行上下文、作用域、闭包与 this](/javascript/execution-model/scope-closure-this)
- [内存模型与垃圾回收](/javascript/execution-model/memory-and-garbage-collection)

### 对象模型

- [原型链与继承](/javascript/object-model/prototype-and-inheritance)

### 异步模型

- [异步编程基础](/javascript/async/async-programming-basics)
- [Promise 与 async/await](/javascript/async/promise-async-await)
- [事件循环、并发控制与 Web Worker](/javascript/async/event-loop-workers-and-concurrency)

### 模块系统

- [JavaScript 模块化](/javascript/modules/module-systems)

### 浏览器宿主 API

- [DOM 事件与节点操作](/javascript/dom-bom/dom-events-and-nodes)
- [BOM 与页面生命周期](/javascript/dom-bom/bom-and-page-lifecycle)
- [浏览器存储](/javascript/dom-bom/browser-storage)
- [页面通信](/javascript/dom-bom/page-communication)

### 运行时性能

- [JavaScript 性能模式](/javascript/performance/js-performance-patterns)

### 手写实现

- [常见手写题](/javascript/handwritten/common-implementations)

## 分类原则

### 语言核心

变量声明、基础类型、表达式、对象、数组、函数、迭代器、生成器、正则和 JSON 属于语言核心。它们不依赖浏览器，也可以在 Node.js、Worker 或嵌入式 JS 引擎中运行。

### 执行模型

执行上下文、词法环境、作用域链、闭包、`this`、调用栈、堆内存和垃圾回收属于运行机制。它们解释代码为什么按某种方式绑定、访问、保留和释放值。

### 对象模型

原型、构造函数、`new`、`class`、继承、`super` 和 `instanceof` 属于对象模型。它们回答 JavaScript 如何表达对象复用和行为委派。

### 异步模型

Promise、`async` / `await`、任务队列、微任务、计时器、Web Worker 和并发控制属于异步模型。它们回答单线程 JavaScript 如何和宿主环境协作。

### 宿主 API

DOM、BOM、事件、存储、页面可见性、跨窗口通信和 History API 属于浏览器宿主能力。它们不是 ECMAScript 语言本身，但面试中通常和 JavaScript 一起考。

### 工程与框架边界

Babel、TypeScript、Vite、Webpack、React、Vue、Node.js、网络协议和浏览器渲染只在和 JavaScript 语义强相关时保留在本分类；主体问题应放到对应专区。
