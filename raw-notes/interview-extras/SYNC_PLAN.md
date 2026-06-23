<!-- 🔄 自维护文档：每完成/跳过一个源文档，更新「总进度」「状态列」和「变更历史」 -->

# 面试题库同步任务

**最后更新**: 2026-06-23
**总进度**: 25 / 25 已完成（语雀 15 为空文档，不计入）

把 `raw-notes/interview-extras/` 采集的面试题，按主题**去重**后融入 `apps/docs/docs/` 对应章节，套用现有文档结构。

## 同步规则

1. **保留**：问题、答案要点、来源链接。
2. **过滤**：考察频率、打卡组件、广告/引流、阅读量等无关元信息。
3. **去重**：添加前判断目标文件是否已有相同主题/题目；重复则不加，只补未覆盖的题。
4. **格式对齐**：套用目标文件现有风格（`## 问题` / `## 结论` / `### 小标题` / 代码块 / `## 参考来源`）。
5. **来源标注**：不在正文标注采集来源（掘金/语雀）；采集来源仅在本文档「跳过记录」中追溯，文末 `## 参考来源` 保留 MDN / 官方文档等权威源。
6. **过时题**：明显过时且与现代实践冲突的（jQuery 兼容、已废弃 API）跳过，并在「备注」记录。
7. **逐个处理**：按源序号一个个推进；存疑项（标 ❓）处理到时单独确认。
8. **手写题全收录**：手写题类文档（`handwritten/`）按"题 + 答案"全量收录，不做精选。同一题的不同解法，只要实现方式不雷同都收录；仅「实现完全相同」时去重。原文仅给外链的经典题补标准实现。

状态图例：⬜ 待处理 ｜ 🔄 进行中 ｜ ✅ 完成 ｜ ⏭️ 跳过

## 映射与进度

### 掘金（10 篇，平铺于 interview-extras/）

| # | 源文件 | 主题 | 目标页面 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 01 | 2021年前端各大公司手写题 | JS 手写 | `javascript/handwritten/common-implementations` | ✅ | 补 24 题(手写题全收录,含多解)：手写 Promise/resolve/reject/串行、数组遍历方法/数组去重多解/数组转树、apply/链式/偏函数、ajax/jsonp、Set/Map、六种继承、发布订阅(EventEmitter)、下划线转驼峰，及 Promise.finally/allSettled/race/any、Object.create、类型判断、sleep、千分位；跳过见下 |
| 02 | 详析一次鹅厂一面（移动端岗） | 面经·混合 | `network/http/protocol-basics` | ✅ | Java/Android 主体跳过；仅网络部分 4 题补入 network/http/protocol-basics |
| 03 | 5年前端·1个月7offer | 面经·混合 | 技术题分流 1~11 类 → 各章节 | ✅ | 本轮补现有文件缺口 15 题 + 新建 Node 子分类（4 文件 11 题）；CSS/Vue/React/工程化/网络等系统题留语雀题库；详见「跳过记录·掘金 03」 |
| 04 | 百度一面 | 面经·混合 | 技术题分流：手写 / 语言基础 / 存储 + 新建 algorithm | ✅ | 补 4 题：Q2 chunk→handwritten、Q3 引用比较→declaration-and-types、Q8 一天一弹→html/storage、Q6 斐波那契→新建 algorithm/；Q4/Q5/Q7/Q9 已覆盖去重、Q10 面经叙事跳过；详见「跳过记录·掘金 04」 |
| 05 | 北京七年前端·面试复盘 | 面经·混合 | 技术题分流：算法 / JS / CSS / Vue | ✅ | 补 13 题（9 文件）：二分查找+洗牌→新建 algorithm/array-and-search；空对象→es-builtins、滚动到底→dom-bom；左固定右自适应多方式→layout-patterns、transform/animation→新建 css/animation-interaction；MVVM+框架对比 / Vue2-3+性能 / 生命周期 / diff+key→新建 vue 概念·组件子分类；三角形/0.5px/自适应grid 等已覆盖去重，代码输出题留语雀 14；详见「跳过记录·掘金 05」 |
| 06 | 铜九铁十·工程化八股 | 工程化 | `git/git-workflow` + `build-tools/webpack` + `engineering/monorepo-and-package-manager` | ✅ | 详见「跳过记录·掘金 06」 |
| 07 | 京东一面：post 为什么发两次请求 | 网络·CORS 预检 | `network/http/ajax-cors-cache` | ✅ | 详见「跳过记录·掘金 07」 |
| 08 | 2023 前端面试系列·Vue 篇 | Vue | `vue/` 多文件（7 文件） | ✅ | 详见「跳过记录·掘金 08」 |
| 09 | 最全的手写 JS 面试题 | JS 手写 | `javascript/handwritten/common-implementations` + `algorithm/` | ✅ | 与 01、现有去重；详见「跳过记录·掘金 09」 |
| 10 | 原生 JS 灵魂之问（中） | JS 语言/手写 | `javascript/language-basics/array-and-iteration` + `handwritten/common-implementations` | ✅ | 详见「跳过记录·掘金 10」 |

### 语雀《前端面试题汇总》（16 篇，子目录 语雀-前端面试题汇总/）

