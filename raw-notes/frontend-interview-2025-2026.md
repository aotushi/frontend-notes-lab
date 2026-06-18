# 2025-2026 前端面试题高质量清单

> 使用方式：面试题牵引，官方资料校准，最小 demo 验证。不要只背答案；每个主题至少能写一个 20-50 行 demo，并能说清取舍。

## 资料锚点

### 官方技术资料

- React 19：<https://react.dev/blog/2024/12/05/react-19>
- Next.js 15：<https://nextjs.org/blog/next-15>
- Next.js 15 Upgrade Guide：<https://nextjs.org/docs/app/guides/upgrading/version-15>
- TypeScript Handbook：<https://www.typescriptlang.org/docs/handbook/intro.html>
- TypeScript 5.9：<https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html>
- MDN JavaScript：<https://developer.mozilla.org/en-US/docs/Web/JavaScript>
- javascript.info：<https://javascript.info/>
- Web Vitals：<https://web.dev/articles/vitals>
- INP：<https://web.dev/articles/inp>

### 掘金近期题库/面经来源

> 用法：掘金内容用于观察 2025 前端面试热点，但不要直接背答案。每道题最终仍然要回到 MDN、React、Vue、Next、Nuxt、TypeScript、Node 官方文档校准。

- 2025 前端面试题 TS 实战篇：<https://juejin.cn/post/7533826195352829988>
- 2025 年 Web 前端开发面试攻略：<https://juejin.cn/post/7530923516384968739>
- Vue 常见面试题复盘：<https://juejin.cn/post/7503371655642759203>
- 前端面试第 76 期，含 Next/Nuxt、构建优化、性能题：<https://juejin.cn/post/7523268191479382062>
- 腾讯前端开发校招一面面试题：<https://juejin.cn/post/7463871170015019023>
- 2025 年杭州前端/Node/移动端面试总结：<https://juejin.cn/post/7483704056647991308>
- 项目场景题方向：截图、QPS、并发请求、耗时统计、大文件上传、移动端适配、换肤：<https://juejin.cn/post/7537728820959723556>
- Vue2/Vue3、React Hooks、虚拟 DOM、diff、Node、TypeScript 等综合八股趋势：<https://juejin.cn/post/7540473266679889929>
- 本地 `allDo/0 Fronted/README.md` 收录的旧掘金资料：
  - <https://juejin.cn/post/6844904103504527374>
  - <https://juejin.cn/post/6844904115428917255>
  - <https://juejin.cn/post/6850037268963721230#heading-8>

### 本地 allDo 旧题来源

> 用法：`allDo` 的内容偏旧，但适合补“语言层/浏览器层/框架基础层”的遗忘面。处理原则是：保留题目覆盖面，答案按 2025-2026 官方资料修正。

- 全量标题索引：[`allDo-fronted-heading-index.md`](./allDo-fronted-heading-index.md)
- `allDo/0 Fronted/note 笔记题目/01_HTML&CSS&JS&TS.md`
- `allDo/0 Fronted/note 笔记题目/02_浏览器&HTTP&Git.md`
- `allDo/0 Fronted/note 笔记题目/04_Vue&Nuxt.md`
- `allDo/0 Fronted/note 笔记题目/05_React&Nest.md`
- `allDo/0 Fronted/note 笔记题目/09_Nodejs.md`
- `allDo/0 Fronted/note 笔记题目/10_移动端.md`
- `allDo/0 Fronted/note 笔记题目/11_项目难点重点.md`
- `allDo/0 Fronted/note 笔记题目/12_前端工程化.md`
- `allDo/0 Fronted/note 笔记题目/13_前端项目优化.md`

### 招聘/JD 抽样来源

- 爱奇艺高级前端开发工程师 JD：<https://www.mianshima.com/job/37/7555040005862082825>
- 2026 校招前端 JD PDF：<https://career.cuhk.edu.cn/attachment/careercuhk/ueditor/file/20260515/2071_%E7%86%B5%E5%9F%BA%E5%BE%8B%E5%8A%A8%20-%202026%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98.pdf>
- 智联招聘 Vue3 + TS 全栈方向：<https://www.zhaopin.com/jobdetail/CCL1508593700J40843883301.htm>
- Bybit 前端开发 JD：<https://www.hackquest.io/en/jobs/357379>
- Didi 高级前端 JD：<https://jobs.spacetalent.org/companies/didi/jobs/59284125-j250922006>
- Next.js / React / TypeScript 业务系统 JD 示例：<https://www.tokyocn.com/jobs/366>

## 中国大陆前端招聘画像（2025-2026）

> 结论：国内前端岗位不是只考“框架 API”，而是把基础、框架、工程化、性能、Node/全栈、业务交付混在一起考。准备顺序应该是：JS/TS 基础 -> Vue/React 主框架 -> 工程化/性能/安全 -> SSR/Node -> 业务场景。

### 招聘信息抽样信号

| 来源 | 技术要求信号 | 对面试准备的影响 |
|---|---|---|
| 爱奇艺高级前端 JD | HTML/CSS/JS 基础、React/Vue/Svelte 原理、TS、Node.js、工程化、CI/CD、测试、构建优化 | 中高级会追问框架原理、TS 类型设计、Node 服务端能力和工程落地 |
| 2026 校招 PDF | Web/H5/小程序、Vue/React、性能分析、TypeScript、Node.js、CI/CD 加分 | 校招和初中级也会看基础、项目、性能意识和工程规范 |
| 远程/全栈岗位 | React/Next、Vue/Nuxt、Node.js、REST、鉴权、Docker、缓存、日志、监控 | 全栈化趋势明显，前端需要能讲接口、缓存、鉴权、部署和线上排障 |
| 支付/性能优化方向岗位 | 浏览器原理、性能优化、Node.js、工程化、AI 工具提效 | 性能、浏览器、主线程、监控和 AI 协作会变成加分项 |
| 25/26 届前端岗位 | Vue/React、组件开发、TS、移动端适配、调试技巧、GitHub/个人作品 | 低年限岗位也重视作品、组件能力和基础清晰度 |

### 技术栈权重

| 权重 | 技术 | 面试准备要求 |
|---|---|---|
| P0 | JavaScript / TypeScript | 必须能写 demo，不能只背结论 |
| P0 | Vue 3 / React | 至少一个框架深入，另一个能比较和完成常规业务 |
| P0 | HTML / CSS / 浏览器 | 布局、语义化、兼容、性能、安全都要会 |
| P0 | 工程化 | Vite/Webpack、包体积、CI、代码规范、构建排查 |
| P0 | 性能优化 | Core Web Vitals、首屏、交互、长任务、资源加载 |
| P1 | Nuxt / Next | SSR、路由、数据获取、缓存、部署、SEO |
| P1 | Node.js | BFF、接口、鉴权、日志、错误处理、并发和流 |
| P1 | 业务场景 | 后台管理、表格、表单、权限、上传、可视化、低代码 |

### 简历项目反推题

面试官通常不会孤立问八股，而是从项目追问：

1. 这个页面为什么用 Vue/React，而不是原生或另一个框架？
2. 你的项目里哪里体现了 TypeScript 的价值？
3. 你怎么做权限、路由、菜单、按钮级控制？
4. 你怎么证明性能优化有效？看什么指标？
5. 你用 AI 写代码，怎么保证你理解了结果？
6. 项目上线后怎么定位白屏、接口慢、内存泄漏、样式错乱？
7. 如果让你把这个项目 SSR 化，你会怎么拆？
8. 前端和后端接口约定怎么管理？

