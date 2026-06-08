# JavaScript 模块化

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 模块化

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 模块化

ES6模块的暴露和引入语法

暴露: 分别暴露, 对象暴露, 默认暴露

```javascript
// 分别暴露
export const a = 'a'
export const b = 'b'

//暴露对象
const c = 'c'
const d = 'd'
export {
	c,
  d as dd
}

//默认暴露
export default function foo() {}

```

引入: 通用引入; 解构赋值形式引入; 简便导入

```javascript
import * as m1from './m1'

//解构赋值形式引入
import {default as aaa} from 'xx.js'

//简便导入
import _ from 'lodash'
```

## Demo

待补充：对比命名导出、默认导出、命名空间导入和重命名导入。

## AMD、CMD 与 ESM

### 问题

AMD、CMD 和 ES Module 有什么区别？

### 结论

AMD、CMD 都是浏览器原生 ESM 普及前的模块化方案。现代项目优先使用 ES Module；AMD/CMD 作为历史知识了解即可。

| 方案 | 代表 | 特点 |
| --- | --- | --- |
| AMD | RequireJS | 依赖前置，异步加载，适合早期浏览器模块加载 |
| CMD | SeaJS | 依赖就近，强调按需执行风格 |
| CommonJS | Node.js | 同步 `require`，主要用于服务端和旧构建链 |
| ESM | 浏览器、Node.js、构建工具 | 标准语法，静态分析，支持 tree-shaking |

```js
// ESM
import { sum } from './math.js';

export function total(values) {
  return values.reduce((acc, value) => sum(acc, value), 0);
}
```

面试回答：

> AMD 和 CMD 是早期浏览器模块化方案，分别以 RequireJS 和 SeaJS 为代表。AMD 偏依赖前置，CMD 偏依赖就近。现在正式项目应优先使用 ES Module，因为它是语言标准，能静态分析，也更适合现代构建工具做 tree-shaking。
