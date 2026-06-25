# 沙盒 PoC

<script setup>
const files = {
  'src/App.vue': `<script setup>
import { ref } from 'vue'
import Hello from './Hello.vue'
const count = ref(0)
<\/script>

<template>
  <Hello :count="count" />
  <button @click="count++">+1</button>
</template>`,
  'src/Hello.vue': `<script setup>
defineProps(['count'])
<\/script>

<template>
  <h3>计数：{{ count }}</h3>
</template>`
}
</script>

可编辑、浏览器内实时编译预览的 Vue 多文件沙盒（Monaco 编辑器）：

<ReplBox :files="files" main-file="src/App.vue" height="460px" />
