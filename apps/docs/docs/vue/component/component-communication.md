# Vue 组件通信

### 理解路径

按**组件关系**选方案：父子关系用 props/$emit，需要双向用 v-model，父访问子用 ref，多层传递用 provide/inject，兄弟/任意组件用 mitt 或 Pinia。

Vue 2 共 10 种方式，Vue 3 有所调整：移除 `.sync`（合并进 v-model）和 `$listeners`（合并进 $attrs），移除 `$children`（统一用 ref），新增 `defineExpose` 控制暴露。

### 通信方式总览

| 方式 | 适用关系 | Vue 2 | Vue 3 |
| --- | --- | --- | --- |
| props | 父 → 子 | ✅ | ✅ |
| $emit | 子 → 父 | ✅ | ✅ |
| v-model | 父子双向 | ✅（单个） | ✅（支持多个） |
| .sync | 父子双向（多属性） | ✅ | ❌ 合并进 v-model |
| ref / expose | 父访问子实例 | `$refs` | `ref` + `defineExpose` |
| $attrs / $listeners | 祖孙透传 | 分开 | 合并为 $attrs |
| $parent / $children | 直接访问父/子 | ✅ | $children 移除 |
| provide / inject | 祖孙跨层级 | ✅（非响应式） | ✅（支持响应式） |
| 事件总线 | 任意组件 | EventBus | mitt |
| 全局状态管理 | 任意组件 | Vuex | Pinia |
| 作用域插槽 | 父子数据共享 | ✅ | ✅ |

---

## 父子通信

### props / $emit

最基础、最常用的父子通信方式。

**父 → 子（props）：**

```vue
<!-- 父组件 -->
<Child :title="pageTitle" :count="num" />
```

```js
// 子组件（Options API）
export default {
  props: {
    title: String,
    count: { type: Number, default: 0 }
  }
}
```

```vue
<!-- 子组件（script setup） -->
<script setup>
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 }
})
</script>
```

**子 → 父（$emit）：**

```vue
<!-- 子组件 -->
<button @click="$emit('close', result)">关闭</button>
```

```vue
<!-- 父组件 -->
<Child @close="handleClose" />
```

> props 是单向数据流，子组件不能直接修改 props，需通过 $emit 通知父组件修改。

---

### v-model（父子双向）

本质是 `:value` + `@input` 的语法糖，适合表单类子组件。

**Vue 2：**

```vue
<!-- 父组件 -->
<CustomInput v-model="name" />
<!-- 等价于 -->
<CustomInput :value="name" @input="name = $event" />
```

```vue
<!-- 子组件 -->
<input :value="value" @input="$emit('input', $event.target.value)" />
<script>
export default { props: ['value'] }
</script>
```

**Vue 3（默认绑定 `modelValue`）：**

```vue
<!-- 父组件 -->
<CustomInput v-model="name" />
<!-- 等价于 -->
<CustomInput :modelValue="name" @update:modelValue="name = $event" />
```

```vue
<!-- 子组件 -->
<input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
```

**Vue 3 支持多个 v-model（替代 Vue 2 的 .sync）：**

```vue
<!-- 父组件 -->
<UserForm v-model:name="name" v-model:age="age" />
```

```vue
<!-- 子组件 -->
<script setup>
defineProps(['name', 'age'])
const emit = defineEmits(['update:name', 'update:age'])
</script>
```

---

### .sync 修饰符（Vue 2 only）

在 props 基础上增加子向父的回传，实现多属性双向绑定。Vue 3 已移除，改用多个 v-model。

```vue
<!-- 父组件 -->
<Child :money.sync="total" />
<!-- 等价于 -->
<Child :money="total" @update:money="total = $event" />
```

```vue
<!-- 子组件 -->
<button @click="$emit('update:money', money - 100)">花钱</button>
<script>
export default { props: ['money'] }
</script>
```

> 应用：Element UI 的 Dialog / Drawer 用 `.sync` 控制显隐（`:visible.sync`）。

---

### ref / expose（父访问子）

父组件通过 ref 直接调用子组件方法或读取子组件数据。

**Vue 2：**

