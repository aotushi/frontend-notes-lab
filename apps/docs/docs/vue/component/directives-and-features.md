# Vue 指令与组件特性

## 模板语法与指令

### Class 与 Style 动态绑定

`:class` 和 `:style`（`v-bind` 简写）都支持对象语法和数组语法，Vue 会自动处理类名拼接和样式合并。

**对象语法**：键是类名 / 样式属性，值为真时生效。

```html
<!-- class：对象的键为类名，值为布尔 -->
<div :class="{ active: isActive, 'text-danger': hasError }"></div>

<!-- style：键为 CSS 属性（驼峰或短横线），值为样式值 -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

**数组语法**：把多个类名 / 样式对象合并。

```html
<div :class="[isActive ? 'active' : '', errorClass]"></div>
<div :style="[baseStyles, overrideStyles]"></div>
```

两种语法可嵌套混用（数组里放对象）。`:class` 与普通 `class` 共存时会自动合并；`:style` 绑定中遇到需要前缀的属性（如 `transform`），Vue 会自动补全浏览器前缀。

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

### template 标签的作用

`<template>` 是一个不渲染真实 DOM 的逻辑包裹容器，用于在不引入多余元素的前提下组织模板：

- 配合 `v-if` / `v-for` 包裹**多个**元素，条件或循环只写一次，且不产生额外包裹标签：

```html
<template v-if="loggedIn">
  <h1>欢迎</h1>
  <p>已登录</p>
</template>
```

- 配合 `v-slot` 声明具名插槽和作用域插槽内容：`<template #header>`、`<template #default="{ item }">`。
- 单文件组件最外层的 `<template>` 则是整个组件的根模板，性质不同（它定义组件的渲染内容）。

> `v-show` 不能用在 `<template>` 上（没有真实元素可切换 `display`），需要条件隐藏多个元素时用 `v-if`。

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

### 过滤器（Vue 2）

过滤器用于文本格式化，可用在插值和 `v-bind` 中，以管道符 `|` 连接，从左到右依次执行：

```html
{{ message | capitalize }}
<div :id="rawId | formatId"></div>
```

```js
// 局部过滤器（组件选项），全局用 Vue.filter('name', fn)
filters: {
  capitalize: (val) => val ? val[0].toUpperCase() + val.slice(1) : ''
}
```

常见于单位换算、千分位、时间格式化等场景。

> **Vue 3 已移除过滤器**，官方建议改用计算属性或方法替代，在插值中直接调用方法（如 `capitalize(message)`）。理由是过滤器是一套额外的私有语法，用普通 JS 函数表达更直观，也更利于类型推导。

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

**三种类型对比**：

| 类型 | 子组件写法 | 父组件写法 | 父组件能访问子组件数据 |
| --- | --- | --- | --- |
| 默认插槽 | `<slot>` | 直接写内容 | 否 |
| 具名插槽 | `<slot name="x">` | `<template #x>` | 否 |
| 作用域插槽 | `<slot :data="val">` | `<template #x="{ data }">` | 是 |

```html
<!-- 作用域插槽：子组件暴露数据，父组件控制渲染 -->

<!-- 子组件 DataList.vue -->
<ul>
  <li v-for="item in items" :key="item.id">
    <slot :item="item" />
  </li>
</ul>

<!-- 父组件 -->
<DataList>
  <template #default="{ item }">
    <span>{{ item.name }}</span>
  </template>
</DataList>
```

**作用域插槽的原理**

作用域插槽本质上是一个**函数**。模板编译后，父组件侧的插槽内容被编译成一个以 slot props 为参数、返回 VNode 的函数，传给子组件；子组件渲染时调用这个函数，同时把自己的数据作为参数传入：

```js
// 父组件编译产物（伪代码）
h(DataList, null, {
  default: ({ item }) => h('span', item.name)  // 父定义函数
})

// 子组件调用插槽时传入数据
slots.default({ item: this.currentItem })
```

所以父组件能访问子组件数据，不是"反向取值"，而是子组件主动把数据作为参数"推送"给父组件定义的函数。

**Vue 2 → Vue 3 API 变化**

| | Vue 2（旧） | Vue 2.6+ / Vue 3 |
| --- | --- | --- |
| 具名插槽 | `slot="header"` | `#header` / `v-slot:header` |
| 作用域插槽 | `slot-scope="{ item }"` | `#default="{ item }"` |
| JS 访问插槽 | `$slots`（VNode 数组）+ `$scopedSlots`（函数） | `$slots` 统一为函数，`$scopedSlots` 已移除 |

Vue 3 中所有插槽都是函数，访问方式统一为 `this.$slots.default()`（注意加括号调用）。

**Vue 3 插槽改为函数的性能提升**