| # | 源文件 | 主题 | 目标页面 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 01 | 互联网公司大盘点 | meta·资源 | — | ⏭️ | 非题目，跳过 |
| 02 | 前端学习路线 | meta·路线 | — | ⏭️ | 非题目，跳过 |
| 03 | 前端面试准备 | meta·准备 | — | ⏭️ | 非题目，跳过 |
| 04 | HTML 篇 | HTML | `html/` 各子分类 | ✅ | 重审补（2026-06-23）新增 5 题：Web Worker、drag API、离线储存管理加载、label 作用、浏览器乱码；其余 15 题已覆盖 |
| 05 | CSS 篇 | CSS | `css/` 各子分类 | ✅ | 重审补（2026-06-23）新增 19 题：可继承属性、CSS3新特性、伪元素伪类、::before/:after、requestAnimationFrame、margin/padding场景、替换元素、margin重叠、图片格式、CSS Sprites、CSS优化、可视区判断、CSS工程化、品字布局、九宫格、层叠顺序、自适应正方形、梯形、0.5px线 |
| 06 | JavaScript 篇 | JS | `javascript/` 各子分类 | ✅ | 重审补（2026-06-23）新增 51 题（4文件）：数据类型检测/null与undefined/typeof null/箭头函数/解构/rest参数/正则/JSON/DOM-BOM/AJAX/for...in vs for...of/原型链指向/原型链终点/异步编程方式/Promise基本用法/Promise解决问题/await等什么/async-await优势 等 |
| 07 | Vue 篇 | Vue | `vue/` | ✅ | 初次补：vue-router（懒加载/导航守卫三类/解析顺序/router vs location.href）；vuex（action vs mutation/mutation不能异步/vs localStorage/vs Redux）；directives（computed vs methods/数组重写7法/v-cloak）；vue2-vs-vue3（Composition API vs React Hook）。重审补（2026-06-23）：reactivity（Vue基本原理/双向数据绑定原理/Dep-Watcher依赖收集链路）；directives-and-features（保存页面状态/mixin覆盖逻辑/Vue.delete/监听属性变化/自定义指令/template vs jsx/Vue.extend）；$parent/$children；获取hash变化；前端路由理解；Vuex vs全局对象/严格模式/mapGetters/mapMutations；MVVM优缺点/Vue设计原则/MVP模式 |
| 08 | React 篇 | React | `react/` | ✅ | 初次新建 7 文件（组件/生命周期/state/通信/路由/Redux/Hooks）。重审补（2026-06-23）新增 70+ 题：class-and-function（Component/Element/Instance区别/createClass vs extends/componentWillReceiveProps/重渲染触发/forwardRef/Context/SSR/设计思路等 36 项）；state-and-props（setState原理/replaceState/state注入组件流程等 6 项）；lifecycle（props变化后处理/性能优化生命周期等 4 项）；react-router（路由切换/Switch/配置等 3 项）；redux（中间件/并发/vs Vuex/Mobx等 6 项） |
| 09 | 性能优化篇 | 性能 | `performance/` | ✅ | 重审补（2026-06-23）新增 3 题：如何优化动画、documentFragment、懒加载与预加载的区别；其余 19 题已覆盖（CDN/懒加载/回流重绘/节流防抖/图片优化/webpack优化等均已有完整节） |
| 10 | 前端工程化篇 | 工程化 | `git/` + `build-tools/` | ✅ | 重审补（2026-06-23）新增 1 题：「如何用 webpack 优化前端性能」→ webpack.md；其余 16 题已覆盖（git/webpack/Babel 相关均有对应节） |
| 11 | 计算机网络篇 | 网络 | `network/` | ✅ | 重审补（2026-06-23）新增 18 题：HTTP 304好坏/keep-alive建立过程/URL回车发生了什么/HTTP优缺点/端口号作用/302-303-307区别/OPTIONS方法/GET长度限制/多图片加载/HPACK/HTTP性能/TCP重传/拥塞控制/流量控制/可靠传输/粘包/UDP不粘包/DNS记录报文；其余 31 题已覆盖 |
| 12 | 浏览器原理篇 | 浏览器 | `browser/` 多文件 | ✅ | 重审补（2026-06-23）新增 45+ 题，新建 6 文件：security/xss-csrf-and-security（XSS/CSRF/中间人攻击/网络劫持等 7 题）、cache/browser-cache（缓存机制/强缓存协商缓存/为什么需要缓存/刷新行为差异）、storage/local-storage（本地存储方式/Cookie字段/三种存储区别/IndexedDB）、cors/same-origin-and-cross-origin（同源策略/跨域解决方案/正向反向代理/Nginx）、events/event-loop-and-delegation（事件模型/阻止冒泡/事件委托/事件循环/宏微任务/执行栈/Node EventLoop等 10 题）、gc/v8-garbage-collection（V8垃圾回收/内存泄漏）；processes/browser-processes-and-threads 追加（IPC/僵尸孤儿进程/死锁/多标签通信/Service Worker）；rendering/browser-kernel 追加（浏览器理解/内核理解/渲染优化/JS阻塞/预解析/CSS阻塞/关键渲染路径/阻塞渲染等 8 题） |
| 13 | 手写代码篇 | JS 手写 | `javascript/handwritten/common-implementations` | ✅ | 重审补（2026-06-23）新增 25 题：Promise.then封装/Promise封装AJAX/交换变量/数组乱序/数组求和/flat/repeat/翻转/add(1)(2)(3)/类数组转数组/reduce多场景/函数参数求和/二维数组查找/斜向打印/找Input子元素/手机号遮码/每秒打印/约瑟夫环/Promise异步加载图片/词频统计/封装fetch/双向数据绑定/Hash路由/斐波那契/最长不重复子串；其余 29 题已覆盖 |
| 14 | 代码输出篇 | JS 执行结果 | — | ⏭️ | 全为代码输出练习题（异步/this/作用域/原型四类），知识点均已在对应文档覆盖；练习题格式不适合参考文档结构，跳过 |
| 15 | 数据结构与算法（待更新） | 空 | — | ⏭️ | 原文为空，跳过 |
| 16 | LeetCode 高频题目分类列表 | 算法清单 | — | ⏭️ | 纯刷题清单，无题目实现；algorithm/ 章节已由掘金 04/09 建立，跳过 |

## 存疑待定项（处理到时逐一确认）

- **掘金 02 面经**：建议抽取其中技术问答分流到各章节，纯面经叙事（流程/心态/薪资）按"无关信息"跳过。（03/04/05 已按此处理完成）
- **语雀 05 CSS / 07 Vue**：掘金 05 已补部分 CSS（左固定右自适应、transform/animation）和 Vue（MVVM、Vue2/3、生命周期、diff/key）内容，处理语雀对应篇时需对照去重。
- **语雀 01–03 meta**：非题目，已确认跳过。
- **语雀 14 代码输出篇**：JS 执行结果题，`javascript/` 下无对应子类。建议新建 `code-output/` 子分类。
- **语雀 16 LeetCode**：纯刷题清单，偏前端八股。`algorithm/` 章节已于掘金 04 建立，可按需补高频题，或仍跳过纯清单。

## 跳过记录

### 语雀 07（→ vue/ 多文件）

**已补（初次 + 重审 2026-06-23）**：
- `vue/router/vue-router.md`：路由懒加载（import()）、导航守卫三类（全局/路由/组件）及执行顺序、路由参数解析顺序、router-link vs location.href。
- `vue/state/vuex.md`：action vs mutation 区别（异步/同步）、mutation 为何不能异步、Vuex vs localStorage 对比、Vuex vs Redux 异同。
- `vue/component/directives-and-features.md`：computed vs methods、数组重写7法、v-cloak。**重审补**：自定义指令（全局/局部定义、5钩子函数（bind/inserted/update/componentUpdated/unbind）、钩子参数（el/binding/vnode/oldVnode）、使用场景与案例）、template vs JSX 对比、Vue.extend 用法。
- `vue/concepts/vue2-vs-vue3.md`：Composition API vs React Hook 详细对比表（触发时机/依赖声明/调用顺序/GC压力）。
- `vue/core/reactivity.md`：**重审补**：Dep/Watcher 依赖收集链路详述（defineReactive → dep → getter触发 → dep.depend() → Watcher订阅 → setter触发 → dep.notify() → Watcher.update()）。

