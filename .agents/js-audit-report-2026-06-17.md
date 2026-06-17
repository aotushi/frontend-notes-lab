# JavaScript 文档审计报告（2026-06-17）

## 范围

- 站点入口：`apps/docs/docs/javascript/index.md`
- 正文目录：`apps/docs/docs/javascript/`
- 候选题来源：`.scratch/questions.jsonl`、`.scratch/source-corpus/`、`raw-notes/01_HTML&CSS&JS&TS.md`
- 本次处理目标：删除迁移痕迹，按 JavaScript 语言与宿主 API 分类重整，结合 raw-data JS 主题补充正式问答。

## 原始候选统计

| 指标 | 数量 |
| --- | ---: |
| `.scratch/questions.jsonl` 总行数 | 6720 |
| JS-like 候选题 | 3359 |
| 其中 `category = javascript` | 2821 |
| 跨分类但命中 JS 主题/来源的候选 | 538 |

JS-like 的识别口径包括：

- `category` 为 `javascript` 或 `js`。
- 来源路径包含 `category/js.md`、`JavaScript.md`、`ES6.md`、`Modules.md`、`Handwritten-code.md`、`summarry/javascript.md`。
- 标题命中 JavaScript 核心关键词，例如 `Promise`、`async`、`await`、事件循环、`this`、闭包、原型、模块、`CommonJS`、`ESM`、防抖、节流、深拷贝、`Proxy`、`Symbol`、`typeof`、`instanceof`、变量提升、严格模式、垃圾回收、`WeakMap`、`Map`、`Set`。

## 候选质量审计

| 类型 | 处理 |
| --- | --- |
| 重复题 | 合并为一个高质量主题，不按来源重复铺陈。 |
| 错分类题 | 根据语义转入语言基础、执行模型、对象模型、异步、模块、DOM/BOM、性能或手写实现。 |
| 浏览器 API 题 | 保留在 DOM/BOM 页，不混入 ECMAScript 语言核心。 |
| 工程化/框架/Node/TS 题 | 只在和 JS 语义直接相关时吸收；主体问题保留给对应专区。 |
| 过时兼容题 | 不作为正文主问题；必要时只保留历史边界。 |
| 私有笔记语法 | 删除 Obsidian 图片语法、迁移说明和过程性文字。 |

## 分类调整

本次采用的正式分类：

1. 语言基础：声明、基础类型、类型判断、相等性、隐式转换、严格模式。
2. 内置对象：Map、Set、WeakMap、WeakSet、Iterator、Generator、Array、Object、JSON、RegExp。
3. 执行模型：执行上下文、词法环境、作用域链、闭包、`this`、内存与垃圾回收。
4. 对象模型：原型链、构造函数、`new`、`class`、继承、`instanceof`。
5. 异步模型：Promise、`async` / `await`、事件循环、并发控制、Web Worker。
6. 模块系统：CommonJS、AMD、CMD、UMD、ESM、动态导入、循环依赖。
7. 浏览器宿主 API：DOM 事件、事件委托、Web Storage、IndexedDB、页面通信、History、Page Visibility。
8. 运行时性能：长任务、CPU 占用、DOM 性能、防抖节流、Worker、缓存。
9. 手写实现：函数绑定、对象模型、异步组合、深拷贝、发布订阅、数组处理。

## 转移统计

| 转移项 | 原位置 | 新位置 | 数量 |
| --- | --- | --- | ---: |
| 垃圾回收 | `async/promise-async-await.md` | `execution-model/memory-and-garbage-collection.md` | 1 |
| 事件循环与并发控制 | `async/promise-async-await.md` | `async/event-loop-workers-and-concurrency.md` | 1 |
| 执行上下文/作用域/闭包/this | `language-basics/declaration-and-types.md` | `execution-model/scope-closure-this.md` | 1 |
| DOM/BOM 内容 | `language-basics/declaration-and-types.md` | `dom-bom/events-and-storage.md` | 1 |
| 手写实现内容 | `language-basics/declaration-and-types.md` | `handwritten/common-implementations.md` | 1 |
| 模块化内容 | `modules/module-systems.md` 原迁移稿 | `modules/module-systems.md` 正式结构 | 1 |

转移数量合计：6 个主题组。

## 正文落地统计

| 指标 | 数量 |
| --- | ---: |
| 审计 JS Markdown 页面 | 13 |
| 正式问答正文页 | 12 |
| 新增正文页 | 1 |
| 正文结论型主题 | 95 |
| 迁移/过程标记残留 | 0 |
| `面试回答` 标题残留 | 0 |
| Obsidian 私有图片语法残留 | 0 |

本次新增正文页：

- `apps/docs/docs/javascript/execution-model/memory-and-garbage-collection.md`

## 页面处理结果

| 页面 | 处理结果 |
| --- | --- |
| `javascript/index.md` | 删除“已迁移知识点”，改为主题索引和分类原则。 |
| `language-basics/declaration-and-types.md` | 精简为声明、类型、相等性、转换、严格模式。 |
| `language-basics/es-builtins-operators-and-objects.md` | 补充 Map/Set、WeakMap、Iterator、Generator、数组、JSON、正则。 |
| `language-basics/proxy.md` | 补充 Proxy/Reflect、trap、与 defineProperty 的区别。 |
| `execution-model/scope-closure-this.md` | 重写执行上下文、作用域、闭包、this、call/apply/bind、箭头函数。 |
| `execution-model/memory-and-garbage-collection.md` | 新增内存模型、可达性、泄漏、WeakMap、排查流程。 |
| `object-model/prototype-and-inheritance.md` | 重写原型链、new、class、继承、instanceof。 |
| `async/promise-async-await.md` | 聚焦 Promise、then 返回、错误传播、组合 API、async/await、并发控制。 |
| `async/event-loop-workers-and-concurrency.md` | 补充任务/微任务、rAF、idle callback、Worker、并发池。 |
| `modules/module-systems.md` | 重写 CJS/AMD/CMD/UMD/ESM、实时绑定、动态导入、循环依赖。 |
| `dom-bom/events-and-storage.md` | 重写事件流、事件委托、存储、页面通信、History、Visibility。 |
| `performance/js-performance-patterns.md` | 补充 CPU、高频事件、长任务、DOM 性能、防抖节流、Worker。 |
| `handwritten/common-implementations.md` | 聚合 call/bind/new/instanceof/deepClone/Promise.all/debounce/throttle/EventBus/curry。 |

## 需要后续继续的事项

- 可以继续按页面增加交互式 Demo，但本次优先保证正文分类、事实边界和问答密度。
- 部分跨区题如 Babel、Webpack、Node、TypeScript、React/Vue 只做边界说明，后续应在对应专区继续整理。
