// 确认框 Dialog 的可编辑沙盒源码（喂给 ReplBox）。
// 放在独立 .ts 里：md 顶层若直接写含 <style> 的字符串，会被 VitePress 当页面样式块提取走。
// 沙盒是隔离 iframe，没有 VitePress 的 --vp-c-* 变量，所以组件样式用具体色值、遮罩用 fixed 铺满预览区。

const App = `<script setup lang="ts">
import { ref } from 'vue'
import { confirm } from './useConfirm'

const result = ref('')

async function remove() {
  // await 一行拿到用户选择，无需声明 visible / 回调
  const ok = await confirm('确定删除「张三」？', { title: '删除确认' })
  result.value = ok ? '已删除' : '已取消'
}
</script>

<template>
  <div class="demo">
    <button class="btn" @click="remove">删除</button>
    <p v-if="result" class="result">{{ result }}</p>
  </div>
</template>

<style>
.demo { padding: 24px; font-family: system-ui, sans-serif; }
.btn {
  padding: 6px 14px;
  border: 1px solid #3451b2;
  border-radius: 6px;
  background: #3451b2;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.result { margin-top: 12px; color: #555; font-size: 14px; }
</style>
`

const ConfirmDialog = `<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{ message: string; title?: string }>()
const emit = defineEmits<{ resolve: [boolean] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('resolve', false)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="mask" @click.self="emit('resolve', false)">
    <div class="dialog" role="alertdialog" aria-modal="true">
      <h3 class="dialog__title">{{ title ?? '提示' }}</h3>
      <p class="dialog__msg">{{ message }}</p>
      <div class="dialog__actions">
        <button class="btn btn--ghost" type="button" @click="emit('resolve', false)">取消</button>
        <button class="btn" type="button" @click="emit('resolve', true)">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}
.dialog {
  width: min(320px, 90%);
  padding: 16px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.dialog__title { margin: 0 0 8px; font-size: 15px; color: #1a1a1a; }
.dialog__msg { margin: 0 0 16px; color: #555; font-size: 13px; }
.dialog__actions { display: flex; justify-content: flex-end; gap: 8px; }
.btn {
  padding: 5px 12px;
  border: 1px solid #3451b2;
  border-radius: 6px;
  background: #3451b2;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}
.btn--ghost { border-color: #ccc; background: none; color: #333; }
</style>
`

const useConfirm = `import { createApp } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

interface ConfirmOptions {
  title?: string
}

// 命令式确认框：动态挂载，关闭即销毁
export function confirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  const { title } = options

  return new Promise((resolve) => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const app = createApp(ConfirmDialog, {
      message,
      title,
      onResolve(result: boolean) {
        resolve(result)
        app.unmount()
        host.remove()
      }
    })
    app.mount(host)
  })
}
`

export const dialogFiles: Record<string, string> = {
  'src/DialogApp.vue': App,
  'src/ConfirmDialog.vue': ConfirmDialog,
  'src/useConfirm.ts': useConfirm
}