**已有，去重跳过**：
- Q1 Vue的基本原理（defineProperty→getter/setter→Watcher订阅→驱动更新）→ `vue/core/reactivity.md`「Vue 基本原理（一句话）」+「响应式原理：Vue 2 vs Vue 3」已覆盖；`## 问题` 已补充"Vue 的基本原理是什么？"问法
- Q2 双向数据绑定原理（Observer/Compile/Watcher三者协作）→ Observer=defineProperty劫持已覆盖；Compile=模板编译在「模板编译原理」节已覆盖；Watcher协作在「Dep/Watcher 依赖收集链路」节已覆盖
- Q3 Object.defineProperty 缺点（无法监听属性新增/数组下标）→ `reactivity.md`「响应式原理」Vue 2 缺点列表已覆盖
- 响应式原理（Object.defineProperty）→ `vue/core/reactivity.md` 已覆盖基础
- nextTick 原理 → `vue/core/reactivity.md` 已覆盖
- 生命周期全流程 → `vue/component/lifecycle.md` 已覆盖
- 虚拟 DOM 与 diff 算法 → `vue/rendering/diff-and-key.md` 已覆盖
- 组件通信（props/$emit/$bus/Vuex/provide/inject）→ `vue/component/component-communication.md` 已覆盖
- Vue 2/3 区别对比 → `vue/concepts/vue2-vs-vue3.md` 已覆盖（Proxy/Fragment/TS/性能）
- MVVM 模式 → `vue/concepts/mvvm-and-framework-comparison.md` 已覆盖
- SPA 优缺点/SSR → `vue/concepts/spa-ssr.md` 已覆盖
- vue-router 基础（hash vs history 模式）→ `vue/router/vue-router.md` 已覆盖
- keep-alive 原理 → `vue/component/directives-and-features.md` 已覆盖
- Vuex 核心概念（state/mutations/actions/getters/modules）→ `vue/state/vuex.md` 已覆盖
- mixin 缺点 → `vue/component/directives-and-features.md` 已覆盖
- v-show vs v-if / computed vs watch / 插槽 / v-model 原理 → `vue/component/directives-and-features.md` 已覆盖
- 过滤器（filters，Q8）→ Vue 2 已废弃，Vue 3 移除，跳过
- Vue 的优点（Q29）→ 过于宏观的概述题，与 MVVM/响应式原理重叠，跳过
- 子组件改父数据（Q26）→ 单向数据流已在 directives-and-features.md 覆盖
- mixin/extends 覆盖逻辑（Q24）→ mixin 缺点已覆盖，extends 已在 Vue.extend 节说明，跳过详细 mergeOptions 代码
- MVVM 优缺点（Q42）→ 已在 mvvm-and-framework-comparison.md 覆盖
- Vue 组件化理解（Q44）→ 纯概念论述，无具体技术点，跳过

### 语雀 13（→ javascript/handwritten/common-implementations 补充）

**已补（5 题）**：
- `Object.assign` 实现（`Object.myAssign`）：遍历自身可枚举属性，`hasOwnProperty` 过滤原型链。
- 日期格式化 `dateFormat(date, format)`：`getFullYear/getMonth/getDate` + `padStart` + 替换 `yyyy/MM/dd`。
- 解析 URL Params `parseParam(url)`：`indexOf('?')` 切出查询串，`&`/`=` 拆分，数字转换，重复 key 归数组，无值键设 `true`。
- 循环打印红黄绿（3s红/1s绿/2s黄）：三版实现（callback 递归尾调用 / Promise 链 / async while true）。
- 判断循环引用 `isCyclic`：`WeakSet` 追踪已访问对象，DFS 递归检查每个属性值。

**已有，去重跳过**：
- 基础类（20 题）：call/apply/bind/new/instanceof → 01/09 已覆盖；深浅拷贝 → 01/09/10 已覆盖；Promise 全家桶 → 01/09 已覆盖；防抖/节流/柯里化/函数记忆/组合函数 → 01/09/03 已覆盖；EventEmitter → 01 两版已覆盖；类型判断 `getType` → 掘金已补；寄生组合继承/ES6 继承 → 01 六种已覆盖；AJAX + Promise 封装 → 01 已覆盖。
- 数据处理类（24 题）：数组转树 → 01 已覆盖；数组去重多解 → 01 六解已覆盖；扁平化 → 09 已覆盖；数组交集/差集/并集/分组 → 类似题 chunk/去重等已有；对象 flatten/unflatten → 09 已覆盖；版本号排序 → 09 已覆盖；大数相加 → 09 已覆盖；模板字符串解析 → 09 已覆盖；对象深拷贝 → 01 已覆盖；下划线转驼峰/驼峰转下划线 → 01 已覆盖；千分位格式化 → 01 已覆盖；图片懒加载 → performance/cdn-and-image-optimization 已覆盖；滚动加载/观察器 → dom-bom 已覆盖；渲染几万条数据分片 → 09 requestAnimationFrame 已覆盖；打印当前网页用到的 HTML 标签 → 低频跳过。
- 高阶应用类（15 题）：发布订阅 EventEmitter → 01 已覆盖；路由 hashchange 实现 → router 章节已覆盖；图片懒加载 IntersectionObserver → cdn-and-image-optimization 已覆盖；ajax 封装→ 01 已覆盖；并发任务控制 Scheduler → 09 已覆盖；LRU → 03 已覆盖；Promise.all/race/allSettled → 01 已覆盖；setTimeout 模拟 setInterval → 09 已覆盖；函数 compose → 03 已覆盖；正则 trim 实现 → 低频/原生已替代跳过；sleep → 01 已覆盖；queryString 解析（补充版）→ 与 parseParam 同题，已收录。

### 语雀 12（→ browser/processes 新建 + 现有文件补充）

**已补（新建 1 文件 + 2 文件更新）**：
- `browser/processes/browser-processes-and-threads`（新建）：进程 vs 线程对比表（资源/隔离/通信/开销）、Chrome 多进程架构 5 种进程（浏览器/GPU/网络/渲染/插件，各职责说明）、多进程优点（标签页隔离/崩溃不影响整体）、渲染进程内 5 种线程（GUI渲染线程、JS引擎线程、事件触发线程、定时器触发线程、异步HTTP请求线程）、GUI与JS线程互斥原因、JavaScript 单线程原因（DOM 竞态问题）。
- `network/security/web-security-and-cross-origin`（更新）：新增「网络劫持」节——DNS 劫持 vs HTTP 劫持（原理/防御），全站 HTTPS+HSTS 防御方案。
- `network/http/http-versions-and-features`（更新）：新增「刷新操作对缓存的影响」表（地址栏回车/F5/Ctrl+F5 三种行为差异）。

