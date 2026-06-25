// 弹窗 Modal 的可编辑沙盒源码（喂给 ReplBox）。
// 自包含：--vp-c-* 改具体色值；遮罩在沙盒里用 fixed 铺满预览区。

const App = `<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const open = ref(false)
const name = ref('')
const result = ref('')

function submit() {
  result.value = name.value ? \`已保存：\${name.value}\` : '已保存（未填姓名）'
  open.value = false
}
</script>

<template>
  <div class="demo">
    <button class="btn" type="button" @click="open = true">新建用户</button>
    <p v-if="result" class="hint">{{ result }}</p>

    <BaseModal v-model:visible="open" title="新建用户">
      <label class="field">
        <span>姓名</span>
        <input v-model="name" placeholder="请输入姓名" />
      </label>
      <!-- 作用域插槽把 close 暴露给父组件 -->
      <template #footer="{ close }">
        <button class="btn btn--ghost" type="button" @click="close">取消</button>
        <button class="btn" type="button" @click="submit">保存</button>
      </template>
    </BaseModal>
  </div>
</template>

<style>
.demo {
  padding: 24px;
  font-family: system-ui, sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
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
.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
.field input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  color: #1a1a1a;
}
.hint { margin: 0; color: #555; font-size: 13px; }
</style>
`

const BaseModal = `<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{ title?: string }>()

// v-model:visible：显隐状态的唯一来源在父组件
const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{ close: [] }>()

function close() {
  visible.value = false
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="base-modal">
    <div v-if="visible" class="base-modal__mask" @click.self="close">
      <div class="base-modal" role="dialog" aria-modal="true" :aria-label="title">
        <header class="base-modal__head">
          <slot name="header">
            <h3 class="base-modal__title">{{ title }}</h3>
          </slot>
          <button class="base-modal__close" type="button" aria-label="关闭" @click="close">×</button>
        </header>

        <div class="base-modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="base-modal__foot">
          <slot name="footer" :close="close" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 沙盒里遮罩用 fixed 铺满预览区；生产中可改 Teleport + fixed 挂到 body */
.base-modal__mask {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}
.base-modal {
  width: min(360px, 90%);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.base-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #e2e2e3;
}
.base-modal__title { margin: 0; font-size: 15px; }
.base-modal__close {
  border: 0;
  background: none;
  color: #555;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.base-modal__body { padding: 14px; }
.base-modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #e2e2e3;
}
.base-modal-enter-active,
.base-modal-leave-active { transition: opacity 0.2s ease; }
.base-modal-enter-from,
.base-modal-leave-to { opacity: 0; }
</style>
`

export const modalFiles: Record<string, string> = {
  'src/ModalApp.vue': App,
  'src/BaseModal.vue': BaseModal
}