Vue 2 的普通插槽是预渲染的 VNode 数组，父组件重渲染时会强制子组件也重渲染。Vue 3 将所有插槽改为函数后：

1. **懒执行**：插槽只在子组件渲染时才调用，父组件渲染阶段不求值
2. **依赖归属子组件**：插槽内容的响应式依赖由子组件收集，数据变化只触发子组件更新，不影响父组件
3. **父组件重渲染不污染子组件**：只要插槽函数引用稳定，子组件可跳过更新

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

自定义组件实现 `v-model`（Vue 3）——完整父子示例：

```vue
<!-- 子组件 MyInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
```

```vue
<!-- 父组件 -->
<template>
  <p>当前值：{{ username }}</p>
  <MyInput v-model="username" />
</template>

<script setup>
import { ref } from 'vue'
import MyInput from './MyInput.vue'

const username = ref('张三')
</script>
```

父组件写 `v-model="username"` 等价于：

```html
<MyInput :modelValue="username" @update:modelValue="username = $event" />
```

子组件用 `:value` 绑定显示值，输入时通过 `emit('update:modelValue', ...)` 通知父组件更新，数据始终由父组件持有，符合单向数据流。

**多个 v-model（Vue 3 支持）**：

```vue
<!-- 父组件 -->
<UserForm v-model:name="name" v-model:age="age" />

<!-- 子组件 UserForm.vue -->
<script setup>
defineProps(['name', 'age'])
const emit = defineEmits(['update:name', 'update:age'])
</script>
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

### 插件与 Vue.use

插件用于给 Vue 添加**全局级**能力，常见用途：注册全局组件 / 指令、挂载全局方法或属性、注入全局混入、提供一整套库的 API（Vue Router、Pinia 本身都是插件）。

**定义**：插件是一个带 `install` 方法的对象，或一个本身就是 `install` 的函数。`install` 接收 app 实例（Vue 3）/ Vue 构造函数（Vue 2）和可选的选项对象：

```js
// 把一批自定义指令打包成插件
const directives = { copy, permission, throttle }

export default {
  install(app, options) {
    Object.keys(directives).forEach(key => {
      app.directive(key, directives[key]) // Vue 2 为 Vue.directive
    })
  }
}
```

**使用**：`app.use()`（Vue 3）/ `Vue.use()`（Vue 2）会自动调用插件的 `install`，并把 app / Vue 作为实参传入，需在创建应用之前完成：

```js
import { createApp } from 'vue'
import MyPlugin from './my-plugin'

createApp(App).use(MyPlugin, { someOption: true }).mount('#app')
```

> `use` 会自动阻止同一个插件重复注册。Vue 2 插件常通过 `Vue.prototype.$xxx` 挂载实例方法，Vue 3 改为 `app.config.globalProperties.$xxx`。

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

按场景选方案：

| 场景 | 推荐方案 |
| --- | --- |
| 同一 session 内来回切换，不需要刷新后保留 | `keep-alive` |
| 状态需要出现在 URL、可分享/可书签 | URL query 参数 |
| 跨页面共享、刷新后仍保留 | Pinia + 持久化插件 |
| 组件级别简单持久化 | `useStorage`（VueUse） |

**1. keep-alive（首选，适合列表/表单来回跳转）**

```html
<!-- App.vue 或布局组件 -->
<router-view v-slot="{ Component, route }">
  <keep-alive :include="cachedViews">
    <component :is="Component" :key="route.path" />
  </keep-alive>
</router-view>
```

```js
// 路由 meta 标记哪些页面需要缓存
{ path: '/list', component: List, meta: { keepAlive: true } }
```

```js
// 组件内用 onActivated / onDeactivated 处理缓存激活逻辑
import { onActivated } from 'vue'

onActivated(() => {
  // 从缓存恢复时执行（例如检查数据是否需要刷新）
})
```

**2. URL query 参数（状态可分享、可书签）**

```js
// 把筛选条件、分页等同步到 URL
const router = useRouter()
const route = useRoute()

// 写入
router.replace({ query: { page: 2, keyword: 'vue' } })

// 读取（刷新后仍能恢复）
const page = computed(() => Number(route.query.page) || 1)
const keyword = computed(() => route.query.keyword || '')
```

适合搜索页、列表筛选等需要支持分享链接或浏览器回退的场景。

**3. Pinia + pinia-plugin-persistedstate（跨页面持久化）**

```js
// stores/list.js
import { defineStore } from 'pinia'

export const useListStore = defineStore('list', {
  state: () => ({ scrollY: 0, filters: {} }),
  persist: true  // 自动同步到 localStorage
})
```

```js
// 组件内
const store = useListStore()

onBeforeUnmount(() => {
  store.scrollY = window.scrollY  // 离开前保存滚动位置
})