**已有，去重跳过（部分 2026-06-23 重审补入）**：
- XSS/CSRF/中间人攻击 → `network/security/web-security-and-cross-origin.md` 已覆盖（安全是网络层主题，browser/ 无需重复）
- CORS/同源策略/跨域解决方案 → `web-security-and-cross-origin.md` + `ajax-cors-cache.md` 已覆盖
- 浏览器强缓存/协商缓存全流程 → `http-versions-and-features.md` 已覆盖
- ~~浏览器内核/常见内核（Blink/Gecko/WebKit）→ browser-kernel.md 已有基础~~ → **重审补充**：browser-kernel.md 已扩充浏览器主要组成部分（7 parts）/五种内核详细比较/常见浏览器对照表/渲染流程 5 步详述/CSS-JS 阻塞说明
- ~~浏览器渲染过程（DOM/CSSOM/RenderTree/Layout/Paint）→ browser-kernel.md 已有基础~~ → **重审补充**：已在 browser-kernel.md 扩展为 6 步详述含渐进渲染说明
- async/defer → `html/resource-loading/script-async-defer.md` 已覆盖
- CSS link vs @import → `css/foundations/css-basic-and-loading.md` 已覆盖
- Cookie/LocalStorage/SessionStorage/IndexedDB → `javascript/dom-bom/browser-storage.md` 已覆盖
- 事件循环/宏任务/微任务/Node.js Event Loop → `javascript/async/event-loop-workers-and-concurrency.md` 已覆盖
- DOM 事件委托/冒泡/捕获/阻止传播 → `javascript/dom-bom/dom-events-and-nodes.md` 已覆盖
- 多标签页通信（postMessage/BroadcastChannel/localStorage） → `javascript/dom-bom/page-communication.md` 已覆盖
- 内存模型/GC 可达性/标记清除基础 → `javascript/execution-model/memory-and-garbage-collection.md` 已覆盖
- 进程间通信（管道/消息队列/信号量等）→ 偏 OS 底层，前端低频，跳过
- 僵尸进程/孤儿进程/死锁 → OS 底层，跳过
- 正向代理/反向代理/Nginx → 偏后端，跳过

### 语雀 11（→ network/ 3 新建文件）

**已补（新建 3 文件）**：
- `network/http/http-versions-and-features`（新建）：HTTP 1.0 vs 1.1（连接/资源请求/缓存/Host）、HTTP 1.1 vs 2.0（二进制/多路复用/HPACK/服务器推送/队头阻塞）、HTTP 3.0/QUIC（UDP+TLS1.3/0~1RTT）、POST vs PUT（创建 vs 更新/幂等）、常见请求方法 8 种、常见请求头/响应头对照表、HTTP 请求/响应报文结构（4部分）、URL 7 个组成部分、HTTP 强缓存（Expires/Cache-Control）与协商缓存（ETag/Last-Modified）请求头。
- `network/http/https-and-tls`（新建）：HTTPS vs HTTP 对比表（加密/端口/证书/性能/验证）、TLS/SSL 三类算法（Hash/对称/非对称 + 工作方式）、数字证书与 CA（防中间人/数字签名验证流程）、HTTPS 握手 5 步（三随机数协商对称密钥）、HTTPS 安全保障总结（非对称协商密钥+CA验证+对称加密通信）、HTTPS 优缺点。
- `network/protocol/tcp-udp-and-dns`（新建）：TCP vs UDP 7 维对比表、TCP/UDP 特点与使用场景、TCP 三次握手（SYN/SYN-ACK/ACK 序号同步 + 为何不是两次）、TCP 四次挥手（FIN/ACK/FIN/ACK + TIME-WAIT 原因 + 为何需要四次）、DNS 53端口 TCP/UDP 使用场景、DNS 7步查询流程（浏览器→hosts→本地DNS→根→TLD→权威）、递归查询 vs 迭代查询、OSI 7层 vs TCP/IP 5层对照表。

**已有，去重跳过**：
- GET vs POST（protocol-basics.md 已覆盖）
- HTTP 状态码基础（protocol-basics.md 已覆盖；详细逐个子码如 403.x/404.x 为 IIS 特定细节，跳过）
- Keep-Alive 详细建立/断开流程（protocol-basics.md 已覆盖）
- OPTIONS 请求与 CORS（ajax-cors-cache.md 已覆盖）
- 304 缓存（protocol-basics.md + ajax-cors-cache.md 已覆盖）
- GET URL 长度限制（各浏览器具体数值细节，过于细节跳过）
- 输入 URL 到页面完整流程（performance/loading 已覆盖）
- HTTP 性能详细（队头阻塞已在 http-versions 文件新建节内提及）
- 302/303/307 区别（状态码细节，protocol-basics 已有简述）
- WebSocket（server-push-options.md 已覆盖基础内容）
- TCP 流量控制/拥塞控制/重传/可靠传输 详细机制（底层细节，前端低频，跳过）
- TCP 粘包（底层细节，前端低频，跳过）
- DNS 记录类型（A/NS/CNAME/MX 细节，跳过）

### 语雀 10（→ git/git-workflow + build-tools/webpack）

**已补（2 文件更新）**：
- `git/git-workflow`：新增 git vs SVN 对比表（分布式/分支轻量/SHA-1完整性/容灾）、新增 git pull vs git fetch 区别（fetch=下载/pull=fetch+merge）。
- `build-tools/webpack`：新增 webpack vs grunt/gulp 定位对比（任务工具 vs 模块打包器）、新增 webpack/rollup/parcel 四维对比表（适用场景/Tree Shaking/代码分割）、新增 Loader 执行顺序（从右向左，compose 函数式编程原因）、新增编写 Loader/Plugin 思路（单一职责/this.callback/apply(compiler)/钩子注册）、新增单页/多页应用配置（多 entry + html-webpack-plugin chunks 示例）、新增 Babel 原理（Parse→Transform→Generate 三阶段 + preset 说明）。

**已有，去重跳过**：
- git 常用命令（git-workflow 已有 14 条命令表）
- git merge vs rebase（git-workflow 已有完整对比）
- 常见 Loader/Plugin 列举（webpack.md 已有，补 file-loader/url-loader/source-map-loader 等细节轻微重叠去重）
- bundle/chunk/module（webpack.md 已有）
- Loader vs Plugin 区别（webpack.md 已有）
- webpack 构建流程（webpack.md 已有 7 步）
- HMR 热更新原理（webpack.md 已有）
- webpack 优化性能/打包速度（webpack.md 已有）

### 语雀 09（→ performance/loading/cdn-and-image-optimization 新建 + performance/rendering/dom-and-page-performance 补充）

**已补（新建 1 文件 + 1 文件更新）**：
- `performance/loading/cdn-and-image-optimization`（新建）：CDN 概念（三部分：分发服务/负载均衡/运营管理）、CDN 作用（性能降延迟+安全防 DDoS/HTTPS）、CDN 原理（DNS 五步解析 + CNAME 七步 CDN 工作流）、CDN 使用场景（静态资源/第三方CDN/直播推送）、懒加载概念+特点+实现原理（data-src+offsetTop判断+原生JS代码+IntersectionObserver 现代方案+loading=lazy）、懒加载 vs 预加载对比表、图片优化手段（CSS替代/CDN裁剪/base64/雪碧图/格式选择）、图片格式详细对比表（BMP/GIF/JPEG/PNG-8/PNG-24/SVG/WebP，WebP 压缩数据：无损比 PNG 小 26%，有损比 JPEG 小 25-34%）。
- `performance/rendering/dom-and-page-performance`（更新 — **重审补充**）：新增「回流与重绘」（触发条件/8 项避免措施/渲染队列机制/DocumentFragment 用法）+ 「节流与防抖」（防抖 vs 节流概念/应用场景对比表/链接手写实现）。