## 训练策略

每天不要随机刷题，按这个流程：

1. 选一个主题。
2. 先做 3-5 道高频题，暴露不会的地方。
3. 查官方资料校准概念。
4. 写最小 demo。
5. 用 2 分钟面试表达复述。

每周至少做一次“项目追问模拟”：从自己的求职项目里选一个功能，让面试官连续追问 5 层。

## 评分规则

| 等级 | 标准 |
|---|---|
| A | 能解释概念、写 demo、说明项目取舍、回答追问 |
| B | 能解释主要概念，但 demo 或边界不稳 |
| C | 只会背结论，遇到代码题容易断 |
| D | 概念混乱，不能落到代码 |

## 每日学习模板

```md
## YYYY-MM-DD

### 今日主题

### 高频面试题

1.
2.
3.

### 官方资料校准

- MDN / javascript.info / React / Next / TS:

### 最小 demo

### 我的答案

### 易错点

### 明日复习
```

## P0：JavaScript 核心

### 1. 事件循环、宏任务、微任务

**面试题**

1. 浏览器事件循环里宏任务和微任务的执行顺序是什么？
2. `Promise.then`、`queueMicrotask`、`setTimeout`、`requestAnimationFrame` 谁先执行？
3. 为什么长任务会影响页面响应？它和 INP 有什么关系？
4. async/await 在事件循环里如何调度？
5. 如何拆分一个会阻塞 UI 的长任务？

**答题要点**

- 一轮宏任务执行完后，会清空微任务队列，再进入渲染机会。
- `await` 后面的代码可以理解为进入 Promise continuation。
- 长任务会占用主线程，导致输入事件无法及时处理。
- 优化方向：分片、懒执行、Web Worker、减少同步计算、避免渲染前密集任务。

**demo**

- 写一段 `console.log` 顺序题。
- 写一个长循环，然后用分片 `setTimeout` 或 `scheduler` 思路改造。

### 2. Promise / async / await

**面试题**

1. `async function` 返回什么？
2. `await` 后面跟普通值会发生什么？
3. `try/catch` 能捕获哪些异步错误？哪些捕不到？
4. 顺序 `await` 和 `Promise.all` 的取舍是什么？
5. `Promise.all`、`Promise.allSettled`、`Promise.race`、`Promise.any` 分别适合什么场景？
6. 如何实现并发限制，比如最多同时请求 3 个接口？

**答题要点**

- `async` 函数总是返回 Promise。
- `await` 会把非 Promise 值包装成已 resolved 的 Promise 语义。
- 忘记 `await` 时，`try/catch` 可能捕不到异步 reject。
- 顺序 await 保证依赖顺序；`Promise.all` 提升并发但会快速失败。

**demo**

- 顺序 await vs `Promise.all`。
- `try/catch` 捕获 reject。
- 简单 `limitConcurrency(tasks, limit)`。

### 3. 闭包、作用域、内存

**面试题**

1. 什么是闭包？它解决什么问题？
2. 闭包为什么可能导致内存不能释放？
3. `var`、`let`、`const` 在作用域和提升上有什么差异？
4. 循环里绑定事件为什么容易出现闭包问题？
5. React Hooks 里的 stale closure 是什么？

**答题要点**

- 闭包是函数保留对外层词法环境的引用。
- stale closure 的关键不是闭包错了，而是函数捕获了旧 render 的值。
- 解决 stale closure：依赖数组、函数式更新、`useRef`、事件回调模式。

**demo**

- `for var` 和 `for let` 输出差异。
- `setInterval` 读取旧 state 的 React 例子。

### 4. this、原型、class

**面试题**

1. `this` 的绑定规则有哪些？
2. 箭头函数的 `this` 和普通函数有什么区别？
3. `call`、`apply`、`bind` 区别是什么？
4. 原型链如何查找属性？
5. class 只是语法糖吗？它和原型有什么关系？

**答题要点**

- `this` 取决于调用方式，不取决于定义位置；箭头函数例外，它捕获外层 `this`。
- class 基于原型机制，但有更严格语义，如 class 必须 new、方法不可枚举等。

**demo**

- 手写 `myBind`。
- 画出 `instance -> Constructor.prototype -> Object.prototype`。

### 5. 模块系统、ESM、CJS

**面试题**

1. ESM 和 CommonJS 的核心区别是什么？
2. ESM 为什么更利于 tree-shaking？
3. `import` 是值拷贝还是 live binding？
4. 循环依赖会发生什么？
5. Node ESM、浏览器 ESM、打包器 ESM 有哪些差异？

**答题要点**

- ESM 是静态结构，CJS 是运行时加载。
- ESM 导入是 live binding。
- 循环依赖不是绝对错误，但初始化时序可能导致 undefined 或 TDZ 问题。

**demo**

- ESM live binding demo。
- CJS 循环依赖 demo。

## P0：TypeScript

### 6. type / interface / 类型组合

**面试题**

1. `type` 和 `interface` 有什么区别？
2. 什么时候用 interface，什么时候用 type？
3. 交叉类型和接口继承有什么不同？
4. `Record<K, V>`、`Pick`、`Omit`、`Partial` 常见场景是什么？
5. 为什么不要滥用 `any`？`unknown` 好在哪里？

**答题要点**

- interface 更适合对象结构和扩展；type 更适合联合、交叉、工具类型、函数签名组合。
- `unknown` 要先收窄才能使用，比 `any` 更安全。

**demo**

- API response 类型建模。
- `unknown` 解析 JSON 并做类型保护。

### 7. 联合类型、类型收窄、never

**面试题**

1. TypeScript 如何做类型收窄？
2. `typeof`、`in`、`instanceof`、判别联合分别适合什么？
3. 什么是 discriminated union？
4. `never` 在穷尽检查中怎么用？
5. 为什么有时 TS 无法按你预期收窄？

**答题要点**

- 判别联合是业务状态建模的核心手段。
- `never` 可以让新增状态时编译器报错。
- TS 是静态分析，不会理解所有运行时约束。

**demo**

- `type Result = { ok: true; data: T } | { ok: false; error: string }`。
- switch + `assertNever`。

### 8. 泛型

**面试题**

1. 泛型解决什么问题？
2. 泛型约束 `extends` 是什么？
3. `keyof` 和索引访问类型怎么用？
4. 如何写一个类型安全的 `get(obj, key)`？
5. 泛型和联合类型如何取舍？

**答题要点**

- 泛型用于保留输入和输出之间的类型关系。
- 泛型不是“任何类型”，而是调用时确定的类型参数。
- 约束用于限定能力，如 `T extends object`、`K extends keyof T`。

**demo**

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 9. TS 工程化

**面试题**

1. `tsconfig` 里 `strict` 为什么重要？
2. `module`、`target`、`moduleResolution` 分别影响什么？
3. 前端项目如何做类型检查和构建分离？
4. `skipLibCheck` 有什么风险？
5. 类型错误应该阻断 CI 吗？

**答题要点**

- 类型检查和打包是两个阶段，Vite/esbuild 很快但不等于完整 typecheck。
- CI 应至少运行 `tsc --noEmit`。