onMounted(() => {
  window.scrollTo(0, store.scrollY)  // 回来时恢复
})
```

**4. useStorage（VueUse，轻量单组件持久化）**

```js
import { useStorage } from '@vueuse/core'

// 自动读写 localStorage，ref 用法完全一致
const filters = useStorage('list-filters', { status: 'all', page: 1 })
```

值变化时自动写入 localStorage，页面刷新后自动读取恢复，无需手动监听。

### 自定义指令

除了 `v-model`、`v-show` 等内置指令，Vue 允许注册自定义指令，适合需要**直接操作 DOM** 的底层场景（自动聚焦、权限控制、一键复制等）。推荐只用来操作 DOM 展示，不在指令内修改组件数据。

#### 指令的几种用法

```html
<div v-xxx />                            <!-- 实例化指令，无参数无值 -->
<div v-xxx="value" />                    <!-- 传入变量值 -->
<div v-xxx="'string'" />                 <!-- 传入字符串字面量 -->
<div v-xxx:arg="value" />               <!-- 传参数（arg），如 v-bind:class -->
<div v-xxx:arg.modifier="value" />      <!-- 传参数 + 修饰符 -->
```

**传对象值：**

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
Vue.directive('demo', function(el, binding) {
  console.log(binding.value.color)  // "white"
  console.log(binding.value.text)   // "hello!"
})
```

#### 注册方式

**全局注册（Vue 2）：**

```js
// 对象写法（推荐，可精细控制每个钩子）
Vue.directive('focus', {
  inserted(el) { el.focus() }
})

// 函数简写（等同于同时设置 bind 和 update）
Vue.directive('color', function(el, binding) {
  el.style.color = binding.value
})
```

**全局注册（Vue 3）：**

```js
// Vue 3 通过 app 实例注册，更符合模块化设计
app.directive('focus', {
  mounted(el) { el.focus() }
})

// 函数简写（等同于同时设置 mounted 和 updated）
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

**局部注册（Options API）：**

```js
export default {
  directives: {
    focus: {
      inserted(el) { el.focus() }  // Vue 2
      // mounted(el) { el.focus() }  // Vue 3
    }
  }
}
```

**局部注册（Vue 3 script setup）：**

```vue
<script setup>
// 以 v 开头的变量自动被识别为指令，无需显式注册
const vFocus = {
  mounted(el) { el.focus() }
}
</script>

<template>
  <input v-focus />
</template>
```

**批量注册（Vue.use 插件模式）：**

```js
// directives/index.js
import copy from './copy'
import permission from './permission'
import throttle from './throttle'

