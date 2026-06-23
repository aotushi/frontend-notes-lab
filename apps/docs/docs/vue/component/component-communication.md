# Vue 组件通信

### 理解路径

按关系分类：父子通信、兄弟通信、跨层级通信、全局状态。从最简单的 props/$emit 出发，按复杂度递增选择方案。

### 父子组件通信

**props / $emit**（最常用）：

```js
// 父 → 子：props
<Child :title="title" />

// 子 → 父：$emit
emit('close', data)
// 父监听：<Child @close="handleClose">
```

**ref**（父访问子实例）：

```html
<Child ref="childRef" />
```

```js
// Vue 3 Composition API
const childRef = ref(null)
childRef.value.someMethod()
```

**v-model**（双向绑定语法糖）：适合表单类子组件，本质是 `:modelValue` + `@update:modelValue`。

### 祖先-后代跨层级通信

**provide / inject**：祖先组件提供数据，任意深度后代组件注入，无需逐层传递：

```js
// 祖先组件
provide('theme', ref('dark'))

// 后代组件（任意层级）
const theme = inject('theme')
```

适合配置、主题等跨层级共享，但数据流向不够透明，慎用于复杂业务。

### 兄弟 / 无关组件通信

**全局事件总线（Vue 2）**：

```js
// Vue 2：new Vue() 作为 EventBus
Bus.$emit('event', data)
Bus.$on('event', handler)
```

Vue 3 移除了实例事件方法，推荐用 **mitt** 库代替：

```js
import mitt from 'mitt'
const emitter = mitt()

// 发送
emitter.emit('event', data)
// 监听
emitter.on('event', handler)
```

**Vuex / Pinia**：适合需要持久化、跨路由共享的状态，详见 Vuex 章节。

### $attrs（透传属性）

Vue 3 中，组件未声明为 `props` 的属性会通过 `$attrs` 向下透传，包括 `class`、`style`、事件监听器。

常用于封装第三方组件时透传所有属性：

```html
<!-- 封装层 -->
<ElInput v-bind="$attrs" />
```

### $parent / $children

- **`$parent`**：访问上一级父组件实例，可以读取父组件数据或调用方法。`$root` 访问根实例。
- **`$children`**：访问所有直接子组件实例（数组，**无序**，不保证顺序）。其数据**不是响应式的**。

```js
// 子组件读取父组件数据
this.$parent.msg

// 父组件操作第一个子组件
this.$children[0].message = 'new value'
```

**注意**：`$children` 不保证顺序，优先用 `ref` 替代（明确引用具体子组件）；两者都形成紧耦合，适合内部实现，不推荐用于业务组件间通信。Vue 3 中已移除 `$children`，统一使用 `ref`。

### 通信方式选型

| 场景 | 推荐方案 |
| --- | --- |
| 父 → 子传数据 | props |
| 子 → 父传事件 | $emit |
| 父访问子方法 | ref |
| 跨层级传配置/主题 | provide / inject |
| 兄弟组件通信 | mitt（简单）/ Pinia（复杂） |
| 跨页面/全局状态 | Pinia / Vuex |

## 参考来源

- [Vue: 组件交互](https://cn.vuejs.org/guide/components/props.html)
- [Vue: provide/inject](https://cn.vuejs.org/guide/components/provide-inject.html)
- [mitt](https://github.com/developit/mitt)
