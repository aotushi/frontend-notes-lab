# Vue 3 组合式 API

### 理解路径

组合式 API 把组件逻辑从"按选项归类"（`data`/`methods`/`computed`）改为"按功能组织"。先理解两个响应式入口 `ref` / `reactive`，再看副作用入口 `watch` / `watchEffect`，最后看 `<script setup>` 语法糖和异步 `setup` 的边界。响应式底层机制见[响应式原理与核心机制](/vue/core/reactivity)，选项式与组合式的整体对比见 [Vue 2 与 Vue 3 的区别](/vue/concepts/vue2-vs-vue3)。

### ref 与 reactive 区别

| 特性 | `ref` | `reactive` |
| --- | --- | --- |
| 接收类型 | 原始类型 + 引用类型 | 只能是引用类型（对象/数组/Map/Set） |
| 访问方式 | JS 中需 `.value` | 直接访问属性 |
| 模板使用 | 顶层自动解包，无需 `.value` | 直接访问属性 |
| 重新赋值 | `count.value = 1` 整体替换不丢响应 | 整体替换（`state = {...}`）会丢失响应式 |
| 适用场景 | 单个值、组合式函数返回值 | 一组相关状态（如表单对象） |

```js
import { ref, reactive } from 'vue'

// ref：原始类型 + 对象都可以，JS 中通过 .value 读写
const count = ref(0)
count.value++

// reactive：只接收对象，直接读写属性
const form = reactive({ name: '', age: 0 })
form.name = '张三'
```

**原理差异**

`ref` 内部用一个带 `get value` / `set value` 的 `RefImpl` 对象包装数据，读写 `.value` 时触发 `track` / `trigger`；当 `ref` 接收的是**对象**时，会在内部用 `reactive` 把 `.value` 转成响应式代理。所以 `ref` 不是简单等于 `reactive`，而是在它之上补齐了对原始类型的处理能力。

**两个易错边界**

- `reactive` 解构会丢失响应式：`const { name } = form` 拿到的是普通值，需要用 `toRefs(form)` 再解构。
- `ref` 的自动解包只在**模板顶层**和**作为 `reactive` 对象的属性**时生效；放进响应式数组或原生集合（如 `reactive([ref(0)])`）时不解包，仍要 `.value`。

**选用建议**：统一用 `ref` 可以避免"这个值到底要不要 `.value`"的心智负担；`reactive` 适合把强相关的一组字段聚成一个对象。两者不必二选一，按场景混用即可。

### watch 与 watchEffect 区别

| 对比 | `watch` | `watchEffect` |
| --- | --- | --- |
| 依赖来源 | 显式指明监听的数据源 | 自动收集回调中用到的响应式依赖 |
| 新旧值 | 能拿到改变前后的值（`newVal`, `oldVal`） | 只能拿到改变后的值 |
| 初始执行 | 默认懒执行，需 `{ immediate: true }` 才立即跑 | 立即执行一次（用于收集依赖） |
| 适合场景 | 需要对比新旧值、有明确监听目标 | 依赖较多、只关心"用到的数据变了就重跑" |

```js
import { ref, watch, watchEffect } from 'vue'

const x = ref(0)
const y = ref(0)

// watch：显式指定源，能拿到新旧值，默认懒执行
watch(x, (newVal, oldVal) => {
  console.log(`x: ${oldVal} → ${newVal}`)
})

// watchEffect：不写源，自动追踪回调里读到的 x、y；定义后立即执行一次
watchEffect(() => {
  console.log(`x + y = ${x.value + y.value}`)
})
```

**watchEffect 与 computed 的区别**：两者都自动收集依赖，但 `computed` 注重**返回值**（必须 `return` 一个派生值，且有缓存），`watchEffect` 注重**过程**（执行副作用，不写返回值）。

**监听 `reactive` 的两个坑**：

- 直接监听整个 `reactive` 对象时，`oldVal` 拿不到正确的旧值（新旧引用相同），且会被强制深度监听，`deep: false` 失效。
- 监听 `reactive` 对象的**某个属性**时，需写成 getter（`watch(() => state.count, ...)`），此时 `deep` 配置才按预期生效。

### script setup 是干什么的

`<script setup>` 是 Vue 3 的编译时语法糖，用更少的样板写组合式 API。它在编译阶段把顶层绑定直接暴露给模板，省去 `setup()` 函数和 `return`。

```vue
<script setup>
import { ref } from 'vue'
// 顶层声明的变量、函数、import 的组件，模板里直接用，无需 return
const count = ref(0)
function inc() { count.value++ }
</script>

<template>
  <button @click="inc">{{ count }}</button>
</template>
```

**特点**：

- 顶层变量、函数**无需 `return`**，模板直接使用。
- `import` 的组件**自动注册**，无需写 `components` 选项。
- 通过编译宏拿到组件接口：`defineProps` 接收 props、`defineEmits` 声明事件、`defineExpose` 主动暴露成员、`defineModel`（3.4+）简化 `v-model`。
- **默认不向外暴露任何成员**，父组件用 `ref` 访问子组件时，子组件需 `defineExpose` 显式暴露。

**和普通 `setup()` 的关系**：`<script setup>` 编译后等价于一个 `setup()` 函数，但省去了手写 `return`、`components` 注册、`props`/`emits` 选项。它的收益主要是**开发体验更简洁**，以及编译期能做更好的静态分析（如更精准的绑定）；不要理解成运行时性能有数量级提升。需要 `name`、`inheritAttrs` 等组件选项时，配合 `defineOptions`（3.3+）或额外写一个普通 `<script>` 块。

### setup 中使用异步的问题

把 `setup` 直接写成 `async` 函数会破坏组件渲染时机：

```js
// ❌ 反例：async setup
export default {
  async setup() {
    const data = await fetchData() // await 之前 return 的内容才会被收集
    return { data }
  }
}
```

问题在于：`setup` 一旦返回 Promise，`await` 之后的返回值无法被正常收集为渲染上下文，组件可能在数据就绪前就渲染，响应式关联也建立不起来。除非配合 `<Suspense>`，否则不要直接 `async setup`。

**方案 1 — `ref` + `onMounted`（最常用）**

```js
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const data = ref(null)
    onMounted(async () => {
      data.value = await fetchData() // 挂载后异步填充，配合 v-if/loading 占位
    })
    return { data }
  }
}
```

**方案 2 — 同步 `setup` + 内部立即执行异步函数**

```js
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ data: null })
    ;(async () => {
      state.data = await fetchData()
    })()
    return { state }
  }
}
```

**方案 3 — `async setup` + `<Suspense>`**

`<Suspense>` 是 Vue 3 的内置组件（仍为**实验性**特性），为异步子树提供统一的加载占位。此时子组件可以放心用 `async setup`（或 `<script setup>` 中的顶层 `await`）：

```vue
<!-- 父组件用 Suspense 包裹异步子组件 -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

```vue
<!-- 子组件 AsyncComponent.vue：script setup 顶层 await -->
<script setup>
const data = await fetchData() // 解析完成前由父级 fallback 占位
</script>
```

## 参考来源

- [Vue: 响应式基础（ref / reactive）](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue: 侦听器（watch / watchEffect）](https://cn.vuejs.org/guide/essentials/watchers.html)
- [Vue: `<script setup>`](https://cn.vuejs.org/api/sfc-script-setup.html)
- [Vue: Suspense](https://cn.vuejs.org/guide/built-ins/suspense.html)