## P0：React 18/19

### 10. React 渲染模型

**面试题**

1. React render 和 commit 阶段分别做什么？
2. 为什么 render 必须保持纯净？
3. state 更新为什么可能是批量的？
4. key 为什么不能随便用 index？
5. 组件重新渲染不等于 DOM 重新创建，怎么解释？

**答题要点**

- render 计算 UI 描述，commit 修改宿主环境。
- key 决定同级节点身份，影响状态保留。
- 不要在 render 阶段做副作用。

### 11. Hooks

**面试题**

1. 为什么 Hooks 不能写在条件语句里？
2. `useEffect` 和 `useLayoutEffect` 区别是什么？
3. 依赖数组怎么判断？
4. `useMemo`、`useCallback` 是否一定优化性能？
5. `useRef` 和 state 的区别是什么？

**答题要点**

- Hooks 依赖稳定调用顺序。
- effect 是同步外部系统，不是“监听 state 的工具”。
- memo 类 API 有成本，不应盲目加。

### 12. React 19 新重点

**面试题**

1. React 19 Actions 解决了什么问题？
2. `useActionState`、`useFormStatus`、`useOptimistic` 分别适合什么场景？
3. React 19 的 `use` API 能做什么？限制是什么？
4. React 19 对 metadata、stylesheet、script 有什么改进？
5. React Compiler 的目标是什么？为什么不能把它理解成万能性能优化？

**答题要点**

- Actions 将异步提交、pending、错误、乐观更新等流程整合到 React 数据流中。
- `useOptimistic` 适合 mutation 期间先展示预期结果。
- `use` 可以在 render 中读取 Promise 或 context，但需要理解 Suspense。
- Compiler 减少手写 memo，但代码仍要遵守 React 规则。

**demo**

- form action + pending 状态。
- optimistic update 列表。

### 13. 状态管理

**面试题**

1. state 应该放本地、Context、URL、服务端缓存还是全局 store？
2. Context 为什么可能导致性能问题？
3. Redux/Zustand/Jotai/React Query 各自适合什么？
4. 服务端状态和客户端状态有什么区别？
5. 表单状态为什么不一定适合放全局 store？

**答题要点**

- 状态管理不是选库题，而是状态归属题。
- 服务端状态重点是缓存、同步、失效、重试；客户端状态重点是 UI 交互。

## P0：Vue 3 / Nuxt

### 14. Vue 3 响应式原理

**面试题**

1. Vue 2 和 Vue 3 响应式实现有什么区别？
2. `reactive` 和 `ref` 怎么选？
3. `shallowRef`、`shallowReactive` 适合什么场景？
4. `toRef`、`toRefs`、`toValue` 解决什么问题？
5. 为什么解构 reactive 对象可能丢失响应式？
6. Vue 的 effect / dependency tracking 大致怎么工作？
7. computed 和 watch 的区别是什么？
8. watch、watchEffect、watchPostEffect 如何取舍？

**答题要点**

- Vue 3 基于 Proxy，能更自然地拦截对象属性访问和修改。
- `ref` 更适合基本类型和单值；`reactive` 更适合对象结构。
- 解构会丢失 getter/setter 访问路径，需要 `toRef` / `toRefs` 保持引用。
- computed 是派生值，watch 是副作用。

**demo**

- `reactive` 解构丢失响应式 demo。
- `watch` vs `watchEffect` 调用时机 demo。

### 15. Vue 组件通信和组合式 API

**面试题**

1. 父子组件通信有哪些方式？
2. `defineProps`、`defineEmits`、`defineModel` 分别解决什么问题？
3. provide/inject 适合什么场景？有什么风险？
4. 什么时候应该抽 composable？
5. composable 如何处理异步、清理、副作用？
6. `<script setup>` 相比 Options API 有什么优势和限制？
7. Vue 插槽有哪些类型？作用域插槽解决什么问题？
8. 如何设计一个可复用 Form/Table 组件？

**答题要点**

- 组件通信要先判断关系：父子、跨层、全局、URL、服务端状态。
- composable 应该封装可复用状态逻辑，不只是把代码挪走。
- provide/inject 适合局部上下文，不适合滥用成隐式全局状态。

### 16. Vue 性能优化

**面试题**

1. Vue 列表渲染为什么必须稳定 key？
2. `v-if` 和 `v-show` 如何取舍？
3. 大表格/长列表在 Vue 中怎么优化？
4. `computed` 缓存什么时候反而没帮助？
5. 如何避免响应式对象过大导致性能问题？
6. `defineAsyncComponent` 和路由懒加载怎么用？
7. keep-alive 适合什么场景？如何控制缓存？
8. 如何定位 Vue 组件重复渲染？

**答题要点**

- key 影响 vnode diff 和组件状态复用。
- 大列表优先虚拟滚动、分页、减少深层响应式、避免每行复杂组件。
- 对大型不可变数据可用 shallow API 或 markRaw。

### 17. Pinia / Vue Router

**面试题**

1. Pinia 相比 Vuex 的变化是什么？
2. store 里应该放哪些状态？哪些不该放？
3. Pinia action 如何处理异步和错误？
4. Vue Router 的导航守卫执行顺序是什么？
5. 动态路由和权限菜单如何设计？
6. 路由 meta 通常放什么？
7. 如何处理登录态过期后的路由跳转？
8. 后台管理系统的菜单、路由、权限如何保持一致？

**答题要点**

- store 不应该放所有状态；表单局部状态和一次性 UI 状态通常留在组件。
- 权限系统要分路由级、菜单级、按钮级、数据级。

### 18. Nuxt 3

**面试题**

1. Nuxt 3 的 SSR、SSG、ISR/预渲染分别适合什么？
2. `useAsyncData` 和 `useFetch` 区别是什么？
3. Nuxt 中 server routes 能做什么？
4. hydration mismatch 常见原因有哪些？
5. Nuxt SEO 怎么做：title、meta、OG、结构化数据？
6. Nitro 是什么？部署到不同平台有什么差异？
7. 客户端插件和服务端插件如何区分？
8. Nuxt 项目如何处理鉴权和 cookie？

**答题要点**

- Nuxt 面试重点不是 API 背诵，而是 SSR 数据流、SEO、缓存、部署、鉴权。
- hydration mismatch 常由时间、随机值、浏览器 API、服务端客户端条件不一致引起。

## P0：Next.js / SSR / RSC

### 19. SSR、SSG、ISR、CSR

**面试题**

1. SSR、SSG、ISR、CSR 的区别是什么？
2. SEO 页面为什么通常不只靠 CSR？
3. 哪些页面适合静态生成，哪些适合动态渲染？
4. Hydration 是什么？为什么会 hydration mismatch？
5. Streaming SSR 解决什么问题？

**答题要点**

- 渲染策略取决于数据实时性、SEO、交互复杂度、成本。
- hydration mismatch 常见原因：时间、随机数、浏览器专属 API、服务端和客户端条件分支不一致。

### 20. App Router / RSC

**面试题**

1. Server Component 和 Client Component 的边界是什么？
2. `"use client"` 的含义是什么？
3. Server Component 能不能使用 state/effect？
4. 为什么不要把所有组件都写成 Client Component？
5. 数据获取应该放在哪里？

**答题要点**

- Server Component 默认在服务端运行，减少客户端 JS。
- Client Component 用于交互、浏览器 API、state/effect。
- 边界越靠下，客户端包越小。

