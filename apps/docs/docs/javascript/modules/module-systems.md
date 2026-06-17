# JavaScript 模块化

## 问题

CommonJS、AMD、CMD、UMD 和 ES Module 分别解决什么问题？`import` / `export`、`module.exports` / `require` 的差异是什么？ESM 的静态结构、实时绑定、动态导入和循环依赖如何回答？

## 结论

### 理解路径

模块化解决的是命名隔离、依赖声明、复用和加载顺序问题。面试中不要只背规范名，要说明它们出现的运行环境：CommonJS 主要服务服务端同步文件加载，AMD/CMD 服务早期浏览器异步加载，ESM 是语言标准模块系统。

### 常见模块方案怎么比较？

| 方案 | 代表 | 加载特点 | 典型环境 |
| --- | --- | --- | --- |
| CommonJS | `require`、`module.exports` | 运行时加载，导出对象可变 | Node.js |
| AMD | RequireJS | 依赖前置，异步加载 | 早期浏览器 |
| CMD | SeaJS | 就近依赖，延迟执行 | 早期浏览器 |
| UMD | 包装兼容层 | 同时兼容多种模块环境 | 类库分发 |
| ESM | `import`、`export` | 静态链接、实时绑定、支持异步加载 | 浏览器和现代 Node.js |

### ESM 有哪些核心特征？

1. 顶层 `import` / `export` 是静态结构，便于提前分析依赖。
2. 导入的是实时绑定，不是值拷贝。
3. 模块顶层默认严格模式。
4. 每个模块有自己的模块作用域。
5. 浏览器中 `<script type="module">` 默认 defer。
6. 可以使用 `import()` 做动态导入，返回 Promise。

```js
// counter.js
export let count = 0
export function inc() {
  count += 1
}

// app.js
import { count, inc } from './counter.js'
inc()
console.log(count) // 1
```

### CommonJS 和 ESM 有什么区别？

| 维度 | CommonJS | ES Module |
| --- | --- | --- |
| 语法阶段 | 普通运行时代码 | 模块链接阶段静态分析 |
| 加载方式 | 通常同步 | 浏览器中异步，支持静态链接 |
| 导出语义 | 导出对象值 | 实时绑定 |
| Tree shaking | 难静态分析 | 更友好 |
| 循环依赖 | 返回当前已执行的导出对象 | 创建绑定后再执行模块 |
| 顶层 `this` | Node CJS 中不是 `undefined` | `undefined` |

### `module.exports` 和 `exports` 是什么关系？

在 CommonJS 中，`exports` 初始只是 `module.exports` 的引用。给 `exports.foo` 赋值有效；直接把 `exports` 重新赋值不会改变真正导出的对象。

```js
exports.name = 'Ada'          // 有效
module.exports = function () {} // 有效
exports = function () {}      // 无效，只改了局部变量
```

### 默认导出和命名导出怎么选？

命名导出适合工具集合和多个稳定 API；默认导出适合一个模块只有一个主要产物。大项目中命名导出更利于重构、自动导入和静态检查。

### 动态导入有什么作用？

`import(specifier)` 返回 Promise，适合路由级拆包、按需加载、特性分支和降低首屏体积。

```js
async function openEditor() {
  const { createEditor } = await import('./editor.js')
  return createEditor()
}
```

### 循环依赖如何处理？

循环依赖不是一定错误，但容易遇到初始化顺序问题。ESM 会先创建绑定再执行模块，因此能在一定程度上处理循环依赖；如果在依赖尚未初始化时读取，会触发暂时性死区错误或得到未完成状态。实践中应把共享常量、接口或工厂函数抽到第三个模块，减少强循环。

## Demo

### ESM 实时绑定

```js
// state.js
export let value = 1
export const setValue = (next) => {
  value = next
}

// page.js
import { value, setValue } from './state.js'

setValue(2)
console.log(value) // 2
```

### CommonJS 导出对象

```js
// user.cjs
exports.name = 'Ada'
exports.rename = (name) => {
  exports.name = name
}
```

## 参考来源

- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN: import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN: export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
- [Node.js: Modules CommonJS](https://nodejs.org/api/modules.html)
- [Node.js: ECMAScript modules](https://nodejs.org/api/esm.html)
