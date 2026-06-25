<script setup lang="ts">
import { useData } from 'vitepress'
import { Repl, useStore, useVueImportMap } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import '@vue/repl/style.css'

const props = withDefaults(
  defineProps<{
    files?: Record<string, string>
    mainFile?: string
    height?: string
  }>(),
  { height: '540px' }
)

const { isDark } = useData()

// Vue 运行时的 import map（CDN），驱动浏览器内编译
const { importMap, vueVersion } = useVueImportMap()

const store = useStore({
  builtinImportMap: importMap,
  vueVersion
})
store.init()

if (props.files && Object.keys(props.files).length) {
  store.setFiles(props.files, props.mainFile ?? Object.keys(props.files)[0])
}
</script>

<template>
  <div class="repl-box" :style="{ height }">
    <Repl
      :editor="Monaco"
      :store="store"
      :theme="isDark ? 'dark' : 'light'"
      :preview-theme="true"
      :show-compile-output="false"
      :show-import-map="false"
    />
  </div>
</template>

<style scoped>
.repl-box {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.repl-box :deep(.vue-repl) {
  height: 100%;
}
</style>