### 21. Next.js 15 变化

**面试题**

1. Next.js 15 中 `fetch` 默认缓存行为有什么变化？
2. `GET` Route Handler 默认是否缓存？
3. `cookies`、`headers`、`params`、`searchParams` 为什么变成异步 API？
4. Client Router Cache 的默认变化会影响什么？
5. 从 Next 14 升到 15，最容易踩哪些坑？

**答题要点**

- Next.js 15 默认更偏向不缓存，显式 opt-in 缓存。
- Request-time APIs 异步化会影响 layout/page/route 的写法。
- 升级重点：缓存、异步 API、React 19、运行时配置、依赖兼容。

**demo**

- `fetch(..., { cache: 'force-cache' })` vs 默认请求。
- async `params` page demo。

## P0：浏览器、网络、安全

### 22. HTTP / 缓存

**面试题**

1. 强缓存和协商缓存区别是什么？
2. `Cache-Control` 常见字段有哪些？
3. ETag 和 Last-Modified 的区别是什么？
4. CDN 缓存和浏览器缓存分别解决什么问题？
5. 前端如何设计静态资源缓存策略？

**答题要点**

- hash 静态资源可以长缓存，HTML 通常短缓存或 no-cache。
- CDN 关注边缘节点复用，浏览器缓存关注用户本地复用。

### 23. CORS / Cookie / Token

**面试题**

1. CORS 是浏览器限制还是服务端限制？
2. 简单请求和预检请求有什么区别？
3. Cookie 的 `SameSite`、`HttpOnly`、`Secure` 分别做什么？
4. Cookie 鉴权和 token 鉴权如何取舍？
5. 如何防 CSRF？如何防 XSS？

**答题要点**

- CORS 是浏览器安全模型，服务端通过响应头授权。
- XSS 防注入，CSRF 防跨站请求借身份。
- HttpOnly 不能防 CSRF，但能降低 token 被 JS 读取的风险。

### 24. Web 安全

**面试题**

1. XSS 有哪些类型？React 是否天然防 XSS？
2. `dangerouslySetInnerHTML` 有什么风险？
3. CSP 能解决什么问题？
4. 点击劫持如何防？
5. 前端如何处理第三方脚本风险？

**答题要点**

- React 默认转义文本，但不能保护所有场景，如 HTML 注入、URL 协议、第三方脚本。
- CSP 是重要的纵深防御。

## P0：性能优化

### 25. Core Web Vitals

**面试题**

1. LCP、INP、CLS 分别衡量什么？
2. 为什么 INP 替代 FID 后更关注完整交互响应？
3. 如何定位 LCP 慢？
4. 如何优化 INP？
5. 实验室数据和真实用户数据冲突时听谁的？

**答题要点**

- LCP 关注最大内容渲染，INP 关注交互响应，CLS 关注布局稳定。
- INP 优化通常涉及减少主线程阻塞、拆分长任务、减少事件处理复杂度、优化渲染更新。
- 真实用户数据更能代表业务体验，实验室数据适合复现和调试。

**demo**

- 用 Performance panel 找长任务。
- 写一个输入卡顿 demo，再用防抖/分片/延迟计算优化。

### 26. 资源与包体积

**面试题**

1. 首屏性能怎么优化？
2. code splitting 的边界怎么划？
3. Tree-shaking 为什么有时不生效？
4. 图片优化有哪些层次？
5. 第三方脚本为什么危险？

**答题要点**

- 优先级：关键路径、首屏资源、JS 执行成本、图片、字体、第三方。
- Tree-shaking 依赖 ESM、sideEffects 标记、打包器分析。

## P1：CSS / UI

### 27. HTML 语义化和可访问性

**面试题**

1. 语义化 HTML 的价值是什么？
2. `button` 和 `div role="button"` 有什么区别？
3. 表单 label 为什么重要？
4. alt、aria-label、aria-hidden 分别适合什么？
5. SEO 和可访问性在 HTML 层有哪些交集？
6. 如何做键盘可访问的弹窗？
7. 图片懒加载和响应式图片怎么写？
8. script 的 async/defer/module 有什么区别？

**答题要点**

- 语义化影响可访问性、SEO、默认交互和可维护性。
- 不要把所有东西都 div 化；能用原生控件就优先用。

### 28. 布局

**面试题**

1. Flex 和 Grid 如何取舍？
2. BFC 是什么？解决什么问题？
3. sticky 定位为什么不生效？
4. 响应式布局有哪些策略？
5. 如何避免文本溢出、布局抖动？

**答题要点**

- Flex 适合一维布局，Grid 适合二维布局。
- 响应式不只是媒体查询，还包括流式布局、容器查询、资源适配。

### 29. CSS 细节和动画

**面试题**

1. 盒模型有哪些模式？
2. margin collapse 是什么？
3. position: sticky 为什么失效？
4. z-index 为什么不生效？什么是 stacking context？
5. rem、em、vw、vh、dvh 如何取舍？
6. CSS 动画如何避免卡顿？
7. 如何处理移动端 1px、适配、安全区域？
8. 容器查询解决了什么问题？

**答题要点**

- sticky 受滚动容器、overflow、top 等影响。
- 动画优先使用 transform/opacity，减少 layout/paint。

### 30. CSS 工程化

**面试题**

1. CSS Modules、CSS-in-JS、Tailwind 各有什么取舍？
2. 设计系统里 token 的作用是什么？
3. 如何组织主题、暗色模式、响应式变量？
4. 样式隔离有哪些方案？
5. 如何避免样式优先级失控？

## P1：工程化、测试、质量

### 31. Vite / 打包器 / 构建

**面试题**

1. Vite 为什么开发环境快？
2. esbuild、Rollup、Webpack、Turbopack 各自定位是什么？
3. sourcemap 在生产环境怎么处理？
4. 环境变量如何安全使用？
5. monorepo 里前端包如何管理依赖和构建？

### 32. 前端 CI/CD 和发布

**面试题**

1. 前端 CI 通常跑哪些检查？
2. 如何设计测试、lint、typecheck、build 的流水线？
3. 灰度发布和回滚怎么做？
4. 静态资源上 CDN 后如何处理缓存？
5. 如何定位线上 sourcemap、白屏、接口错误？
6. 环境变量如何区分构建时和运行时？
7. monorepo 如何只构建受影响包？
8. 依赖升级如何控制风险？

**答题要点**

- CI 至少包含 lint、typecheck、test、build。
- 发布要考虑版本、缓存、回滚、监控和 sourcemap 安全。

### 33. 测试

**面试题**

1. 单元测试、组件测试、E2E 测试分别覆盖什么？
2. React 组件测试应该测实现细节还是用户行为？
3. mock API 有哪些方式？
4. Playwright 和 Cypress 如何取舍？
5. 什么样的前端逻辑必须测？

**答题要点**

- 测试金字塔不是固定比例，而是按风险投入。
- UI 测试优先覆盖用户行为、关键路径、边界状态。

### 34. 可维护性

**面试题**

1. 你如何拆分前端模块？
2. 什么是组件边界？
3. hooks / composables 什么时候值得抽？
4. 如何处理重复代码？
5. 如何做一次低风险重构？

## P1：业务场景题

### 35. 表格、表单、后台管理

**面试题**

