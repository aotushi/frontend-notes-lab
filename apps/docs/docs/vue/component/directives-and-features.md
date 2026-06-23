# Vue 指令与组件特性

## 模板语法与指令

### v-show vs v-if

| 对比 | v-show | v-if |
| --- | --- | --- |
| 实现方式 | CSS `display: none`，DOM 保留 | 真实 DOM 销毁/重建 |
| 初始渲染 | 始终渲染 | `false` 时不渲染（节省初始开销） |
| 切换开销 | 小（只改样式） | 大（销毁/重建 DOM 和子组件） |
| 适合场景 | 频繁切换 | 条件极少改变 |
| template 支持 | 不支持 | 支持（不渲染包裹元素） |

### v-if 和 v-for 不建议同用

- **Vue 2**：`v-for` 优先级高于 `v-if`，会先循环再判断，浪费性能
- **Vue 3**：`v-if` 优先级高于 `v-for`，`v-if` 里访问不到 `v-for` 的 `item` 变量，会报错

```html
<!-- ❌ 错误用法 -->
<li v-for="item in list" v-if="item.active" :key="item.id">

<!-- ✅ 正确做法 1：computed 过滤 -->
<li v-for="item in activeList" :key="item.id">

<!-- ✅ 正确做法 2：v-if 移到外层 -->
<template v-if="list.length">
  <li v-for="item in list" :key="item.id">
</template>
```

### Vue 修饰符

**表单修饰符**：
- `.lazy`：失去焦点时更新（而非 input 事件）
- `.number`：自动转为数字
- `.trim`：过滤首尾空格

**事件修饰符**：
- `.stop`：`stopPropagation()`，阻止冒泡
- `.prevent`：`preventDefault()`，阻止默认行为
- `.once`：只触发一次
- `.capture`：在捕获阶段触发
- `.self`：只在事件目标是自身时触发
- `.passive`：不调用 `preventDefault()`，提升滚动性能

**按键修饰符**：`.enter` / `.esc` / `.ctrl` / `.alt` / `.shift` 等

### v-cloak 解决页面闪动

Vue 实例编译完成前，`{{ }}` 模板表达式会以原始字符串显示（"闪动"）。`v-cloak` 配合 CSS 可在编译完成前隐藏节点：

```css
[v-cloak] { display: none; }
```

```html
<div v-cloak>{{ message }}</div>
```

Vue 实例挂载完成后自动移除 `v-cloak` 属性，元素恢复显示。

### template vs JSX

两者都是 `render` 函数的表现形式：

- `template`：由 `vue-loader` 调用 `vue-template-compiler` 在构建时预编译为 `render` 函数
- JSX：通过 `babel-plugin-transform-vue-jsx` 解析，直接手写 `render` 函数

| | template | JSX |
| --- | --- | --- |
| 灵活性 | 受限（指令语法固定） | 高（完整 JS 表达力） |
| 可读性 | 更直观，结构接近 HTML | 需要熟悉 JSX 语法 |
| 适合场景 | 视图逻辑简单，遵循视图/逻辑分离 | 复杂动态渲染逻辑、高阶组件 |
| 维护性 | 更易维护 | 灵活但混合逻辑增加复杂度 |

## 组件特性

### data 为什么是函数

组件是可复用的，如果 `data` 是对象，所有实例共享同一个对象引用，一处修改会影响所有实例。`data` 是函数则每次调用返回新对象，各实例互相独立。

Vue 根实例（`new Vue()`）只有一个，`data` 可以是对象；组件定义时必须是函数。

### keep-alive

`<keep-alive>` 包裹的动态组件会被缓存（不销毁），切换时保留组件状态：

```html
<keep-alive :include="['CompA']" :max="5">
  <component :is="currentComp" />
</keep-alive>
```

- `include`：缓存哪些组件（组件 name）
- `exclude`：排除哪些组件
- `max`：最多缓存几个组件（LRU 淘汰）

被 keep-alive 缓存的组件有两个专属生命周期钩子：
- `activated`：从缓存中激活时执行（每次展示都执行）
- `deactivated`：被缓存停用时执行

### mixin

mixin 把可复用逻辑（data / methods / 生命周期钩子等）混入组件：

```js
const logMixin = {
  mounted() { console.log('mounted') },
  methods: { log() {} }
}

export default {
  mixins: [logMixin]
}
```

**缺点**（Vue 3 推荐用 Composition API 代替）：
1. **数据来源不清晰**：不知道 `this.xxx` 来自哪个 mixin
2. **命名冲突**：多个 mixin 定义相同属性时难以预测结果
3. **隐式依赖**：mixin 之间可能相互依赖，维护困难

### 插槽

| 类型 | 语法（组件内） | 使用方 | 用途 |
| --- | --- | --- | --- |
| 默认插槽 | `<slot>默认内容</slot>` | 组件标签内的内容 | 内容占位 |
| 具名插槽 | `<slot name="header">` | `<template v-slot:header>` | 多个位置 |
| 作用域插槽 | `<slot :item="item">` | `<template v-slot="{ item }">` | 父组件访问子组件数据 |

