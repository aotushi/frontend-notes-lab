# Vue 生命周期

## 问题

Vue 的生命周期有哪些阶段？各个钩子在什么时机执行？组合式 API 里对应哪些钩子？父子组件的生命周期顺序是怎样的？

## 结论

### 理解路径

生命周期就是组件从创建 → 挂载 → 更新 → 卸载的过程，每个阶段前后各有钩子。Vue 3 选项式钩子基本沿用 Vue 2（`beforeDestroy` / `destroyed` 改名为 `beforeUnmount` / `unmounted`），组合式 API 则用 `setup` 加 `onXxx` 注册。

### Vue 2.x 生命周期钩子

生命周期钩子是在组件不同阶段执行的一组函数，允许在组件生命周期中执行特定操作。常用的有：

1. **beforeCreate（创建前）**：实例初始化之后、数据观测（data observer）和 event/watcher 事件配置之前调用，此时组件的数据、事件等都还没初始化。
2. **created（创建后）**：实例创建完成之后调用，可访问数据、计算属性等，但 DOM 元素还未生成。
3. **beforeMount（挂载前）**：挂载开始之前调用，相关的 render 函数首次被调用。
4. **mounted（挂载后）**：el 被新创建的 `vm.$el` 替换并挂载到实例上之后调用，此时组件已渲染完成、DOM 元素已生成。
5. **beforeUpdate（更新前）**：数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前，可在此进一步修改数据，但避免直接操作 DOM。
6. **updated（更新后）**：数据更改导致的虚拟 DOM 重新渲染和打补丁后调用，此时组件的 DOM 已更新。
7. **beforeDestroy（销毁前）**：实例销毁之前调用，此时实例仍然完全可用。
8. **destroyed（销毁后）**：实例销毁后调用，此时所有指令已解绑、所有事件监听器已移除、所有子实例也已销毁。

### Vue 3 生命周期钩子

Vue 3 引入组合式 API，钩子的命名和调用时机与 Vue 2.x 大致相似，但可在 `setup` 里更灵活地组织逻辑：

- **`setup`**：在实例初始化之后、返回 render 函数之前执行，是组合式 API 的入口，用于设置组件状态、引入响应式数据等，相当于 `beforeCreate` 加 `created`。
- **`onBeforeMount` / `onMounted`**：挂载前 / 后。
- **`onBeforeUpdate` / `onUpdated`**：更新前 / 后。
- **`onBeforeUnmount` / `onUnmounted`**：卸载前 / 后（对应 Vue 2 的 `beforeDestroy` / `destroyed`）。

选项式钩子在 Vue 3 中依然可用（仅 `beforeDestroy` / `destroyed` 重命名为 `beforeUnmount` / `unmounted`）。组合式 API 写法：

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  // 访问 DOM、发请求
})

onUpdated(() => {})

onUnmounted(() => {
  // 清理定时器、事件监听
})
```

### 完整钩子对照表

| 钩子 | Vue 2 | Vue 3 选项式 | Vue 3 组合式 | 说明 |
| --- | --- | --- | --- | --- |
| beforeCreate | ✓ | ✓ | — (setup 代替) | 实例初始化，数据/事件未就绪 |
| created | ✓ | ✓ | — (setup 代替) | 可访问数据，DOM 未生成 |
| beforeMount | ✓ | ✓ | onBeforeMount | 模板编译完成，未挂载 |
| mounted | ✓ | ✓ | onMounted | DOM 已生成，可操作真实 DOM |
| beforeUpdate | ✓ | ✓ | onBeforeUpdate | 数据变化，DOM 更新前 |
| updated | ✓ | ✓ | onUpdated | DOM 已更新 |
| beforeDestroy / beforeUnmount | beforeDestroy | beforeUnmount | onBeforeUnmount | 实例销毁前 |
| destroyed / unmounted | destroyed | unmounted | onUnmounted | 实例销毁后，清理副作用 |
| activated | ✓ | ✓ | onActivated | keep-alive 组件激活时 |
| deactivated | ✓ | ✓ | onDeactivated | keep-alive 组件停用时 |
| errorCaptured | ✓ | ✓ | onErrorCaptured | 捕获后代组件抛出的错误 |
| renderTracked | — | ✓ (开发) | onRenderTracked | 响应式依赖被追踪时（调试用） |
| renderTriggered | — | ✓ (开发) | onRenderTriggered | 响应式依赖触发重渲染时（调试用） |
| serverPrefetch | — | ✓ | onServerPrefetch | SSR 服务端渲染时预取数据 |

### 常见问题

- **请求放哪个钩子？** 一般放 `created` / `onMounted`；需要操作真实 DOM 的逻辑放 `mounted` / `onMounted`。
- **父子挂载顺序**：父 `beforeCreate` → 父 `created` → 父 `beforeMount` → 子 `beforeCreate` → 子 `created` → 子 `beforeMount` → 子 `mounted` → 父 `mounted`。父先开始，子先完成挂载。
- **父子更新顺序**：父 `beforeUpdate` → 子 `beforeUpdate` → 子 `updated` → 父 `updated`。
- **父子销毁顺序**：父 `beforeUnmount` → 子 `beforeUnmount` → 子 `unmounted` → 父 `unmounted`。
- **清理资源**：定时器、事件监听、订阅应在 `unmounted` / `onUnmounted` 里清理，避免内存泄漏。

## 参考来源

- [Vue: 生命周期钩子](https://cn.vuejs.org/guide/essentials/lifecycle.html)
- [Vue: 组合式 API 生命周期钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html)