1. 大表格如何做性能优化？
2. 表单校验应该放前端、后端还是两边？
3. 权限菜单和按钮权限如何设计？
4. 后台管理系统的路由和菜单如何关联？
5. 如何设计一个可复用的列表页？

**答题要点**

- 大表格：虚拟滚动、分页、列裁剪、避免全量响应式、服务端排序筛选。
- 权限：路由级、菜单级、按钮级、数据级分层。

### 36. 文件上传、下载、导入导出

**面试题**

1. 大文件上传如何设计？
2. 断点续传需要哪些信息？
3. 文件下载如何处理鉴权和进度？
4. Excel 导入如何做错误反馈？
5. 前端如何处理二进制数据？

### 37. Node.js / BFF / 全栈前端

**面试题**

1. Node.js 事件循环和浏览器事件循环有什么区别？
2. Node.js 适合 CPU 密集型任务吗？
3. BFF 层解决什么问题？
4. REST 和 RPC/GraphQL 如何取舍？
5. Node 接口如何做错误处理中间件？
6. 如何设计鉴权：session、JWT、cookie？
7. 如何处理接口超时、重试、熔断？
8. Node 如何做日志、traceId、监控？
9. Stream 适合什么场景？
10. SSR 项目里的 Node 层要注意哪些安全问题？

**答题要点**

- Node 适合 I/O 密集型，不适合直接在主线程做大量 CPU 计算。
- BFF 价值：聚合接口、适配前端页面、隐藏后端复杂度、处理鉴权和缓存。
- 中高级前端要能讲清接口边界、错误码、日志、超时和降级。

**demo**

- Express/Koa/Fastify 风格错误处理中间件。
- fetch 上游接口超时控制。

### 38. 小程序 / H5 / 移动端

**面试题**

1. H5 移动端适配有哪些方案？
2. iOS Safari 常见兼容问题有哪些？
3. 小程序和 Web 的运行环境有什么差异？
4. H5 如何和 Native 通信？
5. 页面白屏如何排查？
6. 如何处理弱网、离线、重复提交？
7. 移动端点击延迟、滚动穿透怎么处理？
8. 如何做埋点和曝光统计？

### 39. 可视化 / 大屏

**面试题**

1. Canvas、SVG、WebGL 如何取舍？
2. ECharts 性能问题怎么优化？
3. 大屏自适应怎么做？
4. 高频数据刷新如何避免卡顿？
5. 可视化图表如何做按需加载？
6. 图表主题和设计系统如何结合？

### 40. AI 时代前端

**面试题**

1. 你如何使用 AI 辅助前端开发？
2. AI 生成代码如何验收？
3. 如何避免 AI 生成的安全漏洞？
4. 如何把 LLM 功能接入前端产品？
5. 流式输出如何实现？
6. SSE 和 WebSocket 如何取舍？
7. Prompt、结构化输出、错误兜底如何设计？
8. AI 功能如何做可观测性和成本控制？

**答题要点**

- AI 协作不是“让 AI 写完”，而是需求拆解、代码生成、人工审查、测试验证、风险控制。
- LLM 前端重点：流式交互、加载状态、错误重试、敏感信息、成本和延迟。

## allDo 旧题补强清单

> 这一节解决“语言层和基础层忘光”的问题。它不是替代前面的 P0/P1，而是补足面试官可能随手追问的基础面。旧题不追求全部背完，先做到：看到题能说出主线，能写最小 demo，能指出 1 个边界。

### HTML

1. `<!doctype html>` 的作用是什么？不写会进入什么模式？
2. 标准模式和怪异模式的差异在哪里？会影响哪些 CSS 计算？
3. 语义化标签的价值是什么？除了 SEO，还有哪些可访问性收益？
4. `header`、`nav`、`main`、`article`、`section`、`aside`、`footer` 怎么区分？
5. 行内元素、块级元素、行内块元素的布局差异是什么？
6. 如何把行内元素转成块级或行内块？分别会影响哪些盒模型属性？
7. `script` 放在 `head` 和 `body` 尾部有什么差异？
8. `async` 和 `defer` 的加载、执行顺序有什么不同？
9. 为什么 CSS 通常放在 `head`，JS 通常放在底部或使用 `defer`？
10. `link` 标签可以做哪些资源声明？`preload`、`prefetch`、`stylesheet` 怎么区分？
11. `href` 和 `src` 的语义差异是什么？
12. `img srcset/sizes` 如何做响应式图片？
13. `meta viewport` 解决的是什么问题？
14. 表单元素有哪些原生校验能力？什么时候仍然需要 JS 校验？
15. `label` 和表单控件关联有什么价值？
16. `button` 默认类型是什么？为什么表单内按钮要显式写 `type`？
17. `data-*` 属性适合存什么？不适合存什么？
18. Data URL 的优缺点是什么？为什么不能滥用？
19. iframe 有哪些安全问题？`sandbox` 能限制什么？
20. HTML 可访问性中 `alt`、`aria-*`、键盘可达性分别解决什么？

### CSS

1. CSS Reset 和 Normalize 的区别是什么？
2. 标准盒模型和 IE 盒模型的宽高计算差异是什么？
3. `box-sizing: border-box` 为什么常用于全局样式？
4. `min-width`、`width`、`max-width` 同时出现时如何约束？
5. 百分比高度为什么经常不生效？
6. CSS 引入方式有哪些？`link` 和 `@import` 有什么差异？
7. 选择器优先级如何计算？`!important` 为什么要少用？
8. CSS 选择器从右往左匹配意味着什么？
9. BFC 是什么？能解决哪些问题？
10. margin collapse 什么时候发生？怎么避免？
11. 浮动为什么会导致父元素高度塌陷？如何清除浮动？
12. `display: none`、`visibility: hidden`、`opacity: 0` 的布局、事件、可访问性差异是什么？
13. `position` 五种值分别如何定位？
14. stacking context 怎么产生？为什么 `z-index` 有时不生效？
15. Flex 主轴/交叉轴如何理解？
16. `flex: 1` 展开后是什么？`flex-basis` 如何影响布局？
17. Grid 适合什么布局？和 Flex 的分工是什么？
18. 单行/多行文本省略分别怎么写？
19. 图片底部空隙从哪里来？怎么处理？
20. 移动端 1px 边框有哪些处理方式？
21. `px`、`em`、`rem`、`vw`、`vh`、`vmin`、`vmax` 的适用场景是什么？
22. 响应式布局如何选择媒体查询、弹性布局、容器查询？
23. CSS 动画为什么优先使用 `transform` 和 `opacity`？
24. 如何实现主题切换？CSS 变量、class、data attribute 怎么选？
25. Tailwind、CSS Modules、CSS-in-JS、Sass 的取舍是什么？

### JavaScript 语言层