const directives = { copy, permission, throttle }

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
```

```js
// main.js
import Directives from './directives'
Vue.use(Directives)  // 一次注册所有自定义指令
```

#### 钩子函数（Vue 2 → Vue 3）

| Vue 2 | Vue 3 | 触发时机 |
| --- | --- | --- |
| —— | `created` | Vue 3 新增，元素属性/事件绑定前 |
| `bind` | `beforeMount` | 指令绑定到元素，DOM 还未插入 |
| `inserted` | `mounted` | 元素已插入父节点 |
| `update` | `beforeUpdate` | 组件 VNode 更新前（Vue 3 拆分自 update） |
| `componentUpdated` | `updated` | 组件及子组件 VNode 全部更新后 |
| `unbind` | `unmounted` | 指令与元素解绑 |

Vue 3 钩子名与组件生命周期对齐，Vue 2 的 `update` 被拆分为 `beforeUpdate` + `updated`。

#### 钩子参数详解

所有钩子函数接收同样的参数（**除 `el` 外其余参数均为只读**）：

```js
app.directive('demo', {
  mounted(el, binding, vnode) {
    el          // 指令绑定的 DOM 元素，可直接操作
    binding.name        // 指令名称，不含 v- 前缀，如 "demo"
    binding.value       // 绑定值，如 v-demo="1+1" 则为 2
    binding.oldValue    // 更新前的值，仅 beforeUpdate/updated 中可用
    binding.expression  // 字符串形式的表达式，如 "1+1"（Vue 2 only）
    binding.arg         // 传给指令的参数，如 v-demo:top 则为 "top"
    binding.modifiers   // 修饰符对象，如 v-demo.foo.bar 则为 { foo: true, bar: true }
    binding.instance    // Vue 3 新增，指向组件实例（替代 Vue 2 的 vnode.context）
  }
})
```

> 如需在钩子之间共享数据，建议通过 `el.dataset` 存储，而非直接在 `el` 上挂属性。

#### Vue 2 vs Vue 3 主要差异

| 差异点 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 全局注册 | `Vue.directive()` | `app.directive()` |
| 钩子名称 | bind / inserted / update / componentUpdated / unbind | beforeMount / mounted / beforeUpdate / updated / unmounted（新增 created） |
| 钩子参数 | `(el, binding, vnode, oldVnode)` | `(el, binding, vnode)` — 移除 oldVnode，binding 新增 instance |
| 局部注册 | `directives: {}` 选项 | 同左 + script setup 中 `vXxx` 变量 |
| 函数简写 | 对应 `bind + update` | 对应 `mounted + updated` |

#### 实战示例：一键复制（v-copy）

使用 `textarea` 降级方案，兼容不支持 `navigator.clipboard` 的环境：

```js
const vCopy = {
  bind(el, { value }) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) return
      const textarea = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.cssText = 'position:absolute;left:-9999px'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('Copy')
      document.body.removeChild(textarea)
      console.log('复制成功：', el.$value)
    }
    el.addEventListener('click', el.handler)
  },
  componentUpdated(el, { value }) {
    el.$value = value  // 值更新时同步
  },
  unbind(el) {
    el.removeEventListener('click', el.handler)
  }
}
```

```html
<button v-copy="shareUrl">一键复制</button>
```

#### 实战示例：防止表单重复提交（v-throttle）

```js
Vue.directive('throttle', {
  bind(el, binding) {
    const delay = binding.value || 2000
    let timer = null
    el.addEventListener('click', event => {
      if (timer) {
        event.stopImmediatePropagation()  // 阻止后续处理器执行
        return
      }
      timer = setTimeout(() => { timer = null }, delay)
    }, true)  // 捕获阶段处理，优先于业务事件
  }
})
```

```html
<button v-throttle="1000" @click="submitForm">提交</button>
```

#### 实战示例：权限控制（v-permission）

```js
app.directive('permission', {
  mounted(el, binding) {
    const userRoles = store.state.user.roles
    if (!userRoles.includes(binding.value)) {
      el.parentNode?.removeChild(el)  // 无权限直接移除 DOM
    }
  }
})
```

```html
<button v-permission="'admin'">删除用户</button>
```

#### 使用场景

| 场景 | 指令 |
| --- | --- |
| 自动聚焦输入框 | `v-focus` |
| 表单防重复提交 | `v-throttle` |
| 一键复制文本 | `v-copy` |
| 按钮权限控制 | `v-permission` |
| 图片懒加载 | `v-lazy`（IntersectionObserver） |
| 水印添加 | `v-watermark` |
| 长按触发事件 | `v-longpress` |
| 集成第三方 DOM 插件 | 任意自定义指令 |

## 组件样式

### scoped 样式原理

`<style scoped>` 让 CSS 只作用于当前组件，避免样式跨组件污染。原理是编译期改写：

1. 为组件内每个元素添加一个唯一属性，如 `data-v-f3f3eg9`（同一组件共用一个）。
2. 把每条选择器改写成带该属性选择器的形式：

```css
/* 源码 */
.example { color: red; }
/* 编译后 */
.example[data-v-f3f3eg9] { color: red; }
```

这样选择器只能命中带对应属性的元素，实现样式隔离。

**边界**：`scoped` 不能阻止子组件的**根元素**被父组件样式影响——子组件根节点会同时带有父、子两个组件的 `data-v` 属性。这是有意设计，方便父组件从布局角度调整子组件根元素。

### 深度选择器 :deep()

`scoped` 下父组件无法直接给子组件内部元素（或第三方组件、`v-html` 生成的内容）写样式，因为这些元素不带父组件的 `data-v` 属性。深度选择器用于穿透这层隔离：

```vue
<style scoped>
/* Vue 3 推荐写法 */
.parent :deep(.child-inner) {
  color: red;
}
</style>
```

`:deep(.child-inner)` 编译后把 `data-v` 属性提到前面（`.parent[data-v-xxx] .child-inner`），从而命中子组件内部元素。

> 旧语法 `>>>`、`/deep/`、`::v-deep` 已废弃，Vue 3 + 现代构建工具统一用 `:deep()`。配套的还有 `:slotted()`（作用于插槽内容）和 `:global()`（声明全局样式）。

## 参考来源

- [Vue: 计算属性](https://cn.vuejs.org/guide/essentials/computed.html)
- [Vue: 类与样式绑定](https://cn.vuejs.org/guide/essentials/class-and-style.html)
- [Vue: 插件](https://cn.vuejs.org/guide/reusability/plugins.html)
- [Vue: SFC 样式特性（scoped / :deep）](https://cn.vuejs.org/api/sfc-css-features.html)
- [Vue: 侦听器](https://cn.vuejs.org/guide/essentials/watchers.html)
- [Vue: 插槽](https://cn.vuejs.org/guide/components/slots.html)
- [Vue: keep-alive](https://cn.vuejs.org/guide/built-ins/keep-alive.html)
- [Vue: 自定义指令](https://cn.vuejs.org/guide/reusability/custom-directives.html)