```vue
<!-- 父组件 -->
<Child ref="childRef" />
<script>
export default {
  mounted() {
    this.$refs.childRef.someMethod()
    console.log(this.$refs.childRef.name)
  }
}
</script>
```

**Vue 3 + script setup（需配合 defineExpose）：**

```vue
<!-- 子组件 MyChild.vue -->
<script setup>
const count = ref(0)
function reset() { count.value = 0 }

// script setup 默认关闭外部访问，必须显式暴露
defineExpose({ count, reset })
</script>
```

```vue
<!-- 父组件 -->
<MyChild ref="childRef" />
<script setup>
const childRef = ref(null)
function callChild() {
  childRef.value.reset()
  console.log(childRef.value.count)
}
</script>
```

> `$refs` 不是响应式的，不要在模板中用于响应式依赖；`defineExpose` 是 Vue 3 script setup 特有，不暴露则外部无法访问。

---

### 作用域插槽（父子数据共享）

父组件提供结构，子组件提供数据，适合数据展示逻辑分离的场景（如列表渲染）。

```vue
<!-- 子组件 List.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" />   <!-- 把 item 暴露给父组件 -->
    </li>
  </ul>
</template>

<!-- 父组件 -->
<List :items="data">
  <template #default="{ item }">
    <span>{{ item.name }} — {{ item.price }}</span>
  </template>
</List>
```

> 本质是"子提供数据，父决定怎么展示"，是插槽的逆向数据流。严格限于直接父子关系。

---

### $parent / $children（直接访问）

- `$parent`：访问上一级父组件实例，可读取父组件数据或调用方法
- `$children`：Vue 2 only，所有直接子组件数组（**无序，不响应式**）
- `$root`：访问根实例

```js
// 子组件读取父组件数据
this.$parent.msg

// 父组件操作子组件（Vue 2）
this.$children[0].message = 'new'
```

**Vue 3 移除了 `$children`**，统一用 `ref` 明确引用子组件。两者都形成紧耦合，仅适合组件库内部实现，业务组件不推荐使用。

---

## 祖孙 / 跨层级通信

### provide / inject

祖先组件提供数据，任意深度后代组件注入，无需逐层 props 传递（"prop drilling"）。

**Vue 2（数据非响应式）：**

```js
// 祖先组件
export default {
  provide() {
    return {
      content: this.content,          // 非响应式（传的是当前值）
      updateContent: this.updateContent  // 方法是响应式的
    }
  }
}

// 后代组件
export default {
  inject: ['content', 'updateContent']
}
```

> Vue 2 中 provide 提供的**基础值本身不响应式**，但提供的**对象内部属性**是响应式的。

**Vue 3（支持响应式）：**

```js
// 祖先组件
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)         // 提供 ref，后代收到的也是响应式 ref
provide('toggleTheme', () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
})
```

```js
// 后代组件（任意层级）
import { inject } from 'vue'
const theme = inject('theme')           // 响应式
const toggleTheme = inject('toggleTheme')
```

> 应用：Element UI 的 `<el-form>` 用 provide/inject 向内部 `<el-form-item>` 传递表单配置。

---

### $attrs / $listeners（属性透传）

封装中间层组件时，将父组件未声明为 props 的属性/事件透传给内部子组件。

**Vue 2：**

- `$attrs`：父组件传入但**未被 props 接收**的属性（不含 class/style）
- `$listeners`：父组件绑定的**自定义事件监听**集合

```vue
<!-- 中间层组件 MyInput.vue -->
<template>
  <div>
    <input v-bind="$attrs" v-on="$listeners" />
  </div>
</template>
<script>
export default { inheritAttrs: false }  // 禁止自动挂载到根元素
</script>
```

**Vue 3：**

- `$listeners` 被**移除**，其内容合并进 `$attrs`（包含属性 + 事件监听）
- 事件监听以 `onXxx` 形式存在于 `$attrs` 中

```vue
<!-- 中间层组件（Vue 3） -->
<template>
  <ElInput v-bind="$attrs" />  <!-- attrs 同时包含属性和事件 -->
</template>
<script setup>
// script setup 默认 inheritAttrs: true，可通过 defineOptions 关闭
defineOptions({ inheritAttrs: false })
</script>
```