1. JS 的数据类型有哪些？`null` 和 `undefined` 怎么区分？
2. `typeof null` 为什么是 `object`？面试回答应该怎么说？
3. `==` 和 `===` 的差异是什么？什么时候允许用 `== null`？
4. 隐式类型转换常见坑有哪些？
5. `Number.MAX_SAFE_INTEGER` 是什么？超过后怎么处理？
6. `BigInt` 能解决什么问题？和 `Number` 能混算吗？
7. 原型链是什么？属性查找顺序是什么？
8. `new` 操作符做了哪几步？
9. 手写 `instanceof` 的核心逻辑是什么？
10. `this` 的绑定规则有哪些？箭头函数为什么没有自己的 `this`？
11. 手写 `call`、`apply`、`bind` 的边界有哪些？
12. 闭包是什么？闭包为什么可能造成内存占用？
13. 循环中闭包捕获变量的经典问题如何解释？
14. 作用域链和执行上下文怎么理解？
15. 事件循环中宏任务和微任务如何排序？
16. Promise 状态流转规则是什么？
17. `async/await` 本质上如何衔接 Promise？
18. `Promise.all`、`allSettled`、`race`、`any` 如何选择？
19. 如何实现并发数量限制？
20. 如何实现请求取消？`AbortController` 怎么用？
21. 防抖和节流的区别是什么？各自适合什么场景？
22. 深拷贝为什么难？函数、Date、RegExp、Map、Set、循环引用怎么处理？
23. 浅拷贝有哪些方法？扩展运算符和 `Object.assign` 有什么差异？
24. 数组去重有哪些方法？对象数组按 key 去重怎么写？
25. `map`、`forEach`、`reduce`、`filter` 的语义差异是什么？
26. 可迭代对象和迭代器是什么？`for...of` 依赖什么协议？
27. Generator 的执行模型是什么？现在主要在哪些场景还能见到？
28. ESM 和 CommonJS 的差异是什么？静态分析、live binding、循环依赖如何回答？
29. 模块循环依赖如何排查？
30. 内存泄漏在前端有哪些常见来源？

### TypeScript

1. TypeScript 和 JavaScript 的关系是什么？运行时有没有类型？
2. `type` 和 `interface` 如何选择？
3. `any`、`unknown`、`never`、`void` 分别适合什么场景？
4. 类型断言和非空断言有什么风险？
5. 联合类型和交叉类型怎么区分？
6. 类型收窄有哪些方式？`in`、`typeof`、`instanceof`、自定义谓词怎么用？
7. 泛型解决什么问题？泛型约束怎么写？
8. `keyof`、`typeof`、索引访问类型怎么组合？
9. `Partial`、`Required`、`Pick`、`Omit`、`Record` 的实现思路是什么？
10. 如何给 React 组件 props、children、ref 写类型？
11. 如何给 Vue `defineProps`、`defineEmits`、`ref`、`reactive` 写类型？
12. 如何给接口返回值设计类型？为什么推荐 `Result<T>`？
13. `as const` 有什么作用？
14. 枚举、字面量联合、常量对象怎么选？
15. 类型体操在业务中应该控制到什么程度？

### DOM / BOM

1. DOM 事件流是什么？捕获、目标、冒泡如何触发？
2. `event.target` 和 `event.currentTarget` 有什么区别？
3. 事件委托为什么能提升性能？有什么边界？
4. 如何阻止默认行为和阻止冒泡？
5. 被动事件监听 `passive` 解决什么问题？
6. `addEventListener` 第三个参数可以传什么？
7. 如何安全移除事件监听？
8. DOM 查询和更新有哪些性能注意点？
9. `DocumentFragment` 适合什么场景？
10. `MutationObserver`、`ResizeObserver`、`IntersectionObserver` 分别解决什么问题？
11. `localStorage`、`sessionStorage`、Cookie、IndexedDB 如何选择？
12. Cookie 的 `HttpOnly`、`Secure`、`SameSite` 有什么作用？
13. `history.pushState` 和 hash 路由有什么差异？
14. `location`、`navigator`、`screen` 常见用途是什么？
15. 如何监听页面可见性变化？

### 浏览器 / HTTP / 安全

1. 地址栏输入 URL 后发生了什么？
2. DNS、TCP、TLS、HTTP 请求、解析 HTML、构建 CSSOM、渲染树、布局、绘制如何串起来？
3. 浏览器渲染页面的主流程是什么？
4. 回流和重绘的区别是什么？哪些操作会触发回流？
5. GET 和 POST 的差异应该如何回答，避免只说“一个有 body 一个没有”？
6. POST 为什么可能先发 OPTIONS？
7. 简单请求和非简单请求如何区分？
8. `Accept` 和 `Content-Type` 的区别是什么？
9. `application/json`、`x-www-form-urlencoded`、`multipart/form-data` 怎么选？
10. 常见 HTTP 状态码如何按类别记忆？
11. 301、302、307、308 有什么区别？
12. HTTP/1.1、HTTP/2、HTTP/3 的核心差异是什么？
13. HTTPS 解决了什么问题？TLS 握手大致过程是什么？
14. HTTP 是无状态的，Cookie/Session/JWT 分别如何补状态？
15. 强缓存和协商缓存如何工作？
16. `Cache-Control`、`ETag`、`Last-Modified` 的优先级和适用场景是什么？
17. CORS 的本质是什么？服务端要配哪些头？
18. JSONP 为什么能跨域？为什么现在不推荐？
19. XSS 有哪些类型？如何防护？
20. CSRF 的攻击条件是什么？如何防护？
21. 点击劫持是什么？`X-Frame-Options` 和 CSP 如何防？
22. CSP 能防什么？如何逐步上线？
23. SRI 是什么？适合哪些第三方资源？
24. 前端如何做接口超时、重试、取消、幂等保护？
25. 如何设计全站请求耗时统计？

### Vue / Nuxt

1. Vue2 和 Vue3 响应式原理差异是什么？
2. `Object.defineProperty` 为什么难以完整监听数组和对象新增属性？
3. `Proxy` 带来了哪些能力？有什么兼容性代价？
4. `ref` 和 `reactive` 怎么选？
5. `computed`、`watch`、`watchEffect` 的差异是什么？
6. `nextTick` 解决什么问题？
7. Vue 的异步更新队列如何理解？
8. 虚拟 DOM 的价值是什么？不是越快越好，怎么回答？
9. Vue diff 中 key 的作用是什么？为什么不推荐用 index？
10. `v-if` 和 `v-for` 同时使用为什么不推荐？
11. 组件 `data` 为什么必须是函数？
12. 父子组件生命周期顺序如何？
13. 组件通信方式有哪些？props/emits、provide/inject、Pinia、事件总线怎么选？
14. `v-model` 在组件上如何实现？
15. 插槽和作用域插槽解决什么问题？
16. `attrs` 透传适合什么组件封装？
17. `keep-alive` 的生命周期和缓存策略是什么？
18. `scoped` CSS 的原理是什么？深度选择器怎么用？
19. 自定义指令适合什么场景？
20. Vue Router hash/history 有什么差异？
21. 路由守卫的执行顺序是什么？
22. 动态路由参数变化时组件为什么可能不重新创建？
23. Pinia 和 Vuex 的差异是什么？
24. Nuxt 的 SSR、SSG、ISR/预渲染分别适合什么业务？
25. `useAsyncData` 和 `useFetch` 如何选择？
26. Nuxt SEO 要配置哪些内容：title、meta、OG、canonical、sitemap、robots、结构化数据？
27. Nuxt hydration mismatch 如何定位？
28. Vue 项目首屏慢如何排查？
29. Vue 表格、表单、权限、缓存页面如何做架构设计？
30. Vue3 + TS 组件库如何设计 props、emits、slot 类型？

### React / Next

