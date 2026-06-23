# Vue 响应式原理与核心机制

### 理解路径

从数据劫持 → 依赖收集 → 派发更新，理解响应式的完整链路；再看 Vue 3 如何用 Proxy 弥补 Vue 2 的不足。

### Vue 基本原理（一句话）

> Vue 创建实例时，用 `Object.defineProperty`（Vue 3 改用 `Proxy`）把 `data` 中每个属性转为 getter/setter，并为每个属性维护一个依赖容器（Dep）；组件渲染时访问属性会触发 getter，把当前渲染 Watcher 注册为订阅者；属性被修改时触发 setter，通知所有订阅的 Watcher 重新计算，从而驱动组件更新。

### 响应式原理：Vue 2 vs Vue 3

**Vue 2 — `Object.defineProperty`**

对每个属性用 `getter`/`setter` 劫持读写，缺点明显：

- 必须在初始化时遍历所有属性，后续新增属性无法自动响应，需要 `Vue.set`
- 无法监听数组索引赋值（`arr[0] = 1`）和 `length` 变化，需要重写 7 个数组方法
- 初始化时递归遍历深层对象，性能损耗较大

**Vue 3 — `Proxy`**

代理整个对象，拦截所有操作（get/set/deleteProperty/has 等），优势：

- 无需遍历属性，代理整个对象
- 能自动检测属性新增和删除
- 能拦截数组索引赋值和 `length` 变更
- 惰性代理：只在访问嵌套对象时才代理（而不是初始化时递归全部）

```js
const handler = {
  get(target, key, receiver) {
    track(target, key) // 依赖收集
    const res = Reflect.get(target, key, receiver)
    return typeof res === 'object' ? reactive(res) : res // 惰性嵌套代理
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key) // 派发更新
    return result
  }
}
```

### 双向数据绑定的原理

**"双向"是什么意思？**

以这段代码为例：

```html
<input v-model="name" />
<p>你好，{{ name }}</p>
```

- **数据 → 视图**：在 JS 里修改 `this.name = '张三'`，`<p>` 里的文字自动变成"你好，张三"
- **视图 → 数据**：用户在输入框里打字，`this.name` 的值自动跟着变

**`v-model` 是语法糖**

`v-model` 本质上是两件事的组合：

```html
<!-- v-model 展开后等价于： -->
<input :value="name" @input="name = $event.target.value" />
```

- `:value="name"` — 数据绑定到视图（数据 → 视图）
- `@input="name = ..."` — 用户输入时更新数据（视图 → 数据）

Vue 自动完成这两个方向的同步，开发者只需要关心数据本身。

**内部响应式机制（如何实现自动同步）**

两个方向的自动同步依赖 Vue 的响应式系统实现，不同版本机制不同：

- Vue 2：基于 `Object.defineProperty` 的 Observer / Watcher 机制 → 见下方 [响应式原理：Vue 2 vs Vue 3](#响应式原理vue-2-vs-vue-3)
- Vue 3：基于 `Proxy` 的 track / trigger 机制 → 同上

### Vue 2 依赖收集：Dep 与 Watcher

Vue 2 响应式的"依赖收集 → 派发更新"链路由 **Dep** 和 **Watcher** 两个核心类协作完成：

- **Dep（依赖容器）**：每个响应式属性对应一个 Dep 实例，维护订阅了该属性的 Watcher 列表（`subs`）。`Dep.target` 是全局唯一的当前活跃 Watcher（静态属性，同一时间只有一个）。

- **Watcher（订阅者）**：每个组件渲染、computed、watch 对应一个 Watcher。

链路：

```
初始化
  ↓ defineReactive 为每个属性创建 dep = new Dep()

读取属性（getter 触发）
  ↓ Dep.target 存在（当前渲染 Watcher）
  ↓ dep.depend() → Dep.target.addDep(dep)
  ↓ dep.addSub(Dep.target)  ← Watcher 订阅这个 dep

修改属性（setter 触发）
  ↓ dep.notify()
  ↓ 遍历 subs，调用每个 Watcher.update()
  ↓ 触发组件重渲染 / computed 重算 / watch 回调
```

> 这就是为什么 Vue 2 能精准追踪"哪个组件用到了哪个属性"：渲染 Watcher 执行时设置 `Dep.target = this`，触发 getter 时自动完成订阅。

### data 变化后视图立即同步渲染吗

**不会**。Vue 的 DOM 更新是异步批量执行的。

侦听到数据变化时，Vue 开启一个队列，把同一事件循环内所有的数据变更都缓冲进来。同一个 Watcher 被多次触发，也只会被推入队列一次，避免重复计算和多余 DOM 操作。到下一个事件循环 tick 时，Vue 才刷新队列、执行实际 DOM 更新。

这就是 `$nextTick` 存在的原因——修改数据后若需要立即读取更新后的 DOM，必须把操作放到 `$nextTick` 回调里。

### nextTick

Vue 将同一个 tick 内的数据变更合并，批量更新 DOM（避免重复渲染）。`nextTick` 在 DOM 更新完成后的下一个微任务中执行回调：

```js
import { nextTick } from 'vue'

data.value = 'new'
// 此时 DOM 还没更新
await nextTick()
// 现在 DOM 已经更新完毕
console.log(document.getElementById('el').textContent)
```

内部实现优先级：`Promise.then` → `MutationObserver` → `setImmediate` → `setTimeout`（优先用微任务保证更快执行）。

**使用场景**：修改数据后需要立即读取更新后的 DOM，或在 `mounted` 前操作子组件 DOM。

### Vue 实例挂载过程

```
new Vue(options)
  ↓ _init()
  ↓ 初始化生命周期、事件、响应式数据（beforeCreate → created）
  ↓ $mount()
  ↓ 编译 template → render 函数（如果没有提前编译）
  ↓ 执行 render 函数 → 生成 VNode
  ↓ patch(null, vnode) → 创建真实 DOM
  ↓ mounted
```

关键步骤：
1. `beforeCreate` 时实例已存在但数据/方法尚未初始化
2. `created` 时数据/计算属性/方法就绪，但 DOM 还没生成
3. `mounted` 时 DOM 已生成，可以操作真实 DOM 或调用子组件方法

### 模板编译原理

模板字符串经过三步转换为 render 函数：

```
template 字符串
    ↓ parse（词法分析 + 语法分析）
AST（抽象语法树）
    ↓ transform/optimize（标记静态节点，Vue 3 添加 patchFlag）
优化后的 AST
    ↓ generate（代码生成）
render 函数（返回 VNode）
```

```js
// template: <div id="app">{{ msg }}</div>
// 编译后等价于：
function render() {
  return createVNode('div', { id: 'app' }, ctx.msg)
}
```

Vue 3 在编译阶段分析静态内容，添加 `patchFlag` 标记动态节点，运行时 diff 只比较带标记的节点，大幅减少比较量。

## 参考来源

- [Vue: 响应式原理](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)
- [Vue: nextTick](https://cn.vuejs.org/api/general.html#nexttick)
- [Vue: 渲染机制](https://cn.vuejs.org/guide/extras/rendering-mechanism.html)
