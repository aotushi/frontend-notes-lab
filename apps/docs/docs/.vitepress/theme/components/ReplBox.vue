<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'

// 只透传配置；真正的 repl 在 ReplInner 里，靠 ClientOnly + 异步加载隔离 SSR
defineProps<{
  files?: Record<string, string>
  mainFile?: string
  height?: string
}>()

const ReplInner = defineAsyncComponent({
  loader: () => import('./ReplInner.vue'),
  loadingComponent: {
    render: () =>
      h(
        'div',
        { style: 'padding:40px;text-align:center;color:var(--vp-c-text-3)' },
        '沙盒加载中…'
      )
  }
})
</script>

<template>
  <ClientOnly>
    <ReplInner :files="files" :main-file="mainFile" :height="height" />
  </ClientOnly>
</template>