1. JSX 是什么？为什么它不是字符串模板？
2. React 的声明式 UI 思想如何解释？
3. render 阶段和 commit 阶段分别做什么？
4. React 18 自动批处理改变了什么？
5. Hooks 规则是什么？为什么不能在条件语句里调用？
6. `useEffect`、`useLayoutEffect`、`useInsertionEffect` 如何区分？
7. 依赖数组为什么容易出错？
8. stale closure 是什么？如何修复？
9. `useMemo` 和 `useCallback` 什么时候有效，什么时候是噪音？
10. `React.memo` 为什么不能解决所有渲染问题？
11. Context 为什么可能导致大面积重渲染？
12. 状态应该放本地、URL、Context、store、server cache 的哪一层？
13. key 的作用是什么？错误 key 会造成什么问题？
14. 受控组件和非受控组件如何选择？
15. Error Boundary 能捕获什么，不能捕获什么？
16. Suspense 解决什么问题？
17. React 19 Actions、`useActionState`、`useOptimistic` 的面试价值是什么？
18. Server Component 和 Client Component 的边界是什么？
19. Next App Router 的路由、layout、template、loading、error 如何协作？
20. Next 15 中 async request APIs 对旧代码有什么影响？
21. SSR、SSG、ISR、CSR 如何选择？
22. Hydration mismatch 的常见来源有哪些？
23. Next route handler 和 API routes/BFF 的关系是什么？
24. middleware 适合做什么，不适合做什么？
25. Next 缓存策略如何解释：fetch cache、route cache、revalidate、dynamic？
26. 图片、字体、脚本优化在 Next 中怎么做？
27. React Query / SWR 解决什么问题？和 Redux/Zustand 的边界是什么？
28. React 表格/表单大组件如何拆分状态？
29. React 项目如何做权限路由和按钮权限？
30. React 性能问题如何定位：Profiler、why-did-you-render、Performance 面板？

### Node.js / BFF

1. Node.js 事件循环和浏览器事件循环有什么差异？
2. libuv 线程池处理哪些任务？
3. `process.nextTick` 和 Promise microtask 有什么差异？
4. CommonJS 和 ESM 在 Node 中如何共存？
5. Express/Koa/Fastify 中间件模型有什么差异？
6. Koa 洋葱模型如何执行？
7. BFF 层解决什么问题？什么时候不该引入 BFF？
8. 如何设计接口聚合、超时、重试、降级？
9. JWT、Cookie、Session 如何选择？
10. 刷新 token 如何设计，如何避免并发刷新风暴？
11. Node 如何处理文件上传？流的背压是什么？
12. 大文件上传如何做分片、秒传、断点续传？
13. 日志如何设计：traceId、requestId、错误栈、脱敏？
14. 如何统一错误码和错误响应？
15. 如何防止 SSRF、路径穿越、命令注入？
16. 如何做接口限流？
17. Redis 缓存在 BFF 中适合缓存什么？
18. Node 服务如何优雅退出？
19. PM2、Docker、serverless 部署对前端全栈有什么影响？
20. 前端候选人讲 Node 项目时，必须讲清哪些线上风险？

### 工程化 / 构建 / 测试

1. Vite 为什么开发环境快？生产构建为什么仍依赖 Rollup？
2. Webpack loader 和 plugin 的区别是什么？
3. Tree shaking 依赖什么条件？
4. sideEffects 字段有什么作用？
5. 代码分割有哪些层级：路由、组件、第三方库、业务域？
6. dynamic import 的加载边界如何设计？
7. sourcemap 如何选择？线上 sourcemap 如何保护？
8. 环境变量如何管理？为什么不能把密钥放前端环境变量？
9. Monorepo 适合什么项目？pnpm workspace 如何组织？
10. 组件库如何做按需引入？
11. ESLint、Prettier、Stylelint、TypeScript 分别管什么？
12. Husky/lint-staged 解决什么问题？
13. 单元测试、组件测试、E2E 测试分别覆盖什么风险？
14. Vitest 和 Jest 的差异是什么？
15. Playwright 如何验证关键业务流程？
16. CI/CD 里前端应该跑哪些检查？
17. 如何设计灰度发布和回滚？
18. 如何监控白屏、JS 错误、接口错误、性能指标？
19. 如何做 bundle 分析？
20. 构建失败、线上白屏、样式丢失的排查顺序是什么？

### 移动端 / H5 / 小程序

1. 移动端适配常见方案有哪些？
2. viewport、rem、vw、flexible、媒体查询如何选择？
3. 1px 问题怎么处理？
4. iOS 安全区如何处理？
5. 软键盘顶起页面如何处理？
6. 移动端点击延迟历史问题是什么？
7. H5 页面如何和 Native 通信？
8. 如何判断 PC 打开 Web，手机打开 H5？
9. H5 分享、支付、登录回跳有哪些坑？
10. 小程序和 H5 的运行环境差异是什么？
11. 小程序分包解决什么问题？
12. 小程序登录态如何设计？
13. 移动端滚动穿透如何处理？
14. 移动端长列表如何优化？
15. 移动端图片上传和压缩如何做？

### 项目场景题

1. 前端如何实现页面截图？`html2canvas` 的限制是什么？
2. 当 QPS 达到峰值时，前端、BFF、网关分别能做什么？
3. 页面请求接口大规模并发如何解决？
4. 如何设计全站请求耗时统计工具？
5. 如何实现大文件上传？
6. 如何实现站点一键换肤？
7. 如何保证用户体验：加载、错误、空状态、重试、骨架屏？
8. 如何做后台管理系统的权限模型？
9. 如何设计可配置表单？
10. 如何设计通用表格：搜索、分页、排序、筛选、列设置、导出？
11. 如何处理列表页返回后保持搜索条件和滚动位置？
12. 如何做国际化和多语言 SEO？
13. 如何从 0 到 1 做一个组件库？
14. 如何接入第三方 SDK 并控制加载性能和异常？
15. 如何处理埋点：曝光、点击、停留、转化？
16. 如何定位线上白屏？
17. 如何定位内存泄漏？
18. 如何降低首屏 JS 体积？
19. 如何设计前端错误边界和降级页？
20. 如何说明你用 AI 写代码但仍然理解和负责？

## 题量矩阵

| 模块 | 建议题量 | 当前优先级 | 目标 |
|---|---:|---|---|
| HTML | 20 | P1 | 补语义、表单、资源加载、可访问性 |
| CSS | 25 | P0 | 补布局、盒模型、BFC、响应式、动效性能 |
| JavaScript | 30 | P0 | 恢复语言层、异步、原型、模块、内存 |
| TypeScript | 15 | P0 | 能服务 Vue/React 项目，不停留在概念 |
| DOM/BOM | 15 | P1 | 补事件、存储、观察器、浏览器 API |
| 浏览器/HTTP/安全 | 25 | P0 | 面试高频，项目排障也常用 |
| Vue/Nuxt | 30 | P0 | 当前大陆岗位最常见 |
| React/Next | 30 | P0 | 覆盖 React 19、Next 15、RSC |
| Node/BFF | 20 | P1 | 补全栈和工程岗位要求 |
| 工程化/测试 | 20 | P0 | 对中高级和项目面很关键 |
| 移动端/H5/小程序 | 15 | P1 | 大陆岗位常见加分项 |
| 项目场景题 | 20 | P0 | 和简历项目直接绑定 |

## 每日抽题训练法