---

## 任意组件通信

### 事件总线（EventBus / mitt）

实现任意组件间的发布-订阅通信。

**Vue 2 — 用 Vue 实例作为总线：**

```js
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()
```

```js
// 发送方
import { EventBus } from './event-bus.js'
EventBus.$emit('addition', { num: this.num })

// 接收方（在 mounted 中监听，在 beforeDestroy 中取消）
EventBus.$on('addition', ({ num }) => { this.count += num })
EventBus.$off('addition')  // 组件销毁时移除，避免内存泄漏
```

**Vue 3 — 使用 mitt 库（Vue 3 移除了实例事件方法）：**

```js
// emitter.js
import mitt from 'mitt'
export const emitter = mitt()
```

```js
// 发送方
import { emitter } from './emitter'
emitter.emit('update', { value: 42 })

// 接收方
import { emitter } from './emitter'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  emitter.on('update', handler)
})
onUnmounted(() => {
  emitter.off('update', handler)  // 必须清理，避免内存泄漏
})
```

---

### Vuex / Pinia（全局状态管理）

适合需要跨路由、持久化或多组件共享的复杂状态。

**Vuex（Vue 2 / Vue 3 均可）：**

```js
// 组件 A 触发
this.$store.commit('SET_USER', user)
// 或 dispatch action（异步场景）
this.$store.dispatch('fetchUser', id)

// 组件 B 读取
computed: {
  user() { return this.$store.state.user }
}
```

**Pinia（Vue 3 推荐）：**

```js
// stores/user.js
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({ name: '', age: 0 }),
  actions: {
    setName(name) { this.name = name }
  }
})
```

```js
// 任意组件
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
userStore.setName('张三')
console.log(userStore.name)
```

> Pinia 相比 Vuex 4：无需 mutations（直接 action 修改）、TypeScript 友好、无 namespace 嵌套、体积更小。

---

## 选型指南

| 场景 | 推荐方案 | 备注 |
| --- | --- | --- |
| 父 → 子传数据 | props | 单向，最基础 |
| 子 → 父传事件 | $emit | 单向，明确意图 |
| 父子双向绑定 | v-model | 表单组件首选 |
| 父子多属性双向 | v-model:xxx（Vue 3）/ .sync（Vue 2） | — |
| 父调用子方法/读数据 | ref + defineExpose | Vue 3 需 defineExpose |
| 中间组件透传属性 | $attrs | 封装第三方组件时常用 |
| 祖孙传配置/主题 | provide / inject | 避免 prop drilling |
| 兄弟组件（简单） | mitt / EventBus | 注意及时取消监听 |
| 跨组件复杂状态 | Pinia（Vue 3）/ Vuex | 跨路由、需持久化 |
| 父子：子提供数据，父控制展示 | 作用域插槽 | 逻辑与展示分离，仅限直接父子 |

## Vue 2 vs Vue 3 差异速查

| Vue 2 | Vue 3 | 说明 |
| --- | --- | --- |
| `$listeners` | 移除，合并进 `$attrs` | 事件以 `onXxx` 存于 $attrs |
| `$children` | 移除 | 改用 `ref` + `defineExpose` |
| `.sync` 修饰符 | 移除 | 改用 `v-model:propName` |
| `new Vue()` EventBus | mitt | Vue 3 无实例事件方法 |
| Vuex 4 | Pinia | 官方推荐换用 Pinia |
| provide 非响应式 | provide 支持传 ref | ref 本身保持响应式 |
| `model: { prop, event }` | `v-model:xxx` | 自定义 v-model prop/event |

## 参考来源

- [Vue: Props](https://cn.vuejs.org/guide/components/props.html)
- [Vue: 事件](https://cn.vuejs.org/guide/components/events.html)
- [Vue: provide/inject](https://cn.vuejs.org/guide/components/provide-inject.html)
- [Vue: $attrs](https://cn.vuejs.org/guide/components/attrs.html)
- [mitt](https://github.com/developit/mitt)
- [Pinia](https://pinia.vuejs.org/zh/)