**已有，跳过**（原被错误视为全局去重，2026-06-23 重审修正）：
- ~~回流与重绘→ css/rendering 已覆盖（跨章节错误，已补入 performance/rendering/dom-and-page-performance）~~
- ~~节流与防抖→ handwritten 已覆盖（跨章节错误，概念+场景已补入 performance/rendering/dom-and-page-performance）~~
- Webpack 优化（4 题）→ `build-tools/webpack.md` 已覆盖（build-tools 是该内容的主要目标章节，性能视角已在 webpack 文件中体现，维持跳过）

### 语雀 08（→ react/ 多文件）

**已补（7 新建文件 + 2 文件更新）**：
- `react/components/class-and-function`（新建）：类组件 vs 函数组件（对比表）、PureComponent vs React.memo、HOC/render props/Hooks 三代复用方案、受控 vs 非受控组件（对比表）、ref 三种用法+forwardRef、Fragment+Portals、Fiber 架构作用。
- `react/rendering/lifecycle`（新建）：挂载阶段（constructor/getDerivedStateFromProps/render/componentDidMount）、更新阶段（shouldComponentUpdate/getSnapshotBeforeUpdate/componentDidUpdate）、卸载（componentWillUnmount）、错误处理（componentDidCatch）、废弃钩子三个及替代方案、网络请求推荐 componentDidMount、Hooks 对照表。
- `react/state/state-and-props`（新建）：state vs props 对比、props 只读原因（纯函数思想）、setState 异步/同步（React 控制与否）、批量更新合并规则、函数式 setState、useState 返回数组原因、PropTypes 校验。
- `react/components/communication`（新建）：父→子 props、子→父 回调函数、跨级 Context（createContext/Provider/useContext）、非嵌套 发布订阅/Redux、props drilling 解决方案对比表。
- `react/router/react-router`（新建）：实现原理（history/hash）、BrowserRouter vs HashRouter 对比表+Nginx 配置、Route/Switch 用法、Link vs a 区别、路由参数获取（params/query/state）、懒加载 React.lazy+Suspense。
- `react/state/redux`（新建）：Redux 工作流程、三大原则、异步（redux-thunk/redux-saga 对比）、connect+mapStateToProps/mapDispatchToProps、useSelector+useDispatch、中间件机制（柯里化三层函数）、Redux vs Vuex 对比。
- `react/hooks/react-hooks`（新建）：Hooks 解决的三大问题、常用 Hooks 速查、useState 返回数组设计原因、两条使用限制及背后原因（链表顺序）、useEffect vs useLayoutEffect 时机+阻塞差异、useState 常见陷阱（直接修改引用/初始值只生效一次）、Hooks 与生命周期对照。
- `react/rendering/virtual-dom`（更新）：新增 diff 三策略（树层级/组件类型/key 列表）、key 注意事项（不用 index/不用随机数）、React vs Vue diff 对比、Virtual DOM vs 直接操作 DOM 性能说明。
- `react/events/react-events`（更新）：新增「合成事件系统」节——委托到 React 根节点、节省内存/统一管理/跨浏览器、执行顺序（原生先、合成后）、原生 stopPropagation 的陷阱、必须用 preventDefault 而非 return false。

**已有，去重跳过**：虚拟 DOM 基础（react/rendering/virtual-dom 已有）、React 事件基础命名+函数+nativeEvent（react-events 已有）、React-Intl 国际化（非高频，偏框架用法）、React.createClass（过时 API）、componentWillReceiveProps 作用（在废弃钩子节已提及）。

### 掘金 01（→ javascript/handwritten/common-implementations）
- **完全重复**（实现相同，跳过）：call、bind、new、instanceof、深拷贝、Promise.all、防抖、节流、柯里化、扁平化。
- **多解已补**（实现不雷同，补为另一种解法）：数组去重（Set 版之外补双重循环、includes、排序双指针、Map、filter、reduce 共 6 种）、发布订阅（EventBus 之外补 EventEmitter + once）。
- **缺答案已补全**：原文仅给外链的 手写 Promise、串行 Promise、链式调用、偏函数、数组转树、下划线转驼峰、六种继承。
- **仍跳过**：实现 sort（原文仅外链、篇幅大、非前端高频）、实现 ES6 class（原文仅外链，与「六种继承」重叠）。

### 掘金 02（→ network/http/protocol-basics）

**已补（4 题）**：
- `network/http/protocol-basics`：HTTP 协议分层（应用层/TCP）、长连接与短连接（Keep-Alive / HTTP 1.0 vs 1.1 / 适用场景）、GET vs POST（语义/幂等/缓存/长度限制/URL 可见性，附"两个数据包"说法的准确说明）、HTTP 状态码（1xx-5xx 分类与常见码）。

**跳过**：综合类（自我介绍/项目/C++）、Java 类（String/集合/HashMap/多线程/JVM/GC/对象比较）、Android 类（子线程 UI/内存泄漏/Activity 通讯/生命周期/横竖屏切换）、数据结构（仅图片无文字）、其他（神经网络）——均与前端库主题不相关。

### 掘金 06（→ git/git-workflow + build-tools/webpack + engineering/monorepo-and-package-manager）

**已补（17 题 / 3 文件）**：
- `git/git-workflow`：常用 git 命令（14 条速查表）、git merge vs rebase（分叉历史 vs 线性历史、适用场景与注意事项）。
- `build-tools/webpack`：webpack 主要配置项、常见 Loader/Plugin 列举、Loader vs Plugin 区别、构建流程（7步/3阶段）、HMR 原理（WDS+WebSocket+内存+hash+Ajax+JSONP）、bundle/chunk/module 是什么、Code Splitting（optimization.splitChunks）、Source Map（devtool 配置）、Tree Shaking 原理（ESM静态分析+标记未使用+Terser删除）、提高打包速度（缓存/多进程/DllPlugin/缩小范围）、减少打包体积（Code Splitting/Tree Shaking/压缩/Gzip/CDN）、Vite vs webpack（开发启动/HMR/构建速度/缓存 4 维对比）。
- `engineering/monorepo-and-package-manager`：Monorepo 优缺点、常见实现（pnpm workspace/Turborepo/Nx/Lerna/Rush）、pnpm 原理（npm嵌套→yarn扁平化+幽灵依赖→pnpm store+硬链接+符号链接+非扁平结构）。

**跳过**：无。全部题目均为前端工程化相关，全量收录。

### 掘金 03（5年前端·7offer）