```html
<!-- 子组件 -->
<template>
  <slot :user="currentUser">默认内容</slot>
</template>

<!-- 父组件 -->
<Child v-slot="{ user }">
  <span>{{ user.name }}</span>
</Child>
```

### v-model 原理

`v-model` 是语法糖，等价于绑定值 + 监听输入事件：

```html
<!-- Vue 2 -->
<input v-model="msg">
<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value">

<!-- Vue 3 -->
<MyInput v-model="msg">
<!-- 等价于 -->
<MyInput :modelValue="msg" @update:modelValue="msg = $event">
```

自定义组件实现 `v-model`（Vue 3）：

```js
// 子组件接收 modelValue，emit update:modelValue
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

// 输入时
emit('update:modelValue', newValue)
```

### 子组件能否直接修改父组件数据

不建议。Vue 的单向数据流要求父 → 子通过 `props` 传递，子 → 父通过 `$emit` 通知。直接修改 `props` 会触发 Vue 警告。

如果 `prop` 是对象/数组，修改其内部属性虽然不报错，但破坏了数据流向，维护困难。正确做法：

```js
// 子组件 emit 事件
emit('update:title', newValue)

// 父组件监听
<Child :title="title" @update:title="title = $event">
// 或用 v-model
<Child v-model:title="title">
```

### mixin / extends 的覆盖逻辑

两者都通过 `mergeOptions` 合并选项：

- **mixins**：接收混入对象数组，生命周期钩子在组件自身钩子**之前**调用，多个 mixin 按传入顺序依次执行。
- **extends**：接收单个对象或构造函数，为单文件组件提供继承扩展。

`mergeOptions` 执行过程：先递归处理 `extends`，再遍历 `mixins` 数组，最后按选项类型逐一合并：

```js
if (child.extends) parent = mergeOptions(parent, child.extends, vm)
if (child.mixins) child.mixins.forEach(m => parent = mergeOptions(parent, m, vm))
```

**各类选项合并策略**：

| 选项类型 | 合并策略 |
| --- | --- |
| `data` | 合并成函数，同名 key 以**组件为准** |
| 生命周期钩子 | 合并为数组，**mixin 先执行** |
| `methods / computed / components` | 对象合并，同名时**组件覆盖 mixin** |
| `watch` | 合并为数组，mixin 的先触发 |

### Vue.extend

Vue 2 API，作用是扩展组件生成一个构造器，通常与 `$mount` 配合使用（极少场景用到）：

```js
// 创建组件构造器并挂载
const Component = Vue.extend({
  template: '<div>test</div>'
})
new Component().$mount('#app')

// 扩展已有组件
const SuperComponent = Vue.extend(Component)
new SuperComponent({ created() { console.log('extended') } }).$mount('#app')
```

Vue 3 中已移除 `Vue.extend`，推荐直接用 `defineComponent` + `createApp`。

## 响应式原理

### Vue 2 `$set`

Vue 2 无法检测对象属性的**新增**（`this.obj.newKey = 1` 不触发响应）和**删除**，需要：

```js
this.$set(this.obj, 'newKey', value)   // 新增响应式属性
Vue.set(this.obj, 'newKey', value)     // 等价
this.$delete(this.obj, 'key')          // 删除响应式属性
```

Vue 3 用 Proxy 代理整个对象，直接赋值即可触发响应，不再需要 `$set`。

### Vue 2 数组方法重写

Vue 2 通过 `Object.defineProperty` 监听属性，但无法探测数组下标变动。为此 Vue 2 内部对以下 7 个方法进行了重写，操作后会额外触发响应式更新：

`push` / `pop` / `shift` / `unshift` / `splice` / `sort` / `reverse`

**不能触发响应式的操作：**

```js
this.list[0] = 'new value' // 直接赋值下标 → 不触发更新
this.list.length = 0       // 直接改 length → 不触发更新
```

解决方案：

```js
this.$set(this.list, 0, 'new value') // Vue.set
this.list.splice(0, 1, 'new value')  // 用已重写的 splice
```

Vue 3 使用 Proxy，上述问题不再存在。

### delete 和 Vue.delete 删除数组的区别

- **`delete`**：被删除元素变为 `empty/undefined`，数组长度不变，后续元素位置不移动。**不触发 Vue 响应式更新**。
- **`Vue.delete`（`this.$delete`）**：直接删除元素，长度减一，后续元素下标前移。**会触发响应式更新**。

```js
const arr = [1, 2, 3]

delete arr[1]        // arr: [1, empty, 3]  length 仍为 3，视图不更新
this.$delete(arr, 1) // arr: [1, 3]          length 变为 2，视图更新
```

Vue 3 用 Proxy 代理，直接删除元素即可触发响应，无此问题。

### 如何监听对象或数组某个属性的变化

Vue 2 中，直接给数组下标赋值（`arr[0] = x`）或给对象新增属性（`obj.newKey = x`）不会触发响应式更新，`Object.defineProperty` 无法拦截这些操作。

**三种解决方案**：

1. **`this.$set`（`Vue.set`）**：
```js
this.$set(this.arr, 0, 'newValue')    // 修改数组指定位置
this.$set(this.obj, 'newKey', value)  // 新增对象响应式属性
```