> 你之前担心“问题由谁来生成”。这里直接固定生成规则：每天不用自己想题，从本文件按主题抽取。

### 60 分钟版本

1. 5 分钟：从一个模块抽 6 题，只看题，不看答案。
2. 15 分钟：口头回答 6 题，每题最多 2 分钟。
3. 20 分钟：选最不会的 1 题查官方资料。
4. 15 分钟：写一个 20-50 行 demo。
5. 5 分钟：记录“面试表达版答案”。

### 90 分钟版本

1. 10 分钟：抽 10 题，按 A/B/C/D 自评。
2. 20 分钟：回答 10 题。
3. 25 分钟：查 1-2 个官方资料。
4. 25 分钟：写 demo 或改已有 demo。
5. 10 分钟：复述成 3 段：定义、原理、项目使用。

### 120 分钟版本

1. 15 分钟：抽 15 题。
2. 30 分钟：快速口答，暴露不会点。
3. 30 分钟：官方资料校准。
4. 30 分钟：demo + 边界测试。
5. 15 分钟：把答案写成面试话术。

### 每周复盘规则

1. 每周至少做 1 次 Vue/Nuxt 专项。
2. 每周至少做 1 次 React/Next 专项。
3. 每周至少做 1 次浏览器/HTTP/安全专项。
4. 每周至少做 1 次项目场景题专项。
5. 所有 D 级题进入下周第一优先级。

## 每周验收题

每周选择 3 个主题，做一次口头模拟：

1. 一个 JS/TS 基础题。
2. 一个 React/Next 框架题。
3. 一个性能/工程/业务场景题。

输出格式：

```md
## Week N 模拟

### 题目

### 2 分钟回答

### 追问

### demo / 代码

### 需要补的资料
```

## 国内岗位专项题单

### Vue 中后台岗位

1. Vue 3 响应式原理，`ref` / `reactive` / `computed` / `watch`。
2. Vue Router 动态路由和权限菜单。
3. Pinia 状态设计，异步 action 错误处理。
4. 表格筛选、分页、排序、列配置、虚拟滚动。
5. 表单联动、异步校验、动态表单。
6. 组件封装：Modal、Form、Table、SearchPanel。
7. 请求封装：token、刷新、错误码、取消请求。
8. 权限：路由、菜单、按钮、数据权限。
9. Vite 打包优化和环境变量。
10. 后台系统性能：大列表、缓存、keep-alive。

### React / Next 岗位

1. Hooks 规则、闭包、依赖数组。
2. React render/commit、批处理、key。
3. Context 性能问题和状态归属。
4. React Query / SWR 服务端状态管理。
5. Next App Router、RSC、Client Component 边界。
6. Server Action、Route Handler、middleware。
7. SSR/SSG/ISR 和缓存策略。
8. Hydration mismatch 定位。
9. React 19 Actions、`useOptimistic`、`useActionState`。
10. 页面性能、bundle 分析、首屏优化。

### Nuxt / SEO / 内容站岗位

1. Nuxt SSR 数据获取。
2. `useAsyncData`、`useFetch`、server routes。
3. title/meta/OG/结构化数据。
4. sitemap、robots、canonical。
5. 内容页面缓存和预渲染。
6. hydration mismatch。
7. 图片优化和字体优化。
8. 多语言路由和 SEO。
9. 部署到 Vercel/Netlify/Cloudflare。
10. 日志和错误监控。

### Node / BFF 岗位

1. Node 事件循环。
2. Express/Koa/Fastify 中间件模型。
3. BFF 接口聚合。
4. JWT / Cookie / Session。
5. 接口超时、重试、降级。
6. 日志、traceId、错误码。
7. 文件上传和流。
8. SSR 服务端安全。
9. Redis 缓存。
10. Docker 和部署基础。

### HTML / CSS 基础岗位

1. 语义化标签和 SEO。
2. 表单和可访问性。
3. Flex/Grid 布局。
4. position、z-index、stacking context。
5. 移动端适配。
6. 响应式图片。
7. CSS 动画性能。
8. BFC、margin collapse。
9. Tailwind / CSS Modules / CSS-in-JS 取舍。
10. 暗色模式和主题 token。

## 4 周训练安排

### Week 1：JS/TS 底层恢复

| 天 | 主题 | demo |
|---|---|---|
| Day 1 | Promise / async / await | 顺序、并发、错误捕获 |
| Day 2 | 事件循环 / 长任务 / INP | console 顺序 + 长任务拆分 |
| Day 3 | 闭包 / this / 原型 | stale closure + myBind |
| Day 4 | TS 联合类型 / 类型收窄 | Result + assertNever |
| Day 5 | TS 泛型 / keyof | 类型安全 get |
| Day 6 | 模块系统 / ESM / CJS | live binding + 循环依赖 |
| Day 7 | 周模拟 | 3 题口头回答 |

### Week 2：Vue / React 双框架

| 天 | 主题 | demo |
|---|---|---|
| Day 1 | Vue 响应式 | ref/reactive/watch/computed |
| Day 2 | Vue Router + Pinia | 权限路由 demo |
| Day 3 | Vue 表格/表单封装 | SearchTable 雏形 |
| Day 4 | React Hooks | stale closure + effect |
| Day 5 | React 状态归属 | 本地/Context/query store |
| Day 6 | React 19 Actions | form pending + optimistic |
| Day 7 | 周模拟 | Vue/React 各 1 题 |

### Week 3：SSR / 工程化 / 性能

| 天 | 主题 | demo |
|---|---|---|
| Day 1 | Next App Router / RSC | Server/Client 边界 |
| Day 2 | Nuxt SSR / SEO | useFetch + meta |
| Day 3 | HTTP 缓存 / CDN | cache-control 策略 |
| Day 4 | Core Web Vitals / INP | Performance 长任务分析 |
| Day 5 | Vite / 构建优化 | bundle 分析 |
| Day 6 | CI/CD / 发布回滚 | pipeline 清单 |
| Day 7 | 周模拟 | 性能 + SSR |

### Week 4：Node / 业务场景 / 项目追问

| 天 | 主题 | demo |
|---|---|---|
| Day 1 | Node BFF | API 聚合 + 错误处理 |
| Day 2 | 鉴权安全 | cookie/JWT/CSRF |
| Day 3 | 文件上传 | 分片上传设计 |
| Day 4 | 权限后台 | 路由/菜单/按钮权限 |
| Day 5 | 大表格性能 | 虚拟列表/分页 |
| Day 6 | AI 前端场景 | SSE 流式输出 |
| Day 7 | 项目追问模拟 | 对自己的项目连问 5 层 |

## 第一周建议顺序

| 天 | 主题 | 目标 |
|---|---|---|
| Day 1 | Promise / async / await | 能写顺序/并发/错误处理 demo |
| Day 2 | TS 联合类型和类型收窄 | 能写 Result + assertNever |
| Day 3 | React Hooks 和 stale closure | 能解释依赖数组和闭包问题 |
| Day 4 | Next.js App Router / RSC | 能讲 Server/Client Component 边界 |
| Day 5 | Core Web Vitals / INP | 能定位一个交互卡顿问题 |
| Day 6 | HTTP 缓存 / CORS / Cookie | 能讲清缓存和跨域安全 |
| Day 7 | 周模拟 | 3 题口头回答 + demo 回顾 |