**已补·Part A（现有文件缺口 15 题）**：
- `javascript/handwritten/common-implementations`：节流(尾触发)、数组转树+增删节点、compose、createRepeat、LRU、fetchWithRetry、test(num) 按值找数组名（7）。
- `javascript/execution-model/scope-closure-this`：this 设计缺点（1）。
- `javascript/object-model/prototype-and-inheritance`：ES6 静态/实例成员挂载时机、ES5/ES6 继承本质区别（2）。
- `javascript/async/promise-async-await`：Promise.finally 手写、async/generator/promise 关联（2）。
- `javascript/language-basics/es-builtins-operators-and-objects`：generator 中断与恢复、BigInt 大数（2）。
- `network/security/web-security-and-cross-origin`：CSP 解决什么问题及额外能力（1）。

**已补·Part B（新建 Node 子分类，4 文件 11 题）**：运行时(libuv/前后端分工/事件循环阶段/子进程 IPC)、服务端框架(洋葱模型与 compose/中间件异常/body-parser)、部署运维(pm2/日志负载均衡/服务治理)、调试工具(inspector/Charles map local-remote)；配套更新 `.vitepress/config.mts` sidebar 与 `nodejs/index.md`（旧规划改为 4 分类）。

**已有，去重跳过**：闭包、箭头/普通函数区别、作用域链、原型链、Symbol、Set/Map、事件循环、宏微任务、async/await 原理、Promise 特性/API/then-catch、xss-csrf、浏览器内存查看与前端内存监控——均已散落在现有 `javascript/`、`network/security`、`execution-model/memory-and-garbage-collection`。

**留后续系统题库**：CSS(语雀 05)、Vue(07)、React(08)、工程化(10)、网络 websocket/301-304/缓存优先级/http2-3/tcp-udp 与 https 防中间人(11)、性能 虚拟列表/qps/错误与线上监控(09)、装饰器(06 JS 篇)、TS `is`(typescript 章节)。

**跳过**：类 12 代码输出、类 14 场景设计 → 与语雀 14 代码输出篇一并定（候选 `javascript/code-output/`）；类 13 算法、类 15 软技能/智力题 → 跳过。

### 掘金 04（百度一面）

**已补（4 题）**：
- `javascript/handwritten/common-implementations`：Q2 数组分块 chunk（一维转二维）。
- `javascript/language-basics/declaration-and-types`：Q3 对象 `==`/`===` 按引用比较（含赋值后相等）。
- `html/storage/local-storage-expiry-and-tabs`：Q8 一天只弹一次弹窗（localStorage + `toDateString()` 按天去重）。
- `algorithm/dynamic-programming/fibonacci-and-dp`：Q6 斐波那契 O(n) 动态规划（递归 O(2^n) 缺陷、状态转移方程、空间优化、9 种常见 DP 方程）——**新建 `algorithm/` 章节**，同步 nav + sidebar + index。

**已有，去重跳过**：Q4 this 输出（scope-closure-this 已覆盖）、Q5 Promise 输出 1 4 3 2（event-loop 已覆盖）、Q7 EventBus/EventEmitter（handwritten 两者均已有）、Q9 项目性能优化清单（performance/ 已覆盖）。

**跳过**：Q1、Q11 为非技术题（如何用 ChatGPT、如何学前端）；Q10 项目难点为面经叙事，技术点（pinia / node 错误处理 / 跨域 / axios 拦截）已分散在 vue、network、nodejs。

### 掘金 05（北京七年前端·面试复盘）

**已补（13 题 / 9 文件）**：
- `algorithm/array-and-search/binary-search-and-shuffle`：二分查找 O(log n)、Fisher-Yates 洗牌 O(n)（**新建「数组与查找」子分类**）。
- `javascript/language-basics/es-builtins-operators-and-objects`：如何判断空对象（`Object.keys` / `getOwnPropertyNames` / `Reflect.ownKeys` 几种方式与边界）。
- `javascript/dom-bom/events-and-storage`：如何判断页面滚动到底部（`scrollTop + innerHeight ≥ scrollHeight`，节流 / IntersectionObserver 优化）。
- `css/layout/layout-patterns`：左固定右自适应的多种实现（flex / grid / float+BFC / absolute / table）。
- `css/animation-interaction/transform-transition-animation`：transform vs transition vs animation 区别（**新建该分类首个文件**）。
- `vue/concepts/mvvm-and-framework-comparison`：MVVM/MVC 区别 + Vue vs React（**新建「概念与对比」子分类**）。
- `vue/concepts/vue2-vs-vue3`：Vue2/3 区别 + Vue3 性能为什么更好。
- `vue/component/lifecycle`：Vue 生命周期（选项式 / 组合式 / 父子顺序，**新建「组件」子分类**）。
- `vue/rendering/diff-and-key`：Vue2 双端比较 / Vue3 快速 diff + key 作用与无唯一 key 方案（入既有渲染机制）。

**已有，去重跳过**：浏览器渲染过程（performance/loading）、重绘与回流（css/rendering）、CSS 三角形（css/visual-effects/css-shapes）、0.5px 边框（css/responsive 移动端 1px）、自适应 grid 列表（css/layout/grid-layout 的 auto-fit）、DsBridge/JSBridge 原理（mobile/hybrid）、手写 Promise.all（handwritten 实现相同）、svg（html 已有选型）。

**跳过**：B 二面代码输出题（print 作用域、闭包、Promise+setTimeout、Generator yield 输出）→ 留语雀 14 代码输出篇（暂无 code-output/ 章节）；CTO 谈天、薪资与求职流程等 → 面经叙事，按无关信息跳过。

### 掘金 07（→ network/http/ajax-cors-cache）

**已补（5 个知识点）**：
- `network/http/ajax-cors-cache`：同源策略三种限制（DOM/Web 数据/网络）、简单请求 vs 预检请求判断条件、OPTIONS 预检请求流程（Request/Response 头字段）、access-control-max-age 缓存、凭证请求不能用通配符 `*`（三个头均需明确指定）、Webpack devServer proxy 原理（服务端转发绕过浏览器同源策略）。

**跳过**：无，07 核心全是 CORS 预检，已全量补入。

### 掘金 08（→ vue/ 多文件）

**已补（30 题 / 7 文件）**：
- `vue/component/lifecycle`：新增完整 14 钩子对照表（含 activated/deactivated/errorCaptured/renderTracked/renderTriggered/serverPrefetch）、更新 update/destroy 父子顺序。
- `vue/core/reactivity`（新建）：Vue 2 Object.defineProperty 缺点 vs Vue 3 Proxy 优势（代码示例）、nextTick 原理与使用场景、实例挂载流程（7步）、模板编译原理（parse→transform→generate）。
- `vue/component/directives-and-features`（新建）：data 为函数、v-show vs v-if（对比表）、computed vs watch（对比表）、v-if+v-for 不建议同用（Vue2/3 优先级差异）、Vue.$set、keep-alive（include/exclude/max/activated/deactivated）、mixin 及缺点、插槽（默认/具名/作用域）、Vue 修饰符（表单/事件/鼠标/键值）、v-model 原理（语法糖）、单向数据流。
- `vue/component/component-communication`（新建）：7 种组件通信方式（props/$emit/ref/provide-inject/EventBus-mitt/Vuex-Pinia/$attrs）+ 选型表。
- `vue/router/vue-router`（新建）：$router vs $route、路由传参（params/query/state）、hash vs history 模式（对比表+Nginx 配置）、动态路由（路径参数+运行时 addRoute）。
- `vue/state/vuex`（新建）：Vuex 核心概念（state/getters/mutation/action/module，含代码示例）、状态持久化（手动/vuex-persistedstate）。
- `vue/concepts/spa-ssr`（新建）：SPA vs MPA 对比表、Vue SSR 原理及优缺点、Vue 性能优化（代码层/懒加载/列表/打包层）。