2. **数组变异方法**（Vue 已重写，调用后自动触发更新）：
```js
this.arr.splice(0, 1, 'newValue')  // 替换指定位置
this.arr.push(...)                 // 末尾添加
```

3. **`$watch` 深层监听**：
```js
watch: {
  obj: { handler(val) { /* ... */ }, deep: true }
}
```

> `$set` 内部：目标是数组时调用 `splice`；目标是对象时调用 `defineReactive` 添加 getter/setter。Vue 3 用 Proxy 直接赋值即可响应，不再需要 `$set`。

## 计算与侦听

### computed vs watch

| 对比 | computed | watch |
| --- | --- | --- |
| 用途 | 从已有状态派生新值 | 监听数据变化执行副作用 |
| 缓存 | 依赖不变时不重新计算 | 每次变化都执行 |
| 异步 | 不支持 | 支持（可在回调里发请求） |
| 返回值 | 必须有 | 不需要 |
| 适合 | 多个变量合并成一个值 | 一个变量变化触发多个操作 |

```js
// computed：根据 firstName + lastName 计算 fullName
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// watch：监听 query 变化发起搜索请求
watch(query, async (newVal) => {
  results.value = await search(newVal)
})
```

### computed vs methods

两者都能基于其他数据计算出一个值，区别在于缓存：

| | computed | methods |
| --- | --- | --- |
| 缓存 | 有。依赖不变则不重新计算 | 无。每次渲染都执行 |
| 返回值 | 必须有 | 可选 |
| 能否带参数 | 不能（可通过返回函数间接实现） | 能 |
| 适用场景 | 模板中频繁使用的派生值 | 事件处理、副作用操作 |

```js
computed: {
  fullName() { return this.first + ' ' + this.last } // 依赖不变则走缓存
},
methods: {
  getFullName() { return this.first + ' ' + this.last } // 每次调用都执行
}
```

## 渲染优化与复用

### 如何保存页面的当前状态

分两种情况：组件会被卸载 vs 不会被卸载。

**组件会被卸载时**：
1. **LocalStorage / SessionStorage**：在 `beforeDestroy` 钩子中把状态序列化存入 Storage，组件重建时读取恢复。需要加 `flag` 字段控制是否读取缓存（避免从其他页面进入时读到旧数据）。
2. **路由 state 传参**：`router.push({ state: { ... } })` 携带数据，通过 `history.state` 读取，不污染 URL，支持 Date/RegExp 等复杂类型。

**组件不会被卸载时**：

用 `<keep-alive>` 包裹路由组件，切换时保留状态，通过 `activated` / `deactivated` 钩子处理刷新逻辑：

```html
<keep-alive>
  <router-view v-if="$route.meta.keepAlive" />
</keep-alive>
```

```js
// 路由配置
{ path: '/list', component: List, meta: { keepAlive: true } }
```

> keep-alive 适合回来无需重新请求的列表页；localStorage 适合跨会话持久化；路由 state 适合仅从前一页跳转时传递数据。

### 自定义指令

当需要对普通 DOM 元素进行底层操作时，可以使用自定义指令。组件是 Vue 代码复用的主要形式，自定义指令是对组件的有效补充，适合直接操作 DOM 展示的场景（不建议在指令内修改数据）。

**定义方式：**

```js
// 全局定义
Vue.directive('focus', {
  inserted(el) { el.focus() }
})

// 局部定义（组件选项）
export default {
  directives: {
    focus: {
      inserted(el) { el.focus() }
    }
  }
}
```

**Vue 2 钩子函数（5 个）：**

| 钩子 | 触发时机 |
| --- | --- |
| `bind` | 指令第一次绑定到元素时，只调用一次（做初始化设置） |
| `inserted` | 被绑定元素插入父节点时（父节点存在但不一定在文档中） |
| `update` | 所在组件的 VNode 更新时（值可能未变，可比较前后值忽略不必要更新） |
| `componentUpdated` | 指令所在组件 VNode 及子 VNode 全部更新后 |
| `unbind` | 指令与元素解绑时，只调用一次 |

> Vue 3 将钩子名称改为 `created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`beforeUnmount`、`unmounted`，与组件生命周期对齐。

**钩子参数：**`el`（绑定元素）、`binding`（对象，含 `name`/`value`/`oldValue`/`expression`/`arg`/`modifiers`）、`vnode`、`oldVnode`

**使用场景：**
- 鼠标自动聚焦、下拉菜单控制、相对时间转换、滚动动画
- 图片懒加载（IntersectionObserver 配合自定义指令）
- 集成需要直接操作 DOM 的第三方插件

## 参考来源

- [Vue: 计算属性](https://cn.vuejs.org/guide/essentials/computed.html)
- [Vue: 侦听器](https://cn.vuejs.org/guide/essentials/watchers.html)
- [Vue: 插槽](https://cn.vuejs.org/guide/components/slots.html)
- [Vue: keep-alive](https://cn.vuejs.org/guide/built-ins/keep-alive.html)
- [Vue: 自定义指令](https://cn.vuejs.org/guide/reusability/custom-directives.html)
