# Vue Virtual DOM

Virtual DOM 的核心价值不是保证每次都比手写 DOM 快，而是把 UI 描述、状态更新和跨平台渲染解耦。Vue 可以通过模板编译、响应式依赖追踪、patch flags、静态提升等能力降低更新成本。

直接操作真实 DOM 在很小、很明确的场景可能更快；框架的 Virtual DOM 更强在可维护性、声明式更新、组件抽象、SSR/同构和跨平台渲染。

### 什么是虚拟 DOM

Virtual DOM 是用 JavaScript 对象描述真实 DOM 树的轻量结构。Vue 和 React 都在内存中维护一棵 VNode 树，状态变化时先对比新旧 VNode 树（diff），再把差异批量更新到真实 DOM，避免每次变化都全量重建 DOM。

### 虚拟 DOM 的解析过程

```
template / JSX
  ↓ 模板编译（parse → optimize → generate）
render 函数
  ↓ 执行 render
VNode 树（JavaScript 对象）
  ↓ 首次渲染：patch(null, vnode) → 创建真实 DOM
  ↓ 更新渲染：patch(oldVnode, newVnode) → diff → 最小化 DOM 更新
真实 DOM
```

具体步骤：

1. **模板编译**：`template` 字符串经过 parse（生成 AST）→ optimize（标记静态节点）→ generate（生成 render 函数代码）三步转换为 render 函数。
2. **render 执行**：调用 render 函数，用 `createVNode` 等 API 生成描述 UI 结构的 VNode 树（纯 JS 对象）。
3. **patch**：首次渲染时用 VNode 创建真实 DOM；后续更新时对比新旧 VNode 树，通过 diff 算法找出最小差异，只更新变化的节点。

### 为什么要用虚拟 DOM

Virtual DOM 的核心价值不是"比真实 DOM 更快"，而是：

- **声明式 UI**：开发者只描述状态，框架负责更新——不用手动 `querySelector` + `innerHTML`
- **组件化抽象**：VNode 可以跨平台渲染（Web DOM / SSR / Native），真实 DOM 操作被隔离在平台层
- **批量更新**：同一 tick 内的多次状态变更合并成一次 DOM 更新，避免频繁重排
- **可维护性**：状态 → 视图的映射关系清晰，便于测试和 SSR

### 虚拟 DOM 一定比真实 DOM 快吗

**不一定**。极小规模、明确知道要更新哪些 DOM 时，直接操作真实 DOM 可能更快。框架的 Virtual DOM 牺牲了一点额外的 diff 开销，换来可维护性、声明式更新和跨平台能力。Vue 3 通过 patch flag 和静态提升，把不必要的 diff 降到最低，让更新路径接近手写的最优 DOM 操作。

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
</template>
```

这里开发者只描述状态和模板，Vue 负责把状态变化映射成最小化的 DOM 更新。

面试回答：

> Vue 使用 Virtual DOM 不是因为它永远比真实 DOM 快，而是为了声明式 UI、组件化、SSR 和跨平台能力。Vue 3 还结合编译优化和响应式系统，减少不必要 diff。性能上它提供稳定下限，但极限性能仍取决于组件设计、更新粒度和数据规模。

## 参考来源

- [Vue: Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html)
- [Vue: Render Function APIs](https://vuejs.org/api/render-function.html)