**已有，去重跳过**：MVVM（mvvm-and-framework-comparison）、虚拟DOM 基础答（virtual-dom）、diff 算法（diff-and-key）、key 作用（diff-and-key）。

### 掘金 09（→ handwritten/common-implementations + algorithm/）

**已补（12 题新 + 1 题 algorithm）**：
- `javascript/handwritten/common-implementations`：setTimeout 模拟 setInterval（带 cancel）、并发限制 Scheduler class、LazyMan（链式任务队列）、版本号排序、Object.is 实现、大数相加、DOM2JSON、虚拟 DOM 转真实 DOM、分片渲染（requestAnimationFrame）、模板字符串解析、对象 flatten（DFS）、排序算法 5 种（冒泡/选择/插入/快排/归并）。
- `algorithm/dynamic-programming/fibonacci-and-dp`：零钱兑换实现（完全背包 DP，LeetCode 322）。

**已有，去重跳过**：compose（已有 koa 版）、EventEmitter（already 两版）、数组去重（6 解）、扁平化（已有）、六种继承、new/call/apply/bind（已有）、深拷贝（已有 Reflect.ownKeys+WeakMap 版本，与 09 版等价）、instanceof、柯里化、防抖节流、LRU、Promise 系列、ajax、二分查找（algorithm/array-and-search）、数组转树/树转数组（已有）。

### 掘金 10（→ javascript/language-basics/ + handwritten/）

**已补（9 题）**：
- `javascript/language-basics/array-and-iteration`（新建）：类数组 vs 真数组（转换 4 种方法）、forEach 如何中断（every/some/for...of）、判断数组包含某值（indexOf/includes/find/findIndex 对比）、数组 flat 5 种方法（flat/递归 reduce/while+some/栈迭代/JSON 序列化）、高阶函数注意事项（map/reduce/filter/sort）。
- `javascript/handwritten/common-implementations`：手写 push/pop、手写 splice（含边界参数处理）、手写 sort（V8 思路：≤10 插入/> 10 快排）、浅拷贝 5 种方式。

**已有，去重跳过**：手写 map/reduce/filter（line 486-546 已有简洁版，source10 按规范版重复）、手写 new/bind/call+apply（line 23-570 已有）、this 六场景（scope-closure-this 已极详尽）、深拷贝完整版（已有 WeakMap+Reflect.ownKeys 版）。

**修正 source 10 代码错误**：
- call 实现：`let context = context || window`（重声明参数 → SyntaxError）→ 改用 `context = context || window`（未写入文档，已用更好的现有版本）
- new 实现：`typoof` → `typeof`，`isObect` → `isObject`（拼写错误）
- map 实现：`KValue` → `kValue`（大小写错误）
- 深拷贝：`map.put` → `map.set`，`targe.constructor` → `target.constructor`（均为拼写错误）

## 变更历史

