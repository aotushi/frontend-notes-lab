# Vue Virtual DOM

## 问题

Vue 为什么使用 Virtual DOM？它一定比真实 DOM 更快吗？

## 结论

Virtual DOM 的核心价值不是保证每次都比手写 DOM 快，而是把 UI 描述、状态更新和跨平台渲染解耦。Vue 可以通过模板编译、响应式依赖追踪、patch flags、静态提升等能力降低更新成本。

直接操作真实 DOM 在很小、很明确的场景可能更快；框架的 Virtual DOM 更强在可维护性、声明式更新、组件抽象、SSR/同构和跨平台渲染。

## Demo

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