| 日期 | 变更内容 | 修改人 |
| --- | --- | --- |
| 2026-06-20 | 创建任务文档，建立 26 源 → 章节映射与同步规则 | Claude |
| 2026-06-20 | 处理掘金 01：手写题文件补 8 题，记录去重/跳过项 | Claude |
| 2026-06-20 | 修正 01 尺度：手写题改全收录，补至 22 题（补全 7 道外链经典题实现） | Claude |
| 2026-06-20 | 补数组去重 6 种解法、发布订阅 EventEmitter（多解原则），01 增至 24 题 | Claude |
| 2026-06-20 | 处理掘金 03·Part A：补现有文件缺口 15 题（JS 语言/执行/对象模型/异步 + 安全 CSP + 7 手写题） | Claude |
| 2026-06-20 | 处理掘金 03·Part B：新建 Node 子分类 4 文件 11 题，更新 config.mts sidebar 与 nodejs/index.md；标记 03 完成 | Claude |
| 2026-06-21 | 处理掘金 04：补 4 题（chunk / 引用比较 / 弹窗 / 斐波那契），新建 algorithm/ 章节，去重跳过 Q4/Q5/Q7/Q9，叙事跳过 Q10；标记 04 完成 | Claude |
| 2026-06-21 | 处理掘金 05：补 13 题（算法二分+洗牌、JS 空对象+滚动到底、CSS 左右布局+transform、Vue MVVM+Vue2/3+生命周期+diff/key），新建 algorithm/array-and-search、css/animation-interaction 首文件、vue 概念·组件子分类，更新 config.mts sidebar；CSS 三角形/0.5px/自适应grid 等去重跳过，代码输出题留语雀 14；标记 05 完成 | Claude |
| 2026-06-21 | 按源文深度回补 05 的 4 个 Vue 文件（之前过度精简）：MVVM/MVC 三分点详述+Vue vs React 8 维度、Vue2/3 六点+性能六点、生命周期 8 钩子时机+组合式钩子、diff 完整步骤+双端/单端表述+key 三段示例（落实同步规则 #1 保留答案要点） | Claude |
| 2026-06-21 | 删除正文中的采集来源标注（"本题整理自掘金《…》"等共 15 处，覆盖 01/03/04/05 所加内容），并改同步规则 #5：不再在正文标注采集来源 | Claude |
| 2026-06-23 | 处理掘金 02：抽取网络部分 4 题（HTTP 分层/长短连接 Keep-Alive/GET vs POST/状态码）新建 network/http/protocol-basics.md，更新 sidebar 与 network/index.md；Java/Android/JVM 主体跳过；标记 02 完成 | Claude |
| 2026-06-23 | 处理掘金 06：新建 git/git-workflow（2 题）、build-tools/webpack（12 题）、engineering/monorepo-and-package-manager（3 题），更新 build-tools sidebar、3 个 index.md；全量收录；标记 06 完成 | Claude |
| 2026-06-23 | 处理掘金 07：扩充 network/http/ajax-cors-cache（同源策略三限制/简单请求判断条件/OPTIONS 预检流程/凭证请求限制/devServer proxy 原理）；更新面试回答；标记 07 完成 | Claude |
| 2026-06-23 | 处理掘金 08：新建 vue/core/reactivity（响应式+nextTick+挂载+模板编译）、vue/component/directives-and-features（11 题）、vue/component/component-communication（组件通信）、vue/router/vue-router（4 题）、vue/state/vuex（Vuex+持久化）、vue/concepts/spa-ssr（SPA/SSR/性能优化）；更新 lifecycle.md（14 钩子对照表+update/destroy父子顺序）；更新 config.mts sidebar、vue/index.md；标记 08 完成 | Claude |
| 2026-06-23 | 处理掘金 09：向 common-implementations 补 12 题（setInterval/Scheduler/LazyMan/版本号排序/Object.is/大数相加/DOM2JSON/虚拟Dom→真实Dom/分片渲染/模板字符串解析/对象flatten/排序算法5种）；向 fibonacci-and-dp 补零钱兑换；去重跳过 16 题；标记 09 完成 | Claude |
| 2026-06-23 | 处理掘金 10：新建 javascript/language-basics/array-and-iteration（类数组/forEach中断/includes判断/flat6种/高阶函数）；向 common-implementations 补 push/pop/splice/sort(V8)/浅拷贝5种；去重跳过 map/reduce/filter/new/bind/call/this/深拷贝；修正源文件 5 处代码错误（未写入文档，用已有更好版本）；更新 JS sidebar + index.md；标记 10 完成 | Claude |
| 2026-06-23 | 语雀 01-03 确认跳过（非题目·meta 内容）；处理语雀 04 HTML：补 Q19 渐进增强/优雅降级对比表 → html/document-structure/web-standards.md，余 18 题全部去重；处理语雀 05 CSS：全量去重（1px/形状/布局/定位已覆盖），无新增；处理语雀 06 JS：全量去重（原型/闭包/Promise/异步/作用域均已覆盖），无新增；标记 01-06 完成，总进度 10→16 | Claude |
| 2026-06-23 | 处理语雀 07 Vue：扩充 vue-router（懒加载/导航守卫三类/完整解析顺序/router跳转vs location.href）；扩充 vuex（action vs mutation 区别/mutation不能异步原因/vs localStorage 对比/vs Redux 对比）；扩充 directives-and-features（computed vs methods/Vue2数组重写7法/v-cloak闪动）；扩充 vue2-vs-vue3（Composition API vs React Hook 对比）；其余约 50 题全部去重（响应式/diff/生命周期/组件通信/keep-alive/mixin/插槽等已覆盖）；标记 07 完成，总进度 16→17 | Claude |
| 2026-06-23 | 处理语雀 08 React：新建 react/components/class-and-function（类组件/函数组件/PureComponent/HOC/受控非受控/ref/Fragment/Portals/Fiber）、react/rendering/lifecycle（挂载/更新/卸载/错误四阶段/废弃钩子/getDerivedStateFromProps）、react/state/state-and-props（setState异步批量/state vs props/props只读/PropTypes）、react/components/communication（父子/跨级Context/非嵌套事件总线）、react/router/react-router（Hash vs Browser/Link vs a/路由参数/Switch）、react/state/redux（Redux工作流/thunk-saga异步/connect/中间件）、react/hooks/react-hooks（解决的3个问题/useState为何返回数组/Hooks限制/useEffect vs useLayoutEffect）；更新 virtual-dom（diff三策略/key/React vs Vue diff）；更新 events（合成事件委托机制/执行顺序陷阱）；去重约80题（虚拟DOM基础已覆盖）；标记 08 完成，总进度 17→18 | Claude |
| 2026-06-23 | 处理语雀 09 性能优化：新建 performance/loading/cdn-and-image-optimization（CDN三部分/作用/CNAME七步原理/使用场景、懒加载+data-src实现+IntersectionObserver+loading=lazy+vs预加载、图片格式七种对比表+优化手段）；跳过回流重绘（css/rendering已覆盖）/节流防抖（handwritten已覆盖）/Webpack优化（build-tools已覆盖）；更新 performance sidebar；标记 09 完成，总进度 18→19 | Claude |
| 2026-06-23 | 处理语雀 10 工程化：扩充 git/git-workflow（git vs SVN 对比表/git pull vs fetch 区别）；扩充 build-tools/webpack（webpack vs grunt-gulp/rollup-parcel 对比表/Loader执行从右到左/编写Loader-Plugin思路/单页多页配置/Babel三阶段原理）；去重：常用命令/merge-rebase/Loader-Plugin区别/构建流程/HMR/优化等均已覆盖；标记 10 完成，总进度 19→20 | Claude |
| 2026-06-23 | 处理语雀 11 计算机网络：新建 http-versions-and-features（HTTP版本/POST-PUT/请求方法/请求响应头/报文结构/URL/缓存头）、https-and-tls（HTTPS/TLS三算法/数字证书CA/握手5步/安全机制）、protocol/tcp-udp-and-dns（TCP-UDP对比/三次握手/四次挥手/DNS7步/OSI-TCP-IP模型）；更新 network sidebar 新增两分类；去重：GET/POST/状态码/OPTIONS/304/Keep-Alive/WebSocket/流量控制等已覆盖；标记 11 完成，总进度 20→21 | Claude |
| 2026-06-23 | 处理语雀 12 浏览器原理：新建 browser/processes/browser-processes-and-threads（进程vs线程对比/Chrome多进程架构5种/渲染进程5线程/GUI-JS互斥/单线程原因）；补充 web-security-and-cross-origin（网络劫持：DNS劫持/HTTP劫持+HTTPS防御）；补充 http-versions-and-features（F5/Ctrl+F5/地址栏回车对缓存的影响）；去重大量内容（XSS/CORS/缓存/浏览器内核/async-defer/存储/事件循环/事件委托/GC等均已覆盖）；更新 browser sidebar 新增进程与线程分类；标记 12 完成，总进度 21→22 | Claude |
| 2026-06-23 | 处理语雀 13 手写代码：向 common-implementations 补 5 题（Object.assign/日期格式化/URL参数解析/循环打印红黄绿三版/循环引用检测 WeakSet）；其余 54 题全部去重（基础类/数据处理类/高阶应用类与 01/09/03 及现有文件大量重叠）；标记 13 完成，总进度 22→23 | Claude |
| 2026-06-23 | 跳过语雀 14 代码输出篇：全为代码输出练习题（约 65 题，异步/this/作用域/原型四类），知识点均已在 event-loop/promise-async-await/scope-closure-this/prototype-and-inheritance 对应文档覆盖；练习题格式不适合参考文档结构；标记 14 ⏭️，总进度 23→24 | Claude |
| 2026-06-23 | 跳过语雀 16 LeetCode高频题目：纯刷题清单，无题目实现；algorithm/ 章节已由掘金 04/09 建立；标记 16 ⏭️，总进度 24→25（全部完成） | Claude |
| 2026-06-23 | 重审全部语雀笔记，修正跨章节错误 skip：(1) 语雀 09 性能优化篇——回流重绘/节流防抖被错误地以"css/rendering和handwritten已覆盖"为由跳过，实应属 performance 章节，已补入 performance/rendering/dom-and-page-performance；(2) 语雀 12 浏览器原理篇——browser-kernel.md 内容过于简略（原仅有3行表格+6步列表），已大幅扩充浏览器7部分组成/五大内核详细对比/渲染流程5步详述/CSS-JS阻塞说明 | Claude |
